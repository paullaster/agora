export type Translation = {
    en: string;
    fr: string;
};

export interface IFaq {
    _id: string;
    question: Translation;
    answer: Translation;
    category?: string;
    order?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Faq implements IFaq {
    _id: string;
    question: Translation;
    answer: Translation;
    category?: string;
    order?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: IFaq) {
        this._id = data._id;
        this.question = data.question;
        this.answer = data.answer;
        this.category = data.category;
        this.order = data.order;
        this.isActive = data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
