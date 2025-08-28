import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PORT, EVENT_POINTS, EVENT_URLS } from './config';
import { DataRequester } from './services/dataRequester';

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

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend API is working!',
        config: {
            event_points: EVENT_POINTS,
            event_urls: Object.keys(EVENT_URLS)
        }
    });
});

app.get('/api/test-fetch', async (req, res) => {
    const requester = new DataRequester();
    const testData = await requester.requestEventData(EVENT_URLS.acceleration);

    res.json({
        success: !!testData,
        dataLength: testData?.length || 0,
        message: testData ? 'Data fetching works!' : 'Data fetching failed'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Baja Tracker API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;