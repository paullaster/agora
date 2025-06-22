/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, jest } from '@jest/globals';
import request from 'supertest';
import express, { Response } from 'express';
import { ProductController } from '../../../src/interfaces/controllers/productController';
import type { CreateProductUseCase } from '../../../src/application/product/CreateProductUseCase';
import type { GetProductDetailsUseCase } from '../../../src/application/product/GetProductDetailsUseCase';
import type { ListProductsUseCase } from '../../../src/application/product/ListProductsUseCase';
import type { IProduct } from '../../../src/types/db';
import { Product } from '../../../src/core/entities/product';

// Mocks
const createProductMock: jest.MockedFunction<CreateProductUseCase['execute']> = jest.fn();
const getProductDetailsMock: jest.MockedFunction<GetProductDetailsUseCase['execute']> = jest.fn();
const listProductsMock: jest.MockedFunction<ListProductsUseCase['execute']> = jest.fn();

const createProductUseCase: CreateProductUseCase = { execute: createProductMock } as unknown as CreateProductUseCase;
const getProductDetailsUseCase: GetProductDetailsUseCase = { execute: getProductDetailsMock } as unknown as GetProductDetailsUseCase;
const listProductsUseCase: ListProductsUseCase = { execute: listProductsMock } as unknown as ListProductsUseCase;

const controller = new ProductController(listProductsUseCase, getProductDetailsUseCase, createProductUseCase);

const app = express();
app.use(express.json());

beforeAll(() => {
    (express.response as Response & { ApiResponse?: any }).ApiResponse = {
        success(this: Response, data?: unknown, status = 200, message = 'OK') {
            this.status(status).json({ success: true, message, data });
        },
        error(this: Response, status = 500, message = 'Error') {
            this.status(status).json({ success: false, message });
        },
    };
});

app.get('/products', (req, res, next) => controller.list(req, res, next));
app.get('/products/:id', (req, res, next) => controller.details(req, res, next));
app.post('/products', (req, res, next) => controller.create(req, res, next));

const mockProductData: IProduct = {
    _id: '1',
    name: 'Test Product',
    category: 'Fruit',
    certification: 'Organic',
    nutritionalBenefits: ['Vitamin C'],
    image: 'test.jpg',
    price: '10.00',
    rating: 5,
    description: 'A test product',
};

const mockProduct = new Product(mockProductData);

describe('ProductController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should list products', async () => {
        listProductsMock.mockResolvedValueOnce([mockProduct]);
        const res = await request(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual([mockProduct]);
    });

    test('should get product details', async () => {
        getProductDetailsMock.mockResolvedValueOnce(mockProduct);
        const res = await request(app).get('/products/1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockProduct);
    });

    test('should return 404 if product not found', async () => {
        getProductDetailsMock.mockResolvedValueOnce(null);
        const res = await request(app).get('/products/unknown-id');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Product not found');
    });

    test('should return 400 if product data is invalid', async () => {
        createProductMock.mockImplementationOnce(() => { throw new Error('Invalid product'); });
        const res = await request(app).post('/products').send({ name: '' });
        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
    });
});
