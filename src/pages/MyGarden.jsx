import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import PlantPlansAPI from '../api/plans.api';

const MyGarden = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    needsCare: 0,
    thriving: 0
  });

  // Load plants from both backend and localStorage
  useEffect(() => {
    const loadPlants = async () => {
      setIsLoading(true);
      setError('');
      
      // Load from localStorage first (for immediate display)
      let localPlants = [];
      try {
        localPlants = JSON.parse(localStorage.getItem('myGarden') || '[]');
      } catch (err) {
        console.warn('Error loading from localStorage:', err);
      }
      
      // Show local data immediately
      if (localPlants.length > 0) {
        setPlants(localPlants);
        updateStats(localPlants);
      }
      
      try {
        // Then try to get plants from the backend
        const response = await PlantPlansAPI.getAllPlants();
        
        if (response.success) {
          const plantsFromBackend = Array.isArray(response.data) ? response.data : [];
          
          // Merge local and backend data
          const mergedPlants = mergePlants(localPlants, plantsFromBackend);
          
          // Update state with merged data
          setPlants(mergedPlants);
          updateStats(mergedPlants);
          
          // Update localStorage with merged data
          try {
            localStorage.setItem('myGarden', JSON.stringify(mergedPlants));
          } catch (storageErr) {
            console.warn('Failed to update localStorage:', storageErr);
          }
          
          // If we had local-only plants, try to sync them
          const localOnlyPlants = localPlants.filter(p => p.isLocal);
          if (localOnlyPlants.length > 0) {
            syncLocalPlants(localOnlyPlants);
          }
        } else {
          console.warn('Backend returned error, using local data');
          setError('Using local data. Some features may be limited.');
        }
      } catch (err) {
        console.error('Error loading from backend:', err);
        setError('Using local data. Some features may be limited.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Function to merge local and backend plants
    const mergePlants = (local, backend) => {
      const backendMap = new Map(backend.map(plant => [plant._id || plant.id, plant]));
      const merged = [...backend];
      
      // Add local plants that don't exist in backend
      local.forEach(localPlant => {
        if (!backendMap.has(localPlant.id) && localPlant.isLocal) {
          merged.push(localPlant);
        }
      });
      
      return merged;
    };
    
    // Function to sync local-only plants to backend
    const syncLocalPlants = async (localOnlyPlants) => {
      for (const plant of localOnlyPlants) {
        try {
          const { isLocal, ...plantData } = plant;
          const response = await PlantPlansAPI.createPlant(plantData);
          
          if (response.success && response.data?._id) {
            // Update local storage with the new ID
            const updatedPlants = JSON.parse(localStorage.getItem('myGarden') || '[]');
            const index = updatedPlants.findIndex(p => p.id === plant.id);
            if (index !== -1) {
              updatedPlants[index] = { ...plant, id: response.data._id, isLocal: false };
              localStorage.setItem('myGarden', JSON.stringify(updatedPlants));
              
              // Update the UI if we're still on the same page
              setPlants(prev => prev.map(p => 
                p.id === plant.id 
                  ? { ...p, id: response.data._id, isLocal: false } 
                  : p
              ));
            }
          }
        } catch (syncErr) {
          console.error('Error syncing local plant:', syncErr);
        }
      }
    };

    loadPlants();
  }, []);

  // Calculate statistics
  const updateStats = (plantsList) => {
    const now = new Date();
    const needsWater = plantsList.filter(plant => {
      if (!plant.lastWatered) return true;
      const lastWatered = new Date(plant.lastWatered);
      const daysSinceWatered = (now - lastWatered) / (1000 * 60 * 60 * 24);
      return daysSinceWatered > 3; // Consider a plant needs care if not watered in 3 days
    }).length;

    setStats({
      total: plantsList.length,
      needsCare: needsWater,
      thriving: Math.max(0, plantsList.length - needsWater)
    });
  };

  // Handle watering a plant
  const handleWaterPlant = async (plantId) => {
    const originalPlants = [...plants];
    
    // Optimistic UI update
    const updatedPlants = plants.map(plant => 
      plant._id === plantId || plant.id === plantId
        ? { 
            ...plant, 
            lastWatered: new Date().toISOString(),
            healthStatus: 'Healthy'
          }
        : plant
    );
    
    setPlants(updatedPlants);
    updateStats(updatedPlants);
    
    try {
      // Update on the backend
      await PlantPlansAPI.updatePlant(plantId, {
        lastWatered: new Date().toISOString(),
        healthStatus: 'Healthy'
      });
      
      // Update local storage
      try {
        localStorage.setItem('myGarden', JSON.stringify(updatedPlants));
      } catch (storageErr) {
        console.warn('Failed to update localStorage:', storageErr);
      }
      
      // Show success message
      const plant = updatedPlants.find(p => p._id === plantId || p.id === plantId);
      if (plant) {
        alert(`Successfully watered your ${plant.name || 'plant'}!`);
      }
    } catch (err) {
      // Revert on error
      console.error('Error updating plant:', err);
      setPlants(originalPlants);
      updateStats(originalPlants);
      setError('Failed to update plant. Please try again.');
    }
    try {
      const updatedPlants = plants.map(plant => 
        plant.id === plantId 
          ? { 
              ...plant, 
              lastWatered: new Date().toISOString(),
              // Reset any 'needs water' status
              healthStatus: 'Watered just now'
            }
          : plant
      );
      
      // Update state
      setPlants(updatedPlants);
      updateStats(updatedPlants);
      
      // Save to localStorage
      localStorage.setItem('myGarden', JSON.stringify(updatedPlants));
      
      // Optional: Show a success message
      const plant = plants.find(p => p.id === plantId);
      if (plant) {
        alert(`Successfully watered your ${plant.name || 'plant'}!`);
      }
    } catch (err) {
      console.error('Error updating plant:', err);
      setError('Failed to update plant. Please try again.');
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Get next watering time
  const getNextWatering = (plant) => {
    if (!plant.lastWatered) return 'ASAP';
    
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(nextWatering.getDate() + 3); // Suggest watering every 3 days
    
    if (nextWatering < new Date()) return 'Overdue';
    return `in ${formatDistanceToNow(nextWatering, { addSuffix: true })}`;
  };

  // Get health status
  const getHealthStatus = (plant) => {
    if (!plant.lastWatered) return 'Needs Care';
    
    const lastWatered = new Date(plant.lastWatered);
    const daysSinceWatered = (new Date() - lastWatered) / (1000 * 60 * 60 * 24);
    
    if (daysSinceWatered > 7) return 'Needs Care';
    if (daysSinceWatered > 3) return 'Check Soon';
    return 'Healthy';
  };

  // Get plant emoji based on type or name
  const getPlantEmoji = (plant) => {
    // Check if plant has a custom image (data URL)
    if (plant.image && plant.image.startsWith('data:image')) {
      return (
        <img 
          src={plant.image} 
          alt={plant.name || 'Plant'} 
          className="w-12 h-12 object-cover rounded-full"
        />
      );
    }
    
    // Fallback to emoji based on plant type or name
    const type = (plant.type || plant.name || '').toLowerCase();
    if (type.includes('cactus')) return '🌵';
    if (type.includes('monstera')) return '🌿';
    if (type.includes('pothos')) return '🍃';
    if (type.includes('snake')) return '🌱';
    if (type.includes('flower')) return '🌸';
    return '🌱';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </main>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">My Garden</h1>
          <p className="text-gray-600">Manage and care for your plant collection</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-emerald-600">{stats.total}</div>
            <div className="text-gray-500">Total Plants</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-amber-600">{stats.needsCare}</div>
            <div className="text-gray-500">Needs Care</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">{stats.thriving}</div>
            <div className="text-gray-500">Thriving</div>
          </div>
        </div>

        {/* Add New Plant */}
        <Link 
          to="/add-plant" 
          className="block mb-10 p-6 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 text-center hover:border-emerald-400 transition-colors cursor-pointer hover:shadow-md"
        >
          <div className="text-4xl mb-3">+</div>
          <h3 className="font-medium text-gray-800">Add New Plant</h3>
          <p className="text-sm text-gray-500">Start tracking a new plant in your collection</p>
        </Link>

        {/* Plant List */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Plants</h2>
            <div className="text-sm text-gray-500">
              {plants.length === 0 ? 'No plants yet' : `Showing ${plants.length} plant${plants.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          {plants.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No plants in your garden yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first plant to your collection.</p>
              <div className="mt-6">
                <Link
                  to="/add-plant"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Your First Plant
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => {
                const healthStatus = getHealthStatus(plant);
                const nextWatering = getNextWatering(plant.lastWatered);
                const needsWater = nextWatering === 'Today' || nextWatering === 'Tomorrow';
                
                return (
                  <div key={plant._id || plant.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{plant.name || 'Unnamed Plant'}</h3>
                          {plant.type && (
                            <p className="text-sm text-gray-500 truncate">{plant.type}</p>
                          )}
                        </div>
                        <div className="ml-4 text-4xl">
                          {getPlantEmoji(plant)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Last watered:</span>
                          <span className="font-medium">
                            {plant.lastWatered ? formatDate(plant.lastWatered) : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next watering:</span>
                          <span className={`font-medium ${
                            needsWater ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {nextWatering}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Health:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                            healthStatus === 'Great' ? 'bg-green-100 text-green-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {healthStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t border-gray-100">
                      <button 
                        onClick={() => handleWaterPlant(plant._id || plant.id)}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Water
                      </button>
                      <button 
                        onClick={() => navigate(`/plants/${plant._id || plant.id}`)}
                        className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Care Tips - Only show if there are plants */}
        {plants.length > 0 && (
          <div className="bg-emerald-50 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">Care Tips</h2>
            <div className="space-y-4">
              {plants.some(p => {
                const nextWatering = getNextWatering(p.lastWatered);
                return nextWatering === 'Today' || nextWatering === 'Tomorrow';
              }) && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mr-3 mt-0.5">💧</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Watering Reminder</h4>
                    <p className="text-sm text-gray-600">
                      Some of your plants need watering {getNextWatering(plants.find(p => getNextWatering(p.lastWatered) === 'Today')?.lastWatered) === 'Today' ? 'today' : 'soon'}. 
                      Check each plant's specific needs before watering.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mr-3 mt-0.5">🌱</div>
                <div>
                  <h4 className="font-medium text-gray-900">Plant Care Tip</h4>
                  <p className="text-sm text-gray-600">
                    Rotate your plants every few weeks to ensure even growth. Most plants grow toward the light source, so rotating them helps maintain a balanced shape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyGarden;
