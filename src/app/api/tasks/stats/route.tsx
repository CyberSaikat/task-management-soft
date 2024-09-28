import { conn } from "@/database/config";
import Task from "@/models/Task";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";

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

    let tasks;
    if (isAdmin) {
        tasks = await Task.find({});
    } else {
        tasks = await Task.find({
            $or: [
                { owner: user._id },
                { assigned_user: user._id }
            ]
        });
    }
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const pendingTasks = totalTasks - completedTasks;

    return NextResponse.json({
        totalTasks,
        completedTasks,
        pendingTasks,
        tasks: tasks,
    });
}
