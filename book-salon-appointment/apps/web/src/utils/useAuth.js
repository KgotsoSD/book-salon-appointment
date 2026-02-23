import { useCallback } from 'react';

const AUTH_BASE = '/api/auth';

async function getCsrfToken() {
	const res = await fetch(`${AUTH_BASE}/csrf`, { credentials: 'include' });
	const data = await res.json();
	return data?.csrfToken ?? '';
}

async function signIn(providerId, options = {}) {
	const callbackUrl = options.callbackUrl ?? typeof window !== 'undefined' ? window.location.origin : '/';
	const isCredentials = providerId === 'credentials-signin' || providerId === 'credentials-signup';
	if (isCredentials && options.email != null && options.password != null) {
		const csrfToken = await getCsrfToken();
		const res = await fetch(`${AUTH_BASE}/callback/${providerId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			credentials: 'include',
			body: new URLSearchParams({
				csrfToken,
				email: options.email,
				password: options.password,
				callbackUrl,
				json: 'true',
			}),
		});
		const data = await res.json();
		if (data?.url) window.location.href = data.url;
		return data;
	}
	// OAuth: redirect to signin
	const url = new URL(`${AUTH_BASE}/signin/${providerId}`, window.location.origin);
	url.searchParams.set('callbackUrl', callbackUrl);
	window.location.href = url.toString();
	return { url: url.toString() };
}

function signOut(options = {}) {
	const callbackUrl = options.callbackUrl ?? typeof window !== 'undefined' ? window.location.origin : '/';
	const url = new URL(`${AUTH_BASE}/signout`, window.location.origin);
	url.searchParams.set('callbackUrl', callbackUrl);
	window.location.href = url.toString();
}

function useAuth() {
	const callbackUrl =
		typeof window !== 'undefined'
			? new URLSearchParams(window.location.search).get('callbackUrl')
			: null;

	const signInWithCredentials = useCallback(
		(options) => {
			return signIn('credentials-signin', {
				...options,
				callbackUrl: callbackUrl ?? options?.callbackUrl,
			});
		},
		[callbackUrl]
	);

	const signUpWithCredentials = useCallback(
		(options) => {
			return signIn('credentials-signup', {
				...options,
				callbackUrl: callbackUrl ?? options?.callbackUrl,
			});
		},
		[callbackUrl]
	);

	const signInWithGoogle = useCallback(
		(options) => {
			return signIn('google', {
				...options,
				callbackUrl: callbackUrl ?? options?.callbackUrl,
			});
		},
		[callbackUrl]
	);
	const signInWithFacebook = useCallback((options) => {
		return signIn('facebook', { ...options, callbackUrl: callbackUrl ?? options?.callbackUrl });
	}, [callbackUrl]);
	const signInWithTwitter = useCallback((options) => {
		return signIn('twitter', { ...options, callbackUrl: callbackUrl ?? options?.callbackUrl });
	}, [callbackUrl]);

	return {
		signInWithCredentials,
		signUpWithCredentials,
		signInWithGoogle,
		signInWithFacebook,
		signInWithTwitter,
		signOut,
	};
}

export default useAuth;
