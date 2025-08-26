import express from 'express';
import {
  postAnimal,
  getAnimals,
  getAnimalById,
  modifyAnimal,
  deleteAnimal,
  getAnimalsWithinBox,
} from '../controllers/animalController';

const router = express.Router();

router.route('/').post(postAnimal).get(getAnimals);

router.route('/location').get(getAnimalsWithinBox);

router.route('/:id').get(getAnimalById).put(modifyAnimal).delete(deleteAnimal);


export default router;
