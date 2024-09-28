"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import axios from "axios";
import toastMsg from "@/utils/toaster";
import DataTable from "@/components/DataTable";
import CustomModal from "@/components/CustomModal";
import TaskForm from "./TaskForm";
import type { TaskList } from "@/abstract/interface";

export default function TaskList() {
    const [open, setOpen] = useState(false);
    const { setLoading } = useContext(LoaderContext);
    const [currentTask, setCurrentTask] = useState<TaskList | null>(null);
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
            .get("/api/task-lists") // API endpoint for tasks
            .then((res) => {
                setFilteredTasks(res.data.taskLists);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function reloadTasks() {
        setLoading(true);
        axios
            .get("/api/task-lists")
            .then((res) => {
                setFilteredTasks(res.data.taskLists);
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
                            { label: "Title", render: (r: any) => r.name, name: 'name' },
                            { label: "Owner", render: (r: any) => r.owner.name, name: 'owner' },
                        ]}
                        data={filteredTasks}
                        onEdit={(item: any): void => {
                            setCurrentTask(item);
                            setOpen(true);
                        }}
                        onDelete={(id: string): void => {
                            setLoading(true);
                            axios
                                .delete(`/api/task-lists`, { data: { id } })
                                .then((res) => {
                                    if (res.status === 200) {
                                        toastMsg("success", "Task deleted successfully");
                                        reloadTasks();
                                    }
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
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
                    onComplete={() => {
                        setOpen(false);
                        setCurrentTask(null);
                        reloadTasks();
                    }}
                />
            </CustomModal>
        </>
    );
}
