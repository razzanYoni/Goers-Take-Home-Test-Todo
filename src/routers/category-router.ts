import express, { Router } from 'express';

import * as CategoryController from '../controllers/category-controller';
import { verifyToken } from '../middlewares/verify-token';

const categoryRouter: Router = express.Router({ mergeParams: true });

categoryRouter
    .route("/")
    .get(
        verifyToken,
        CategoryController.searchCategoryOwned,
    )
    .post(
        verifyToken,
        CategoryController.createCategory,
    );

categoryRouter
    .route("/:categoryId")
    .get(
        verifyToken,
        CategoryController.getCategoryById,
    )
    .put(
        verifyToken,
        CategoryController.editCategory,
    )
    .delete(
        verifyToken,
        CategoryController.deleteCategory,
    );

export { categoryRouter };
