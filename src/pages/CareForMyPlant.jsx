import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlantCareAPI from '../api/care.api';
import PlantPlansAPI from '../api/plans.api';

const CareForMyPlant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plantName: '',
    daysSincePlanted: '',
    location: 'indoor',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [careAdvice, setCareAdvice] = useState(null);
  const [error, setError] = useState('');
  const [showAITip, setShowAITip] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const locations = [
    { id: 'indoor', name: 'Indoor' },
    { id: 'outdoor', name: 'Outdoor' },
    { id: 'balcony', name: 'Balcony' },
    { id: 'garden', name: 'Garden' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToGarden = async () => {
    if (!formData.plantName) {
      setError('Please enter a plant name');
      return;
    }

    setIsSaving(true);
    
    // Create plant data object
    const plantData = {
      name: formData.plantName,
      type: formData.plantName,
      lastWatered: new Date().toISOString(),
      image: imagePreview || getDefaultEmoji(formData.plantName),
      addedDate: new Date().toISOString(),
      notes: formData.notes,
      location: formData.location,
      careInstructions: careAdvice?.careTips?.join('\n') || '',
      healthStatus: 'Healthy',
      wateringFrequency: '3 days',
      sunlight: 'Medium'
    };
    
    try {
      // First try to save to backend
      const response = await PlantPlansAPI.createPlant(plantData);
      
      if (response.success) {
        // If backend save is successful, update local storage with backend ID
        plantData.id = response.data?._id || Date.now();
        const garden = JSON.parse(localStorage.getItem('myGarden') || '[]');
        garden.push(plantData);
        localStorage.setItem('myGarden', JSON.stringify(garden));
        
        alert(`${formData.plantName} has been added to your garden!`);
        // navigate('/my-garden');
      } else {
        // If backend fails, save to localStorage and show warning
        throw new Error('backend-failed');
      }
    } catch (err) {
      console.warn('Backend save failed, falling back to localStorage:', err);
      
      try {
        // Save to localStorage as fallback
        const garden = JSON.parse(localStorage.getItem('myGarden') || '[]');
        garden.push({
          ...plantData,
          id: Date.now(),
          isLocal: true // Mark as locally saved for future sync
        });
        localStorage.setItem('myGarden', JSON.stringify(garden));
        
        // Show success message with offline warning
        alert(`${formData.plantName} has been saved locally. Some features may be limited until you're back online.`);
        // navigate('/my-garden');
      } catch (storageErr) {
        console.error('Error saving to localStorage:', storageErr);
        setError('Failed to save plant. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getDefaultEmoji = (plantName) => {
    const name = (plantName || '').toLowerCase();
    if (name.includes('cactus')) return '🌵';
    if (name.includes('monstera')) return '🌿';
    if (name.includes('pothos')) return '🍃';
    if (name.includes('snake')) return '🌱';
    if (name.includes('flower')) return '🌸';
    return '🌱';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // First get basic care info
      const basicResponse = await PlantCareAPI.getPlantCare({
        plantName: formData.plantName,
        daysSincePlanted: formData.daysSincePlanted,
        location: formData.location
      });
      
      if (basicResponse.success) {
        // Then get AI-powered advice
        const aiResponse = await PlantCareAPI.getAIPlantCareAdvice({
          plantName: formData.plantName,
          daysSincePlanted: formData.daysSincePlanted,
          location: formData.location,
          userNotes: formData.notes
        });
        
        if (aiResponse.success) {
          setCareAdvice({
            ...basicResponse.data,
            aiAdvice: aiResponse.data
          });
        } else {
          // Fallback to basic care if AI fails
          setCareAdvice({
            ...basicResponse.data,
            aiAdvice: null
          });
        }
      } else {
        setError(basicResponse.error || 'Failed to get care advice');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get risk level color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">
            Care for My Plant
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized care advice to keep your plants thriving
          </p>
        </div>

        {!careAdvice ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            {/* Plant Name */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="plantName">
                Plant Name
              </label>
              <input
                type="text"
                id="plantName"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., Snake Plant, Monstera, Peace Lily"
                required
              />
            </div>

            {/* Days Since Planted */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="daysSincePlanted">
                How many days ago was it planted/repotted?
              </label>
              <input
                type="number"
                id="daysSincePlanted"
                name="daysSincePlanted"
                min="0"
                value={formData.daysSincePlanted}
                onChange={handleChange}
                className="w-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">
                Where is your plant located?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {locations.map((loc) => (
                  <div key={loc.id} className="flex items-center">
                    <input
                      id={`loc-${loc.id}`}
                      name="location"
                      type="radio"
                      value={loc.id}
                      checked={formData.location === loc.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor={`loc-${loc.id}`} className="ml-2 text-gray-700">
                      {loc.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-medium" htmlFor="notes">
                  Any specific concerns or notes? (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowAITip(!showAITip)}
                  className="text-xs text-emerald-600 hover:text-emerald-800"
                >
                  {showAITip ? 'Hide AI Tip' : 'AI Tip'}
                </button>
              </div>
              
              {showAITip && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-3 rounded">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">AI Tip:</span> Include details like "leaves turning yellow" or "not growing" for more specific advice.
                  </p>
                </div>
              )}
              
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="E.g., Leaves are turning yellow, soil stays wet for long, etc."
              />
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting Care Advice...
                  </>
                ) : (
                  'Get Care Advice'
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
            {/* Plant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-emerald-800">
                  {careAdvice.plantName || 'Your Plant'}
                </h2>
                <p className="text-gray-600">
                  {formData.daysSincePlanted ? `Planted ${formData.daysSincePlanted} days ago` : 'Care Advice'}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(careAdvice.riskLevel)}`}>
                  {careAdvice.riskLevel || 'Low'} Risk
                </span>
              </div>
            </div>

            {/* Care Tips */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {careAdvice.riskLevel === 'High' ? '⚠️ Immediate Attention Needed' : '💡 Care Tips for Today'}
              </h3>
              
              <div className="space-y-4">
                {careAdvice.careTips?.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <span className="flex-shrink-0 mt-1 mr-3 text-emerald-500">•</span>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
                
                {careAdvice.aiAdvice?.careAdvice && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">AI-Powered Advice:</h4>
                    <p className="text-blue-700 whitespace-pre-line">{careAdvice.aiAdvice.careAdvice}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Impact */}
            {careAdvice.environmentalImpact && (
              <div className="mb-10 p-5 bg-green-50 rounded-xl">
                <h3 className="flex items-center text-lg font-semibold text-green-800 mb-3">
                  <span className="mr-2">🌱</span> Environmental Impact
                </h3>
                <p className="text-green-700">{careAdvice.environmentalImpact}</p>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-10 p-5 bg-amber-50 rounded-xl">
              <h3 className="flex items-center text-lg font-semibold text-amber-800 mb-3">
                <span className="mr-2">📅</span> Next Steps
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-3 text-amber-600">•</span>
                  <div>
                    <p className="font-medium text-gray-800">Check back in 3 days</p>
                    <p className="text-sm text-gray-600">Monitor your plant's response to these care instructions</p>
                  </div>
                </li>
                {careAdvice.riskLevel === 'High' && (
                  <li className="flex items-start">
                    <span className="flex-shrink-0 mt-1 mr-3 text-amber-600">•</span>
                    <div>
                      <p className="font-medium text-gray-800">Monitor closely</p>
                      <p className="text-sm text-gray-600">Your plant needs extra attention right now</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-6 border-t">
              <button
                onClick={() => setCareAdvice(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Check Another Plant
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white border border-emerald-600 text-emerald-600 py-3 px-6 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Care Guide
              </button>
            </div>

            {/* Save to Garden Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={saveToGarden}
                disabled={isSaving || !formData.plantName}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSaving || !formData.plantName 
                    ? 'bg-emerald-300 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save to My Garden
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CareForMyPlant;
