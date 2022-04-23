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
  if (typeof window === 'undefined') return null;
  try {
    const storage = window.localStorage.getItem(STORAGE_KEY)
    const credentials = JSON.parse(storage || 'null') as Credentials | null;
    return credentials?.access_token ? credentials : null;
  } catch (error) {
    throw new Error(`Error retriving credentials: ${error}`);
  }
}

export function removeCredentials() {
  if (typeof window === 'undefined') return null;
  const storage = window.localStorage.removeItem(STORAGE_KEY);
}

function saveCredentialsToStorage() {
  try {
    const credentials = location.hash
      .replace('#', '')
      .split('&')
      .map(param => {
        const [key, value] = param.split('=')
        return { [key]: value };
      })
      .reduce((params, param) => ({ ...params, ...param }), {}) as Credentials;
    
    // Moves credentials to localstorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
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
  if (location.hostname === 'localhost') return;
  location.href = `https://bitbucket.org/site/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`
}

type Credentials = {
  access_token: string;
  scopes: string;
  spires_in: string;
  token_type: string;
}
