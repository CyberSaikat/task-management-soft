import { connect } from "@/db/config";
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validator/authValidator";
import vine, { errors } from "@vinejs/vine";
import JSONAPIErrorReporter from "@/validator/errorReporter";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  connect();
  try {
    const body = await req.json();

    const validator = vine.compile(registerSchema);
    validator.errorReporter = () => new JSONAPIErrorReporter();
    const validated = await validator.validate(body);

    const user = await User.findOne({ email: validated.email });

    if (user) {
      return NextResponse.json(
        {
          errors: {
            email: ["User with this email already exists"],
          },
          status: 400,
        },
        { status: 200 }
      );
    } else {
      const salt = bcrypt.genSaltSync(10);

      const hashedPassword = bcrypt.hashSync(validated.password, salt);
      validated.password = hashedPassword;

      await User.create(validated);

      return NextResponse.json(
        { message: "User created successfully", status: 200 },
        { status: 200 }
      );
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
