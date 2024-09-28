import mongoose, { Schema } from "mongoose";

// Task List Schema
const taskListSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: { type: Schema.Types.String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Schema.Types.Date, default: Date.now },
    updated_at: { type: Schema.Types.Date, default: Date.now }
});

const TaskList = mongoose.models.TaskList || mongoose.model("TaskList", taskListSchema);

export default TaskList;