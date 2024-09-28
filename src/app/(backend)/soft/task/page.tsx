"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import DataTable from "@/components/DataTable";
import CustomModal from "@/components/CustomModal";
import TaskForm from "./TaskForm";
import { LoaderContext } from "@/context/loaderContext";
import toastMsg from "@/utils/toaster";
import type { CustomUser } from "@/abstract/type";
import { CustomTask } from "@/abstract/interface";

export default function TaskList() {
    const [tasks, setTasks] = useState<CustomTask[]>([]);
    const [users, setUsers] = useState<CustomUser[]>([]);
    const [open, setOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<CustomTask | null>(null);
    const { setLoading } = useContext(LoaderContext);


    const fetchTasks = () => {
        setLoading(true);
        axios
            .get("/api/tasks")
            .then((res) => {
                if (res.status === 200) {
                    setTasks(res.data.tasks);
                } else {
                    toastMsg("error", "Failed to fetch tasks");
                }
            })
            .finally(() => setLoading(false));
    };

    const fetchUsers = () => {
        setLoading(true);
        axios
            .get("/api/users")
            .then((res) => {
                if (res.status === 200) {
                    setUsers(res.data.users);
                } else {
                    toastMsg("error", "Failed to fetch users");
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, [fetchTasks, fetchUsers]);

    const handleDelete = (taskId: string) => {
        setLoading(true);
        axios
            .delete(`/api/tasks/${taskId}`)
            .then((res) => {
                if (res.status === 200) {
                    toastMsg("success", "Task deleted successfully");
                    setTasks(tasks.filter((task) => task._id !== taskId));
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex">
                        <h1 className="text-2xl font-bold">Task List</h1>
                        <Button
                            className="ml-auto bg-primary"
                            onClick={() => {
                                setCurrentTask(null);
                                setOpen(true);
                            }}
                        >
                            Add Task
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={[
                            { label: "Title", render: (r: any) => r.title, name: "title" },
                            { label: "Description", render: (r: any) => r.description, name: "description" },
                            { label: "Due Date", render: (r: any) => new Date(r.due_date).toLocaleDateString(), name: "due_date" },
                            { label: "Status", render: (r: any) => r.status, name: "status" },
                            { label: "Owner", render: (r: any) => r.owner.name, name: "owner" },
                            { label: "Assigned User", render: (r: any) => r.assigned_user?.name || "-", name: "assigned_user" },
                            { label: "Task List", render: (r: any) => r.taskList ? r.taskList.name : '', name: "taskList" },
                        ]}
                        data={tasks}
                        onEdit={(task: CustomTask): void => {
                            setCurrentTask(task);
                            setOpen(true);
                        }}
                        onDelete={(id: string): void => {
                            const cTask = tasks.find((task) => task._id === id);
                            const owner = typeof cTask?.owner !== 'string' ? cTask?.owner._id.toString() : '';
                            const currentUser = typeof cTask?.assigned_user !== 'string' ? cTask?.assigned_user?._id.toString() : '';
                            if (currentUser && owner !== currentUser) {
                                toastMsg("error", "Only the owner of the task can delete it.");
                                return;
                            }
                            if (owner) {
                                handleDelete(id);
                            } else {
                                toastMsg("error", "Owner not found");
                            }
                        }}
                    />
                </CardContent>
            </Card>

            <CustomModal
                isOpen={open}
                onOpenChange={() => setOpen(!open)}
                header={`${currentTask ? "Edit" : "Add"} Task`}
            >
                <TaskForm
                    task={currentTask!}
                    users={users}
                    currentUser={typeof currentTask?.assigned_user !== 'string' ? currentTask?.assigned_user?._id.toString() : ''}
                    onComplete={() => {
                        setOpen(false);
                        fetchTasks();
                    }}
                />
            </CustomModal>
        </>
    );
}
