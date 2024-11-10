import { Category, Prisma } from '@prisma/client';

import prismaClient from '../cores/db';
import { ErrorType, StandardError } from '../errors/standard-error';
import {
    createCategorySchema,
    deleteCategorySchema,
    getCategoryByIdSchema,
    searchCategoryOwnedSchema,
    updateCategorySchema,
} from '../validation/category-validation';
import { validate } from '../validation/validation';

const createCategory = async (
    data: Prisma.CategoryCreateInput,
    userId: number,
): Promise<Category> => {
    validate(createCategorySchema, { ...data, userId: userId });

    const category = await prismaClient.category.findFirst({
        where: {
            name: data.name,
            userId: userId,
        },
    });

    if (category) {
        throw new StandardError(ErrorType.CATEGORY_ALREADY_EXISTS);
    }

    return prismaClient.category.create({
        data: {
            name: data.name,
            userId: userId,
        },
    });
}

const getCategoryById = async (
    userId: number,
    categoryId: number,
): Promise<Category> => {
    validate(getCategoryByIdSchema, { categoryId: categoryId })

    const category = await prismaClient.category.findUnique({
        where: {
            id: categoryId
        }
    });

    if (!category) {
        throw new StandardError(ErrorType.CATEGORY_NOT_FOUND);
    }

    if (category.userId !== userId) {
        throw new StandardError(ErrorType.CATEGORY_NOT_OWNED);
    }

    return category;
}

const searchCategoryOwned = async (
    userId: number,
    reqQuery: {
        asc?: string;
    }
): Promise<
    {
        data: Category[],
        total: number
    }> => {
    validate(searchCategoryOwnedSchema, { userId: userId, ...reqQuery })

    const nameOrder = reqQuery.asc ? (reqQuery.asc.toLowerCase() !== 'true' ? 'desc' : 'asc') : 'asc';

    const categories = await prismaClient.category.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            name: nameOrder,
        }
    })

    const totalCategory = await prismaClient.category.count({
        where: {
            userId: userId
        }
    })

    return {
        data: categories,
        total: totalCategory
    }
}

const updateCategory = async (
    inputData: Prisma.CategoryUpdateInput,
    categoryId: number,
    userId: number
): Promise<Category> => {
    validate(updateCategorySchema, { categoryId: categoryId, ...inputData })

    const category = await prismaClient.category.findUnique({
        where: {
            id: categoryId
        }
    });

    if (!category) {
        throw new StandardError(ErrorType.CATEGORY_NOT_FOUND);
    }

    if (category.userId !== userId) {
        throw new StandardError(ErrorType.CATEGORY_NOT_OWNED);
    }

    return prismaClient.category.update({
        where: {
            id: categoryId
        },
        data: {
            name: inputData.name,
        }
    })
};

const deleteCategory = async (
    categoryId: number,
    userId: number
): Promise<Category> => {
    validate(deleteCategorySchema, { categoryId: categoryId })

    const category = await prismaClient.category.findUnique({
        where: {
            id: categoryId,
        }
    })

    if (!category) {
        throw new StandardError(ErrorType.CATEGORY_NOT_FOUND);
    }

    if (category.userId !== userId) {
        throw new StandardError(ErrorType.CATEGORY_NOT_OWNED);
    }

    return prismaClient.category.delete({
        where: {
            id: categoryId,
        }
    })
};

export {
    createCategory,
    getCategoryById,
    searchCategoryOwned,
    updateCategory,
    deleteCategory,
};
