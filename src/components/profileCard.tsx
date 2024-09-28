"use client";

import { CardContent, CardTitle } from "@/components/ui/card";
import { Button, Card, CardHeader, Link } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import UserAvatar from "@/assets/images/user.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { CustomUser } from "@/abstract/type";
import React from "react";
import { LogOut } from "lucide-react";

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
        className={`dropdown absolute right-0 bg-white rounded-xl overflow-hidden shadow-lg top-[45px] w-fit border border-primary`}
      >
        <Card className="p-2 w-64 relative">
          <CardHeader className="min-w-fit rounded-lg items-center flex flex-col justify-center m-auto p-[10px]">
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
          <CardContent className="flex flex-col space-y-2">
            <LogOut className="text-primary absolute top-2 right-2 cursor-pointer z-50" onClick={async () => {
              await signOut();
              router.push("/login");
            }} />
          </CardContent>
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
