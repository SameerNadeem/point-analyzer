
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
    res.json({ message: 'Backend API is working!' });
});

app.listen(PORT, () => {
    console.log(`Baja Tracker API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;