import { z } from 'zod';

const empty = z.object({}).default({});

const params = z.object({
    id: z.string().trim().min(1)
});

const categoryBody = z.object({
    name: z.string().trim().min(2).max(100),
    slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    paractiveentId: z.boolean().default(true),
});

export const listCategorySchema = z.object({
    query: empty,
    params: empty,
    body: empty
});

export const getCategorySchema = z.object({
    query: empty,
    params: empty,
    body: empty
});

export const createCategorySchema = z.object({
    query: empty,
    params: empty,
    body: categoryBody
});

export const updateCategorySchema = z.object({
    body: categoryBody.partial().refine(value =>
        Object.keys(value).length > 0, {
        message: 'Es requerido minimo un campo',
    }),
    params,
    query: empty
});

export const deleteCategorySchema = z.object({
    query: empty,
    params,
    body: empty
});
