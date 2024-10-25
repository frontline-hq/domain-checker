import type { Config } from 'tailwindcss';
import { getPreset } from '@frontline-hq/uui';
import { getDynamicSafelist } from '@frontline-hq/tdc/tailwind';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

export default {
	content: ['./src/**/*.{html,js,svelte,ts,json}', '!**/*.tdc.ts', './messages/*.json'],
	theme: {
		extend: {
			fontFamily: {
				'super-large': 'Inter Variable',
				'uui-text-xl': 'IBM Plex Mono',
				'uui-text-lg': 'IBM Plex Mono',
				'uui-text-md': 'IBM Plex Mono',
				'uui-text-sm': 'IBM Plex Mono',
				'uui-text-xs': 'IBM Plex Mono'
			}
		}
	},
	corePlugins: {
		aspectRatio: false
	},
	safelist: [...getDynamicSafelist()],
	presets: [
		getPreset({
			foundations: {
				color: {
					colorModes: {
						root: {
							darkModes: {
								'fg-primary-900': 'var(--color-uui-white)',
								'fg-secondary-700': 'var(--color-uui-gray-dark-mode-300)',
								/* text */
								'text-primary-900': 'var(--color-uui-gray-dark-mode-25)',
								'text-primary_on-brand': 'var(--color-uui-gray-dark-mode-50)',
								'text-secondary-700': 'var(--color-uui-gray-dark-mode-50)',
								'text-secondary_hover': 'var(--color-uui-gray-dark-mode-100)',
								'text-secondary_on-brand': 'var(--color-uui-gray-dark-mode-100)',
								'text-tertiary-600': 'var(--color-uui-gray-dark-mode-200)',
								'text-tertiary_hover': 'var(--color-uui-gray-dark-mode-300)',
								'text-tertiary_on-brand': 'var(--color-uui-gray-dark-mode-400)',
								/* buttons primary */
								'button-primary-fg': 'var(--color-uui-black)',
								'button-primary-fg_hover': 'var(--color-uui-black)',
								'button-primary-bg': 'var(--color-uui-white)',
								'button-primary-bg_hover': 'var(--color-uui-brand-50)',
								'button-primary-border': 'var(--color-uui-white)',
								'button-primary-border_hover': 'var(--color-uui-white)'
							}
							/* TODO add and fix light modes */
						}
					},
					colors: {
						'Gray light mode': {
							25: '#FCFCFC',
							50: '#FAFAFA',
							100: '#EBEBEB',
							200: '#D2D2D2',
							300: '#B6B6B6',
							400: '#9A9A9A',
							500: '#7E7E7E',
							600: '#626262',
							700: '#464646',
							800: '#2A2A2A',
							900: '#0E0E0E',
							950: '#000000'
						},
						'Gray dark mode': {
							25: '#FCFCFC',
							50: '#FAFAFA',
							100: '#EBEBEB',
							200: '#D2D2D2',
							300: '#B6B6B6',
							400: '#9A9A9A',
							500: '#7E7E7E',
							600: '#626262',
							700: '#464646',
							800: '#2A2A2A',
							900: '#0E0E0E',
							950: '#000000'
						},
						Brand: {
							25: '#FCFCFC',
							50: '#FAFAFA',
							100: '#EBEBEB',
							200: '#D2D2D2',
							300: '#B6B6B6',
							400: '#9A9A9A',
							500: '#7E7E7E',
							600: '#626262',
							700: '#464646',
							800: '#2A2A2A',
							900: '#0E0E0E',
							950: '#000000'
						}
					}
				}
			}
		})
	],
	plugins: [aspectRatioPlugin]
} as Config;
