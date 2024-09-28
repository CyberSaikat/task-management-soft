import { conn } from "@/database/config";
import User from "@/models/User";
import SendMailer from "@/utils/sendMailer";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { CustomUser } from "@/abstract/type";

// Function to send email
const sendEmail = async (email: string, name: string, password: string, url: string) => {

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Our Platform",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Platform</title>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Our Platform</h1>
          <p>Hello, ${name}!</p>
          <p>We're excited to have you on board. Your account has been successfully created, and you can now access our platform using the following credentials:</p>
          
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          
          <p>For security reasons, we strongly recommend changing your password upon your first login.</p>
          
          <a href="${url}" class="cta-button">Log In Now</a>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await SendMailer(mailOptions.to, mailOptions.subject, mailOptions.html);
  } catch (error) {
    throw new Error("Error sending email: " + error);
  }
};

export async function GET() {
  await conn();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = session.user as CustomUser;
  const isAdmin = user.usertype === "admin";
  let users;
  if (!isAdmin) {
    users = await User.find({}).select({
      name: true,
      email: true,
      usertype: true,
      created_at: true,
      updated_at: true,
    }).where("usertype").ne("admin").where("_id").ne(user._id);
  } else {
    users = await User.find({}).select({
      name: true,
      email: true,
      usertype: true,
      created_at: true,
      updated_at: true,
    }).where("usertype").ne("admin");
  }

  return NextResponse.json({ users }, { status: 200 });
}

export async function POST(request: NextRequest) {
  await conn();
  const body = await request.json();
  const { action } = body;

  if (!action) {
    return NextResponse.json({ message: "Missing required action field" }, { status: 400 });
  }


  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const url = `${protocol}://${host}`;

  try {
    switch (action) {
      case "update": {
        const { _id, name, email, usertype } = body;
        const updated_at = new Date();
        const user = await User.findOneAndUpdate(
          { _id },
          { name, email, usertype, updated_at },
          { new: true }
        );

        if (!user) {
          return NextResponse.json({ message: "User not found", status: 404 }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully", status: 200 }, { status: 200 });
      }

      case "delete": {
        const { _id } = body;
        const user = await User.findOneAndDelete({ _id });

        if (!user) {
          return NextResponse.json({ message: "User not found", status: 404 }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully", status: 200 }, { status: 200 });
      }

      case "add": {
        const { name, email, usertype } = body;

        if (!name || !email || !usertype) {
          return NextResponse.json({ message: "Missing required fields", status: 400 }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json({ message: "Email already exists", status: 400 }, { status: 400 });
        }

        const created_at = new Date();
        const random_password = Math.random().toString(36).slice(-8); // Generate random password
        const newUser = new User({
          name,
          email,
          usertype,
          password: random_password,
          created_at,
          updated_at: created_at,
        });

        await newUser.save();

        // Send email with credentials
        await sendEmail(email, name, random_password, url);

        return NextResponse.json({ message: "User added successfully", status: 201 }, { status: 201 });
      }

      default:
        return NextResponse.json({ message: "Invalid action", status: 400 }, { status: 400 });
    }
  } catch (error) {
    const errorMessage = (error instanceof Error ? error.message : String(error)) || "An error occurred";

    if (errorMessage.includes("Invalid email address")) {
      return NextResponse.json({ message: "Invalid email address", status: 400 }, { status: 400 });
    }

    return NextResponse.json({ message: errorMessage, status: 500 }, { status: 500 });
  }
}
