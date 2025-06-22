import type { IBlogRepository } from "../../core/repositories/interfaces.ts";
import type { Connection, Model, Document } from "mongoose";
import type { IBlogPost, QueryInterace } from "../../types/db.ts";
import { Blog } from "../../core/entities/blog.ts";
import { AppError } from "../../core/entities/error.ts";

export class MongoDBBlogRepository implements IBlogRepository {
    public client: Connection;
    public blogModel: Model<IBlogPost>;

    constructor(client: Connection, blogModel: Model<IBlogPost>) {
        this.client = client;
        this.blogModel = blogModel;
    }

    async findById(id: string): Promise<Blog | null> {
        const session = await this.client.startSession();
        try {
            let blogDoc: (Document & IBlogPost) | null = null;
            await session.withTransaction(async () => {
                blogDoc = await this.blogModel.findOne({ id: Number(id) }).session(session);
            });
            return blogDoc ? Blog.createFromModel(blogDoc) : null;
        } finally {
            session.endSession();
        }
    }

    async findAll(query: QueryInterace): Promise<Blog[]> {
        const session = await this.client.startSession();
        try {
            let blogDocs: (Document & IBlogPost)[] = [];
            await session.withTransaction(async () => {
                blogDocs = await this.blogModel.find(query).session(session);
            });
            return Promise.all(blogDocs.map(doc => Blog.createFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async save(blog: Blog): Promise<Blog> {
        const session = await this.client.startSession();
        try {
            let savedDoc: (Document & IBlogPost) | null = null;
            await session.withTransaction(async () => {
                if (blog.id) {
                    savedDoc = await this.blogModel.findOneAndUpdate(
                        { id: blog.id },
                        blog.toPersistenceObject(),
                        { new: true, upsert: true, session }
                    );
                } else {
                    const created = await this.blogModel.create([blog.toPersistenceObject()], { session });
                    savedDoc = created[0];
                }
            });
            if (!savedDoc) throw new AppError('Failed to save blog', 500);
            return Blog.createFromModel(savedDoc);
        } finally {
            session.endSession();
        }
    }

    async saveBulk(blogs: Blog[]): Promise<Blog[]> {
        const session = await this.client.startSession();
        try {
            let savedDocs: (Document & IBlogPost)[] = [];
            await session.withTransaction(async () => {
                const bulk = blogs.map(b => b.toPersistenceObject());
                savedDocs = await this.blogModel.insertMany(bulk, { session });
            });
            return Promise.all(savedDocs.map(doc => Blog.createFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async delete(id: string): Promise<boolean> {
        const session = await this.client.startSession();
        try {
            let result: (Document & IBlogPost) | null = null;
            await session.withTransaction(async () => {
                result = await this.blogModel.findOneAndDelete({ id: Number(id) }).session(session);
            });
            return !!result;
        } finally {
            session.endSession();
        }
    }
}
