import { Router as ExpressRouter, type Application } from 'express';
import productRoutes from './productRoutes.ts';
import userRoutes from './userRoutes.ts';
import outletRoutes from './outletRoutes.ts';
import blogRoutes from './blogRoutes.ts';
import authRoutes from './authRoutes.ts';
import protectedRoutes from './protectedRoutes.ts';
import faqRoutes from './faqRoutes.ts';
import ingestRoutes from './ingestRoutes.ts';

export const setRoutes = (app: Application): void => {
    const router: ExpressRouter = ExpressRouter({ caseSensitive: true });
    app.use(router);

    router.use('/products', productRoutes);
    router.use('/users', userRoutes);
    router.use('/outlets', outletRoutes);
    router.use('/blogs', blogRoutes);
    router.use('/auth', authRoutes);
    router.use('/protected', protectedRoutes);
    router.use('/faqs', faqRoutes);
    router.use('/ingest', ingestRoutes);
};