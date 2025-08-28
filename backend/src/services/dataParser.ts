import { load } from 'cheerio';
import { EventData } from '../types';
import { CarData } from '../models/CarData';


export class DataParser {
    private carDatas: Map<number, CarData> = new Map();

    private getCarData(carNumber: number): CarData {
        if (!this.carDatas.has(carNumber)) {
            this.carDatas.set(carNumber, new CarData(carNumber));
        }
        return this.carDatas.get(carNumber)!;
    }

    private parseData(htmlData: string) {
        if (!htmlData) return [];

        const $ = load(htmlData);

        const tableIds = ["MainContent_GridViewDynamicResults", "MainContent_GridViewStaticResults", "MainContent_GridViewEnduranceResults"];

        let resultsTable = null;
        for (const tableId of tableIds) {
            resultsTable = $(`table#${tableId}`);
            if (resultsTable.length > 0) break;
        }

        if (!resultsTable || resultsTable.length === 0) {
            console.warn('No results table found');
            return [];
        }

        return resultsTable.find('tr').slice(1).toArray();
    }

    private extractNumericValue(valueStr: string): number | null {
        const match = valueStr.match(/^([\d.]+)/);
        return match ? parseFloat(match[1]) : null;
    }

    parseTeamNames(data: string): void {
        console.log('Parsing team names...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const teamName = $(cells[1]).text().trim();

                if (!isNaN(carNumber)) {
                    this.getCarData(carNumber).team_name = teamName;
                }
            } catch (error) {
                console.error('Error parsing team name:', error);
            }
        });
    }

    parseAccelData(data: string): void {
        console.log('Parsing acceleration data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const time = parseFloat($(cells[4]).text().trim());
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber) && !isNaN(time)) {
                    this.getCarData(carNumber).addAccelerationResult(time, status);
                }
            } catch (error) {
                console.error('Error parsing acceleration:', error);
            }
        });
    }

    parseTractionData(data: string): void {
        console.log('Parsing traction data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const time = parseFloat($(cells[4]).text().trim());
                const distance = this.extractNumericValue($(cells[5]).text().trim()) || 0;
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber)) {
                    this.getCarData(carNumber).addTractionResult(time, distance, status);
                }
            } catch (error) {
                console.error('Error parsing traction:', error);
            }
        });
    }

    parseManeuverabilityData(data: string): void {
        console.log('Parsing maneuverability data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const time = parseFloat($(cells[4]).text().trim());
                const conesHit = parseInt($(cells[6]).text().trim()) || 0;
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber)) {
                    this.getCarData(carNumber).addManeuverabilityResult(time, conesHit, status);
                }
            } catch (error) {
                console.error('Error parsing maneuverability:', error);
            }
        });
    }

    parseSuspensionData(data: string): void {
        console.log('Parsing suspension data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const time = parseFloat($(cells[4]).text().trim());
                const gatesHit = this.extractNumericValue($(cells[5]).text().trim()) || 0;
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber)) {
                    this.getCarData(carNumber).addSuspensionResult(time, gatesHit, status);
                }
            } catch (error) {
                console.error('Error parsing suspension:', error);
            }
        });
    }

    parseDesignData(data: string): void {
        console.log('Parsing design data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const points = parseFloat($(cells[7]).text().trim());
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber) && !isNaN(points)) {
                    this.getCarData(carNumber).design_result = { score: points, status };
                }
            } catch (error) {
                console.error('Error parsing design:', error);
            }
        });
    }

    parseCostData(data: string): void {
        console.log('Parsing cost data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const points = parseFloat($(cells[7]).text().trim());
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber) && !isNaN(points)) {
                    this.getCarData(carNumber).cost_result = { score: points, status };
                }
            } catch (error) {
                console.error('Error parsing cost:', error);
            }
        });
    }

    parseBusinessData(data: string): void {
        console.log('Parsing business data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[0]).text().trim());
                const points = parseFloat($(cells[5]).text().trim());
                const status = $(cells[3]).text().trim();

                if (!isNaN(carNumber) && !isNaN(points)) {
                    this.getCarData(carNumber).business_result = { score: points, status };
                }
            } catch (error) {
                console.error('Error parsing business:', error);
            }
        });
    }

    parseEnduranceData(data: string): void {
        console.log('Parsing endurance data...');
        const rows = this.parseData(data);

        rows.forEach(row => {
            try {
                const $ = load(row);
                const cells = $('td');

                const carNumber = parseInt($(cells[1]).text().trim());
                const laps = parseFloat($(cells[4]).text().trim());

                if (!isNaN(carNumber) && !isNaN(laps)) {
                    this.getCarData(carNumber).endurance_laps = laps;
                }
            } catch (error) {
                console.error('Error parsing endurance:', error);
            }
        });
    }

    parseAllData(eventData: EventData): void {
        if (eventData.acceleration) {
            this.parseTeamNames(eventData.acceleration);
            this.parseAccelData(eventData.acceleration);
        }
        if (eventData.traction) this.parseTractionData(eventData.traction);
        if (eventData.maneuverability) this.parseManeuverabilityData(eventData.maneuverability);
        if (eventData.suspension) this.parseSuspensionData(eventData.suspension);
        if (eventData.design) this.parseDesignData(eventData.design);
        if (eventData.cost) this.parseCostData(eventData.cost);
        if (eventData.business) this.parseBusinessData(eventData.business);
        if (eventData.endurance) this.parseEnduranceData(eventData.endurance);
    }

    getCarDatas(): Map<number, CarData> {
        return this.carDatas;
    }
}