import axios, { AxiosRequestConfig } from "axios";
import * as bitbucket from "./auth";

const BitbucketApi = {
  async get(url: string, config?: AxiosRequestConfig) {
    const credentials = bitbucket.getCredentials();

    const baseConfig: AxiosRequestConfig = {
      baseURL: `https://api.bitbucket.org/2.0`,
      headers: {
        'Authorization': `Bearer ${credentials?.access_token}`,
        'Accept': 'application/json'
      },
    };

    try {
      const { data } = await axios.get(url, { ...baseConfig, ...(config || {}) })
      return data;
    } catch (error: any) {
      if (error.response.status !== 401) {
        bitbucket.removeCredentials();
        bitbucket.auth();
      }
      throw error;
    }
  },
};

export default BitbucketApi;

// Private
async function unauthorizedInterceptor(error) {
  if (error.response.status !== 401) return;

  bitbucket.removeCredentials();
  bitbucket.auth();
}