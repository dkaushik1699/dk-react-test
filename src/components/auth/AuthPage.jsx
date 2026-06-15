import { useEffect } from "react";
import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginRequest, protectedApiScope } from "./msalConfig";

export function AuthPage() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("loginRedirect error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({ account });
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-700/80 bg-slate-900/90 p-8 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.5)]">
      <h1 className="mb-3 text-3xl font-semibold text-slate-100">
        Authentication
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-400">
        Sign in with Microsoft Entra ID to let the frontend acquire an access token for the protected API scope {protectedApiScope}.
      </p>

      <AuthenticatedTemplate>
        <p className="mb-6 text-slate-400">
          You are signed in with Microsoft Azure AD.
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-slate-300">
            <p className="text-sm">Signed in as</p>
            <p className="font-medium text-slate-100">
              {account?.name || account?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-700 px-5 py-3 text-white transition-colors hover:bg-slate-600"
          >
            Sign out
          </button>
        </div>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <p className="text-slate-400">
          Sign in to access Azure AD secured content.
        </p>
        <p className="mb-6 text-slate-300">
          Active Account: {activeAccount?.name || activeAccount?.username}
        </p>
        <p className="pb-8 pt-1 text-xs text-slate-500">
          Redirect URI : {`${import.meta.env.VITE_AZURE_REDIRECT_URI ?? "__"}`}
        </p>
        <button
          onClick={handleLogin}
          className="rounded-lg bg-sky-600 px-5 py-3 text-white transition-colors hover:bg-sky-500"
        >
          Sign in with Microsoft
        </button>
      </UnauthenticatedTemplate>
    </div>
  );
}
