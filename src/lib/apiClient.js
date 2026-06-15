import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from '../components/auth/msalConfig';

export const publicApiUrl = 'https://codepush-ardkfzgeeddbe7gx.centralus-01.azurewebsites.net/api/v1/public';
export const protectedApiUrl = 'https://codepush-ardkfzgeeddbe7gx.centralus-01.azurewebsites.net/api/v1/protected';

export async function getProtectedAccessToken(instance, account, { forceRefresh = false } = {}) {
  try {
    return await instance.acquireTokenSilent({
      ...loginRequest,
      account,
      forceRefresh,
    });
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      throw new Error(
        'The session needs re-authentication before a new access token can be issued. Use the sign-in page and try again.',
        { cause: error },
      );
    }

    throw error;
  }
}

export async function callApiEndpoint(url, { headers = {}, signal } = {}) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    signal,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const message = typeof data === 'string'
      ? data
      : data?.message || data?.error || `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return { response, data };
}

export function formatExpiresOn(expiresOn) {
  if (!expiresOn) {
    return 'No token cached yet';
  }

  return `Expires ${new Date(expiresOn).toLocaleString()}`;
}

function parseResponseBody(response) {
  return response.text().then((text) => {
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  });
}