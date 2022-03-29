import axios from 'axios';
import { getAccessToken } from './auth';

const Api = axios.create({
  headers: {
    'Authorization': `Bearer ${getAccessToken()}`,
    'Accept': 'application/json'
  }
})

export default Api;