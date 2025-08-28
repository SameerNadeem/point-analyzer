import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PORT, EVENT_POINTS, EVENT_URLS } from './config';
import { DataRequester } from './services/dataRequester';
import { DataParser } from './services/dataParser';
import { PointsCalculator } from './services/pointsCalculator';

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

app.get('/api/test-parse', async (req, res) => {
    try {
        const requester = new DataRequester();
        const parser = new DataParser();

        console.log('Fetching and parsing data...');
        const eventData = await requester.fetchAllEventData();
        parser.parseAllData(eventData);

        const carDatas = parser.getCarDatas();
        const carCount = carDatas.size;
        const sampleCar = Array.from(carDatas.values())[0];

        res.json({
            success: true,
            message: 'Data parsing test completed!',
            totalCars: carCount,
            sampleCar: sampleCar ? {
                carNumber: sampleCar.car_number,
                teamName: sampleCar.team_name,
                hasAccelerationData: !!sampleCar.acceleration_result_1,
                hasDesignData: !!sampleCar.design_result,
                hasTractionData: !!sampleCar.traction_result_1,
                hasEnduranceData: !!sampleCar.endurance_laps
            } : null
        });
    } catch (error) {
        console.error('Parsing test error:', error);
        res.status(500).json({
            success: false,
            message: 'Parsing test failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.get('/api/test-scoring', async (req, res) => {
    try {
        const requester = new DataRequester();
        const parser = new DataParser();

        console.log('Fetching, parsing, and calculating scores...');
        const eventData = await requester.fetchAllEventData();
        parser.parseAllData(eventData);

        const calculator = new PointsCalculator(parser.getCarDatas());
        calculator.calculateAllPoints();
        const rankings = calculator.getRankings();

        res.json({
            success: true,
            message: 'Scoring test completed!',
            totalCars: parser.getCarDatas().size,
            rankings: {
                overall: rankings.overall.slice(0, 5),
                dynamic: rankings.dynamic.slice(0, 5),
                static: rankings.static.slice(0, 5),
                endurance: rankings.endurance.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Scoring test error:', error);
        res.status(500).json({
            success: false,
            message: 'Scoring test failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Baja Tracker API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Test parsing: http://localhost:${PORT}/api/test-parse`);
});

export default app;