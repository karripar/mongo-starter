import {Request, Response, NextFunction} from 'express';
import {Species} from '../../types/localTypes';
import {MessageResponse} from '../../types/Messages';
import speciesModel from '../models/speciesModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Species;
};

// Create a new species
const postSpecies = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as Species;

    if (!body) {
      return next(new CustomError('Invalid species data', 400));
    }
    const newSpecies = new speciesModel(body);
    const savedSpecies = await newSpecies.save();

    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const getSpecies = async (
  _req: Request,
  res: Response<Species[] | MessageResponse>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.find()
    .populate({ path: 'category', select: '-__v' })
    .select('-__v');
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpeciesById = async (
  req: Request<{id: string}>,
  res: Response<Species | DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const species = await speciesModel.findById(id)
    .populate({ path: 'category', select: '-__v' })
    .select('-__v');

    if (!species) {
      return next(new CustomError('Species not found', 404));
    }
    res.json({
      message: 'Species found',
      data: species,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const modifySpecies = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const updatedCategory = await speciesModel.findByIdAndUpdate(
      id,
      req.body,
      {new: true, runValidators: true},
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

const deleteSpecies = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const deletedSpecies = await speciesModel.findByIdAndDelete(id);
    if (!deletedSpecies) {
      return next(new CustomError('Species not found', 404));
    }
    res.json({
      message: 'Species deleted',
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const findSpeciesByArea = async (
  req: Request<{}, {}, GeoJSON.Polygon>,
  res: Response,
  next: NextFunction
) => {
  try {
    const polygon = req.body;

    if (!polygon || polygon.type !== "Polygon" || !polygon.coordinates) {
      return next(new CustomError("Invalid polygon data", 400));
    }

    const species = await speciesModel.findByArea(polygon)
    res.json(species);
  } catch (err) {
    next(new CustomError((err as Error).message, 500));
  }
};

export { postSpecies, getSpecies, getSpeciesById, modifySpecies, deleteSpecies, findSpeciesByArea };
