import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validator/authValidator";
import vine, { errors } from "@vinejs/vine";
import JSONAPIErrorReporter from "@/validator/errorReporter";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import {conn} from "@/database/config";

export async function POST(req: NextRequest) {
  await conn();
  try {
    const body = await req.json();

    const validator = vine.compile(loginSchema);
    validator.errorReporter = () => new JSONAPIErrorReporter();
    const validated = await validator.validate(body);

    const user = await User.findOne({ email: validated.email });

    if (!user) {
      return NextResponse.json(
        {
          errors: {
            email: ["User with this email does not exist"],
          },
          status: 400,
        },
        { status: 200 }
      );
    } else {
      const isPasswordValid = bcrypt.compareSync(
        validated.password,
        user.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          {
            errors: {
              password: ["Password is incorrect"],
            },
            status: 400,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "User logged in successfully", status: 200 },
          { status: 200 }
        );
      }
    }
  } catch (e) {
    if (e instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { errors: e.messages, status: 400 },
        { status: 200 }
      );
    }
  }
}
