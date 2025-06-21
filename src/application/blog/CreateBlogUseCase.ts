import type { IBlogRepository } from '../../core/repositories/interfaces.ts';
import type { Blog } from '../../core/entities/blog.ts';

export class CreateBlogUseCase {
    private blogRepository: IBlogRepository;
    constructor(blogRepository: IBlogRepository) {
        this.blogRepository = blogRepository;
    }
    async execute(blog: Blog) {
        return await this.blogRepository.save(blog);
    }
}
