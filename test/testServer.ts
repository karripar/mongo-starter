import {Express} from 'express';
import request from 'supertest';

// function to test the server is running

const testServer = async (app: Express) => {
  return new Promise((resolve, reject) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
  });
};

// test that invalid routes return 404
const testInvalidRoute = async (app: Express, endpoint: string) => {
  return new Promise((resolve, reject) => {
    request(app)
      .get(endpoint)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
  });
};

export {testServer, testInvalidRoute};
