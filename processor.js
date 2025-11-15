const { createClient } = require('redis');
const { connect, run } = require('./db');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const QUEUE_NAME = process.env.QUEUE_NAME || 'events_queue';

const redis = createClient({ url: REDIS_URL });

async function processEvent(jsonStr) {
  const db = connect();
  try {
    const ev = JSON.parse(jsonStr);

    // Log the event being processed
    console.log("Processing event:", ev);

    const date = ev.timestamp
      ? new Date(ev.timestamp).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    const sql = `INSERT INTO events (site_id, event_type, path, user_id, timestamp, date)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    await run(db, sql, [
      ev.site_id,
      ev.event_type,
      ev.path,
      ev.user_id,
      ev.timestamp,
      date,
    ]);
  } catch (err) {
    console.error("Error processing event:", err);
  } finally {
    db.close();
  }
}

async function start() {
  try {
    console.log("Connecting to Redis...");
    await redis.connect();
    console.log("Processor connected to Redis:", REDIS_URL);
    console.log("Worker blocking on queue:", QUEUE_NAME);

    while (true) {
      const res = await redis.brPop(QUEUE_NAME, 0);

      if (res && res.element) {
        await processEvent(res.element);
      }
    }
  } catch (err) {
    console.error("Processor error:", err);
  }
}

start();
