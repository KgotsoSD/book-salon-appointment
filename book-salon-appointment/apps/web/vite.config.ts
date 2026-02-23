import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import netlifyPlugin from '@netlify/vite-plugin-react-router';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	plugins: [reactRouter(), tsconfigPaths(), netlifyPlugin()],
	resolve: {
		alias: {
			'virtual:load-fonts.jsx': resolve(__dirname, 'src/app/load-fonts-stub.jsx'),
		},
	},
});
