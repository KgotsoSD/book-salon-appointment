import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
	const [session, setSession] = useState(null);
	const [status, setStatus] = useState('loading');

	const getSession = useCallback(async () => {
		try {
			const res = await fetch('/api/auth/session', { credentials: 'include' });
			const data = await res.json();
			setSession(data?.user ? { user: data.user, expires: data.expires } : null);
			setStatus(data?.user ? 'authenticated' : 'unauthenticated');
		} catch {
			setSession(null);
			setStatus('unauthenticated');
		}
	}, []);

	useEffect(() => {
		getSession();
	}, [getSession]);

	const value = {
		data: session,
		status,
		refetch: getSession,
	};

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
	const ctx = useContext(SessionContext);
	if (!ctx) {
		return { data: null, status: 'loading' };
	}
	return { data: ctx.data, status: ctx.status };
}
