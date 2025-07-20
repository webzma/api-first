const database = require('../../config/database');

class Category {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.color = data.color;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async getAll() {
    const db = database.getDb();
    const sql = `
      SELECT * FROM categories 
      ORDER BY name ASC
    `;

    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const categories = rows.map(row => new Category(row));
        resolve(categories);
      });
    });
  }

  static async getById(id) {
    const db = database.getDb();
    const sql = 'SELECT * FROM categories WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve(new Category(row));
      });
    });
  }

  static async getByName(name) {
    const db = database.getDb();
    const sql = 'SELECT * FROM categories WHERE name = ?';

    return new Promise((resolve, reject) => {
      db.get(sql, [name], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve(new Category(row));
      });
    });
  }

  async save() {
    const db = database.getDb();
    const sql = `
      INSERT INTO categories (name, description, color)
      VALUES (?, ?, ?)
    `;

    const params = [
      this.name,
      this.description,
      this.color
    ];

    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.lastID);
      });
    });
  }

  static async update(id, data) {
    const db = database.getDb();
    const fields = [];
    const params = [];

    // Construir dinámicamente la query de actualización
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    params.push(id); // Para el WHERE

    const sql = `
      UPDATE categories 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      });
    });
  }

  static async delete(id) {
    const db = database.getDb();
    const sql = 'DELETE FROM categories WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      });
    });
  }

  static async exists(id) {
    const db = database.getDb();
    const sql = 'SELECT 1 FROM categories WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(!!row);
      });
    });
  }

  static async nameExists(name, excludeId = null) {
    const db = database.getDb();
    let sql = 'SELECT 1 FROM categories WHERE name = ?';
    const params = [name];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(!!row);
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      color: this.color,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Category;