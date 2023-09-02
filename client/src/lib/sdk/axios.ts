import axios from 'axios';
export default axios.create({
  baseURL: '/ex_api/v1',
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
});
