import { Manipulation, type LibraryConfig } from '@frontline-hq/tdc';
import {
	default as config,
	buttonButtonWrapper,
	buttonButtonWrapperA
} from '@frontline-hq/uui/tdc';

export default {
	...config,
	manipulations: [
		new Manipulation(buttonButtonWrapper, {
			styles: (s) => {
				return { coloring: '[&&]:rounded-full' };
			}
		}),
		new Manipulation(buttonButtonWrapperA, {
			styles: (s) => {
				return { coloring: '[&&]:rounded-full' };
			}
		})
	]
} as LibraryConfig;
