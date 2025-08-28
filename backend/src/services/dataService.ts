import fs from 'fs';
import path from 'path';
import { DataRequester } from './dataRequester';
import { DataParser } from './dataParser';
import { PointsCalculator } from './pointsCalculator';
import { CarData } from '../models/CarData';
import { Rankings, EventData } from '../types';
import { CACHE_DIR } from '../config';


export class DataService {
    private carDatas: Map<number, CarData> = new Map();
    private rankings: Rankings | null = null;
    private lastUpdated: Date | null = null;
    private cacheFile: string;

    constructor() {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }

        this.cacheFile = path.join(CACHE_DIR, 'event_data.json');
    }


    //Load competition data (with optional force refresh)

    async loadData(forceRefresh: boolean = false): Promise<void> {
        // If data already loaded and not forcing refresh, return
        if (this.carDatas.size > 0 && !forceRefresh) {
            return;
        }

        console.log(forceRefresh ? 'Force refreshing data...' : 'Loading data...');

        const requester = new DataRequester();
        const parser = new DataParser();
        let eventData: EventData;

        // Try to use cached data first (if not forcing refresh)
        if (!forceRefresh && fs.existsSync(this.cacheFile)) {
            try {
                console.log('Loading cached data...');
                const cachedData = fs.readFileSync(this.cacheFile, 'utf8');
                eventData = JSON.parse(cachedData);
            } catch (error) {
                console.warn('Failed to load cached data, fetching fresh data');
                eventData = await requester.fetchAllEventData();
                this.saveToCache(eventData);
            }
        } else {
            // Fetch fresh data
            console.log('Fetching fresh data from website...');
            eventData = await requester.fetchAllEventData();
            this.saveToCache(eventData);
        }

        // Parse the data
        parser.parseAllData(eventData);
        this.carDatas = parser.getCarDatas();

        // Calculate scores and rankings
        const calculator = new PointsCalculator(this.carDatas);
        calculator.calculateAllPoints();
        this.rankings = calculator.getRankings();

        this.lastUpdated = new Date();
        console.log(`Data loaded successfully. ${this.carDatas.size} cars found.`);
    }


    // Save event data to cache

    private saveToCache(eventData: EventData): void {
        try {
            fs.writeFileSync(this.cacheFile, JSON.stringify(eventData, null, 2));
            console.log('Data cached successfully');
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }


    getRankings(): Rankings {
        if (!this.rankings) {
            throw new Error('Data not loaded. Call loadData() first.');
        }
        return this.rankings;
    }


    getCarData(carNumber: number): CarData | undefined {
        return this.carDatas.get(carNumber);
    }


    getStats(): { totalCars: number; lastUpdated: Date | null } {
        return {
            totalCars: this.carDatas.size,
            lastUpdated: this.lastUpdated
        };
    }
}