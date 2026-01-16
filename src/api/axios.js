import axios from "axios";

const api = axios.create({
  baseURL: "https://plant.vervi.in",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  // Don't throw for 204 status code
  validateStatus: function (status) {
    return status >= 200 && status < 300 || status === 204;
  },
});

// Add a response interceptor to handle 204 responses
api.interceptors.response.use(
  response => {
    // For 204 responses, return an empty object as data
    if (response.status === 204) {
      return { ...response, data: { data: [], message: 'No content' } };
    }
    return response;
  },
  error => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default api;
