import {Request, Response, NextFunction} from 'express';
import {Animal} from '../../types/localTypes';
import {MessageResponse} from '../../types/Messages';
import animalModel from '../models/animalModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Animal;
};

// Create a new animal
const postAnimal = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as Animal;

    if (!body) {
      return next(new CustomError('Invalid animal data', 400));
    }
    const newAnimal = new animalModel(body);
    const savedAnimal = await newAnimal.save();

    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const getAnimals = async (
  _req: Request,
  res: Response<Animal[] | MessageResponse>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel.find()
    .populate('species')
    .populate('category')
    .select('-__v');
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalById = async (
  req: Request<{id: string}>,
  res: Response<Animal | DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const animal = await animalModel.findById(id)
    .populate('species')
    .populate('category')
    .select('-__v');
    if (!animal) {
      return next(new CustomError('Animal not found', 404));
    }
    res.json({
      message: 'Animal found',
      data: animal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const modifyAnimal = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const updatedAnimal = await animalModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAnimal) {
      return next(new CustomError('Animal not found', 404));
    }
    res.json({
      message: 'Animal updated',
      data: updatedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const deletedAnimal = await animalModel.findByIdAndDelete(id);
    if (!deletedAnimal) {
      return next(new CustomError('Animal not found', 404));
    }
    res.json({
      message: 'Animal deleted',
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsWithinBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[] | MessageResponse>,
  next: NextFunction,
) => {
  try {
    const { topRight, bottomLeft } = req.query;

    if (!topRight || !bottomLeft) {
      return next(
        new CustomError(
          'Please provide both topRight and bottomLeft coordinates',
          400,
        ),
      );
    }

    const animals = await animalModel.find({
      location: {
        $geoWithin: {
          $box: [
            topRight.split(','),
            bottomLeft.split(','),
          ],
        },
      },
    })
    .populate('species')
    .populate('category')
    .select('-__v');

    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsBySpecies = async (
  req: Request<{ species_name: string }>,
  res: Response<Animal[] | MessageResponse>,
  next: NextFunction,
) => {
  try {
    const { species_name } = req.params;
    console.log("Species param:", species_name);

    if (!species_name) {
      return next(new CustomError("Please provide a species", 400));
    }

    const animals = await animalModel.findBySpecies(species_name)

    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};



export {
  postAnimal,
  getAnimals,
  getAnimalById,
  modifyAnimal,
  deleteAnimal,
  getAnimalsWithinBox,
  getAnimalsBySpecies
};
