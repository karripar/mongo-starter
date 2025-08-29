import {Request, Response, NextFunction} from 'express';
import {Category} from '../../types/localTypes';
import {MessageResponse} from '../../types/Messages';
import categoryModel from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Category;
};

// Create a new category
const postCategory = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Get category by ID
const getCategoryById = async (
  req: Request<{id: string}>,
  res: Response<Category | DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
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

const modifyCategory = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const newCategoryData = req.body;

    if (!newCategoryData) {
      return next(new CustomError('No data provided for update', 400));
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      newCategoryData,
      {new: true},
    );
    if (!updatedCategory) {
      return next(new CustomError('Category not found', 404));
    }
    res.json({
      message: 'Category updated',
      data: updatedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteCategory = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedCategory) {
      next(new CustomError('Category not found', 404));
      return;
    }
    res.json({
      message: 'Category deleted',
      data: deletedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  postCategory,
  getCategories,
  getCategoryById,
  modifyCategory,
  deleteCategory,
};
