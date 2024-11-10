import { Priority } from '@prisma/client';
import { z } from 'zod';

const createTodoSchema = z.object({
    userId: z.number().int().min(1),
    title: z.string().min(1).max(255),
    priority: z.optional(z.nativeEnum(Priority)),
    completed: z.optional(z.boolean()),
    categoryId: z.optional(z.number().int().min(1)),
});

const getTodoByIdSchema = z.object({
    todoId: z.number().int().min(1),
});

const searchTodoOwnedSchema = z.object({
    userId: z.number().int().min(1),
    category: z.optional(z.string().min(1)),
    completed: z.optional(z.union([z.literal('true'), z.literal('false')])),
    dueDateOrder: z.optional(z.union([z.literal('asc'), z.literal('desc')])),
    size: z.optional(z.number().int().min(10).max(100)),
    page: z.optional(z.number().int().min(1)),
});

const editTodoSchema = z.object({
    todoId: z.number().int().min(1),
    title: z.string().min(1).max(255),
    priority: z.optional(z.nativeEnum(Priority)),
    completed: z.optional(z.boolean()),
    categoryId: z.optional(z.number().int().min(1)),
});

const deleteTodoSchema = z.object({
    todoId: z.number().int().min(1),
});

export {
    createTodoSchema,
    getTodoByIdSchema,
    searchTodoOwnedSchema,
    editTodoSchema,
    deleteTodoSchema,
}
