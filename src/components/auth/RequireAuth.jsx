import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }) {
  const { instance, accounts, inProgress } = useMsal();
  const location = useLocation();

  if (inProgress !== InteractionStatus.None) {
    return <div>Loading...</div>;
  }

  const activeAccount = instance.getActiveAccount() || accounts[0];

  if (!activeAccount) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}