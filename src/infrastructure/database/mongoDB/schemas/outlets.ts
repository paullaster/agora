import type { IOutlet } from '../../../../types/db.ts';
import { Schema } from "mongoose";

export const Outlet = new Schema<IOutlet>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, required: true },
    rating: { type: Number, required: true },
    specialties: { type: [String], required: true },
    coordinates: { type: [Number], required: true },
});
