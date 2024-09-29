import Task from "@/models/Task";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";

export async function GET() {
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
        const taskStats = {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            notStartedTasks: 0,
            overdueTasks: 0,
            tasksDueToday: 0,
            tasksPerUser: {} as { [key: string]: { name: string, taskCount: number } },
        };
        const limit = 100;
        const tasks = isAdmin
            ? await Task.find().limit(limit).populate("assigned_user", "name")
            : await Task.find({
                $or: [{ owner: user._id }, { assigned_user: user._id }]
            }).limit(limit).populate("assigned_user", "name");
        tasks.forEach((task) => {
            taskStats.totalTasks++;
            if (task.status === "Completed") taskStats.completedTasks++;
            else if (task.status === "In Progress") taskStats.inProgressTasks++;
            else if (task.status === "Not Started") taskStats.notStartedTasks++;
            const taskDueDate = task.due_date.toISOString().split('T')[0];
            if (taskDueDate < today) taskStats.overdueTasks++;
            if (taskDueDate === today) taskStats.tasksDueToday++;
            if (task.assigned_user) {
                const userId = task.assigned_user._id.toString(); // Ensure userId is a string
                if (!taskStats.tasksPerUser[userId]) {
                    taskStats.tasksPerUser[userId] = {
                        name: task.assigned_user.name,
                        taskCount: 0
                    };
                }
                taskStats.tasksPerUser[userId].taskCount++;
            }
        });
        return NextResponse.json({ taskStats }, { status: 200 });
    } catch (error) {
        console.error("Error fetching task stats:", error);
        return NextResponse.json({ message: "Server error occurred" }, { status: 500 });
    }
}
