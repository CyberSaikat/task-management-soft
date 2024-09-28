"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TaskList } from "@/abstract/interface";
import axios from "axios";
import { AnimatedInput } from "@/components/animatedInput";
import toastMsg from "@/utils/toaster";
import { LoaderContext } from "@/context/loaderContext";

interface TaskFormProps {
    task: TaskList | null;
    onComplete: () => void;
}

export default function TaskForm({ task, onComplete }: TaskFormProps) {
    const { setLoading } = useContext(LoaderContext);
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (task) {
            setTitle(task.name!);
        } else {
            setTitle("");
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const taskData: TaskList = {
            _id: task?._id || "",
            name: title,
        };

        try {
            if (task) {
                setLoading(true);
                await axios.put(`/api/task-lists`, {
                    ...taskData,
                    action: 'update',
                }).then((res) => {
                    if (res.status === 200) {
                        toastMsg('success', res.data.message);
                    } else {
                        toastMsg('error', res.data.message);
                    }
                }).catch((err) => {
                    console.error(err);
                    toastMsg('error', "Failed to update task");
                }).finally(() => {
                    setLoading(false);
                    onComplete();
                });
            } else {
                await axios.post("/api/task-lists", {
                    ...taskData,
                    action: 'add',
                }).then((res) => {
                    if (res.status === 201) {
                        toastMsg('success', res.data.message);
                    } else {
                        toastMsg('error', res.data.message);
                    }
                }).catch((err) => {
                    console.error(err);
                    toastMsg('error', "Failed to save task");
                }).finally(() => {
                    setLoading(false);
                    onComplete();
                });
            }
            onComplete();
        } catch (error) {
            console.error("Failed to save task:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatedInput
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required label={"Task Title"} type={"text"} name={"task_title"} id={"task_title"} onchange={(e) => {
                    setTitle(e);
                }} />
            <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
        </form>
    );
}
