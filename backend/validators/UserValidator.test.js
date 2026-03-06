const express = require('express');
const request = require('supertest');

const { registerUserRules, loginUserRules } = require('./userValidator'); 
const { validate } = require('../middleware/validate');


function createApp() {
  const app = express();
  app.use(express.json());

  app.post('/register', registerUserRules, validate, (req, res) => {
    return res.status(201).json({ message: 'ok' });
  });

  app.post('/login', loginUserRules, validate, (req, res) => {
    return res.status(200).json({
      message: 'ok',
      email: req.body.email,
    });
  });

  return app;
}

describe('registerUserRules + validate middleware', () => {
  test('accepts valid payload', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/register')
      .send({
        firstname: 'Kumar',
        lastname: 'Karan',
        email: 'kumar.karan@example.com',
        password: '12345678'
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'ok' });
  });

  test('rejects firstname is empty', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/register')
      .send({
        lastname: 'Karan',
        email: 'kumar.karan@example.com',
        password: '12345678'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'firstname' })])
    );
  });

  test('rejects invalid email', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/register')
      .send({
        firstname: 'Kumar',
        lastname: 'Karan',
        email: 'karankumar.com',
        password: '12345678'
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    );
  });

  test('rejects short password', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/register')
      .send({
        firstname: 'Kumar',
        lastname: 'Karan',
        email: 'kumar.karan@example.com',
        password: '123456'
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'password' })])
    );
  });

});

describe('loginUserRules + validate middleware', () => {
  test('accepts valid credentials', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: '12345678',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('ok');
  });

  test('rejects when email is empty', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/login')
      .send({ password: '12345678' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    );
  });

  test('rejects invalid email format', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/login')
      .send({ email: 'userasdas.com', password: '12345678' });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    );
  });

  test('rejects when password is empty', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/login')
      .send({ email: 'user@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'password' })])
    );
  });

  test('rejects short password less than 8 characters', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'Short1!' });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'password' })])
    );
  });
})