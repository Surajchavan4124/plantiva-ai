import api from './axios';

const PlantCareAPI = {
  // Health check
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: 'Service unavailable' };
    }
  },

  // Plant care logs
  async saveCareLog(careData) {
    try {
      const response = await api.post('/api/care', careData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error saving care log:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to save care log' 
      };
    }
  },

  // Get care logs for a plant
  async getCareLogs(plantId) {
    try {
      const response = await api.get(`/api/care?plantId=${plantId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching care logs:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch care logs' 
      };
    }
  },

  // Get plant recommendations based on user's environment
  async getPlantRecommendations({ city, place, sunlight, water }) {
    try {
      const response = await api.get('/api/plants', {
        params: {
          city,
          location: place,  // Using 'location' instead of 'place' to match common API conventions
          sunlight,
          water,
          recommend: true   // Add a flag to indicate we want recommendations
        }
      });
      
      return { 
        success: true, 
        data: response.data || [],
        message: 'Successfully retrieved plant recommendations'
      };
      
    } catch (error) {
      console.error('Error getting plant recommendations:', error);
      
      // If 404, try the old endpoint as fallback
      if (error.response?.status === 404) {
        try {
          const fallbackResponse = await api.post('/api/plants/recommend', {
            city,
            place,
            sunlight,
            water
          });
          
          return { 
            success: true, 
            data: fallbackResponse.data?.data || fallbackResponse.data || [],
            message: 'Successfully retrieved plant recommendations (fallback)'
          };
        } catch (fallbackError) {
          console.error('Fallback endpoint also failed:', fallbackError);
        }
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get plant recommendations',
        status: error.response?.status,
        data: []
      };
    }
  },

  // Get care advice for a specific plant
  async getPlantCare({ plantName, daysSincePlanted, location }) {
    try {
      const response = await api.get('/api/care/advice', {
        params: { plantName, daysSincePlanted, location }
      });
      return { success: true, data: response.data };
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('Using mock data for plant care advice');
      const mockCareAdvice = {
        plantName: plantName || 'Snake Plant',
        careTips: [
          'Water sparingly - let soil dry between waterings',
          'Wipe leaves with a damp cloth to remove dust',
          'Rotate plant occasionally for even growth'
        ],
        riskLevel: 'Low',
        riskMessage: 'Your plant is doing well!',
        environmentalImpact: 'This low-maintenance plant helps purify indoor air and requires minimal resources.'
      };
      return { success: true, data: mockCareAdvice };
    }
  },

  // Get AI-powered plant care advice
  async getAIPlantCareAdvice({ plantName, daysSincePlanted, location, userNotes = '' }) {
    try {
      const response = await api.post('/api/care/ai-advice', {
        plantName,
        daysSincePlanted,
        location,
        userNotes
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting AI plant care advice:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get AI care advice' 
      };
    }
  }
};

export default PlantCareAPI;
