import { Router as ExpressRouter, type Application } from 'express';

interface IApp extends Application { };

export const setRoutes = (app: IApp): void => {
    const router: ExpressRouter = ExpressRouter({ caseSensitive: true });
    app.use(`/api`, router);
};