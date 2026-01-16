import { useState, useCallback } from 'react';
import * as api from '../api/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Health check
  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.checkHealth();
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to check health');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new plant
  const createPlant = useCallback(async (plantData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.createPlant(plantData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to create plant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all plants
  const getPlants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllPlants();
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch plants');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save care advice
  const saveCareAdvice = useCallback(async (careData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.saveCareAdvice(careData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to save care advice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    checkHealth,
    createPlant,
    getPlants,
    saveCareAdvice,
  };
};

export default useApi;
