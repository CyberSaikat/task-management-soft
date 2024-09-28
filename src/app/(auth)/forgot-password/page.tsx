"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedInput } from "@/components/animatedInput";
import logo from "@/assets/images/logo.png";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        email: '',
    });
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;

        if (!email) {
            setErrors({ ...errors, email: "Email is required" });
            return;
        }

        setLoading(true);
        axios
            .post("/api/auth/forgot-password", { email })
            .then((response) => {
                setMessage("A password reset link has been sent to your email.");
                setErrors({ email: "" });
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setErrors({ email: error.response.data.message });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center flex-col mx-5 sm:mx-0 sm:px-5 bg-white shadow-2xl rounded-lg py-4">
            <Image src={logo.src} alt="Logo" className="w-72" width={1563} height={625} />
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-8 w-full sm:w-96"
            >
                <h2 className="text-2xl font-bold text-gray-600 mb-5 text-center">Forgot Password</h2>

                {message && <p className="text-green-500 text-center mb-5">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <AnimatedInput
                            label={`Email`}
                            type={`text`}
                            placeholder={`Enter your Email`}
                            name={`email`}
                            id={`email`}
                            onchange={(e) => setEmail(e)}
                            value={email}
                            required={true}
                        />
                        {errors.email && <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.email}</p>}
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5" />
                                </svg>
                            ) : (
                                `Submit`
                            )}
                        </motion.button>
                    </div>
                </form>

                <div className="flex justify-end mt-3">
                    <a
                        href="/login"
                        className="text-sm text-primary hover:text-accent-foreground transition-all duration-300"
                    >
                        Back to Login
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
