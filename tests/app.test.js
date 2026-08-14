const request = require('supertest');
const app = require('../src/app');

describe('Task Manager API', () => {

  test('GET /health debe responder correctamente', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('GET /api/tasks debe devolver una lista', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/tasks debe crear una tarea', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Tarea de prueba'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Tarea de prueba');
  });

});