import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {conn} from "@/database/config";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import {JWT} from "next-auth/jwt";
import {CustomSession, CustomUser} from "@/abstract/type";

export const authOptions: AuthOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "User Management",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password",
                },
            },
            async authorize(credentials) {
                await conn();
                const user = await User.findOne({email: credentials?.email});
                if (!user) {
                    return null;
                } else {
                    return user;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn(params) {
            const {user, account, email} = params;
            const incomingUser = user;

            if (account?.provider != "credentials") {
                await User.findOne({email: email}).then(async (user: CustomUser) => {
                    if (user) {
                        return true;
                    } else {
                        const randomPassword = Math.random().toString(36).slice(-8);
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(randomPassword, salt);
                        await User.create({
                            email: incomingUser?.email,
                            password: hash,
                            name: incomingUser?.name,
                            avatar: incomingUser?.image,
                        })
                            .then(() => {
                                return true;
                            })
                            .catch(() => {
                                return false;
                            });
                    }
                });
            }
            return true;
        },

        async jwt({token, user}: { token: JWT; user: CustomUser }) {
            if (user) {
                user.role = user.role ?? "user";
                token.user = user;
            }
            return token;
        },

        async session({
                          session,
                          token,
                      }: {
            session: CustomSession;
            token: JWT;
            user: CustomUser;
        }) {
            session.user = token.user as CustomUser;
            return session;
        },
    },
};
