/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Model } from "mongoose";

export type DB = 'MONGODB';

export type SchemaMap = Record<string, Schema>;
export type ModelMap = Record<string, Model<any>>;

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    avatar?: string;
    password: string;
    lastLogin: Date;
}
export interface Translation {
    en: string;
    fr: string;
}

export interface IProduct {
    _id?: string;
    name: string;
    category: string;
    certification: string;
    nutritionalBenefits: string[];
    image: string;
    price: string;
    rating: number;
    description: Translation;
}
export interface IOutlet {
    _id?: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    rating: number;
    specialties: string[];
    coordinates: [number, number];
}

export interface IBlogPost {
    _id?: string
    title: string
    excerpt: string
    content: string
    image: string
    author: string
    publishDate: string
    readTime: string
    tags: string[]
    category: string
}

export interface QueryInterace {
    [key: string]: any
}


export interface UserDTO {
    id: string | null;
    name: string;
    email: string;
    avatar: string | null;
    lastLogin: Date | null;
}