import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Helper function to get random environmental impact data
const getRandomImpact = (plantName) => {
  const score = Math.min(90, Math.max(60, (plantName.length * 12) % 100));
  return {
    airPurification: score,
    oxygenProduction: Math.min(85, score + (Math.random() * 10 - 5)),
    carbonSequestration: Math.min(80, score - 5 + (Math.random() * 10)),
    biodiversity: Math.min(75, score - 10 + (Math.random() * 15))
  };
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
    suitableLocations: ['indoor', 'tropical', 'humid'],
    impact: getRandomImpact('Monstera Deliciosa')
  },
  {
    id: 2,
    name: 'Snake Plant',
    type: 'Succulent',
    difficulty: 'Very Easy',
    light: 'Low to bright',
    image: '🌱',
    liked: true,
    suitableLocations: ['indoor', 'arid', 'low-light'],
    impact: getRandomImpact('Snake Plant')
  },
  {
    id: 3,
    name: 'Fiddle Leaf Fig',
    type: 'Tree',
    difficulty: 'Moderate',
    light: 'Bright, indirect',
    image: '🌳',
    liked: false,
    suitableLocations: ['indoor', 'tropical', 'bright'],
    impact: getRandomImpact('Fiddle Leaf Fig')
  },
  {
    id: 4,
    name: 'ZZ Plant',
    type: 'Succulent',
    difficulty: 'Very Easy',
    light: 'Low to bright',
    image: '🍃',
    liked: false,
    suitableLocations: ['indoor', 'low-maintenance', 'low-light'],
    impact: getRandomImpact('ZZ Plant')
  },
  // Add more plants with different locations
  {
    id: 5,
    name: 'Aloe Vera',
    type: 'Succulent',
    difficulty: 'Easy',
    light: 'Bright, direct',
    image: '🌵',
    liked: false,
    suitableLocations: ['indoor', 'outdoor', 'arid', 'sunny'],
    impact: getRandomImpact('Aloe Vera')
  },
  {
    id: 6,
    name: 'Peace Lily',
    type: 'Flowering',
    difficulty: 'Easy',
    light: 'Low to medium, indirect',
    image: '🌸',
    liked: false,
    suitableLocations: ['indoor', 'shade', 'humid'],
    impact: getRandomImpact('Peace Lily')
  },
];

// Location presets
const locationPresets = [
  { id: 'all', name: 'All Locations' },
  { id: 'indoor', name: 'Indoor' },
  { id: 'outdoor', name: 'Outdoor' },
  { id: 'tropical', name: 'Tropical' },
  { id: 'arid', name: 'Arid/Dry' },
  { id: 'temperate', name: 'Temperate' },
];

const Discover = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [filteredPlants, setFilteredPlants] = useState([]);
  const navigate = useNavigate();

  // Filter plants based on search and location
  useEffect(() => {
    let result = [...allPlants];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(plant => 
        plant.name.toLowerCase().includes(query) ||
        plant.type.toLowerCase().includes(query)
      );
    }
    
    // Filter by location
    if (selectedLocation && selectedLocation !== 'all') {
      result = result.filter(plant => 
        plant.suitableLocations.includes(selectedLocation)
      );
    }
    
    setFilteredPlants(result);
  }, [searchQuery, selectedLocation]);
  
  // Shuffle array function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Get trending plants (shuffled for variety)
  const trendingPlants = shuffleArray([...allPlants]).slice(0, 6);
  
  // Get recommended plants based on location
  const recommendedPlants = selectedLocation === 'all' 
    ? shuffleArray([...allPlants]).slice(0, 4)
    : allPlants
        .filter(plant => plant.suitableLocations.includes(selectedLocation))
        .slice(0, 4);

  const categories = [
    { id: 'indoor', name: 'Indoor Plants', count: 24 },
    { id: 'succulents', name: 'Succulents', count: 18 },
    { id: 'herbs', name: 'Herbs', count: 15 },
    { id: 'flowering', name: 'Flowering', count: 22 },
    { id: 'petFriendly', name: 'Pet Friendly', count: 12 },
    { id: 'lowLight', name: 'Low Light', count: 20 },
  ];

  const careGuides = [
    {
      id: 1,
      title: 'Beginner\'s Guide to Plant Care',
      description: 'Learn the basics of keeping your plants alive and thriving.',
      image: '📚',
      duration: '5 min read'
    },
    {
      id: 2,
      title: 'How to Propagate Succulents',
      description: 'Step-by-step guide to growing new plants from cuttings.',
      image: '🌵',
      duration: '8 min read'
    },
    {
      id: 3,
      title: 'Best Plants for Low Light',
      description: 'Discover plants that thrive in low-light conditions.',
      image: '💡',
      duration: '6 min read'
    },
  ];

  const toggleLike = (plantId) => {
    // In a real app, this would update the state or make an API call
    console.log(`Toggled like for plant ${plantId}`);
  };

  // Render impact score bar
  const renderImpactBar = (score, label) => (
    <div className="mb-1">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full" 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  // Render plant card
  const PlantCard = ({ plant }) => (
    <div key={plant.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{plant.name}</h3>
            <p className="text-sm text-gray-500">{plant.type}</p>
          </div>
          <button 
            onClick={() => toggleLike(plant.id)}
            className="text-4xl"
            aria-label={plant.liked ? 'Unlike plant' : 'Like plant'}
          >
            {plant.liked ? '❤️' : '🤍'}
          </button>
        </div>
        
        <div className="mt-4 text-6xl text-center py-4">
          {plant.image}
        </div>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Difficulty:</span>
            <span className="font-medium">{plant.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Light:</span>
            <span className="font-medium">{plant.light}</span>
          </div>
          
          {/* Environmental Impact */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Environmental Impact</h4>
            {plant.impact && (
              <div className="space-y-2">
                {renderImpactBar(plant.impact.airPurification, 'Air Purification')}
                {renderImpactBar(plant.impact.oxygenProduction, 'O₂ Production')}
                {renderImpactBar(plant.impact.carbonSequestration, 'CO₂ Absorption')}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/plants/${plant.id}`)}
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discover Plants</h1>
              <p className="text-gray-600 mt-1">Find the perfect plants for your space</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locationPresets.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trending'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'guides'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Care Guides
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-10">
          {activeTab === 'trending' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Trending Plants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPlants.map((plant) => (
                  <div key={plant.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
                          <p className="text-sm text-gray-500">{plant.type}</p>
                        </div>
                        <button 
                          onClick={() => toggleLike(plant.id)}
                          className="text-2xl"
                          aria-label={plant.liked ? 'Unlike' : 'Like'}
                        >
                          {plant.liked ? '❤️' : '🤍'}
                        </button>
                      </div>
                      
                      <div className="mt-4 text-6xl text-center my-6">
                        {plant.image}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Difficulty:</span>
                          <span className="font-medium">{plant.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Light:</span>
                          <span className="font-medium">{plant.light}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t border-gray-100">
                      <button className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                        Add to Garden
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Plant Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <span className="text-sm text-gray-500">{category.count} plants</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.min(100, category.count * 3)}%` }}
                      ></div>
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
