import axios from 'axios';
import { getCredentials } from './auth';

const Api = axios.create({
  headers: {
    'Authorization': `Bearer ${getCredentials()}`,
    'Accept': 'application/json'
  }
})

export default Api;