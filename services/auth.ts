const CLIENT_ID = 'V3CkunMvVKj2zDKHzQ';
const STORAGE_KEY = 'auth';

export async function auth() {
  try {
    // Check if has credentials in localstorage
    const credentials = getCredentials();
    if (credentials) return;

    // Check if has credentials in url
    if (hasTokenInUrl()) {
      saveCredentialsToStorage();
      return;
    }

    // Finally, if not logued yet, redirects to login
    redirectToLogin();
  } catch (error) {
    console.error(error)
  }
}

export function getCredentials() {
  try {
    const storage = localStorage.getItem(STORAGE_KEY)
    const credentials = JSON.parse(storage || 'null') as Credentials | null;
    return credentials?.access_token ? credentials : null;
  } catch (error) {
    throw new Error(`Error retriving credentials: ${error}`);
  }
}

function saveCredentialsToStorage() {
  try {
    const credentials = window.location.hash
      .replace('#', '')
      .split('&')
      .map(param => {
        const [key, value] = param.split('=')
        return { [key]: value };
      })
      .reduce((params, param) => ({ ...params, ...param }), {}) as Credentials;
    
    // Moves credentials to localstorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    location.hash = '';

    return true;
  } catch (error) {
    throw new Error(`Error saving credentials: ${error}`);
  }
}

function hasTokenInUrl() {
  return location.hash.includes('access_token=');
}

function redirectToLogin() {
  window.location.href = `https://bitbucket.org/site/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`
}

type Credentials = {
  access_token: string;
  scopes: string;
  spires_in: string;
  token_type: string;
}
