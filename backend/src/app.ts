import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PORT } from './config';

import apiRoutes from './routes/api';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());


app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Baja SAE Results Tracker API'
    });
});

app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Baja Tracker API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Rankings: http://localhost:${PORT}/api/rankings`);
    console.log(`Car detail: http://localhost:${PORT}/api/car/65`);
    console.log(`Refresh data: POST http://localhost:${PORT}/api/refresh`);
    console.log(`Export JSON: http://localhost:${PORT}/api/export/json`);
    console.log(`Export CSV: http://localhost:${PORT}/api/export/csv`);
});
export default app;