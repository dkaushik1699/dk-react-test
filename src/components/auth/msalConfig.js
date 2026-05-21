export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '<YOUR_CLIENT_ID>',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || '<YOUR_TENANT_ID>'}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || 'http://localhost:5173',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};
 