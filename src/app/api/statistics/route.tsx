import Task from "@/models/Task";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";

export async function GET(req: NextRequest) {
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
        const today = new Date().toISOString().split('T')[0];

        let taskStats = {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            notStartedTasks: 0,
            overdueTasks: 0,
            tasksDueToday: 0,
            tasksPerUser: {} as { [key: string]: { name: string, taskCount: number } }, // Map user ID to { name, taskCount }
        };
        const tasks = isAdmin
            ? await Task.find().populate("assigned_user", "name")
            : await Task.find({
                $or: [{ owner: user._id }, { assigned_user: user._id }]
            }).populate("assigned_user", "name");

        taskStats.totalTasks = tasks.length;
        tasks.forEach((task) => {
            switch (task.status) {
                case "Completed":
                    taskStats.completedTasks++;
                    break;
                case "In Progress":
                    taskStats.inProgressTasks++;
                    break;
                case "Not Started":
                    taskStats.notStartedTasks++;
                    break;
            }

            if (task.due_date.toISOString().split('T')[0] < today) {
                taskStats.overdueTasks++;
            }

            if (task.due_date.toISOString().split('T')[0] === today) {
                taskStats.tasksDueToday++;
            }
            if (task.assigned_user) {
                const userId = task.assigned_user._id;
                const userName = task.assigned_user.name;
                if (taskStats.tasksPerUser[userId]) {
                    taskStats.tasksPerUser[userId].taskCount++;
                } else {
                    taskStats.tasksPerUser[userId] = { name: userName, taskCount: 1 };
                }
            }
        });

        return NextResponse.json({ taskStats }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
