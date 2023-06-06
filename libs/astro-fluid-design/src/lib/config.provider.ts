import { FluidDesignSystemConfig } from "./interface.provider";

export const DEFAULT_CONFIG: FluidDesignSystemConfig = {
    minViewport: {
        width: 320,
        fontSize: 18,
        typeScale: 'minor-third',
    },
    maxViewport: {
        width: 1240,
        fontSize: 20,
        typeScale: 'major-third',
    },
    typeScaleSteps: [-5, 5],
    spaceSteps: {
        '-3XS': 0.25,
        '-2XS': 0.5,
        '-XS': 0.75,
        '-S': 1,
        '-M': 1.5,
        '-L': 2,
        '-XL': 3,
        '-2XL': 4,
        '-3XL': 6,
        '-4XL': 8,
    },
    spacePairs: {
        '-3XS': '-2XS',
        '-2XS': '-XS',
        '-XS': '-S',
        '-S': '-M',
        '-M': '-L',
        '-L': '-XL',
        '-XL': '-2XL',
        '-2XL': '-3XL',
    },
    customPairs: {},
};
