import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import PlantPlansAPI from '../api/plans.api';
import Navbar from '../components/Navbar';

// Register all ChartJS components
ChartJS.register(...registerables);

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastWatered, setLastWatered] = useState('');
  const [nextWatering, setNextWatering] = useState('');

  useEffect(() => {
    const loadPlant = async () => {
      console.log('Loading plant with ID:', id); // Debug log
      setIsLoading(true);
      setError('');
      
      try {
        // First try to get from localStorage (faster and works offline)
        const localPlants = JSON.parse(localStorage.getItem('myGarden') || '[]');
        console.log('Local plants:', localPlants); // Debug log
        
        // Try to find by _id (from backend) or id (from localStorage)
        const localPlant = localPlants.find(p => {
          const match = (p._id === id || p.id === id || (p._id && p._id.toString() === id) || (p.id && p.id.toString() === id));
          if (match) console.log('Found matching plant:', p); // Debug log
          return match;
        });
        
        if (localPlant) {
          // If found in localStorage, use it immediately
          console.log('Using local plant data:', localPlant); // Debug log
          setPlant(localPlant);
          updateWateringInfo(localPlant);
          setIsLoading(false);
          
          // Then try to sync with backend in the background
          try {
            console.log('Attempting to sync with backend...'); // Debug log
            const response = await PlantPlansAPI.getPlantById(localPlant._id || localPlant.id);
            if (response.success && response.data) {
              console.log('Received updated data from backend:', response.data); // Debug log
              // Update with latest data from backend
              setPlant(response.data);
              updateWateringInfo(response.data);
              
              // Update localStorage with the latest data
              const updatedPlants = localPlants.map(p => 
                (p._id === id || p.id === id || p._id === response.data._id || p.id === response.data.id) 
                  ? response.data 
                  : p
              );
              localStorage.setItem('myGarden', JSON.stringify(updatedPlants));
            }
          } catch (err) {
            console.warn('Failed to sync with backend, using local data:', err);
            // Continue with local data if sync fails
          }
        } else {
          // If not found in localStorage, try backend
          console.log('Plant not found in localStorage, trying backend...'); // Debug log
          try {
            const response = await PlantPlansAPI.getPlantById(id);
            if (response.success && response.data) {
              console.log('Found plant in backend:', response.data); // Debug log
              setPlant(response.data);
              updateWateringInfo(response.data);
              
              // Add to localStorage for offline access
              const updatedPlants = [...localPlants, response.data];
              localStorage.setItem('myGarden', JSON.stringify(updatedPlants));
            } else {
              console.error('Plant not found in backend');
              setError('Plant not found');
            }
          } catch (err) {
            console.error('Error loading from backend:', err);
            setError('Plant not found in your garden');
          }
        }
      } catch (err) {
        console.error('Error loading plant:', err);
        setError('Failed to load plant details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlant();
  }, [id]);

  const updateWateringInfo = (plantData) => {
    if (plantData.lastWatered) {
      setLastWatered(formatDistanceToNow(new Date(plantData.lastWatered), { addSuffix: true }));
      
      // Calculate next watering (3 days after last watered)
      const lastWateredDate = new Date(plantData.lastWatered);
      const nextWateringDate = new Date(lastWateredDate);
      nextWateringDate.setDate(nextWateringDate.getDate() + 3);
      
      setNextWatering(formatDistanceToNow(nextWateringDate, { addSuffix: true }));
    } else {
      setLastWatered('Never');
      setNextWatering('ASAP');
    }
  };

  const handleWaterPlant = async () => {
    if (!plant) return;
    
    const updatedPlant = {
      ...plant,
      lastWatered: new Date().toISOString(),
      healthStatus: 'Healthy'
    };
    
    try {
      // Update in backend
      await PlantPlansAPI.updatePlant(id, {
        lastWatered: updatedPlant.lastWatered,
        healthStatus: updatedPlant.healthStatus
      });
      
      // Update in localStorage
      const localPlants = JSON.parse(localStorage.getItem('myGarden') || '[]');
      const updatedPlants = localPlants.map(p => 
        p.id === id ? { ...p, ...updatedPlant } : p
      );
      localStorage.setItem('myGarden', JSON.stringify(updatedPlants));
      
      // Update UI
      setPlant(updatedPlant);
      updateWateringInfo(updatedPlant);
      
      alert(`Successfully watered your ${plant.name || 'plant'}!`);
    } catch (err) {
      console.error('Error watering plant:', err);
      setError('Failed to update plant. Please try again.');
    }
  };

  const getHealthStatus = () => {
    if (!plant?.lastWatered) return 'Needs Care';
    
    const lastWatered = new Date(plant.lastWatered);
    const daysSinceWatered = (new Date() - lastWatered) / (1000 * 60 * 60 * 24);
    
    if (daysSinceWatered > 7) return 'Needs Care';
    if (daysSinceWatered > 3) return 'Check Soon';
    return 'Healthy';
  };

  const getPlantEmoji = () => {
    if (!plant) return '🌱';
    
    if (plant.image && plant.image.startsWith('data:image')) {
      return (
        <img 
          src={plant.image} 
          alt={plant.name || 'Plant'} 
          className="w-32 h-32 object-cover rounded-full mx-auto"
        />
      );
    }
    
    const type = (plant.type || plant.name || '').toLowerCase();
    if (type.includes('cactus')) return '🌵';
    if (type.includes('monstera')) return '🌿';
    if (type.includes('pothos')) return '🍃';
    if (type.includes('snake')) return '🌱';
    if (type.includes('flower')) return '🌸';
    return '🌱';
  };

  const getEnvironmentalImpact = () => {
    if (!plant) return [];
    
    // Generate random but consistent values for visualization
    const plantName = (plant.name || 'plant').toLowerCase();
    const impactScores = {
      airPurification: Math.min(90, Math.max(60, (plantName.length * 15) % 100)),
      oxygenProduction: Math.min(85, Math.max(50, (plantName.length * 12) % 100)),
      carbonSequestration: Math.min(75, Math.max(30, (plantName.length * 10) % 100)),
      biodiversity: Math.min(80, Math.max(20, (plantName.length * 8) % 100))
    };
    
    const impact = [
      { 
        id: 'airPurification',
        title: 'Air Purification', 
        description: 'Removes toxins like formaldehyde and benzene from indoor air.',
        icon: '💨',
        value: impactScores.airPurification > 80 ? 'High' : impactScores.airPurification > 50 ? 'Moderate' : 'Low',
        score: impactScores.airPurification,
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Air Quality Improvement (%)',
            data: [
              impactScores.airPurification * 0.6,
              impactScores.airPurification * 0.7,
              impactScores.airPurification * 0.8,
              impactScores.airPurification * 0.9,
              impactScores.airPurification * 0.95,
              impactScores.airPurification
            ],
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true
          }]
        }
      },
      { 
        id: 'oxygenProduction',
        title: 'Oxygen Production', 
        description: 'Daily oxygen output compared to average houseplant.', 
        icon: '🌬️',
        value: impactScores.oxygenProduction > 75 ? 'High' : impactScores.oxygenProduction > 45 ? 'Moderate' : 'Low',
        score: impactScores.oxygenProduction,
        data: {
          labels: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'],
          datasets: [{
            label: 'Oxygen Output',
            data: [
              impactScores.oxygenProduction * 0.2,
              impactScores.oxygenProduction * 0.3,
              impactScores.oxygenProduction * 0.7,
              impactScores.oxygenProduction * 0.9,
              impactScores.oxygenProduction * 0.8,
              impactScores.oxygenProduction * 0.5
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 4
          }]
        }
      },
      { 
        id: 'carbonSequestration',
        title: 'Carbon Sequestration', 
        description: 'Annual CO₂ absorption in kilograms.',
        icon: '🌍',
        value: `${Math.round(impactScores.carbonSequestration * 0.2)} kg/year`,
        score: impactScores.carbonSequestration,
        data: {
          labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
          datasets: [{
            label: 'CO₂ Absorbed (kg)',
            data: [
              impactScores.carbonSequestration * 0.15,
              impactScores.carbonSequestration * 0.3,
              impactScores.carbonSequestration * 0.5,
              impactScores.carbonSequestration * 0.7,
              impactScores.carbonSequestration * 0.85,
              impactScores.carbonSequestration
            ],
            backgroundColor: [
              'rgba(245, 158, 11, 0.5)',
              'rgba(245, 158, 11, 0.6)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(245, 158, 11, 0.9)',
              'rgba(245, 158, 11, 1)'
            ],
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1
          }]
        }
      },
      { 
        id: 'biodiversity',
        title: 'Biodiversity Impact', 
        description: 'Supports local ecosystem health and pollinator activity.',
        icon: '🦋',
        value: impactScores.biodiversity > 70 ? 'High' : impactScores.biodiversity > 40 ? 'Moderate' : 'Low',
        score: impactScores.biodiversity,
        data: {
          labels: ['Pollinators', 'Soil Health', 'Pest Control', 'Habitat'],
          datasets: [{
            label: 'Impact Score',
            data: [
              impactScores.biodiversity * 0.9,
              impactScores.biodiversity * 0.7,
              impactScores.biodiversity * 0.6,
              impactScores.biodiversity * 0.8
            ],
            backgroundColor: [
              'rgba(139, 92, 246, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(59, 130, 246, 0.5)',
              'rgba(245, 158, 11, 0.5)'
            ],
            borderColor: [
              'rgba(139, 92, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)'
            ],
            borderWidth: 1
          }]
        }
      }
    ];
    
    return impact;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || 'Plant not found'}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Back to Garden
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const environmentalImpact = getEnvironmentalImpact();
  const healthStatus = getHealthStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Garden
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
                  {getPlantEmoji()}
                </div>
                <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Plant Health</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
                      style={{ width: `${Math.min(100, Math.max(0, healthStatus === 'Healthy' ? 90 : healthStatus === 'Check Soon' ? 60 : 30))}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Needs Care</span>
                    <span>Thriving</span>
                  </div>
                </div>
                <button
                  onClick={handleWaterPlant}
                  className="w-full mt-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Water Plant
                </button>
              </div>
              
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name || 'Unnamed Plant'}</h1>
                {plant.type && (
                  <p className="text-lg text-gray-600 mb-6">{plant.type}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Last Watered</h3>
                    <p className="text-lg font-medium">{lastWatered}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Next Watering</h3>
                    <p className="text-lg font-medium text-emerald-600">{nextWatering}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Health Status</h3>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                        healthStatus === 'Check Soon' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {healthStatus}
                      </span>
                    </div>
                  </div>
                  {plant.location && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-lg font-medium">{plant.location}</p>
                    </div>
                  )}
                </div>
                
                {plant.notes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{plant.notes}</p>
                  </div>
                )}
                
                {plant.careInstructions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Care Instructions</h3>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                      <p className="text-amber-700 whitespace-pre-line">{plant.careInstructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Environmental Impact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🌱 Environmental Impact</h2>
            
            {/* Impact Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {environmentalImpact.map((item, index) => (
                <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{item.icon}</span>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Detailed Visualizations */}
            <div className="space-y-8">
              {environmentalImpact.map((item) => (
                <div key={item.id} className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="h-64">
                    {item.id === 'airPurification' || item.id === 'oxygenProduction' ? (
                      <div className="h-64">
                        <Chart
                          type="line"
                          data={item.data}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                              tooltip: { mode: 'index', intersect: false }
                            },
                            scales: {
                              y: { 
                                beginAtZero: true, 
                                max: 100, 
                                title: { 
                                  display: true, 
                                  text: 'Score (%)' 
                                } 
                              },
                              x: { 
                                title: { 
                                  display: true, 
                                  text: item.id === 'airPurification' ? 'Time' : 'Time of Day' 
                                } 
                              }
                            }
                          }}
                        />
                      </div>
                    ) : item.id === 'carbonSequestration' ? (
                      <div className="h-64">
                        <Chart
                          type="bar"
                          data={item.data}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: { 
                                callbacks: { 
                                  label: ctx => `CO₂: ${ctx.raw.toFixed(1)} kg` 
                                } 
                              }
                            },
                            scales: {
                              y: { 
                                beginAtZero: true, 
                                title: { 
                                  display: true, 
                                  text: 'kg CO₂' 
                                } 
                              },
                              x: { 
                                title: { 
                                  display: true, 
                                  text: 'Year' 
                                } 
                              }
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-64">
                        <Chart
                          type="bar"
                          data={item.data}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: { 
                                callbacks: { 
                                  label: ctx => `Score: ${ctx.raw}` 
                                } 
                              }
                            },
                            scales: {
                              y: { 
                                beginAtZero: true, 
                                max: 100, 
                                title: { 
                                  display: true, 
                                  text: 'Score (%)' 
                                } 
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    By caring for this plant, you're contributing to a healthier environment. 
                    Indoor plants help improve air quality and create a more sustainable living space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(`/care?plant=${encodeURIComponent(plant.name || '')}`)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Get Care Tips
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Check out my ${plant.name || 'plant'}!`,
                  text: `I'm growing a ${plant.name || 'beautiful plant'} in my garden.`,
                  url: window.location.href,
                }).catch(console.error);
              } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </main>
    </div>
  );
};

export default PlantDetails;
