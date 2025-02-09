import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import biomePlugin from 'vite-plugin-biome'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), biomePlugin()],
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:3000',
			},
		},
	},
})
