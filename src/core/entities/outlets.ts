import type { Document } from "mongoose";
import type { IOutlet } from "../../types/db.ts";

export class Outlet {
    public id?: string;
    public name: string;
    public address: string;
    public phone: string;
    public hours: string;
    public rating: number;
    public specialties: string[];
    public coordinates: [number, number];

    constructor(outlet: IOutlet) {
        this.id = outlet._id;
        this.name = outlet.name;
        this.address = outlet.address;
        this.phone = outlet.phone;
        this.hours = outlet.hours;
        this.rating = outlet.rating;
        this.specialties = outlet.specialties;
        this.coordinates = outlet.coordinates;
    }

    static async createFromModel(model: Document & IOutlet): Promise<Outlet> {
        return new Outlet({
            _id: model.id,
            name: model.name,
            address: model.address,
            phone: model.phone,
            hours: model.hours,
            rating: model.rating,
            specialties: model.specialties,
            coordinates: model.coordinates,
        });
    }

    static async createFromRawObject(obj: IOutlet): Promise<Outlet> {
        return new Outlet(obj);
    }

    public toPersistenceObject() {
        return {
            name: this.name,
            address: this.address,
            phone: this.phone,
            hours: this.hours,
            rating: this.rating,
            specialties: this.specialties,
            coordinates: this.coordinates,
        };
    }
}