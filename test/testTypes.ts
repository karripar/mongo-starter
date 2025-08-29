
import {Animal, Species, Category} from '../src/types/localTypes';

type TestAnimal = Animal & {
  _id: string;
};

type TestSpecies = Species & {
  _id: string;
};

type PostSpecies = Omit<Species, 'category'> & {
  category: string;
};

type TestCategory = Category & {
  _id: string;
};

export {TestAnimal, TestSpecies, PostSpecies, TestCategory};
