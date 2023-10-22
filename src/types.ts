export interface LoginRes {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    username: string;
    role: 'user' | 'admin';
    active: boolean;
    message: string;
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
    category: string;
    sold: number;
    available: boolean;
    reviews: Review[];
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationMessage {
    title: string;
    content: string;
}

export interface Review {
    _id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Testimonial {
    pfpPath: string;
    author: string;
    text: string;
    rating: number;
}
