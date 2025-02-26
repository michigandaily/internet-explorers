import { defineConfig } from 'sink';

export default defineConfig({
	deployment: {
		region: 'us-east-2',
		bucket: 'specials.michigandaily.com',
		key: 'bside/2025/internet-explorers',
		build: './dist',
		profile: 'sink'
	}
});
