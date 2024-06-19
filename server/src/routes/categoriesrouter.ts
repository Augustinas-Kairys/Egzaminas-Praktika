import express from 'express';
import {  getAllCategories, createCategory, updateCategory, deleteCategory, } from '../controllers/categoriesController';

const router = express.Router();

router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

export default router;
