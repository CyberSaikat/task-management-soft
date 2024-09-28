"use client";

import { CardTitle } from "@/components/ui/card";
import { Button, Card, CardHeader, Link } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import UserAvatar from "@/assets/images/user.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {CustomUser} from "@/abstract/type";
import React from "react";

export default function ProfileCard({
  profileCard,
  setProfileCard,
  userdata,
}: {
  profileCard: boolean;
  setProfileCard: React.Dispatch<React.SetStateAction<boolean>>;
  userdata: CustomUser;
}) {
  const router = useRouter();
  const menuItems = [
    {
      href: null,
      text: "Log Out",
      func: async () => {
        await signOut();
        router.push("/login");
      },
    },
  ];
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0, y: -10, height: 0 }}
        animate={
          profileCard
            ? {
                opacity: 1,
                scale: 1,
                y: 15,
                height: "auto",
                transition: {
                  height: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0 },
                  scale: { duration: 0 },
                  y: { duration: 0.3, ease: "easeOut" },
                },
              }
            : {
                opacity: 0,
                scale: 0,
                y: -10,
                height: 0,
                transition: {
                  height: { duration: 0.3, ease: "easeIn" },
                  opacity: { duration: 0, delay: 0.3 },
                  scale: { duration: 0, delay: 0.3 },
                  y: { duration: 0.3, ease: "easeIn" },
                },
              }
        }
        transition={{ duration: 0.3 }}
        className={`dropdown absolute right-0 bg-white rounded-xl overflow-hidden shadow-lg top-[45px] w-fit`}
      >
        <Card className="p-2">
          <CardHeader className="min-w-fit rounded-lg items-center flex flex-col justify-center m-auto shadow-xl border p-[10px]">
            <Card className="w-full">
              <div className="grid grid-cols-4 w-full">
                <div className="col-span-1">
                  <Image
                    src={UserAvatar.src}
                    alt="User"
                    className="w-12 h-12 rounded-full"
                    width={972}
                    height={972}
                  />
                </div>
                <div className="col-span-3 flex flex-col justify-center items-start">
                  <CardTitle className="text-primary">
                    {userdata?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{userdata?.email}</p>
                </div>
              </div>
            </Card>
          </CardHeader>
          <ul className="w-64">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href ?? ""}
                  className="w-full h-full ps-3 hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={(e) => {
                    if (!item.href) {
                      e.preventDefault();
                      if (item.func) item.func();
                    }
                  }}
                >
                  <p className="p-2">{item.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <Button
        onClick={() => {
          setProfileCard(!profileCard);
        }}
        className="px-0"
      >
        <FaUserCircle className="text-white text-3xl" />
      </Button>
    </>
  );
}
