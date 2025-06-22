/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProductRepository } from "../../core/repositories/interfaces.ts";
import type { Connection, Model, Document } from "mongoose";
import type { IProduct, QueryInterace } from "../../types/db.ts";
import { Product } from "../../core/entities/product.ts";
import { AppError } from "../../core/entities/error.ts";

export class MongoDBProductRepository implements IProductRepository {
    public client: Connection;
    public productModel: Model<IProduct>;

    constructor(client: Connection, productModel: Model<IProduct>) {
        this.client = client;
        this.productModel = productModel;
    }

    async findById(id: string): Promise<Product | null> {
        const session = await this.client.startSession();
        try {
            let productDoc = null;
            await session.withTransaction(async () => {
                productDoc = await this.productModel.findById(id).session(session);
            });
            return productDoc ? await Product.creatFromModel(productDoc) : null;
        } finally {
            session.endSession();
        }
    }

    async findAll(query: QueryInterace): Promise<Product[]> {
        const session = await this.client.startSession();
        try {
            let productDocs: any[] = [];
            await session.withTransaction(async () => {
                productDocs = await this.productModel.find(query).session(session);
            });

            return Promise.all(productDocs.map(async (doc) => await Product.creatFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async save(product: Product): Promise<Product> {
        const session = await this.client.startSession();
        try {
            let savedDoc: (Document & IProduct) | null = null;
            await session.withTransaction(async () => {
                if (product.id) {
                    savedDoc = await this.productModel.findByIdAndUpdate(
                        product.id,
                        product.toPersistenceObject(),
                        { new: true, upsert: true, session }
                    );
                } else {
                    const created = await this.productModel.create([product.toPersistenceObject()], { session });
                    savedDoc = created[0];
                }
            });
            if (!savedDoc) throw new AppError('Failed to save product');
            return Product.creatFromModel(savedDoc);
        } finally {
            session.endSession();
        }
    }

    async saveBulk(products: Product[]): Promise<Product[]> {
        const session = await this.client.startSession();
        try {
            let savedDocs: (Document & IProduct)[] = [];
            await session.withTransaction(async () => {
                const bulk = products.map(p => p.toPersistenceObject());
                savedDocs = await this.productModel.insertMany(bulk, { session });
            });
            return Promise.all(savedDocs.map(doc => Product.creatFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async delete(id: string): Promise<boolean> {
        const session = await this.client.startSession();
        try {
            let result: (Document & IProduct) | null = null;
            await session.withTransaction(async () => {
                result = await this.productModel.findByIdAndDelete(id).session(session);
            });
            return !!result;
        } finally {
            session.endSession();
        }
    }
}
