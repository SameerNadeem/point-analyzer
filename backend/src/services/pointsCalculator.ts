import { RankingEntry, Rankings } from '../types';
import { CarData } from '../models/CarData';
import { EVENT_POINTS, TIME_CAP_MULTIPLIERS } from '../config';


export class PointsCalculator {
    private carDatas: Map<number, CarData>;

    constructor(carDatas: Map<number, CarData>) {
        this.carDatas = carDatas;
    }


    calculateAccelerationPoints(): void {
        console.log('Calculating acceleration points...');

        // Get all best times
        const bestTimes: number[] = [];
        for (const car of this.carDatas.values()) {
            const times: number[] = [];

            if (car.acceleration_result_1?.status === 'OK' && car.acceleration_result_1.time) {
                times.push(car.acceleration_result_1.time);
            }
            if (car.acceleration_result_2?.status === 'OK' && car.acceleration_result_2.time) {
                times.push(car.acceleration_result_2.time);
            }

            if (times.length > 0) {
                bestTimes.push(Math.min(...times));
            }
        }

        if (bestTimes.length === 0) return;

        const minTime = Math.min(...bestTimes);
        const maxTime = Math.min(Math.max(...bestTimes), TIME_CAP_MULTIPLIERS.acceleration * minTime);

        // Calculate points for each car
        for (const car of this.carDatas.values()) {
            const times: number[] = [];

            if (car.acceleration_result_1?.status === 'OK' && car.acceleration_result_1.time) {
                times.push(car.acceleration_result_1.time);
            }
            if (car.acceleration_result_2?.status === 'OK' && car.acceleration_result_2.time) {
                times.push(car.acceleration_result_2.time);
            }

            if (times.length === 0) {
                car.acceleration_score = 0;
                continue;
            }

            const bestTime = Math.min(...times);
            const denominator = maxTime - minTime;

            if (denominator === 0) {
                car.acceleration_score = bestTime === minTime ? EVENT_POINTS.acceleration : 0;
            } else {
                car.acceleration_score = Math.max(0, EVENT_POINTS.acceleration * (maxTime - bestTime) / denominator);
            }
        }
    }

    calculateManeuverabilityPoints(): void {
        console.log('Calculating maneuverability points...');

        // Get all best times
        const bestTimes: number[] = [];
        for (const car of this.carDatas.values()) {
            const times: number[] = [];

            if (car.maneuverability_result_1?.status === 'OK' && car.maneuverability_result_1.time) {
                times.push(car.maneuverability_result_1.time);
            }
            if (car.maneuverability_result_2?.status === 'OK' && car.maneuverability_result_2.time) {
                times.push(car.maneuverability_result_2.time);
            }

            if (times.length > 0) {
                bestTimes.push(Math.min(...times));
            }
        }

        if (bestTimes.length === 0) return;

        const minTime = Math.min(...bestTimes);
        const maxTime = Math.min(Math.max(...bestTimes), TIME_CAP_MULTIPLIERS.maneuverability * minTime);

        // Calculate points for each car
        for (const car of this.carDatas.values()) {
            const times: number[] = [];

            if (car.maneuverability_result_1?.status === 'OK' && car.maneuverability_result_1.time) {
                times.push(car.maneuverability_result_1.time);
            }
            if (car.maneuverability_result_2?.status === 'OK' && car.maneuverability_result_2.time) {
                times.push(car.maneuverability_result_2.time);
            }

            if (times.length === 0) {
                car.maneuverability_score = 0;
                continue;
            }

            const bestTime = Math.min(...times);
            const denominator = maxTime - minTime;

            if (denominator === 0) {
                car.maneuverability_score = bestTime === minTime ? EVENT_POINTS.maneuverability : 0;
            } else {
                car.maneuverability_score = Math.max(0, EVENT_POINTS.maneuverability * (maxTime - bestTime) / denominator);
            }
        }
    }


