import type { IBlogPost } from '../../../../types/db.ts';
import { Schema } from "mongoose";

export const Blog = new Schema<IBlogPost>({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    publishDate: { type: String, required: true },
    readTime: { type: String, required: true },
    tags: { type: [String], required: true },
    category: { type: String, required: true },
});
