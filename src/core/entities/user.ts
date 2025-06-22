import type { Document } from "mongoose";
import { InValidData } from "./error.ts";
import type { IUser, UserDTO } from "../../types/db.ts";

export class User {
    public id: string | null;
    public name: string;
    public email: string;
    public avatar: string | null;
    public password: string;
    public lastLogin: Date | null;
    public role: string;
    constructor(id: string | null, name: string, email: string, avatar: string | null, password: string, lastLogin: Date | null, role = 'user') {
        if (!name || !email || !password) {
            throw new InValidData('invalid user data');
        }
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.password = password;
        this.lastLogin = lastLogin;
        this.role = role;
    }
    static async createFromModel(model: Document & IUser): Promise<User> {
        return new User(
            model._id?.toString() ?? null,
            model.name,
            model.email,
            model.avatar ?? null,
            model.password,
            model.lastLogin ?? null,
            model.role,
        );
    }
    static async createFromRawObject({ name, email, avatar, password, lastLogin, role }: IUser): Promise<User> {
        return new User(null, name, email, avatar ?? null, password, lastLogin ?? null, role);
    }
    public toPersistenceObject() {
        return {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            password: this.password,
            lastLogin: this.lastLogin,
            role: this.role,
        };
    }
    public updateLastLogin(date: Date = new Date()) {
        this.lastLogin = date;
    }
    public toSafeObject(user: User): UserDTO {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            lastLogin: user.lastLogin,
            role: user.role,
        };
    }
}