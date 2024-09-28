"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedInput } from "@/components/animatedInput";
import logo from '@/assets/images/logo.png';
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();

    useEffect(() => {
        getSession().then((session) => {
            if (session) {
                router.push('/soft/dashboard');
            }
        })
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;
        if (!email) {
            setErrors({ ...errors, email: 'Email is required' });
            return;
        }
        if (!password) {
            setErrors({ ...errors, password: 'Password is required' });
            return;
        }
        setLoading(true);
        axios.post('/api/auth/login', { email, password }).then(r => {
            if (r.data.status != 200) {
                setErrors(r.data.errors);
            } else if (r.data.status == 200) {
                signIn("credentials", {
                    email: email,
                    password: password,
                    callbackUrl: "/soft/dashboard",
                    redirect: true,
                }).then(r => {
                    console.log(r);
                });
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div
            className="flex items-center justify-center flex-col mx-5 sm:mx-0 sm:px-5 bg-white shadow-2xl rounded-lg py-4">
            <Image src={logo.src} alt="Logo" className="w-72" width={1563} height={625} />
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-8 w-full sm:w-96"
            >
                <h2 className="text-2xl font-bold text-gray-600 mb-5 text-center">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <AnimatedInput label={`Email`} type={`text`} placeholder={`Enter your Email`} name={`email`}
                            id={`email`} onchange={(e) => setEmail(e)} value={email} required={true} />
                        {
                            errors.email && (
                                <p className={`text-red-500 text-xs font-semibold mt-1 ml-2`}>{errors.email}</p>
                            )
                        }
                    </div>
                    <div>
                        <AnimatedInput label={`Password`} type={`password`} placeholder={`Enter your Password`}
                            name={`password`} id={`password`} onchange={(e) => setPassword(e)}
                            value={password}
                            required={true} />
                        {
                            errors.password && (
                                <p className={`text-red-500 text-xs font-semibold mt-1 ml-2`}>{errors.password}</p>
                            )
                        }
                    </div>
                    <div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {
                                loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V2.5" />
                                    </svg>
                                ) : `Login`
                            }
                        </motion.button>
                    </div>
                </form>
                <div className={`flex justify-end mt-3`}>
                    <Link href="/forgot-password"
                        className={`text-sm text-primary hover:text-accent-foreground transition-all duration-300`}>
                        Forgot your password?
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;