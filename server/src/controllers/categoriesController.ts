import { Request, Response } from 'express';
import { categoryModel } from '../models/categories'; 

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newCategory = await categoryModel.create({
      data: {
        name,
      },
    });

    res.json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateCategory = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);
  const { name } = req.body;

  try {
    const updatedCategory = await categoryModel.update({
      where: { id: categoryId },
      data: {
        name, 
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);

  try {
    await categoryModel.delete({
      where: { id: categoryId },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
