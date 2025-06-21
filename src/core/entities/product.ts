import type { Document } from "mongoose";
import type { IProduct } from "../../types/db.ts";
import { InValidData } from "./error.ts";

export class Product {
    public name: string;
    public category: string;
    public id?: string;
    public certification: string;
    public nutritionalBenefits: string[];
    public image: string;
    public price: string;
    public rating: number;
    public description: string
    constructor(product: IProduct) {
        if (
            !product.name ||
            !product.category ||
            !product.certification ||
            !product.description ||
            !product.image ||
            !product.nutritionalBenefits ||
            !product.nutritionalBenefits.length ||
            !product.price ||
            !product.rating
        ) {
            throw new InValidData('Invalid product');
        }
        this.name = product.name;
        this.category = product.category;
        this.id = product._id;
        this.certification = product.certification;
        this.nutritionalBenefits = product.nutritionalBenefits;
        this.image = product.image;
        this.price = product.price;
        this.description = product.description;
        this.rating = product.rating;

    }
    static async creatFromModel(model: Document & IProduct): Promise<Product> {
        return new Product(model);
    }
    static async createFromRawObject({ name, description, category, certification, nutritionalBenefits, image, price, rating }: IProduct): Promise<Product> {
        return new Product({ name, category, certification, price, description, image, nutritionalBenefits, rating });
    }
    public toPersistenceObject() {
        return {
            name: this.name,
            description: this.description,
            category: this.category,
            image: this.image,
            certification: this.certification,
            nutritionalBenefits: this.nutritionalBenefits,
            price: this.price,
            rating: this.rating,
        }
    }
}