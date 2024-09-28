import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";
import { conn } from "@/database/config";

export async function PUT(req: NextRequest) {
    await conn();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as CustomUser;
    const userId = user._id;

    const queryString = req.nextUrl.pathname.split('/');

    const id = queryString[queryString.length - 2];

    try {
        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        if (task.assigned_user.toString() === userId || task.owner.toString() === userId) {
            const { status } = await req.json();

            task.status = status;
            await task.save();

            return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
    }
}
