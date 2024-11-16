export interface IProduct {
    name: string;
    desc?: string;
    image?: string;
    end: number;
    creator: string;
    price: number;
    category?: string;
    created_at: number;
}