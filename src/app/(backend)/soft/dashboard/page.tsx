"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";
import { CustomUser } from "@/abstract/type";

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export default function Dashboard() {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const taskStatsRes = await axios.get("/api/tasks/stats");
        setTaskStats(taskStatsRes.data);

        const usersRes = await axios.get("/api/users");
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const chartData = [
    { name: 'Total', Tasks: taskStats?.totalTasks || 0 },
    { name: 'Completed', Tasks: taskStats?.completedTasks || 0 },
    { name: 'Pending', Tasks: taskStats?.pendingTasks || 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-0">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.totalTasks || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.completedTasks || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.pendingTasks || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 mb-8 md:grid-cols-3">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Task Overview</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Tasks" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Users Overview</h2>
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {users.length > 0 ? (
              users.map((user: CustomUser) => (
                <Card key={user._id}>
                  <CardContent className="flex items-center space-x-4 pt-6">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name!} />
                      <AvatarFallback>{user.name!.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">User Type: {user.usertype}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}