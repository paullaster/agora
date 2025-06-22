/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IUserRepository } from "../../core/repositories/interfaces.ts";
import type { Connection, Model } from "mongoose";
import type { IUser, QueryInterace } from "../../types/db.ts";
import { User } from "../../core/entities/user.ts";
import { AppError } from "../../core/entities/error.ts";

export class MongoDBUserRepository implements IUserRepository {
    public client: Connection;
    public userModel: Model<IUser>;

    constructor(client: Connection, userModel: Model<IUser>) {
        this.client = client;
        this.userModel = userModel;
    }

    async findById(id: string): Promise<User | null> {
        const session = await this.client.startSession();
        try {
            let userDoc = null;
            await session.withTransaction(async () => {
                userDoc = await this.userModel.findById(id).session(session);
            });
            return userDoc ? User.createFromModel(userDoc) : null;
        } finally {
            session.endSession();
        }
    }

    async findAll(query: QueryInterace): Promise<User[]> {
        const session = await this.client.startSession();
        try {
            let userDocs: any[] = [];
            await session.withTransaction(async () => {
                userDocs = await this.userModel.find(query).session(session);
            });
            return Promise.all(userDocs.map(doc => User.createFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    // Create and Update user
    async save(user: User): Promise<User> {
        const session = await this.client.startSession();
        try {
            let savedDoc;
            await session.withTransaction(async () => {
                if (user.id) {
                    savedDoc = await this.userModel.findByIdAndUpdate(
                        user.id,
                        user.toPersistenceObject(),
                        { new: true, upsert: true, session }
                    );
                } else {
                    savedDoc = await this.userModel.create([user.toPersistenceObject()], { session });
                    savedDoc = savedDoc[0];
                }
            });
            if (!savedDoc) {
                throw new AppError("Failed to save user document.", 500);
            }
            return User.createFromModel(savedDoc);
        } finally {
            session.endSession();
        }
    }

    async saveBulk(users: User[]): Promise<User[]> {
        const session = await this.client.startSession();
        try {
            let savedDocs: any[] = [];
            await session.withTransaction(async () => {
                const bulk = users.map(u => u.toPersistenceObject());
                savedDocs = await this.userModel.insertMany(bulk, { session });
            });
            return await Promise.all(savedDocs.map(doc => User.createFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async delete(id: string): Promise<boolean> {
        const session = await this.client.startSession();
        try {
            let result;
            await session.withTransaction(async () => {
                result = await this.userModel.findByIdAndDelete(id).session(session);
            });
            return !!result;
        } finally {
            session.endSession();
        }
    }
}