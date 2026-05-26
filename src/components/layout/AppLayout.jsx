import { NavLink, Outlet } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

const navClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-sky-700' : 'text-slate-500 hover:text-slate-700'
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">React DK</h1>
            <p className="text-sm text-slate-500">A modular app shell with routes.</p>
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
                  <div className="text-sm font-medium text-slate-900">{account?.name || account?.username}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-md bg-slate-900 px-3 py-1 text-white hover:bg-slate-800 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/90 py-4">
        <div className="mx-auto max-w-5xl px-4 text-sm text-slate-500 sm:px-6">
          React and authentication with Microsoft Entra ID.
        </div>
      </footer>
    </div>
  );
}
