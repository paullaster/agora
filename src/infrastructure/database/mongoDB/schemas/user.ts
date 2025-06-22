import type { IUser } from '../../../../types/db.ts';
import { Schema } from "mongoose";


export const User = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
    lastLogin: { type: Date },
    password: { type: String, required: true },
    role: String,
});