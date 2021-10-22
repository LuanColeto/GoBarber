import axios from 'axios';

const api = axios.create({
  baseURL: 'http://159.223.103.26/',
});

export default api;
