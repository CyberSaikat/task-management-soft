"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/context/loaderContext";
import axios from "axios";
import toastMsg from "@/utils/toaster";
import DataTable from "@/components/DataTable";
import CustomModal from "@/components/CustomModal";
import type { CustomUser } from "@/abstract/type";
import UserForm from "./UserForm";
import { getSession } from "next-auth/react";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const { setLoading } = useContext(LoaderContext);
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<CustomUser[]>([]);
  const [userdata, setUserData] = useState<CustomUser | null>(null);

  useEffect(() => {
    setLoading(true);

    getSession().then((session) => {
      if (session) {
        setUserData(session.user as CustomUser);
      } else {
        window.location.href = "/login";
      }
    });

    axios
      .get("/api/users")
      .then((res) => {
        if (res.status === 200) {
          setFilteredUsers(res.data.users);
        } else {
          toastMsg("error", "Failed to fetch users");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function reloadUsers() {
    setLoading(true);
    axios
      .get("/api/users")
      .then((res) => {
        if (res.status === 200) {
          setFilteredUsers(res.data.users);
        } else {
          toastMsg("error", "Failed to fetch users");
        }
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
            <h1 className="text-2xl font-bold">Users List</h1>
            {
              userdata?.usertype === "admin" && (
                <Button
                  className="ml-auto bg-primary"
                  onClick={() => {
                    setCurrentUser(null);
                    setOpen(true);
                  }}
                >
                  Add User
                </Button>
              )
            }
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { label: "Name", render: (r: any) => r.name, name: "name" },
              { label: "Email", render: (r: any) => r.email, name: "email" },
              { label: "User Type", render: (r: any) => r.usertype, name: "usertype" },
              { label: "Created At", render: (r: any) => new Date(r.created_at).toLocaleString(), name: "created_at" },
            ]}
            data={filteredUsers}
            onEdit={(item: CustomUser): void => {
              setCurrentUser(item);
              setOpen(true);
            }}
            onDelete={(id: string): void => {
              setLoading(true);
              axios
                .post(`/api/users`, { action: "delete", _id: id })
                .then((res) => {
                  if (res.status === 200) {
                    toastMsg("success", "User deleted successfully");
                    setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
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
        header={`${currentUser ? "Edit" : "Add"} User`}
      >
        <UserForm
          user={currentUser!}
          onComplete={() => {
            setOpen(false);
            setCurrentUser(null);
            reloadUsers();
          }}
        />
      </CustomModal>
    </>
  );
}
