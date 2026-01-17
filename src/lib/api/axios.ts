import axios from 'axios';

// Puedes usar variables de entorno para la URL base
const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
