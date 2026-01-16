import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Discover = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // In a real app, you would reverse geocode these coordinates to get a location name
          setLocation('Your Location');
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // Mock data for plants with environmental impact
  const allPlants = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      type: 'Tropical',
      difficulty: 'Easy',
      light: 'Medium to bright, indirect',
      image: '🌿',
      liked: false,
      impact: {
        airPurification: 85,
        oxygenProduction: 70,
        humidity: 75,
        co2Absorption: 60,
        description: 'Excellent for improving indoor air quality by removing toxins'
      },
      suitableLocations: ['Living Room', 'Office', 'Bedroom']
    },
    {
      id: 2,
      name: 'Snake Plant',
      type: 'Succulent',
      difficulty: 'Very Easy',
      light: 'Low to bright',
      image: '🌱',
      liked: true,
      impact: {
        airPurification: 90,
        oxygenProduction: 95, // Releases oxygen at night
        humidity: 40,
        co2Absorption: 80,
        description: 'One of the best plants for oxygen production, especially at night'
      },
      suitableLocations: ['Bedroom', 'Office', 'Bathroom']
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      type: 'Tree',
      difficulty: 'Moderate',
      light: 'Bright, indirect',
      image: '🌳',
      liked: false,
      impact: {
        airPurification: 75,
        oxygenProduction: 65,
        humidity: 60,
        co2Absorption: 70,
        description: 'Great for large spaces, helps maintain healthy humidity levels'
      },
      suitableLocations: ['Living Room', 'Office']
    },
    {
      id: 4,
      name: 'Peace Lily',
      type: 'Flowering',
      difficulty: 'Easy',
      light: 'Low to medium',
      image: '🌸',
      liked: false,
      impact: {
        airPurification: 95, // Excellent at removing toxins
        oxygenProduction: 75,
        humidity: 80,
        co2Absorption: 70,
        description: 'Top performer in air purification, removes common household toxins'
      },
      suitableLocations: ['Bedroom', 'Living Room', 'Bathroom']
    },
    {
      id: 5,
      name: 'Spider Plant',
      type: 'Hanging',
      difficulty: 'Very Easy',
      light: 'Bright, indirect',
      image: '🕷️',
      liked: false,
      impact: {
        airPurification: 85,
        oxygenProduction: 80,
        humidity: 65,
        co2Absorption: 75,
        description: 'Effective at removing carbon monoxide and other toxins'
      },
      suitableLocations: ['Kitchen', 'Living Room', 'Office']
    },
    {
      id: 6,
      name: 'Aloe Vera',
      type: 'Succulent',
      difficulty: 'Easy',
      light: 'Bright, direct',
      image: '🌵',
      liked: false,
      impact: {
        airPurification: 70,
        oxygenProduction: 65,
        humidity: 30,
        co2Absorption: 60,
        description: 'Releases oxygen at night and helps clear air of formaldehyde'
      },
      suitableLocations: ['Kitchen', 'Bedroom', 'Bathroom']
    }
  ];

  // Filter plants based on search and location
  const filteredPlants = allPlants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !location || plant.suitableLocations.some(loc => 
      loc.toLowerCase().includes(location.toLowerCase())
    );
    return matchesSearch && matchesLocation;
  });

  // Get trending plants (first 4 for demo)
  const trendingPlants = allPlants.slice(0, 4);

  // Get recommended plants based on location
  const recommendedPlants = location 
    ? allPlants.filter(plant => 
        plant.suitableLocations.some(loc => 
          location.toLowerCase().includes(loc.toLowerCase())
        )
      )
    : allPlants;

  const categories = [
    { id: 'indoor', name: 'Indoor Plants', count: 24 },
    { id: 'succulents', name: 'Succulents', count: 18 },
    { id: 'herbs', name: 'Herbs', count: 15 },
    { id: 'flowering', name: 'Flowering', count: 22 },
    { id: 'petFriendly', name: 'Pet Friendly', count: 12 },
    { id: 'lowLight', name: 'Low Light', count: 20 },
  ];

  const toggleLike = (plantId) => {
    // In a real app, this would update the state or make an API call
    console.log(`Toggled like for plant ${plantId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Plants</h1>
          <p className="text-gray-600">Find the perfect plants for your space</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search plants</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Search by name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="location"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter location (e.g., Bedroom, Office)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    'Locating...'
                  ) : (
                    <><svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    My Location</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('trending')}
              className={`${activeTab === 'trending' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`${activeTab === 'recommended' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Recommended for You
            </button>
          </nav>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'trending' ? trendingPlants : recommendedPlants).map((plant) => (
            <div key={plant.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
                    <p className="text-sm text-gray-500">{plant.type}</p>
                  </div>
                  <span className="text-4xl">{plant.image}</span>
                </div>

                {/* Environmental Impact */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Air Quality</span>
                      <span className="font-medium">{plant.impact.airPurification}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${plant.impact.airPurification}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Oxygen</span>
                      <span className="font-medium">{plant.impact.oxygenProduction}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${plant.impact.oxygenProduction}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">CO₂ Absorption</span>
                      <span className="font-medium">{plant.impact.co2Absorption}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${plant.impact.co2Absorption}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">{plant.impact.description}</p>
                  
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">Best for: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {plant.suitableLocations.map((loc, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plant.difficulty === 'Very Easy' ? 'bg-green-100 text-green-800' :
                      plant.difficulty === 'Easy' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {plant.difficulty}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      <span className="font-medium">{plant.light}</span> light
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/plants/${plant.id}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View Details
                  </button>
                </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guides' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Care Guides</h2>
              <div className="space-y-6">
                {careGuides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 flex items-start">
                      <div className="text-4xl mr-6">{guide.image}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{guide.title}</h3>
                        <p className="text-gray-600 mb-3">{guide.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{guide.duration}</span>
                          <span className="mx-2">•</span>
                          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Read Guide
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Community Section */}
        <div className="bg-emerald-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">Connect with other plant lovers, share your plant journey, and get expert advice.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Sign Up for Free
            </button>
            <button className="px-6 py-3 bg-white text-emerald-600 border border-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
