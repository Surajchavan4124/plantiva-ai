import React, { createContext, useContext, useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const api = useApi();
  const [plants, setPlants] = useState([]);
  const [careLogs, setCareLogs] = useState([]);
  const [isHealthy, setIsHealthy] = useState(false);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.checkHealth();
        setIsHealthy(true);
      } catch (error) {
        console.error('API Health Check Failed:', error);
        setIsHealthy(false);
      }
    };

    checkHealth();
  }, []);

  // Load plants on component mount
  useEffect(() => {
    if (isHealthy) {
      loadPlants();
    }
  }, [isHealthy]);

  const loadPlants = async () => {
    try {
      const data = await api.getPlants();
      setPlants(data || []);
    } catch (error) {
      console.error('Failed to load plants:', error);
    }
  };

  const addPlant = async (plantData) => {
    try {
      const newPlant = await api.createPlant(plantData);
      setPlants(prev => [...prev, newPlant]);
      return newPlant;
    } catch (error) {
      console.error('Failed to add plant:', error);
      throw error;
    }
  };

  const addCareLog = async (careData) => {
    try {
      const newCareLog = await api.saveCareAdvice(careData);
      setCareLogs(prev => [...prev, newCareLog]);
      return newCareLog;
    } catch (error) {
      console.error('Failed to add care log:', error);
      throw error;
    }
  };

  return (
    <PlantContext.Provider
      value={{
        isHealthy,
        plants,
        careLogs,
        loadPlants,
        addPlant,
        addCareLog,
        loading: api.loading,
        error: api.error,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
};

export default PlantContext;
