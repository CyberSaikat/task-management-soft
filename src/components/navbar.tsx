"use client";

import React, { useEffect } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem
} from "@nextui-org/react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import ProfileCard from "./profileCard";
import { CustomUser } from "@/abstract/type";
import { Button } from "@/components/ui/button";

export default function NavBar({
  isMenuOpen,
  setIsMenuOpen,
  profileCard,
  setProfileCard,
  userdata,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profileCard: boolean;
  setProfileCard: React.Dispatch<React.SetStateAction<boolean>>;
  userdata: CustomUser;
}) {
  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      document.addEventListener("click", function (e) {
        const target = e.target as HTMLElement;
        if (target.classList.contains("profile-card")) {
          return;
        }
        if (target.closest(".profile-card")) {
          return;
        }
        setProfileCard(false);
      });
    });
  }, [setProfileCard]);


  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-primary h-16 z-10 sticky top-0 left-0"
    >
      <NavbarContent justify="start" className="gap-0">
        <Button
          className="flex items-center text-xl sm:text-2xl bg-transparent shadow-none"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          {isMenuOpen ? (
            <motion.div
              initial={{ rotate: 360, opacity: 0, scale: 0.5 }}
              whileInView={{
                rotate: 0,
                opacity: 1,
                scale: 1,
              }}
              className="ms-64"
            >
              <FaTimes className="text-white text-2xl sm:text-xl" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 0, opacity: 0, scale: 0.5 }}
              whileInView={{
                rotate: 360,
                opacity: 1,
                scale: 1,
              }}
            >
              <FaBars className="text-white text-2xl sm:text-xl" />
            </motion.div>
          )}
        </Button>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-0 me-6">
        <NavbarItem className="relative profile-card">
          <ProfileCard
            profileCard={profileCard}
            setProfileCard={setProfileCard}
            userdata={userdata}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
