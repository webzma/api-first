const database = require('../../config/database');

class Task {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.due_date = data.due_date;
    this.category_id = data.category_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async getAll(filters = {}, pagination = {}) {
    const db = database.getDb();
    const { page = 1, limit = 10, status, category_id } = { ...filters, ...pagination };
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause += 'WHERE t.status = ? ';
      params.push(status);
    }

    if (category_id) {
      whereClause += whereClause ? 'AND t.category_id = ? ' : 'WHERE t.category_id = ? ';
      params.push(category_id);
    }

    // Query para obtener el total de registros
    const countSql = `
      SELECT COUNT(*) as total 
      FROM tasks t 
      ${whereClause}
    `;

    // Query para obtener los datos paginados
    const dataSql = `
      SELECT 
        t.*,
        c.name as category_name,
        c.description as category_description,
        c.color as category_color,
        c.created_at as category_created_at,
        c.updated_at as category_updated_at
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return new Promise((resolve, reject) => {
      // Primero obtenemos el total
      db.get(countSql, params, (err, countResult) => {
        if (err) {
          reject(err);
          return;
        }

        const total = countResult.total;
        const totalPages = Math.ceil(total / limit);

        // Luego obtenemos los datos
        db.all(dataSql, [...params, limit, offset], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          const tasks = rows.map(row => {
            const task = new Task(row);
            if (row.category_name) {
              task.category = {
                id: row.category_id,
                name: row.category_name,
                description: row.category_description,
                color: row.category_color,
                created_at: row.category_created_at,
                updated_at: row.category_updated_at
              };
            }
            return task;
          });

          resolve({
            data: tasks,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total,
              total_pages: totalPages,
              has_next: page < totalPages,
              has_prev: page > 1
            }
          });
        });
      });
    });
  }

  static async getById(id) {
    const db = database.getDb();
    const sql = `
      SELECT 
        t.*,
        c.name as category_name,
        c.description as category_description,
        c.color as category_color,
        c.created_at as category_created_at,
        c.updated_at as category_updated_at
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `;

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

        const task = new Task(row);
        if (row.category_name) {
          task.category = {
            id: row.category_id,
            name: row.category_name,
            description: row.category_description,
            color: row.category_color,
            created_at: row.category_created_at,
            updated_at: row.category_updated_at
          };
        }

        resolve(task);
      });
    });
  }

  async save() {
    const db = database.getDb();
    const sql = `
      INSERT INTO tasks (title, description, status, priority, due_date, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      this.title,
      this.description,
      this.status,
      this.priority,
      this.due_date,
      this.category_id
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
      UPDATE tasks 
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
    const sql = 'DELETE FROM tasks WHERE id = ?';

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
    const sql = 'SELECT 1 FROM tasks WHERE id = ?';

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

  static async getTasksByCategory(categoryId) {
    const db = database.getDb();
    const sql = 'SELECT COUNT(*) as count FROM tasks WHERE category_id = ?';

    return new Promise((resolve, reject) => {
      db.get(sql, [categoryId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row.count);
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      due_date: this.due_date,
      category_id: this.category_id,
      category: this.category,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Task;