import React, { useState, useContext } from 'react';
import { usePlantContext } from '../context/PlantContext';

const PlantForm = () => {
  const { addPlant } = usePlantContext();
  const [formData, setFormData] = useState({
    city: '',
    place: '',
    plantName: '',
    survivalProbability: 'Medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await addPlant(formData);
      setMessage({ 
        text: 'Plant added successfully!', 
        type: 'success' 
      });
      // Reset form
      setFormData({
        city: '',
        place: '',
        plantName: '',
        survivalProbability: 'Medium',
      });
    } catch (error) {
      console.error('Error adding plant:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to add plant', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Plant</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plantName" className="block text-sm font-medium text-gray-700">
            Plant Name *
          </label>
          <input
            type="text"
            id="plantName"
            name="plantName"
            value={formData.plantName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="place" className="block text-sm font-medium text-gray-700">
            Place (e.g., Balcony, Garden) *
          </label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="survivalProbability" className="block text-sm font-medium text-gray-700">
            Survival Probability
          </label>
          <select
            id="survivalProbability"
            name="survivalProbability"
            value={formData.survivalProbability}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isSubmitting ? 'Adding...' : 'Add Plant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantForm;
