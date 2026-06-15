import { NavLink, Outlet } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

const navClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
  }`;

export function AppLayout() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = instance.getActiveAccount() || accounts[0];

  const handleSignOut = async () => {
    try {
      await instance.logoutRedirect({ account });
    } catch (e) {
      console.error('logoutRedirect error', e);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(52,211,153,0.06),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">React DK</h1>
            <p className="text-sm text-slate-400">Public and protected Azure API calls with token renewal.</p>
          </div>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={navClasses} end>
              Home
            </NavLink>
            <NavLink to="/auth" className={navClasses}>
              Auth
            </NavLink>
            {isAuthenticated && (
              <div className="ml-4 flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Signed in as</div>
                  <div className="text-sm font-medium text-slate-200">{account?.name || account?.username}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-md bg-slate-700 px-3 py-1 text-white transition-colors hover:bg-slate-600"
                >
                  Sign out
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500 sm:px-6">
          React, Microsoft Entra ID, and silent token renewal for the protected API.
        </div>
      </footer>
    </div>
  );
}
