
export * from './CarData';
export * from './Results';

export type EventCategory = 'overall' | 'dynamic' | 'static' | 'endurance';
export type ExportFormat = 'json' | 'csv';
export type EventStatus = 'OK' | 'DNF' | 'DSQ' | string;