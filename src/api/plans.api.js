import api from "./axios";

const PlantPlansAPI = {
  // Create a new plant plan
  async createPlant(plantData) {
    try {
      const response = await api.post("/api/plants", plantData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating plant plan:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create plant plan' 
      };
    }
  },

  // Get all planned plants
  async getAllPlants() {
    try {
      const response = await api.get("/api/plants");
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching plants:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch plants' 
      };
    }
  },

  // Get a single plant by ID
  async getPlantById(plantId) {
    try {
      const response = await api.get(`/api/plants/${plantId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching plant:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch plant details' 
      };
    }
  },

  // Update a plant plan
  async updatePlant(plantId, updateData) {
    try {
      const response = await api.put(`/api/plants/${plantId}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating plant:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update plant' 
      };
    }
  },

  // Delete a plant plan
  async deletePlant(plantId) {
    try {
      await api.delete(`/api/plants/${plantId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting plant:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete plant' 
      };
    }
  }
};

export default PlantPlansAPI;
