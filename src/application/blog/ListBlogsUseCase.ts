import type { IBlogRepository } from '../../core/repositories/interfaces.ts';
import type { QueryInterace } from '../../types/db.ts';

export class ListBlogsUseCase {
    private blogRepository: IBlogRepository;
    constructor(blogRepository: IBlogRepository) {
        this.blogRepository = blogRepository;
    }
    async execute(query: QueryInterace) {
        return await this.blogRepository.findAll(query);
    }
}
