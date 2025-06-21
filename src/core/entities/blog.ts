import type { Document } from "mongoose";
import type { IBlogPost } from "../../types/db.ts";

export class Blog {
    public id: string;
    public title: string;
    public excerpt: string;
    public content: string;
    public image: string;
    public author: string;
    public publishDate: string;
    public readTime: string;
    public tags: string[];
    public category: string;

    constructor(blog: IBlogPost) {
        this.id = blog._id ?? '';
        this.title = blog.title;
        this.excerpt = blog.excerpt;
        this.content = blog.content;
        this.image = blog.image;
        this.author = blog.author;
        this.publishDate = blog.publishDate;
        this.readTime = blog.readTime;
        this.tags = blog.tags;
        this.category = blog.category;
    }

    static async createFromModel(model: Document & IBlogPost): Promise<Blog> {
        return new Blog({
            _id: model._id,
            title: model.title,
            excerpt: model.excerpt,
            content: model.content,
            image: model.image,
            author: model.author,
            publishDate: model.publishDate,
            readTime: model.readTime,
            tags: model.tags,
            category: model.category,
        });
    }

    static async createFromRawObject(obj: IBlogPost): Promise<Blog> {
        return new Blog(obj);
    }

    public toPersistenceObject() {
        return {
            title: this.title,
            excerpt: this.excerpt,
            content: this.content,
            image: this.image,
            author: this.author,
            publishDate: this.publishDate,
            readTime: this.readTime,
            tags: this.tags,
            category: this.category,
        };
    }
}
