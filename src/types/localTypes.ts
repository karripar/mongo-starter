import { Types, Model, Query} from "mongoose";
import {Point} from "geojson";

type Category = {
  category_name: string;
}

type Species = {
  species_name: string;
  category: Types.ObjectId; // Reference to Category
  location: Point;
  image: string;
}

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId; // Reference to Species
  location: Point;
}

interface AnimalModel extends Model<Animal> {
  findBySpecies(species: string): Query<Animal[], Animal>;
};

export {Category, Species, Animal, AnimalModel};
