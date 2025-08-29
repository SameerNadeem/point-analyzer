import axios from 'axios';
import { Rankings, CarData, ApiResponse, EventCategory } from '../types';


const api = axios.create({
    baseURL: '/api', // will forward to backend
    timeout: 30000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);


export const fetchRankings = async (category?: EventCategory): Promise<Rankings> => {
    try {
        const url = category ? `/rankings?category=${category}` : '/rankings';
        const response = await api.get<ApiResponse<Rankings>>(url);

        if (response.data.success && response.data.data) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch rankings');
        }
    } catch (error) {
        console.error('Error fetching rankings:', error);
        throw error;
    }
};


export const fetchCarDetail = async (carNumber: number): Promise<CarData> => {
    try {
        const response = await api.get<ApiResponse<CarData>>(`/car/${carNumber}`);

        if (response.data.success && response.data.data) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch car data');
        }
    } catch (error) {
        console.error('Error fetching car detail:', error);
        throw error;
    }
};


export const refreshData = async (): Promise<void> => {
    try {
        const response = await api.post<ApiResponse<any>>('/refresh');

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to refresh data');
        }
    } catch (error) {
        console.error('Error refreshing data:', error);
        throw error;
    }
};


export const getExportUrls = () => ({
    json: '/api/export/json',
    csv: '/api/export/csv'
});


export const checkHealth = async (): Promise<boolean> => {
    try {
        const response = await axios.get('/health');
        return response.data.status === 'OK';
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
};