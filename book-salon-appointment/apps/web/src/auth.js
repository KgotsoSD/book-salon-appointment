/**
 * WARNING: This file connects this app to Create's internal auth system. Do
 * not attempt to edit it. Do not import @auth/create or @auth/create
 * anywhere else or it may break. This is an internal package.
 */
import CreateAuth from '@auth/create';
import Credentials from '@auth/core/providers/credentials';
import Google from '@auth/core/providers/google';

const result = CreateAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
		}),
		...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
			? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
			: []),
	],
	pages: {
		signIn: '/account/signin',
		signOut: '/account/logout',
	},
});
export const { auth } = result;
