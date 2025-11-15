const express = require('express');
const bodyParser = require('body-parser');
const { connect, all } = require('./db');
require('dotenv').config();

const PORT = process.env.PORT_REPORTING || 5000;

const app = express();
app.use(bodyParser.json());

app.get('/stats', async (req, res) => {
  const site_id = req.query.site_id;
  const date = req.query.date;

  if (!site_id) return res.status(400).json({ error: 'site_id is required' });

  const db = connect();
  try {
    const tSql = date ? 
      `SELECT COUNT(*) as total FROM events WHERE site_id = ? AND date = ?` :
      `SELECT COUNT(*) as total FROM events WHERE site_id = ?`;
    const total = (await all(db, tSql, date ? [site_id, date] : [site_id]))[0].total;

    const uSql = date ? 
      `SELECT COUNT(DISTINCT user_id) as u FROM events WHERE site_id = ? AND date = ?` :
      `SELECT COUNT(DISTINCT user_id) as u FROM events WHERE site_id = ?`;
    const unique_users = (await all(db, uSql, date ? [site_id, date] : [site_id]))[0].u;

    const pSql = date ?
      `SELECT path, COUNT(*) as views FROM events WHERE site_id=? AND date=? GROUP BY path ORDER BY views DESC LIMIT 10` :
      `SELECT path, COUNT(*) as views FROM events WHERE site_id=? GROUP BY path ORDER BY views DESC LIMIT 10`;
    const rows = await all(db, pSql, date ? [site_id,date] : [site_id]);
    const top_paths = rows.map(r => ({ path: r.path || '/', views: r.views }));

    res.json({ site_id, date: date||null, total_views: total, unique_users, top_paths });
  } finally { db.close(); }
});

app.listen(PORT, ()=>console.log("Reporting API on",PORT));