    calculateTractionPoints(): void {
        console.log('Calculating traction points...');

        // Get all cars with valid times (finishers)
        const finishers: CarData[] = [];
        const allTimes: number[] = [];

        for (const car of this.carDatas.values()) {
            let bestTime = 0;

            if (car.traction_result_1?.time && car.traction_result_1.time > 0) {
                bestTime = car.traction_result_1.time;
            }
            if (car.traction_result_2?.time && car.traction_result_2.time > 0 &&
                (bestTime === 0 || car.traction_result_2.time < bestTime)) {
                bestTime = car.traction_result_2.time;
            }

            if (bestTime > 0) {
                finishers.push(car);
                allTimes.push(bestTime);
            }
        }

        if (allTimes.length === 0) return;

        const minTime = Math.min(...allTimes);
        const maxTime = Math.min(Math.max(...allTimes), TIME_CAP_MULTIPLIERS.traction * minTime);

        // Calculate points for finishers
        for (const car of finishers) {
            let bestTime = 0;

            if (car.traction_result_1?.time && car.traction_result_1.time > 0) {
                bestTime = car.traction_result_1.time;
            }
            if (car.traction_result_2?.time && car.traction_result_2.time > 0 &&
                (bestTime === 0 || car.traction_result_2.time < bestTime)) {
                bestTime = car.traction_result_2.time;
            }

            const denominator = maxTime - minTime;
            if (denominator === 0) {
                car.traction_score = bestTime === minTime ? EVENT_POINTS.traction : 0;
            } else {
                car.traction_score = Math.max(0, EVENT_POINTS.traction * (maxTime - bestTime) / denominator);
            }
        }

        // Set zero points for non-finishers
        for (const car of this.carDatas.values()) {
            if (!finishers.includes(car)) {
                car.traction_score = 0;
            }
        }
    }


    calculateSuspensionPoints(): void {
        console.log('Calculating suspension points...');

        // Get all cars with valid times (finishers)
        const finishers: CarData[] = [];
        const allTimes: number[] = [];

        for (const car of this.carDatas.values()) {
            let bestTime = 0;

            if (car.suspension_result_1?.time && car.suspension_result_1.time > 0) {
                bestTime = car.suspension_result_1.time;
            }
            if (car.suspension_result_2?.time && car.suspension_result_2.time > 0 &&
                (bestTime === 0 || car.suspension_result_2.time < bestTime)) {
                bestTime = car.suspension_result_2.time;
            }

            if (bestTime > 0) {
                finishers.push(car);
                allTimes.push(bestTime);
            }
        }

        if (allTimes.length === 0) return;

        const minTime = Math.min(...allTimes);
        const maxTime = Math.min(Math.max(...allTimes), TIME_CAP_MULTIPLIERS.suspension * minTime);

        // Calculate points for finishers
        for (const car of finishers) {
            let bestTime = 0;

            if (car.suspension_result_1?.time && car.suspension_result_1.time > 0) {
                bestTime = car.suspension_result_1.time;
            }
            if (car.suspension_result_2?.time && car.suspension_result_2.time > 0 &&
                (bestTime === 0 || car.suspension_result_2.time < bestTime)) {
                bestTime = car.suspension_result_2.time;
            }

            const denominator = maxTime - minTime;
            if (denominator === 0) {
                car.suspension_score = bestTime === minTime ? EVENT_POINTS.suspension : 0;
            } else {
                car.suspension_score = Math.max(0, EVENT_POINTS.suspension * (maxTime - bestTime) / denominator);
            }
        }

        // Set zero points for non-finishers
        for (const car of this.carDatas.values()) {
            if (!finishers.includes(car)) {
                car.suspension_score = 0;
            }
        }
    }


    calculateEndurancePoints(): void {
        console.log('Calculating endurance points...');

        let mostLaps = 0;
        for (const car of this.carDatas.values()) {
            if (car.endurance_laps && car.endurance_laps > mostLaps) {
                mostLaps = car.endurance_laps;
            }
        }

        if (mostLaps === 0) return;

        for (const car of this.carDatas.values()) {
            if (car.endurance_laps) {
                car.endurance_score = EVENT_POINTS.endurance * car.endurance_laps / mostLaps;
            } else {
                car.endurance_score = 0;
            }
        }
    }

    calculateAllPoints(): void {
        console.log('Calculating points for all events...');
        this.calculateAccelerationPoints();
        this.calculateManeuverabilityPoints();
        this.calculateTractionPoints();
        this.calculateSuspensionPoints();
        this.calculateEndurancePoints();
    }


    private getDynamicScore(car: CarData): number {
        return car.getDynamicScore();
    }


    private getStaticScore(car: CarData): number {
        return car.getStaticScore();
    }


    private getTotalScore(car: CarData): number {
        return car.getTotalScore();
    }

    getRankings(): Rankings {
        const cars = Array.from(this.carDatas.values());

        const dynamicRankings = cars
            .map(car => ({ car_number: car.car_number, score: this.getDynamicScore(car), team_name: car.team_name || '' }))
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        const staticRankings = cars
            .map(car => ({ car_number: car.car_number, score: this.getStaticScore(car), team_name: car.team_name || '' }))
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        const enduranceRankings = cars
            .map(car => ({ car_number: car.car_number, score: car.endurance_score || 0, team_name: car.team_name || '' }))
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        const overallRankings = cars
            .map(car => ({ car_number: car.car_number, score: this.getTotalScore(car), team_name: car.team_name || '' }))
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        return {
            dynamic: dynamicRankings,
            static: staticRankings,
            endurance: enduranceRankings,
            overall: overallRankings
        };
    }
}