'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export default function AdminPasswordRecovery() {
  const [client] = useState<SupabaseClient | null>(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && anonKey ? createClient(url, anonKey) : null;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sent, setSent] = useState(false);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!client) {
      setCheckingSession(false);
      return;
    }
    let active = true;
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' && session) {
        setHasRecoverySession(true);
        setCheckingSession(false);
      } else if (event === 'SIGNED_OUT') {
        setHasRecoverySession(false);
      }
    });

    // getSession waits for Supabase to process tokens from a recovery link.
    void client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (!sessionError && data.session) setHasRecoverySession(true);
      setCheckingSession(false);
    }).catch(() => {
      if (active) setCheckingSession(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [client]);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || busy) return;
    setError('');
    setBusy(true);
    try {
      const redirectTo = new URL('/admin/recover', window.location.origin).toString();
      const { error: requestError } = await client.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo }
      );
      if (requestError) throw requestError;
      setSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to send recovery email.');
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || busy || !hasRecoverySession) return;
    setError('');
    if (password.length < 12) {
      setError('Use a password with at least 12 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const { error: updateError } = await client.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword('');
      setConfirmPassword('');
      setFinished(true);
      await client.auth.signOut();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="cp-login">
      <div className="cp-login-card">
        <img className="cp-login-logo" src="/brand/primary-logo.png" alt="Alden Rovell" />
        <span className="cp-eyebrow">SECURE ACCOUNT RECOVERY</span>
        <h1>{finished ? 'Password updated' : hasRecoverySession ? 'Set a new password' : 'Reset admin password'}</h1>

        {!client ? (
          <p role="alert" className="cp-error">Authentication is unavailable. Please contact the store administrator.</p>
        ) : finished ? (
          <p>Your password has been updated. Sign in with your email and your new password.</p>
        ) : checkingSession ? (
          <p role="status">Checking your recovery link…</p>
        ) : hasRecoverySession ? (
          <form className="cp-form" onSubmit={changePassword}>
            <label>New password
              <input type="password" autoComplete="new-password" minLength={12} required value={password} onChange={event => setPassword(event.target.value)} />
            </label>
            <label>Confirm new password
              <input type="password" autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
            </label>
            <button className="cp-save" type="submit" disabled={busy}>{busy ? 'Updating…' : 'Set new password'}</button>
          </form>
        ) : sent ? (
          <p role="status">If this email is registered, a password recovery link has been sent. Open the link in the same browser. You can check Spam or Promotions too.</p>
        ) : (
          <>
            <p>Enter the email registered for your store admin account. We will send a secure recovery link.</p>
            <form className="cp-form" onSubmit={requestReset}>
              <label>Email address
                <input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
              </label>
              <button className="cp-save" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Email me a recovery link'}</button>
            </form>
          </>
        )}

        {error && <p role="alert" className="cp-error">{error}</p>}
        <a href="/admin">← Back to admin sign in</a>
      </div>
    </main>
  );
}
