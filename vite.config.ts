import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { plugin } from '@frontline-hq/tdc/plugin';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { imagetools } from 'vite-imagetools';
import { paraglide } from "@inlang/paraglide-js-adapter-sveltekit/vite"

export default defineConfig({
	plugins: [paraglide({
		project: "./project.inlang",
		outdir: "./src/lib/paraglide",
	}), enhancedImages(), imagetools(), await plugin(), sveltekit()]
});
