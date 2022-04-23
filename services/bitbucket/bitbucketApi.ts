import axios, { AxiosRequestConfig } from "axios";
import * as bitbucket from "./bitbucketAuth";

const api = axios.create();

api.interceptors.response.use(
  res => res,
  error => {
    console.error('API ERROR INTERCEPTED', error)
    console.error(error.config)
    console.error(error.response.status)
    if (error.response.status === 401) {
      bitbucket.removeCredentials();
      bitbucket.auth()
    }
  }
)

export type BitbucketApiParams = {
  ep: string,
  version?: string;
} & AxiosRequestConfig;

export default async function bitbucketApi(params: BitbucketApiParams) {
  const credentials = bitbucket.getCredentials();

  const config: AxiosRequestConfig = {
    baseURL: `https://api.bitbucket.org${params.version || '/2.0'}`,
    headers: {
      'Authorization': `Bearer ${credentials?.access_token}`,
      'Accept': 'application/json'
    },
    ...params,
  };
  
  return api
    .get(params.ep, config)
    .then(res => res.data)
}