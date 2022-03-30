import axios from "axios";
import { Credentials } from "../pages/api/oauth/token";

export async function auth() {
  const credentials = getCredentials();
  if (credentials) return;

  const code = getCode();
  if (!code) goToAtlassianOAuth();

  try {
      const { data } = await axios.get<Credentials>('/api/oauth/token', { params: { code } })
      window.localStorage.setItem('credentials', JSON.stringify(data));
  } catch (e: any) {
    localStorage.removeItem('credentials')
    localStorage.removeItem('code');
    window.history.pushState({}, document.title, window.location.pathname);

    goToAtlassianOAuth();
  }
}

export function getCredentials() {
  const credentials = window.localStorage.getItem('credentials');
  return JSON.parse(credentials || 'null');
}

export function getCode() {
  const codeSaved = window.localStorage.getItem('code') as string;
  if (codeSaved) return codeSaved;

  const params = new URLSearchParams(window.location.search)
  const codeFromParams = params.get('code');

  if (codeFromParams) {
    window.localStorage.setItem('code', codeFromParams);
    return codeFromParams;
  }
}

function goToAtlassianOAuth() {
  window.location.href = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=q7BPfsrFgPvZPMVOSoqIEoT49ajnSIOh&scope=read%3Ame&redirect_uri=https%3A%2F%2Fbitbucket-dashboard.vercel.app&response_type=code&prompt=consent`
}