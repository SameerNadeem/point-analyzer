import { Router, Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { EventCategory } from '../types';

const router = Router();
const dataService = new DataService();


// Get rankings by category (overall, dynamic, static, endurance)

router.get('/rankings', async (req: Request, res: Response) => {
    try {
        const category = req.query.category as EventCategory;

        await dataService.loadData();
        const rankings = dataService.getRankings();

        if (category && rankings[category]) {
            res.json({
                success: true,
                category,
                data: rankings[category],
                timestamp: new Date().toISOString()
            });
        } else {
            res.json({
                success: true,
                data: rankings,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error getting rankings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get rankings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});


// Get detailed information for a specific car

router.get('/car/:carNumber', async (req: Request, res: Response) => {
    try {
        const carNumber = parseInt(req.params.carNumber);

        if (isNaN(carNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid car number'
            });
        }

        await dataService.loadData();
        const carData = dataService.getCarData(carNumber);

        if (!carData) {
            return res.status(404).json({
                success: false,
                message: `Car #${carNumber} not found`
            });
        }

        return res.json({
            success: true,
            data: {
                car_number: carData.car_number,
                team_name: carData.team_name,
                acceleration_result_1: carData.acceleration_result_1,
                acceleration_result_2: carData.acceleration_result_2,
                acceleration_score: carData.acceleration_score,
                traction_result_1: carData.traction_result_1,
                traction_result_2: carData.traction_result_2,
                traction_score: carData.traction_score,
                maneuverability_result_1: carData.maneuverability_result_1,
                maneuverability_result_2: carData.maneuverability_result_2,
                maneuverability_score: carData.maneuverability_score,
                suspension_result_1: carData.suspension_result_1,
                suspension_result_2: carData.suspension_result_2,
                suspension_score: carData.suspension_score,
                design_result: carData.design_result,
                cost_result: carData.cost_result,
                business_result: carData.business_result,
                endurance_laps: carData.endurance_laps,
                endurance_score: carData.endurance_score,
                dynamic_score: carData.getDynamicScore(),
                static_score: carData.getStaticScore(),
                total_score: carData.getTotalScore()
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error getting car data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get car data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});


// Force refresh of competition data

router.post('/refresh', async (req: Request, res: Response) => {
    try {
        console.log('Refreshing competition data...');
        await dataService.loadData(true); // Force refresh

        const stats = dataService.getStats();

        res.json({
            success: true,
            message: 'Data refreshed successfully',
            stats: {
                totalCars: stats.totalCars,
                lastUpdated: stats.lastUpdated
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error refreshing data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;