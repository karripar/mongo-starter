import {MessageResponse} from '../src/types/Messages';
import {Express} from 'express';
import request from 'supertest';
import {TestAnimal, TestCategory, TestSpecies} from './testTypes';

// TODO: Add tests for the following:
// 1. Get all animals
// 2. Get animal by id
// 3. Post animal
// 4. Put animal
// 5. Delete animal
// 6. Get all animals by area (box)

type DBMessageResponse = MessageResponse & {
  data: TestAnimal | TestAnimal[];
};

const getAnimals = (app: Express): Promise<TestAnimal[]> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get('/api/v1/animals')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animals: TestAnimal[] = response.body;
          animals.forEach((animal) => {
            expect(animal._id).toBeDefined();
            expect(animal.animal_name).toBeDefined();
            expect((animal.species as TestSpecies).species_name).toBeDefined();
            expect(
              ((animal.species as TestSpecies).category as TestCategory)
                .category_name,
            ).toBeDefined();
            expect(animal.location.type).toBe('Point');
            expect(animal.location.coordinates).toHaveLength(2);
          });
          resolve(animals);
        }
      });
  });
};

const getAnimalById = (app: Express, id: string): Promise<TestAnimal> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get(`/api/v1/animals/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animal: TestAnimal = response.body;
          expect(animal._id).toBeDefined();
          expect(animal.animal_name).toBeDefined();
          expect((animal.species as TestSpecies).species_name).toBeDefined();
          expect(
            ((animal.species as TestSpecies).category as TestCategory)
              .category_name,
          ).toBeDefined();

          expect(animal.location.type).toBe('Point');
          expect(animal.location.coordinates).toHaveLength(2);
          resolve(animal);
        }
      });
  });
};

const postAnimal = (
  app: Express,
  animal_name: string,
  species: string,
  birthdate: Date,
  location: {type: string; coordinates: number[]},
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/api/v1/animals')
      .send({animal_name, species, birthdate, location})
      .expect(201, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: string = response.body.message;
          const data: TestAnimal = response.body.data;
          expect(data._id).toBeDefined();
          expect(data.animal_name).toBe(animal_name);
          expect(data.species).toBe(species);
          birthdate = new Date(birthdate);
          expect(data.location).toStrictEqual(location);
          resolve(response.body);
        }
      });
  });
};

const putAnimal = (
  app: Express,
  id: string,
  animal_name: string,
  birthdate: Date,
  location: {type: string; coordinates: number[]},
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .put(`/api/v1/animals/${id}`)
      .send({animal_name, birthdate, location})
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: string = response.body.message;
          const data: TestAnimal = response.body.data;
          expect(data._id).toBeDefined();
          expect(data.animal_name).toBe(animal_name);
          birthdate = new Date(birthdate);
          expect(data.location).toStrictEqual(location);
          resolve(response.body);
        }
      });
  });
};

const deleteAnimal = (app: Express, id: string): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .delete(`/api/v1/animals/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: string = response.body.message;
          expect(message).toBe('Animal deleted');
          resolve(response.body);
        }
      });
  });
};

const getAnimalsByArea = (
  app: Express,
  topRight: string,
  bottomLeft: string,
): Promise<TestAnimal[]> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get(`/api/v1/animals/location`)
      .query({topRight, bottomLeft})
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animals: TestAnimal[] = response.body;
          animals.forEach((animal) => {
            expect(animal._id).toBeDefined();
            expect(animal.animal_name).toBeDefined();
            expect((animal.species as TestSpecies).species_name).toBeDefined();
            expect(
              ((animal.species as TestSpecies).category as TestCategory)
                .category_name,
            ).toBeDefined();
            expect(animal.location.type).toBe('Point');
            expect(animal.location.coordinates).toHaveLength(2);
          });
          resolve(animals);
        }
      });
  });
};

const getaAnimalsBySpecies = (
  app: Express,
  species: string,
): Promise<TestAnimal[]> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get(`/api/v1/animals/species/${species}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animals: TestAnimal[] = response.body;
          animals.forEach((animal) => {
            expect(animal._id).toBeDefined();
            expect(animal.animal_name).toBeDefined();
            expect((animal.species as TestSpecies).species_name).toBe(species);
            expect(
              ((animal.species as TestSpecies).category as TestCategory)
                .category_name,
            ).toBeDefined();
            expect(animal.location.type).toBe('Point');
            expect(animal.location.coordinates).toHaveLength(2);
          });
          resolve(animals);
        }
      });
  });
};

export {
  getAnimals,
  getAnimalById,
  postAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByArea,
  getaAnimalsBySpecies,
};
