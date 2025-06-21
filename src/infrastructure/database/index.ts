import { MongoDBDatabaseProvider } from "./mongoDB/MongoDBDatabaseProvider.ts";
import { User } from "./mongoDB/schemas/user.ts";
import { Product } from "./mongoDB/schemas/product.ts";
import { Outlet } from "./mongoDB/schemas/outlets.ts";
import { Blog } from "./mongoDB/schemas/blogs.ts";

const schemas = {
    User: User,
    Product: Product,
    Outlet: Outlet,
    Blog: Blog,
};

export const mongoDBProvider = MongoDBDatabaseProvider.create(schemas);