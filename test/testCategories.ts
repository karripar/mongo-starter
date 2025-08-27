import {Express} from 'express';
import request from 'supertest';
import {MessageResponse} from '../src/types/Messages';
import {TestCategory} from './testTypes';

// TODO: Add tests for the following:
// 1. Get all categories
// 2. Get category by id
// 3. Post category
// 4. Put category
// 5. Delete category

type DBMessageResponse = MessageResponse & {
  data: TestCategory | TestCategory[];
};

const getCategories = (app: Express): Promise<TestCategory[]> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get('/api/v1/categories')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const categories: TestCategory[] = response.body;
          categories.forEach((category) => {
            expect(category._id).not.toBe('');
            expect(category.category_name).not.toBe('');
          });
          resolve(categories);
        }
      });
  });
};

const getCategory = (app: Express, id: string): Promise<TestCategory> => {
  return new Promise((resolve, reject) => {
    request(app)
      .get(`/api/v1/categories/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const category: TestCategory = response.body;
          expect(category._id).not.toBe('');
          expect(category.category_name).not.toBe('');
          resolve(category);
        }
      });
  });
};

const postCategory = (
  app: Express,
  category_name: string,
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/api/v1/categories')
      .send({category_name})
      .expect(201, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: DBMessageResponse = response.body;
          const data = message.data as TestCategory;
          expect(message.message).toBe('Category created');
          expect(data._id).not.toBe('');
          expect(data.category_name).toBe(category_name);
          resolve(message);
        }
      });
  });
};

const putCategory = (
  app: Express,
  id: string,
  category_name: string,
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .put(`/api/v1/categories/${id}`)
      .send({category_name})
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: DBMessageResponse = response.body;
          const data = message.data as TestCategory;
          expect(message.message).not.toBe('');
          expect(data._id).not.toBe('');
          expect(data.category_name).toBe(category_name);
          resolve(message);
        }
      });
  });
};

const deleteCategory = (
  app: Express,
  id: string,
): Promise<DBMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(app)
      .delete(`/api/v1/categories/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: DBMessageResponse = response.body;
          const data = message.data as TestCategory;
          expect(message.message).not.toBe('');
          expect(data._id).not.toBe('');
          expect(data.category_name).not.toBe('');
          resolve(message);
        }
      });
  });
};

export {getCategories, getCategory, postCategory, putCategory, deleteCategory};
