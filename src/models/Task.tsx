import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    id: Schema.Types.ObjectId,
    title: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String },
    due_date: { type: Schema.Types.Date, required: true },
    status: {
        type: Schema.Types.String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_user: { type: Schema.Types.ObjectId, ref: 'User' },
    taskList: { type: Schema.Types.ObjectId, ref: 'TaskList', required: true },
    created_at: { type: Schema.Types.Date, default: Date.now },
    updated_at: { type: Schema.Types.Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
