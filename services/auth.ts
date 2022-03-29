import axios from "axios";

export async function auth() {
  const credentials = getCredentials();
  if (credentials) return;

  const code = getCode();
  if (!code) goToAtlassianOAuth();

  const headers = { 'Content-Type': 'application/json' }
  const body = {
    "grant_type": "authorization_code",
    "client_id": config.CLIENT_ID,
    "client_secret": config.CLIENT_SECRET,
    "code": code,
    "redirect_uri": config.REDIRECT_URI
  }

  const res = await axios.post<Credentials>(
    'https://auth.atlassian.com/oauth/token', 
    { headers, body }
  )

  window.localStorage.setItem('credentials', JSON.stringify(res));
  
  return res;
}

export function getCredentials() {
  const credentials = window.localStorage.getItem('credentials');
  return JSON.parse(credentials || '') || null;
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
  window.location.href = `
    https://auth.atlassian.com/authorize
      ?audience=api.atlassian.com
      &client_id=${config.CLIENT_ID}
      &redirect_uri=${config.REDIRECT_URI}
      &response_type=code
      &prompt=consent
  `
}

interface Credentials {
  "access_token": string,
  "expires_in": number;
  "scope": string;
}

const config = {
  CLIENT_ID: 'q7BPfsrFgPvZPMVOSoqIEoT49ajnSIOh',
  CLIENT_SECRET: '8992rg_UHpZG4vaisHgHLJ3Vqfykz01vq7TJuzi_Dqe0lH1H7cnRhEz6fyKXPs-u',
  REDIRECT_URI: 'https://bitbucket-dashboard.vercel.app',
}