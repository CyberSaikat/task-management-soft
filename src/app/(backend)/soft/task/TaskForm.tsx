import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AnimatedInput, AnimatedSelect } from "@/components/animatedInput";
import { CustomTask } from "@/abstract/interface";
import { CustomUser } from "@/abstract/type";

interface TaskFormProps {
    task: CustomTask;
    taskId?: string;
    onComplete: () => void;
    users: CustomUser[];
    currentUser?: CustomUser;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, taskId, onComplete, currentUser }) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [status, setStatus] = useState<string>("Not Started");
    const [assignedUser, setAssignedUser] = useState<string | null>(null);
    const [owner, setOwner] = useState<string>("");
    const [users, setUsers] = useState<{ name: string; value: string }[]>([]);
    const [taskLists, setTaskLists] = useState<{ name: string; value: string }[]>([]);
    const [selectedTaskList, setSelectedTaskList] = useState<string | null>(null);

    const statusOptions = [
        { name: "Not Started", value: "Not Started" },
        { name: "In Progress", value: "In Progress" },
        { name: "Completed", value: "Completed" },
    ];

    const fetchUsers = async () => {
        const response = await axios.get("/api/users");
        const userOptions = response.data.users.map((user: any) => ({
            name: user.name,
            value: user._id,
        }));
        setUsers(userOptions);
    };

    const fetchTaskLists = async () => {
        const response = await axios.get("/api/task-lists"); // Assuming you have this API endpoint
        const taskListOptions = response.data.taskLists.map((list: any) => ({
            name: list.name,
            value: list._id,
        }));
        setTaskLists(taskListOptions);
    };

    const fetchTaskDetails = async () => {
        const response = await axios.get(`/api/tasks/${taskId}`);
        const task = response.data.task;
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(new Date(task.due_date).toISOString().split("T")[0]);
        setStatus(task.status);
        setAssignedUser(task.assigned_user._id);
        setOwner(task.owner);
        setSelectedTaskList(task.taskList?._id ?? null); // Set task list ID if present
    };

    useEffect(() => {
        fetchUsers();
        fetchTaskLists(); // Fetch task lists on component mount
        if (taskId) {
            fetchTaskDetails();
        }
    }, []);

    useEffect(() => {
        if (task) {
            task = JSON.parse(JSON.stringify(task));
            let newDate = new Date(task.due_date);
            if (task.due_date) {
                if (newDate.toString() === "Invalid Date") {
                    newDate = new Date();
                } else {
                    newDate = new Date(task.due_date);
                }
            } else {
                newDate = new Date();
            }
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(new Date(newDate).toISOString().split("T")[0]);
            setStatus(task.status);
            setAssignedUser(typeof task.assigned_user === 'object' ? task.assigned_user._id : null);
            setOwner(typeof task.owner === 'object' ? task.owner._id : task.owner ?? "");
            task.taskList ? setSelectedTaskList(typeof task.taskList === 'object' ? task.taskList._id : null) : null;
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const taskData = {
            title,
            description,
            due_date: dueDate,
            status,
            assigned_user: assignedUser,
            owner,
            taskListId: selectedTaskList, // Include task list ID in task data
        };

        try {
            if (taskId || task) {
                if (taskId) {
                    await axios.put(`/api/tasks/${taskId}`, taskData);
                } else {
                    await axios.put(`/api/tasks/${task._id}`, taskData);
                }
            } else {
                await axios.post("/api/tasks", taskData);
            }
            onComplete();
        } catch (error) {
            console.error("Error creating/updating task", error);
        }
    };

    if ((currentUser && currentUser.usertype !== "admin") || (currentUser && owner !== currentUser._id)) {
        return (
            <div className="text-center text-red-500">
                Only the owner of the task can edit it.
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatedInput
                label="Task Title"
                type="text"
                id="title"
                name="title"
                placeholder="Enter task title"
                required={true}
                value={title}
                onchange={setTitle}
            />

            <AnimatedInput
                label="Description"
                type="text"
                id="description"
                name="description"
                placeholder="Enter task description"
                required={true}
                value={description}
                onchange={setDescription}
            />

            <AnimatedInput
                label="Due Date"
                type="date"
                id="due_date"
                name="due_date"
                required={true}
                value={dueDate}
                onchange={setDueDate}
                placeholder={"Select Due Date"}
            />

            <AnimatedSelect
                label="Status"
                options={statusOptions}
                required={true}
                name="status"
                id="status"
                value={status}
                onChange={setStatus}
            />

            <AnimatedSelect
                label="Assign User"
                options={users}
                required={true}
                name="assigned_user"
                id="assigned_user"
                value={assignedUser ?? ""}
                onChange={setAssignedUser}
            />

            <AnimatedSelect
                label="Task List"
                options={taskLists}
                required={true} // Assuming a task list must be selected
                name="taskList"
                id="taskList"
                value={selectedTaskList ?? ""}
                onChange={setSelectedTaskList}
            />

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md transition-all duration-300 ease-in-out"
            >
                {task || taskId ? "Update Task" : "Create Task"}
            </button>
        </form>
    );
};

export default TaskForm;
