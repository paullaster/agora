import type { IBlogRepository } from '../../core/repositories/interfaces.ts';

export class GetBlogDetailsUseCase {
    private blogRepository: IBlogRepository;
    constructor(blogRepository: IBlogRepository) {
        this.blogRepository = blogRepository;
    }
    async execute(id: string) {
        return await this.blogRepository.findById(id);
    }
}
