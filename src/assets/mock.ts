import { Product, Testimonial } from '@/types';

export const mockProducts: Product[] = [
    {
        _id: '1',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair1.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.8,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '2',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair2.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 3.8,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '3',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair3.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.6,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '4',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair4.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.2,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '5',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair5.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.9,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '6',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair6.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '7',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair7.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.4,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '8',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair8.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.7,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '9',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair9.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '10',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair10.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.3,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '11',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair11.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.6,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '12',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair12.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.2,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const mockTestimonials: Testimonial[] = [
    {
        pfpPath: '/testimonials/testimonial1.jpg',
        rating: 4.5,
        author: 'John Doe',
        text: 'The craftsmanship of the bedroom set is superb, and it has transformed my bedroom into a cozy and stylish oasis.'
    },
    {
        pfpPath: '/testimonials/testimonial2.jpg',
        rating: 5,
        author: 'Jane Doe',
        text: 'I found the perfect sofa for my living room, and it far exceeded my expectations in terms of quality and comfort. It looks and feels like a luxurious piece, yet it fits well within my budget.'
    },
    {
        pfpPath: '/testimonials/testimonial3.jpg',
        rating: 4.5,
        author: 'Johnny Doe',
        text: 'The quality of the furniture is top-notch, and the designs are absolutely stunning. The chairs are not only comfortable but also add a touch of elegance to my dining area.'
    }
];
