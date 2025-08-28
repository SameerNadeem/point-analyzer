// Represents a static event result (Design, Cost, Business)
export interface StaticResult {
    score: number | null;
    status: string | null;
}

// Represents a dynamic event result (Acceleration, Traction, Maneuverability, Suspension)
export interface DynamicResult {
    time: number | null;
    unique_attribute: number | null;
    status: string | null;
}

// Raw event D.S. for caching 
export interface EventData {
    acceleration?: string;
    traction?: string;
    maneuverability?: string;
    suspension?: string;
    design?: string;
    cost?: string;
    business?: string;
    endurance?: string;
}

export interface RankingEntry {
    rank: number;
    car_number: number;
    team_name: string;
    score: number;
}

// Rankings by categories
export interface Rankings {
    overall: RankingEntry[];
    dynamic: RankingEntry[];
    static: RankingEntry[];
    endurance: RankingEntry[];
}

// Wrapper 
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    timestamp: string;
}