// src/models/todo.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUSER extends Document {
  email: string;
  password: string;
}

const todoSchema: Schema = new Schema({
  email: { type: String },
  password: { type: String },
});

export default mongoose.model<IUSER>('Todo', todoSchema);
