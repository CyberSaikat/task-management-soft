import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: Schema.Types.String,
    email: { type: Schema.Types.String, required: true, unique: true },
    login_key: { type: Schema.Types.String },
    password: { type: Schema.Types.String, required: true },
    usertype: { type: Schema.Types.String, required: true },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true },
    reset_key: { type: Schema.Types.String },
    reset_key_expires: { type: Schema.Types.Date },
    avatar: { type: Schema.Types.String },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    if(!this.isModified('email')) return next();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
        throw new Error("Invalid email address");
    }

    next();
});


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
