import {Polygon} from 'geojson';
import {MessageResponse} from '../src/types/Messages';
import {Express} from 'express';
import request from 'supertest';
import {TestSpecies} from './testTypes';

// TODO: Add tests for the following:
// 1. Get all species
// 2. Get species by id
// 3. Post species
// 4. Put species
// 5. Delete species
// 6. Get all species by area (polygon)

type DBMessageResponse = MessageResponse & {
  data: TestSpecies | TestSpecies[];
};

const getSpecies = (app: Express): Promise<TestSpecies[]> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get('/api/v1/species')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const species: TestSpecies[] = response.body;
          species.forEach((species) => {
            expect(species._id).toBeDefined();
            expect(species.species_name).toBeDefined();
            expect(species.category).toBeDefined();
            expect(species.location.type).toBe('Point');
            expect(species.location.coordinates).toHaveLength(2);
          });
          resolve(species);
        }
      });
  });
};

const getSpeciesById = (app: Express, id: string): Promise<TestSpecies> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get(`/api/v1/species/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const species: TestSpecies = response.body;
          expect(species._id).toBeDefined();
          expect(species.species_name).toBeDefined();
          expect(species.category).toBeDefined();
          expect(species.location.type).toBe('Point');
          expect(species.location.coordinates).toHaveLength(2);
          resolve(species);
        }
      });
  });
};

const postSpecies = (
  app: Express,
  species_name: string,
  category: string,
  location: {type: string; coordinates: number[]},
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/api/v1/species')
      .send({species_name, category, location})
      .expect(201, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: string = response.body.message;
          const data = response.body.data as TestSpecies;
          expect(message).toBe('Species created');
          expect(data._id).toBeDefined();
          expect(data.species_name).toBe(species_name);
          expect(data.category).toBe(category);
          expect(data.location).toStrictEqual(location);
          resolve(response.body);
        }
      });
  });
};

const putSpecies = (
  app: Express,
  id: string,
  species_name: string,
  location: {type: string; coordinates: number[]},
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .put(`/api/v1/species/${id}`)
      .send({species_name, location})
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: string = response.body.message;
          const data = response.body.data as TestSpecies;
          expect(message).toBe('Species updated');
          expect(data._id).toBeDefined();
          expect(data.species_name).toBe(species_name);
          expect(data.location).toStrictEqual(location);
          resolve(response.body);
        }
      });
  });
};

const deleteSpecies = (
  app: Express,
  id: string,
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .delete(`/api/v1/species/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: string = response.body.message;
          expect(message).toBe('Species deleted');
          resolve(response.body);
        }
      });
  });
};

const getSpeciesByArea = (
  app: Express,
  polygon: Polygon,
): Promise<TestSpecies[]> => {
  return new Promise((resolve, reject) => {
    request(app)
      .post(`/api/v1/species/area`)
      .send({polygon})
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const species: TestSpecies[] = response.body;
          species.forEach((species) => {
            expect(species._id).toBeDefined();
            expect(species.species_name).toBeDefined();
            expect(species.category).toBeDefined();
            expect(species.location.type).toBe('Point');
            expect(species.location.coordinates).toHaveLength(2);
          });
          resolve(species);
        }
      });
  });
};

export {
  getSpecies,
  getSpeciesById,
  postSpecies,
  putSpecies,
  deleteSpecies,
  getSpeciesByArea,
};
