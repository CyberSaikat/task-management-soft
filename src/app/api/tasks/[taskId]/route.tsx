import Task from "@/models/Task";
import TaskList from "@/models/TaskList"; // Import the TaskList model
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { conn } from "@/database/config";

export async function GET(req: NextRequest, { params }: { params: { taskId: string } }) {
    await conn();
    try {
        const { taskId } = params;

        const task = await Task.findById(taskId)
            .populate("owner", "name")
            .populate("assigned_user", "name");

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
    await conn();
    try {
        const { taskId } = params;
        const body = await req.json();
        const { title, description, due_date, status, assigned_user, taskListId } = body;

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.due_date = due_date || task.due_date;
        task.status = status || task.status;
        task.assigned_user = assigned_user || task.assigned_user;

        // Optionally, associate the task with a task list
        if (taskListId) {
            const taskList = await TaskList.findById(taskListId);
            if (!taskList) {
                return NextResponse.json({ message: "Task list not found" }, { status: 404 });
            }
            task.taskList = taskListId; // Assuming you've added a `taskList` field in Task schema
        }

        await task.save();
        return NextResponse.json({ message: "Task updated successfully", task }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
    await conn();
    try {
        const { taskId } = params;

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        await Task.findByIdAndDelete(taskId);
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
