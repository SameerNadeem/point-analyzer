export interface StaticResult {
    score: number | null;
    status: string | null;
}

export interface DynamicResult {
    time: number | null;
    unique_attribute: number | null;
    status: string | null;
}

export interface CarData {
    car_number: number;
    team_name: string | null;
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
    design_result: StaticResult | null;
    cost_result: StaticResult | null;
    business_result: StaticResult | null;
    endurance_laps: number | null;
    endurance_score: number | null;
    dynamic_score: number;
    static_score: number;
    total_score: number;
}

export interface RankingEntry {
    rank: number;
    car_number: number;
    team_name: string;
    score: number;
}

export interface Rankings {
    overall: RankingEntry[];
    dynamic: RankingEntry[];
    static: RankingEntry[];
    endurance: RankingEntry[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp?: string;
    error?: string;
}

export type EventCategory = 'overall' | 'dynamic' | 'static' | 'endurance';