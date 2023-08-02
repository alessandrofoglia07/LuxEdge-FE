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

export interface AuthContextType {
    accessToken: string | null;
    userInfo: UserInfo | null;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
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