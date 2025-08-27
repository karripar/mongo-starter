import {Animal} from '../src/types/Animal';
import {Category} from '../src/types/Category';
import {Species} from '../src/types/Species';

type TestAnimal = Animal & {
  _id: string;
};

type TestSpecies = Species & {
  _id: string;
};

type TestCategory = Category & {
  _id: string;
};

export {TestAnimal, TestSpecies, TestCategory};
