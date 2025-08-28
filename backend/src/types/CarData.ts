import { DynamicResult, StaticResult } from "./Results";

// Contains all competition results and calculated scores

export interface ICarData {
    car_number: number;
    team_name: string | null;

    // dynamic events results
    acceleration_result_1: DynamicResult | null;
    acceleration_result_2: DynamicResult | null;
    acceleration_score: number | null;

    traction_result_1: DynamicResult | null;
    traction_result_2: DynamicResult | null;
    traction_score: number | null;

    maneuverability_result_1: DynamicResult | null;
    maneuverability_result_2: DynamicResult | null;
    maneuverability_score: number | null;

    suspension_result_1: DynamicResult | null;
    suspension_result_2: DynamicResult | null;
    suspension_score: number | null;

    // static events results

    design_result: StaticResult | null;
    cost_result: StaticResult | null;
    business_result: StaticResult | null;

    // endurance event results
    endurance_laps: number | null;
    endurance_score: number | null;
}

// Car data for API export

export interface CarExportData {
    rank: number;
    car_number: number;
    team_name: string;
    acceleration_score: number;
    traction_score: number;
    maneuverability_score: number;
    suspension_score: number;
    design_score: number;
    cost_score: number;
    business_score: number;
    endurance_laps: number;
    endurance_score: number;
    dynamic_score: number;
    static_score: number;
    total_score: number;
}