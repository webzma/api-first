const request = require('supertest');
const { app } = require('../src/server');

describe('Task Management API', () => {
  describe('Health Check', () => {
    test('GET /api/v1/health should return 200', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Categories', () => {
    test('GET /api/v1/categories should return default categories', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const category = response.body[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('created_at');
      expect(category).toHaveProperty('updated_at');
    });

    test('POST /api/v1/categories should create a new category', async () => {
      const newCategory = {
        name: 'Test Category',
        description: 'Category for testing',
        color: '#ff0000'
      };

      const response = await request(app)
        .post('/api/v1/categories')
        .send(newCategory)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newCategory.name);
      expect(response.body.description).toBe(newCategory.description);
      expect(response.body.color).toBe(newCategory.color);
    });
  });

  describe('Tasks', () => {
    test('GET /api/v1/tasks should return paginated tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      const pagination = response.body.pagination;
      expect(pagination).toHaveProperty('page');
      expect(pagination).toHaveProperty('limit');
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('total_pages');
      expect(pagination).toHaveProperty('has_next');
      expect(pagination).toHaveProperty('has_prev');
    });

    test('POST /api/v1/tasks should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Task for testing',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.status).toBe('pending');
    });

    test('POST /api/v1/tasks with invalid data should return validation error', async () => {
      const invalidTask = {
        title: '', // Empty title should fail
        description: 'Test',
        priority: 'invalid' // Invalid priority should fail
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(invalidTask)
        .expect(422);

      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('validation_errors');
      expect(Array.isArray(response.body.validation_errors)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('GET /api/v1/nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'ROUTE_NOT_FOUND');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /api/v1/tasks/999999 should return 404', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'NOT_FOUND');
      expect(response.body).toHaveProperty('message');
    });
  });
});