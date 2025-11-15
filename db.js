const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_FILE = process.env.SQLITE_FILE || './analytics.db';
const MIGRATION_SQL = fs.readFileSync(path.join(__dirname, 'migration.sql'), 'utf8');

function connect() {
  const db = new sqlite3.Database(DB_FILE);
  return db;
}

function migrate() {
  const db = connect();
  db.exec(MIGRATION_SQL, (err) => {
    if (err) {
      console.error('Migration failed:', err);
      process.exit(1);
    } else {
      console.log('Migration applied successfully.');
      db.close();
      process.exit(0);
    }
  });
}

function run(db, sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(db, sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { connect, migrate, run, all };