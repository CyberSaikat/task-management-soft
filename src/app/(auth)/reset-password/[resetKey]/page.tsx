"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedInput } from "@/components/animatedInput";
import logo from "@/assets/images/logo.png";
import axios from "axios";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

const ResetPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });
    const router = useRouter();
    const { resetKey } = useParams(); // Get the resetKey from the URL params

    useEffect(() => {
        if (!resetKey) {
            setMessage("Invalid reset key.");
        }
    }, [resetKey]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;

        if (!password || !confirmPassword) {
            setErrors({
                password: !password ? "Password is required" : "",
                confirmPassword: !confirmPassword ? "Please confirm your password" : "",
            });
            return;
        }

        if (password !== confirmPassword) {
            setErrors({
                ...errors,
                confirmPassword: "Passwords do not match",
            });
            return;
        }

        setLoading(true);
        axios
            .post("/api/auth/reset-password", { password, resetKey })
            .then(() => {
                setMessage("Password has been reset successfully. Redirecting to login...");
                setErrors({ password: "", confirmPassword: "" });
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setErrors({
                        ...errors,
                        password: error.response.data.message,
                    });
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
                <h2 className="text-2xl font-bold text-gray-600 mb-5 text-center">Reset Password</h2>

                {message && <p className="text-green-500 text-center mb-5">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <AnimatedInput
                            label={`Password`}
                            type={`password`}
                            placeholder={`Enter new password`}
                            name={`password`}
                            id={`password`}
                            onchange={(e) => setPassword(e)}
                            value={password}
                            required={true}
                        />
                        {errors.password && <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.password}</p>}
                    </div>

                    <div>
                        <AnimatedInput
                            label={`Confirm Password`}
                            type={`password`}
                            placeholder={`Confirm your new password`}
                            name={`confirmPassword`}
                            id={`confirmPassword`}
                            onchange={(e) => setConfirmPassword(e)}
                            value={confirmPassword}
                            required={true}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.confirmPassword}</p>
                        )}
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

export default ResetPassword;
