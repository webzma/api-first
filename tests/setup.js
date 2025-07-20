const database = require('../config/database');

beforeAll(async () => {
  // Configurar variable de entorno para usar base de datos en memoria
  process.env.DB_PATH = ':memory:';
  await database.connect();
});

afterAll(async () => {
  await database.close();
});