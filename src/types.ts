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
    createdAt: string;
    updatedAt: string;
}

export interface NotificationMessage {
    title: string;
    content: string;
}

export interface Notification extends NotificationMessage {
    id: number;
}

export interface Review {
    _id: string;
    productId: string;
    user: {
        _id: string;
        username: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface Testimonial {
    pfpPath: string;
    author: string;
    text: string;
    rating: number;
}
