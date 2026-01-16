import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/home', icon: '🏠' },
    { name: 'Plan a Plantation', path: '/plan', icon: '🌱' },
    { name: 'Care for My Plant', path: '/care', icon: '🌿' },
    { name: 'My Garden', path: '/my-garden', icon: '🪴' },
    { name: 'Discover', path: '/discover', icon: '🔍' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer flex-1 md:flex-none justify-center md:justify-start"
            onClick={() => {
              navigate('/home');
              handleNavigation();
            }}
          >
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              Plantiva AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'text-emerald-600 bg-emerald-50 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Search and User */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Hidden on mobile when menu is open */}
            <div className={`${isMobileMenuOpen ? 'hidden' : 'block'} md:block`}>
              <form 
                onSubmit={handleSearch}
                className={`relative ${isSearchFocused ? 'w-40 sm:w-64' : 'w-32 sm:w-48'} transition-all duration-300`}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                      className="h-4 w-4 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="block w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 border border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all duration-200"
                    placeholder="Search plants..."
                  />
                </div>
              </form>
            </div>

            {/* User Profile */}
            <div className={isMobileMenuOpen ? 'hidden' : 'block'}>
              <button 
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                onClick={() => {
                  navigate('/profile');
                  handleNavigation();
                }}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 flex items-center justify-center font-medium">
                  U
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-100`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-base font-medium rounded-md ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3 text-xl">{link.icon}</span>
              {link.name}
              {link.path === location.pathname && (
                <span className="ml-auto inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              )}
            </NavLink>
          ))}
          
          {/* Mobile Search */}
          <div className="px-3 py-2">
            <form onSubmit={handleSearch} className="mt-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Search plants..."
                />
              </div>
            </form>
          </div>
          
          {/* Mobile Profile Link */}
          <div 
            className="group flex items-center px-3 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            onClick={() => {
              navigate('/profile');
              handleNavigation();
            }}
          >
            <span className="mr-3 text-xl">👤</span>
            My Profile
          </div>
        </div>
      </div>
    </header>
  );
}

