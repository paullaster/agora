import type { Product } from '../entities/product.ts';
import type { User } from '../entities/user.ts';
import type { Outlet } from '../entities/outlets.ts';
import type { Blog } from '../entities/blog.ts';
import type { QueryInterace } from '../../types/db.ts';

export interface IProductRepository {
    findById(id: string): Promise<Product | null>;
    findAll(query: QueryInterace): Promise<Product[]>;
    save(product: Product): Promise<Product>;
    delete(id: string): Promise<boolean>;
}

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findAll(query: QueryInterace): Promise<User[]>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<boolean>;
}

export interface IOutletRepository {
    findById(id: string): Promise<Outlet | null>;
    findAll(query: QueryInterace): Promise<Outlet[]>;
    save(outlet: Outlet): Promise<Outlet>;
    delete(id: string): Promise<boolean>;
}

export interface IBlogRepository {
    findById(id: string): Promise<Blog | null>;
    findAll(query: QueryInterace): Promise<Blog[]>;
    save(blog: Blog): Promise<Blog>;
    delete(id: string): Promise<boolean>;
}
