import { TimeSeriesData } from '../types';

const STORAGE_KEY = 'crypto_tracker_data';

export function saveTimeSeriesData(period: string, data: any[]) {
  try {
    const allData = getAllData();
    allData[period] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  } catch (error) {
    console.error('Error saving time series data:', error);
  }
}

export function getTimeSeriesData(period: string) {
  try {
    const allData = getAllData();
    return allData[period] || [];
  } catch (error) {
    console.error('Error getting time series data:', error);
    return [];
  }
}

function getAllData(): TimeSeriesData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}