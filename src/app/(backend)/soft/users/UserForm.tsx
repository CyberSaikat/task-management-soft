"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import toastMsg from "@/utils/toaster";
import axios from "axios";
import type { CustomUser } from "@/abstract/type";
import { AnimatedInput, AnimatedSelect } from "@/components/animatedInput";
import { LoaderContext } from "@/context/loaderContext";
import { set } from "mongoose";

interface UserFormProps {
    user?: CustomUser;
    onComplete: () => void;
}

export default function UserForm({ user, onComplete }: UserFormProps) {
    const [_id, setId] = useState(user?._id || "");
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [usertype, setUserType] = useState(user?.usertype || "user");
    const { setLoading } = useContext(LoaderContext);

    useEffect(() => {
        if (user) {
            setId(user._id!);
            setName(user.name!);
            setEmail(user.email!);
            setUserType(user.usertype!);
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!name || !email || !usertype) {
            toastMsg("error", "Please fill all fields");
            return;
        }

        const payload = { _id, name, email, usertype, action: user ? "update" : "add" };

        try {
            setLoading(true);
            const response = user
                ? await axios.post(`/api/users`, payload)
                : await axios.post("/api/users", payload);
            setLoading(false);

            if (response.status === 200 || response.status === 201) {
                toastMsg("success", `User ${user ? "updated" : "created"} successfully`);
                onComplete();
            } else {
                toastMsg("error", "An error occurred");
            }
        } catch (error) {
            toastMsg("error", "An error occurred");
        }
    };

    return (
        <div className="space-y-4">
            <AnimatedInput label={"Name"} type={"text"} placeholder={"Enter Name"} name={"name"} id={"name"} value={name} onchange={(e) => {
                setName(e);
            }} required={true} />
            <AnimatedInput label={"Email"} type={"email"} placeholder={"Enter Email"} name={"email"} id={"email"} value={email} onchange={(e) => {
                setEmail(e);
            }} required={true} />
            <AnimatedSelect label={"Usertype"} options={[
                { value: "user", name: "User" },
                { value: "admin", name: "Admin" },
            ]} required={true} name={"usertype"} id={"usertype"} onChange={(e) => {
                setUserType(e);
            }} value={usertype} />
            <Button onClick={handleSubmit}>{user ? "Update" : "Add"} User</Button>
        </div>
    );
}
