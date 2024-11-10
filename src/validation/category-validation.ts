import { z } from 'zod';

const createCategorySchema = z.object({
    userId: z.number().int().min(1),
    name: z.string().min(1).max(50),
});

const getCategoryByIdSchema = z.object({
    categoryId: z.number().int().min(1),
});

const searchCategoryOwnedSchema = z.object({
    userId: z.number().int().min(1),
    asc: z.optional(z.union([z.literal('true'), z.literal('false')])),
});

const updateCategorySchema = z.object({
    categoryId: z.number().int().min(1),
    name: z.string().min(1).max(50),
});

const deleteCategorySchema = z.object({
    categoryId: z.number().int().min(1),
});

export {
    createCategorySchema,
    getCategoryByIdSchema,
    searchCategoryOwnedSchema,
    updateCategorySchema,
    deleteCategorySchema,
}