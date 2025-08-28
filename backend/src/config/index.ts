import path from 'path';
import { ExportFormat } from '@/types';

// Base URLs
export const BASE_URL = "https://results.bajasae.net";
export const TECH_URL = `${BASE_URL}/TechLineAssigns.aspx`;
export const EVENTS_URL = `${BASE_URL}/EventResults.aspx`;

// Event Specific URLs
export const EVENT_URLS = {
    business: `${EVENTS_URL}?Event=PRES`,
    design: `${EVENTS_URL}?Event=DESN`,
    cost: `${EVENTS_URL}?Event=COST`,
    acceleration: `${EVENTS_URL}?Event=ACCEL`,
    traction: `${EVENTS_URL}?Event=TRAC`,
    maneuverability: `${EVENTS_URL}?Event=MANU`,
    suspension: `${EVENTS_URL}?Event=SPEC`,
    endurance: `${EVENTS_URL}?Event=ENDUR`
} as const;

export const DEFAULT_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '30000');

export const EVENT_POINTS = {
    acceleration: 70.0,
    traction: 70.0,
    maneuverability: 70.0,
    suspension: 70.0,
    design: 150.0,
    cost: 100.0,
    business: 75.0,
    endurance: 400.0
} as const;

export const TIME_CAP_MULTIPLIERS = {
    acceleration: 1.5,
    maneuverability: 2.5,
    traction: 2.5,
    suspension: 2.5
} as const;

// Directories Config
const ROOT_DIR = path.dirname(path.dirname(__dirname));
export const DATA_DIR = path.join(ROOT_DIR, 'data');
export const CACHE_DIR = process.env.CACHE_DIR || path.join(DATA_DIR, 'cache');

export const EXPORT_FORMATS: ExportFormat[] = ['json', 'csv'];

export const CACHE_DURATION = parseInt(process.env.CACHE_DURATION || '3600'); // in seconds, default 1 hour

// Server Config
export const PORT = process.env.PORT || '3001'
export const NODE_ENV = process.env.HOST || 'development';

