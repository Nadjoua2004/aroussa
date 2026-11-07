import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes principales de l'API Express
app.use('/api', apiRoutes);

// Gestion des routes API introuvables
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Route API introuvable' });
});

export default app;

