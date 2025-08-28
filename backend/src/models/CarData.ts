import { ICarData, DynamicResult, StaticResult } from '../types';


export class CarData implements ICarData {
    car_number: number;
    team_name: string | null = null;

    // Dynamic event results
    acceleration_result_1: DynamicResult | null = null;
    acceleration_result_2: DynamicResult | null = null;
    acceleration_score: number | null = null;

    traction_result_1: DynamicResult | null = null;
    traction_result_2: DynamicResult | null = null;
    traction_score: number | null = null;

    maneuverability_result_1: DynamicResult | null = null;
    maneuverability_result_2: DynamicResult | null = null;
    maneuverability_score: number | null = null;

    suspension_result_1: DynamicResult | null = null;
    suspension_result_2: DynamicResult | null = null;
    suspension_score: number | null = null;

    // Static event results
    design_result: StaticResult | null = null;
    cost_result: StaticResult | null = null;
    business_result: StaticResult | null = null;

    // Endurance event results
    endurance_laps: number | null = null;
    endurance_score: number | null = null;

    constructor(carNumber: number) {
        this.car_number = carNumber;
    }


    addAccelerationResult(time: number, status: string): void {
        if (!this.acceleration_result_1) {
            this.acceleration_result_1 = { time, unique_attribute: null, status };
        } else if (!this.acceleration_result_2) {
            this.acceleration_result_2 = { time, unique_attribute: null, status };
        } else {
            console.warn(`Car #${this.car_number} already has 2 acceleration results!`);
        }
    }


    addTractionResult(time: number, distance: number, status: string): void {
        if (!this.traction_result_1) {
            this.traction_result_1 = { time, unique_attribute: distance, status };
        } else if (!this.traction_result_2) {
            this.traction_result_2 = { time, unique_attribute: distance, status };
        } else {
            console.warn(`Car #${this.car_number} already has 2 traction results!`);
        }
    }


    addManeuverabilityResult(time: number, conesHit: number, status: string): void {
        if (!this.maneuverability_result_1) {
            this.maneuverability_result_1 = { time, unique_attribute: conesHit, status };
        } else if (!this.maneuverability_result_2) {
            this.maneuverability_result_2 = { time, unique_attribute: conesHit, status };
        } else {
            console.warn(`Car #${this.car_number} already has 2 maneuverability results!`);
        }
    }


    addSuspensionResult(time: number, gates: number, status: string): void {
        if (!this.suspension_result_1) {
            this.suspension_result_1 = { time, unique_attribute: gates, status };
        } else if (!this.suspension_result_2) {
            this.suspension_result_2 = { time, unique_attribute: gates, status };
        } else {
            console.warn(`Car #${this.car_number} already has 2 suspension results!`);
        }
    }


    getDynamicScore(): number {
        return (this.acceleration_score || 0) +
            (this.traction_score || 0) +
            (this.maneuverability_score || 0) +
            (this.suspension_score || 0);
    }


    getStaticScore(): number {
        return (this.design_result?.score || 0) +
            (this.cost_result?.score || 0) +
            (this.business_result?.score || 0);
    }


    getTotalScore(): number {
        return this.getDynamicScore() +
            this.getStaticScore() +
            (this.endurance_score || 0);
    }


    toString(): string {
        return `Car #${this.car_number} ${this.team_name || 'Unknown Team'}
Acceleration: ${this.acceleration_result_1?.time || 'N/A'} / ${this.acceleration_result_2?.time || 'N/A'} (Score: ${this.acceleration_score || 0})
Traction: ${this.traction_result_1?.time || 'N/A'} / ${this.traction_result_2?.time || 'N/A'} (Score: ${this.traction_score || 0})
Maneuverability: ${this.maneuverability_result_1?.time || 'N/A'} / ${this.maneuverability_result_2?.time || 'N/A'} (Score: ${this.maneuverability_score || 0})
Suspension: ${this.suspension_result_1?.time || 'N/A'} / ${this.suspension_result_2?.time || 'N/A'} (Score: ${this.suspension_score || 0})
Design: ${this.design_result?.score || 0}
Cost: ${this.cost_result?.score || 0}
Business: ${this.business_result?.score || 0}
Endurance: ${this.endurance_laps || 0} laps (Score: ${this.endurance_score || 0})
Total Score: ${this.getTotalScore()}`;
    }
}