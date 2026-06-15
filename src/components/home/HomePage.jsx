/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, Globe, KeyRound, Loader2, Play, RefreshCcw, ShieldCheck } from 'lucide-react';
import { callApiEndpoint, formatExpiresOn, getProtectedAccessToken, protectedApiUrl, publicApiUrl } from '../../lib/apiClient';

export function HomePage() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = instance.getActiveAccount() || accounts[0];
  const [publicState, setPublicState] = useState({ status: 'idle', data: null, error: null, fetchedAt: null });
  const [protectedState, setProtectedState] = useState({ status: 'idle', data: null, error: null, fetchedAt: null });
  const [tokenState, setTokenState] = useState({ status: 'idle', preview: null, expiresOn: null, scopes: [] });

  const accountLabel = useMemo(() => account?.name || account?.username || 'No active account', [account]);

  const loadPublicData = useCallback(async () => {
    setPublicState((current) => ({ ...current, status: 'loading', error: null }));

    try {
      const { data } = await callApiEndpoint(publicApiUrl);
      setPublicState({
        status: 'success',
        data,
        error: null,
        fetchedAt: new Date().toISOString(),
      });
    } catch (error) {
      setPublicState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error.message : 'Unable to load the public endpoint.',
        fetchedAt: null,
      });
    }
  }, []);

  const loadProtectedData = useCallback(async ({ forceRefresh = false } = {}) => {
    if (!account) {
      setProtectedState({
        status: 'idle',
        data: null,
        error: 'Sign in to call the protected endpoint.',
        fetchedAt: null,
      });
      setTokenState({ status: 'idle', preview: null, expiresOn: null, scopes: [] });
      return;
    }

    setProtectedState((current) => ({ ...current, status: 'loading', error: null }));

    try {
      const tokenResult = await getProtectedAccessToken(instance, account, { forceRefresh });
      const tokenPreview = `${tokenResult.accessToken.slice(0, 18)}...${tokenResult.accessToken.slice(-8)}`;

      setTokenState({
        status: 'success',
        preview: tokenPreview,
        expiresOn: tokenResult.expiresOn ? tokenResult.expiresOn.toISOString() : null,
        scopes: tokenResult.scopes || [],
      });

      const { data } = await callApiEndpoint(protectedApiUrl, {
        headers: {
          Authorization: `Bearer ${tokenResult.accessToken}`,
        },
      });

      setProtectedState({
        status: 'success',
        data,
        error: null,
        fetchedAt: new Date().toISOString(),
      });
    } catch (error) {
      setProtectedState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error.message : 'Unable to load the protected endpoint.',
        fetchedAt: null,
      });
    }
  }, [account, instance]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProtectedState({ status: 'idle', data: null, error: null, fetchedAt: null });
      setTokenState({ status: 'idle', preview: null, expiresOn: null, scopes: [] });
    }
  }, [account?.homeAccountId, isAuthenticated]);

  const publicEndpointBody = renderBody(publicState.data, publicState.status);
  const protectedEndpointBody = renderBody(protectedState.data, protectedState.status);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-900/80 p-6 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.06),transparent_35%,rgba(52,211,153,0.06)_70%,transparent)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
              <ShieldCheck size={14} />
              Entra ID token flow
            </span>
            <div className="space-y-3">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
                Click to call public and protected APIs.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                Each endpoint is called only when you press its button. The protected call acquires an access token silently through MSAL before hitting the backend.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadPublicData}
                disabled={publicState.status === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {publicState.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                Call public API
              </button>
              <button
                type="button"
                onClick={() => loadProtectedData()}
                disabled={!isAuthenticated || protectedState.status === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/50 disabled:text-slate-500"
              >
                {protectedState.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Call protected API
              </button>
              <button
                type="button"
                onClick={() => loadProtectedData({ forceRefresh: true })}
                disabled={!isAuthenticated || protectedState.status === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500"
              >
                <RefreshCcw size={16} />
                Renew token &amp; call
              </button>
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 transition hover:border-emerald-500/50 hover:bg-emerald-500/15"
                >
                  <KeyRound size={16} />
                  Sign in first
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-slate-700 bg-slate-950 p-5 text-white shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Session</p>
                <p className="mt-2 text-lg font-semibold text-slate-100">{accountLabel}</p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${isAuthenticated ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                {isAuthenticated ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {isAuthenticated ? 'Signed in' : 'Public mode'}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Public API" value={publicState.status === 'idle' ? 'Not called' : publicState.status} />
              <Metric label="Protected API" value={protectedState.status === 'idle' ? 'Not called' : protectedState.status} />
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-400">
              <p className="font-medium text-slate-200">Scope</p>
              <p className="mt-1 break-all">api://6003afdd-c28b-4e0b-a2aa-1af6d53ac1c3/read_users</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ApiCard
          title="Public endpoint"
          endpointUrl={publicApiUrl}
          description="No sign-in required. Click the button to send a GET request and view the response."
          icon={<Globe size={18} />}
          status={publicState.status}
          fetchedAt={publicState.fetchedAt}
          error={publicState.error}
          actionLabel="Call endpoint"
          onAction={loadPublicData}
          body={publicEndpointBody}
        />

        <ApiCard
          title="Protected endpoint"
          endpointUrl={protectedApiUrl}
          description={isAuthenticated ? 'MSAL acquires an access token silently, then calls the secured endpoint.' : 'Sign in first, then click the button to call this endpoint.'}
          icon={<ShieldCheck size={18} />}
          status={protectedState.status}
          fetchedAt={protectedState.fetchedAt}
          error={protectedState.error}
          actionLabel={isAuthenticated ? 'Call endpoint' : 'Sign in to call'}
          onAction={isAuthenticated ? () => loadProtectedData() : undefined}
          actionTo={isAuthenticated ? undefined : '/auth'}
          body={protectedEndpointBody}
          footer={
            <div className="grid gap-3 rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-200">Access token</span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Silent acquisition</span>
              </div>
              <p className="break-all text-slate-300">
                {tokenState.preview || 'No token yet — call the endpoint to acquire one'}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{formatExpiresOn(tokenState.expiresOn)}</span>
                <span>{tokenState.scopes.length > 0 ? tokenState.scopes.join(', ') : 'No scopes cached yet'}</span>
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold capitalize text-slate-100">{value}</p>
    </div>
  );
}

function ApiCard({ title, endpointUrl, description, icon, status, fetchedAt, error, actionLabel, onAction, actionTo, body, footer }) {
  const isBusy = status === 'loading';

  const actionClasses = 'inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-700';

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-slate-700/80 bg-slate-900/80 p-6 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.4)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-sky-400">{icon}</span>
            {title}
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
          {endpointUrl && (
            <p className="mt-2 break-all font-mono text-xs text-slate-500">{endpointUrl}</p>
          )}
        </div>
        <StatusPill status={status} />
      </div>

      <div className="mt-5 flex items-center gap-3">
        {actionTo ? (
          <Link to={actionTo} className={actionClasses}>
            <KeyRound size={16} />
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            disabled={!onAction || isBusy}
            className={actionClasses}
          >
            {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {actionLabel}
          </button>
        )}
        {fetchedAt && (
          <span className="text-xs text-slate-500">
            Updated {new Date(fetchedAt).toLocaleString()}
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="mt-4 flex-1 rounded-3xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Response</p>
        <pre className="max-h-[22rem] overflow-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-slate-300">
          {body}
        </pre>
      </div>

      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}

function StatusPill({ status }) {
  const styles = {
    idle: 'border-slate-600 bg-slate-800 text-slate-400',
    loading: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${styles[status] || styles.idle}`}>
      {status === 'idle' ? 'ready' : status}
    </span>
  );
}

function renderBody(data, status) {
  if (status === 'idle') {
    return 'Click "Call endpoint" to send a request.';
  }

  if (status === 'loading') {
    return 'Waiting for response…';
  }

  if (!data) {
    return 'No response body.';
  }

  if (typeof data === 'string') {
    return data;
  }

  return JSON.stringify(data, null, 2);
}
