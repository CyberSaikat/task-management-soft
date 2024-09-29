import TaskList from "@/models/TaskList";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";
import { conn } from "@/database/config";

export async function GET() {
    await conn();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
        );
    }

    const user = session.user as CustomUser;
    const isAdmin = user.usertype === "admin";
    let taskLists;
    try {
        if (isAdmin) {
            taskLists = await TaskList.find().populate("owner", "name");
        } else {
            taskLists = await TaskList.find({ owner: user._id }).populate("owner", "name");
        }
        return NextResponse.json({ taskLists }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, action } = body;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
        );
    }

    const user = session.user as CustomUser;

    if (action === "add") {
        if (!name) {
            return NextResponse.json(
                { message: "Name is required" },
                { status: 400 }
            );
        }

        const taskList = new TaskList({
            name,
            owner: user._id,
        });

        await taskList.save();
        return NextResponse.json(
            { message: "Task list added successfully", taskList },
            { status: 201 }
        );
    } else {
        return NextResponse.json(
            { message: "Invalid action" },
            { status: 400 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const { id } = body;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const taskList = await TaskList.findById(id);
        if (!taskList) {
            return NextResponse.json({ message: "Task list not found" }, { status: 404 });
        }

        await TaskList.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "Task list deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, name, action } = body;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
        );
    }

    if (action === "update") {
        if (!name) {
            return NextResponse.json(
                { message: "Name is required" },
                { status: 400 }
            );
        }

        const taskList = await TaskList.findById(id);
        if (!taskList) {
            return NextResponse.json({ message: "Task list not found" }, { status: 404 });
        }

        taskList.name = name;
        taskList.updated_at = new Date(); // Update timestamp
        await taskList.save();
        return NextResponse.json(
            { message: "Task list updated successfully", taskList },
            { status: 200 }
        );
    }
}
