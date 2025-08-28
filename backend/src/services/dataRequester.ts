import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EVENT_URLS, DEFAULT_TIMEOUT } from '../config';
import { EventData } from '../types';

// Handles HTTP requests to the Baja SAE results site

export class DataRequester {
    private timeout: number;

    constructor(timeout: number = DEFAULT_TIMEOUT) {
        this.timeout = timeout;
    }

    async requestEventData(url: string): Promise<string | null> {
        try {
            const response = await axios.get(url, { timeout: this.timeout });
            return response.data;
        } catch (error) {
            console.error(`Error requesting data from ${url}:`, error);
            return null;
        }
    }


    async fetchAllEventData(): Promise<EventData> {
        const results: EventData = {};

        for (const [eventName, url] of Object.entries(EVENT_URLS)) {
            console.log(`Fetching data for ${eventName} event...`);
            const data = await this.requestEventData(url);

            if (data) {
                results[eventName as keyof EventData] = data;
            } else {
                console.warn(`Failed to fetch data for ${eventName} event`);
            }
        }

        return results;
    }

    close(): void {
    }
}