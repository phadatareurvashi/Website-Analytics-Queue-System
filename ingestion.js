const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('redis');
require('dotenv').config();

const PORT = process.env.PORT_INGESTION || 4000;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const QUEUE_NAME = process.env.QUEUE_NAME || 'events_queue';

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

const redis = createClient({ url: REDIS_URL });

redis.on('error', (err) => console.error('Redis Client Error', err));

async function start() {
  await redis.connect();
  console.log('Connected to Redis at', REDIS_URL);

  app.post('/event', async (req, res) => {
    const body = req.body || {};
    const { site_id, event_type, path, user_id, timestamp } = body;
    if (!site_id || !event_type) {
      return res.status(400).json({ error: 'site_id and event_type are required' });
    }
    const ts = timestamp || new Date().toISOString();
    const event = { site_id, event_type, path: path || null, user_id: user_id || null, timestamp: ts };
    try {
      await redis.rPush(QUEUE_NAME, JSON.stringify(event));
      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to queue event' });
    }
  });

  app.listen(PORT, () => console.log(`Ingestion API running on ${PORT}`));
}

start();