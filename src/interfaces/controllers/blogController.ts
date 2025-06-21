import type { Request, Response, NextFunction } from 'express';
import { ListBlogsUseCase } from '../../application/blog/ListBlogsUseCase.ts';
import { GetBlogDetailsUseCase } from '../../application/blog/GetBlogDetailsUseCase.ts';
import { CreateBlogUseCase } from '../../application/blog/CreateBlogUseCase.ts';

export class BlogController {
    private listBlogsUseCase: ListBlogsUseCase;
    private getBlogDetailsUseCase: GetBlogDetailsUseCase;
    private createBlogUseCase: CreateBlogUseCase;

    constructor(
        listBlogsUseCase: ListBlogsUseCase,
        getBlogDetailsUseCase: GetBlogDetailsUseCase,
        createBlogUseCase: CreateBlogUseCase
    ) {
        this.listBlogsUseCase = listBlogsUseCase;
        this.getBlogDetailsUseCase = getBlogDetailsUseCase;
        this.createBlogUseCase = createBlogUseCase;
    }

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const blogs = await this.listBlogsUseCase.execute(req.query);
            res.ApiResponse!.success(blogs);
        } catch (error) {
            next(error);
        }
    }

    async details(req: Request, res: Response, next: NextFunction) {
        try {
            const blog = await this.getBlogDetailsUseCase.execute(req.params.id);
            if (!blog) return res.ApiResponse!.error(404, 'Blog not found');
            res.ApiResponse!.success(blog);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const blog = await this.createBlogUseCase.execute(req.body);
            res.ApiResponse!.success(blog, 201, 'Blog created');
        } catch (error) {
            next(error);
        }
    }
}
