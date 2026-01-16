import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlantCareAPI from '../api/care.api';

const PlanPlantation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    place: '',
    sunlight: '',
    water: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const places = [
    { id: 'balcony', name: 'Balcony' },
    { id: 'garden', name: 'Garden' },
    { id: 'indoor', name: 'Indoor' },
    { id: 'roadside', name: 'Roadside' }
  ];

  const levels = [
    { id: 'low', name: 'Low' },
    { id: 'medium', name: 'Medium' },
    { id: 'high', name: 'High' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await PlantCareAPI.getPlantRecommendations({
        city: formData.city,
        place: formData.place,
        sunlight: formData.sunlight,
        water: formData.water
      });
      
      if (response.success) {
        // Transform the API response to match the expected format
        const formattedResponse = {
          recommended: Array.isArray(response.data) 
            ? response.data.map(plant => ({
                name: plant.name || 'Unnamed Plant',
                scientificName: plant.scientificName || 'N/A',
                survivalChance: 'High', // Default value
                careLevel: plant.careLevel || 'Medium',
                description: plant.description || 'No description available.'
              }))
            : [],
          avoid: [] // Empty array as we don't have this data
        };
        setRecommendations(formattedResponse);
      } else {
        setError(response.error || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">
            Plan a Plantation
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to find the perfect plants for your space
          </p>
        </div>

        {!recommendations ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            {/* City Input */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your city"
                required
              />
            </div>

            {/* Place Selection */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">
                Place
              </label>
              <div className="grid grid-cols-2 gap-3">
                {places.map((place) => (
                  <div key={place.id} className="relative">
                    <input
                      id={`place-${place.id}`}
                      name="place"
                      type="radio"
                      value={place.id}
                      checked={formData.place === place.id}
                      onChange={handleChange}
                      className="peer hidden"
                      required
                    />
                    <label 
                      htmlFor={`place-${place.id}`} 
                      className={`block p-4 border-2 rounded-lg cursor-pointer text-center transition-colors
                        ${formData.place === place.id 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-emerald-300'}`}
                    >
                      {place.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sunlight Level */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">
                Sunlight
              </label>
              <div className="grid grid-cols-3 gap-3">
                {levels.map((level) => (
                  <div key={`sun-${level.id}`} className="relative">
                    <input
                      id={`sun-${level.id}`}
                      name="sunlight"
                      type="radio"
                      value={level.id}
                      checked={formData.sunlight === level.id}
                      onChange={handleChange}
                      className="peer hidden"
                      required
                    />
                    <label 
                      htmlFor={`sun-${level.id}`} 
                      className={`block p-3 border-2 rounded-lg cursor-pointer text-center transition-colors
                        ${formData.sunlight === level.id 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-emerald-300'}`}
                    >
                      {level.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Availability */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">
                Water
              </label>
              <div className="grid grid-cols-3 gap-3">
                {levels.map((level) => (
                  <div key={`water-${level.id}`} className="relative">
                    <input
                      id={`water-${level.id}`}
                      name="water"
                      type="radio"
                      value={level.id}
                      checked={formData.water === level.id}
                      onChange={handleChange}
                      className="peer hidden"
                      required
                    />
                    <label 
                      htmlFor={`water-${level.id}`} 
                      className={`block p-3 border-2 rounded-lg cursor-pointer text-center transition-colors
                        ${formData.water === level.id 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-emerald-300'}`}
                    >
                      {level.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-full font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center text-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting AI Recommendation
                  </>
                ) : (
                  'Get AI Recommendation'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">
              🌿 Perfect Plants for You
            </h2>
            
            <p className="text-gray-600 mb-6">
              Based on your location and environment, here are our top recommendations:
            </p>

            {/* Recommended Plants */}
            <div className="space-y-6 mb-8">
              <h3 className="font-semibold text-lg text-gray-800">
                {recommendations?.recommended?.length > 0 
                  ? 'Recommended Plants' 
                  : 'No Specific Recommendations Found'}
              </h3>
              
              {recommendations?.recommended?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendations.recommended.map((plant, index) => (
                    <div key={index} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="h-16 w-16 rounded-lg bg-emerald-100 flex items-center justify-center text-2xl mr-4">
                          {index === 0 ? '🌿' : index === 1 ? '🌱' : '🌵'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{plant.name}</h4>
                          {plant.scientificName && (
                            <p className="text-sm text-gray-600 italic">{plant.scientificName}</p>
                          )}
                          {(plant.survivalChance || plant.careLevel) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {plant.survivalChance && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  plant.survivalChance.toLowerCase() === 'high' ? 'bg-green-100 text-green-800' :
                                  plant.survivalChance.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {plant.survivalChance} Survival
                                </span>
                              )}
                              {plant.careLevel && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {plant.careLevel} Care
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {plant.description && (
                        <p className="mt-3 text-sm text-gray-600">{plant.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        We couldn't find specific plant recommendations for your criteria. Try adjusting your filters or check back later for more options.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Plants to Avoid */}
            {recommendations.avoid && recommendations.avoid.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Plants to Avoid</h3>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    Based on your environment, you might want to avoid these plants as they may not thrive:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                    {recommendations.avoid.map((plant, index) => (
                      <li key={index}>{plant}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button
                onClick={() => setRecommendations(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={() => navigate('/care')}
                className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Get Care Tips for These Plants
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlanPlantation;
