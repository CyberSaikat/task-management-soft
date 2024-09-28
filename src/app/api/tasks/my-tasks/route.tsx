import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";
import { conn } from "@/database/config";

export async function GET(req: NextRequest) {
    await conn();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as CustomUser;
    const userId = user._id;

    try {
        const tasks = await Task.find({ $or: [{ owner: userId }, { assigned_user: userId }] });
        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to load tasks" }, { status: 500 });
    }
}
