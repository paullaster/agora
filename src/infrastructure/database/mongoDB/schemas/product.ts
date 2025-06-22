import type { IProduct } from '../../../../types/db.ts';
import { Schema } from "mongoose";

export const Product = new Schema<IProduct>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    certification: { type: String, required: true },
    nutritionalBenefits: { type: [String], required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    description: {
        en: { type: String, required: true },
        fr: { type: String, required: true }
    },
});
