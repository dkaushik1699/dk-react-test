import { useEffect } from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from '@azure/msal-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginRequest } from './msalConfig';

export function AuthPage() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutPopup({ account });
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900 mb-4">Authentication</h1>

      <AuthenticatedTemplate>
        <p className="text-slate-600 mb-6">You are signed in with Microsoft Azure AD.</p>
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
            <p className="text-sm">Signed in as</p>
            <p className="font-medium text-slate-900">{account?.name || account?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-5 py-3 text-white hover:bg-slate-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <p className="text-slate-600 mb-6">Sign in to access Azure AD secured content.</p>
        <p>{`${import.meta.env.VITE_AZURE_REDIRECT_URI}`}</p>
        <button
          onClick={handleLogin}
          className="rounded-lg bg-slate-900 px-5 py-3 text-white hover:bg-slate-800 transition-colors"
        >
          Sign in with Microsoft
        </button>
      </UnauthenticatedTemplate>
    </div>
  );
}
