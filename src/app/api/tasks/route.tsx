import Task from "@/models/Task";
import TaskList from "@/models/TaskList";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";
import { conn } from "@/database/config";

export async function GET() {
    await conn();
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = session.user as CustomUser;
        const isAdmin = user.usertype === "admin";

        let tasks;

        if (isAdmin) {
            tasks = await Task.find()
                .populate("owner", "name")
                .populate({
                    path: 'assigned_user', select: 'name',
                    strictPopulate: false
                })
                .populate({
                    path: 'taskList',
                    strictPopulate: false,
                    select: 'name',
                    options: { skipInvalid: true }
                });
        } else {
            tasks = await Task.find({
                $or: [
                    { owner: user._id },
                    { assigned_user: user._id }
                ]
            })
                .populate("owner", "name")
                .populate({
                    path: 'assigned_user', select: 'name',
                    strictPopulate: false
                })
                .populate({
                    path: 'taskList',
                    strictPopulate: false,
                    select: 'name',
                    options: { skipInvalid: true }
                });
        }

        // Filter out tasks with missing or invalid taskList references (null values)
        tasks = tasks.filter(task => task.taskList !== null);

        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, due_date, status, assigned_user, taskListId } = body; // Include taskListId

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = session.user as CustomUser;

        if (!title || !due_date) {
            return NextResponse.json(
                { message: "Title and due date are required" },
                { status: 400 }
            );
        }

        const task = new Task({
            title,
            description,
            due_date,
            status,
            owner: user._id,
            assigned_user: assigned_user || null,
            taskList: taskListId || null, // Link to the task list
        });

        await task.save();
        return NextResponse.json(
            { message: "Task created successfully", task },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title, description, due_date, status, assigned_user, taskListId } = body; // Include taskListId

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.due_date = due_date || task.due_date;
        task.status = status || task.status;
        task.assigned_user = assigned_user || task.assigned_user;
        task.taskList = taskListId || task.taskList; // Update task list

        await task.save();
        return NextResponse.json(
            { message: "Task updated successfully", task },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized" },
                { status: 401 }
            );
        }

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        await Task.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "Task deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
