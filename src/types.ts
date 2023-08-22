export interface LoginRes {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    username: string;
    role: 'user' | 'admin';
    active: boolean;
}

export interface UserInfo {
    userId: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    active: boolean;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imagePath: string;
    tags: string[];
    sold: number;
    available: boolean;
    reviews: string[];
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Testimonial {
    pfpPath: string;
    author: string;
    text: string;
    rating: number;
}
