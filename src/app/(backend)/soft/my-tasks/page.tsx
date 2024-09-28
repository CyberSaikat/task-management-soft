"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle, XCircle, Clock, PlayCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTask } from "@/abstract/interface";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
    "Not Started": "bg-gray-500",
    "In Progress": "bg-blue-500",
    "Completed": "bg-green-500",
};

const StatusBadge: React.FC<{ status: "Not Started" | "In Progress" | "Completed" }> = ({ status }) => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
        <Badge className={`${statusColors[status]} text-white`}>{status}</Badge>
    </motion.div>
);

const TaskCard: React.FC<{
    task: CustomTask;
    onUpdateStatus: (taskId: string, newStatus: string) => Promise<void>;
    isUpdating: boolean;
}> = ({ task, onUpdateStatus, isUpdating }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <StatusBadge status={task.status} />
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-end space-x-2">
                {task.status !== "Completed" && (
                    <>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => onUpdateStatus(task._id, "Completed")}
                                disabled={isUpdating}
                                variant="outline"
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Complete
                            </Button>
                        </motion.div>
                        {task.status === "Not Started" && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    onClick={() => onUpdateStatus(task._id, "In Progress")}
                                    disabled={isUpdating}
                                    variant="outline"
                                >
                                    {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <PlayCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Start
                                </Button>
                            </motion.div>
                        )}
                    </>
                )}
            </CardFooter>
        </Card>
    </motion.div>
);

const MyTasks: React.FC = () => {
    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<CustomTask[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchTasks = async () => {
            if (status === "authenticated") {
                try {
                    setLoading(true);
                    const response = await axios.get("/api/tasks/my-tasks");
                    setTasks(response.data.tasks);
                } catch (err) {
                    setError("Failed to load tasks.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTasks();
    }, [status]);

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        setUpdating((prev) => ({ ...prev, [taskId]: true }));
        setError(null);

        try {
            await axios.put(`/api/tasks/${taskId}/status`, { status: newStatus });
            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId ? { ...task, status: newStatus as "Not Started" | "In Progress" | "Completed" } : task
                )
            );
        } catch (err) {
            setError("Failed to update task status.");
        } finally {
            setUpdating((prev) => ({ ...prev, [taskId]: false }));
        }
    };

    if (loading) {
        return (
            <motion.div
                className="flex items-center justify-center h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </motion.div>
        );
    }

    if (!session || !session.user) {
        return (
            <motion.div
                className="flex items-center justify-center h-screen"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
            >
                <Alert variant="destructive" className="w-96">
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>You need to be logged in to view your tasks.</AlertDescription>
                </Alert>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                My Tasks
            </motion.h1>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {tasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <Alert variant="default" className="mb-6">
                            <Clock className="h-4 w-4 mr-2" />
                            <AlertTitle>No tasks</AlertTitle>
                            <AlertDescription>You have no tasks assigned to you.</AlertDescription>
                        </Alert>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <AnimatePresence>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onUpdateStatus={updateTaskStatus}
                                    isUpdating={updating[task._id]}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyTasks;