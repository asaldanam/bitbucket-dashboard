const CLIENT_ID = 'V3CkunMvVKj2zDKHzQ';
const STORAGE_KEY = 'auth';

export async function auth() {
  try {
    // Check if has credentials in localstorage
    const credentials = getCredentials();
    if (credentials) return;

    // Finally, if not logued yet, redirects to login
    redirectToLogin();
  } catch (error) {
    console.error(error)
  }
}

export function getCredentials() {
  if (typeof window === 'undefined') return null;
  try {
    saveCredentialsToStorage();
  
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

// Private

function saveCredentialsToStorage() {
  if (!hasTokenInUrl()) return;

  const credentials = getCredentialsFromUrlHash();
  
  // Moves credentials to localstorage
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  removeUrlHashData(); 
}

function hasTokenInUrl() {
  return location.hash.includes('access_token=');
}

function getCredentialsFromUrlHash() {
  const credentials = location.hash
    .replace('#', '')
    .split('&')
    .reduce((params, param) => {
      const [key, value] = param.split('=');
      return { ...params, [key]: value }
    }, {}) as Credentials;
  
  return credentials;
}

function removeUrlHashData() {
  history.pushState(
    "",
    document.title,
    location.pathname + location.search
  )
}

function redirectToLogin() {
  console.log('REDIRECTING TO BITBUCKET OAUTH...')
  if (location.hostname === 'localhost') return;
  location.href = `https://bitbucket.org/site/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`
}

type Credentials = {
  access_token: string;
  scopes: string;
  spires_in: string;
  token_type: string;
}
