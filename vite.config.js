import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glslify from 'rollup-plugin-glslify';
import path from 'path'

export default defineConfig({
	plugins: [
		vue(),
		glslify(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "/src"),
		},
	},
	
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@/assets/scss/main.scss";`
			},
		},
	},
});
