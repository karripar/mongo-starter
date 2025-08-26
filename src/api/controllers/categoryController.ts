import { Request, Response, NextFunction} from 'express';
import { Category } from '../../types/localTypes';
import { MessageResponse } from '../../types/Messages';
import categoryModel from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Category;
};

// Create a new category
const postCategory = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
  const newCategory = new categoryModel(req.body);
  const savedCategory = await newCategory.save();

  res.status(201).json({
    message: 'Category created',
    data: savedCategory,
  });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Get all categories
const getCategories = async (
  _req: Request,
  res: Response<Category[] | MessageResponse>,
  next: NextFunction
) => {
  try {
  const categories = await categoryModel.find();
  res.json(categories)
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Get category by ID
const getCategoryById = async (
  req: Request<{id: string}>,
  res: Response<Category | DBMessageResponse>,
  next: NextFunction
) => {
  try {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new CustomError('Category not found', 404));
  }
  res.json({
    message: 'Category found',
    data: category,
  });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export { postCategory, getCategories, getCategoryById };
