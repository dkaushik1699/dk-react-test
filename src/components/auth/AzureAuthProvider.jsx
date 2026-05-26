
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './msalConfig';


  const msalInstance = new PublicClientApplication(msalConfig);
  
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.addEventCallback((event) => {
        var authenticationResult = event?.payload ;
        if (event.eventType === EventType.LOGIN_SUCCESS && authenticationResult?.account) {
            const account = authenticationResult?.account;
            msalInstance.setActiveAccount(account);
            // window.location.reload();
        }
    });
export const AuthProvider = ({ children }) => {

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

