import type { IOutletRepository } from "../../core/repositories/interfaces.ts";
import type { Connection, Model, Document } from "mongoose";
import type { IOutlet, QueryInterace } from "../../types/db.ts";
import { Outlet } from "../../core/entities/outlets.ts";
import { AppError } from "../../core/entities/error.ts";

export class MongoDBOutletRepository implements IOutletRepository {
    public client: Connection;
    public outletModel: Model<IOutlet>;

    constructor(client: Connection, outletModel: Model<IOutlet>) {
        this.client = client;
        this.outletModel = outletModel;
    }

    async findById(id: string): Promise<Outlet | null> {
        const session = await this.client.startSession();
        try {
            let outletDoc: (Document & IOutlet) | null = null;
            await session.withTransaction(async () => {
                outletDoc = await this.outletModel.findById(id).session(session);
            });
            return outletDoc ? await Outlet.createFromModel(outletDoc) : null;
        } finally {
            session.endSession();
        }
    }

    async findAll(query: QueryInterace): Promise<Outlet[]> {
        const session = await this.client.startSession();
        try {
            let outletDocs: (Document & IOutlet)[] = [];
            await session.withTransaction(async () => {
                outletDocs = await this.outletModel.find(query).session(session);
            });
            return Promise.all(outletDocs.map(async (doc) => await Outlet.createFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async save(outlet: Outlet): Promise<Outlet> {
        const session = await this.client.startSession();
        try {
            let savedDoc: (Document & IOutlet) | null = null;
            await session.withTransaction(async () => {
                if (outlet.id) {
                    savedDoc = await this.outletModel.findByIdAndUpdate(
                        outlet.id,
                        outlet.toPersistenceObject(),
                        { new: true, upsert: true, session }
                    );
                } else {
                    const created = await this.outletModel.create([outlet.toPersistenceObject()], { session });
                    savedDoc = created[0];
                }
            });
            if (!savedDoc) throw new AppError('Failed to save outlet');
            return await Outlet.createFromModel(savedDoc);
        } finally {
            session.endSession();
        }
    }

    async saveBulk(outlets: Outlet[]): Promise<Outlet[]> {
        const session = await this.client.startSession();
        try {
            let savedDocs: (Document & IOutlet)[] = [];
            await session.withTransaction(async () => {
                const bulk = outlets.map(o => o.toPersistenceObject());
                savedDocs = await this.outletModel.insertMany(bulk, { session });
            });
            return Promise.all(savedDocs.map(doc => Outlet.createFromModel(doc)));
        } finally {
            session.endSession();
        }
    }

    async delete(id: string): Promise<boolean> {
        const session = await this.client.startSession();
        try {
            let result: (Document & IOutlet) | null = null;
            await session.withTransaction(async () => {
                result = await this.outletModel.findByIdAndDelete(id).session(session);
            });
            return !!result;
        } finally {
            session.endSession();
        }
    }
}
