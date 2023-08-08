
import { Configuration, FluidDesignSystemCSSInput, FluidDesignSystemConfig, scaleSteps } from './interface.provider';
import { DEFAULT_CONFIG } from './config.provider';

function round(num: number): number {
    return Math.round(num * 100) / 100;
}

function clampBuilder(
    minWidthPx: number,
    maxWidthPx: number,
    minSizePx: number,
    maxSizePx: number
) {
    const pixelsPerRem = 16;

    const minWidth = minWidthPx / pixelsPerRem;
    const maxWidth = maxWidthPx / pixelsPerRem;

    const minSize = minSizePx / pixelsPerRem;
    const maxSize = maxSizePx / pixelsPerRem;

    const slope = (maxSize - minSize) / (maxWidth - minWidth);
    const yAxisIntersection = -minWidth * slope + minSize;

    const min = `${round(minSize)}rem`;
    const val = `${round(yAxisIntersection)}rem + ${round(slope * 100)}vw`;
    const max = `${round(maxSize)}rem`;

    return `clamp(${min}, calc(${val}), ${max})`;
}

function createEffectiveConfig(
    userConfig: Configuration
): FluidDesignSystemConfig {
    return { ...DEFAULT_CONFIG, ...userConfig };
}

function buildFluidDesignSystem(
    opts: FluidDesignSystemConfig
): FluidDesignSystemCSSInput {
    const {
        minViewport,
        maxViewport,
        typeScaleSteps,
        spaceSteps,
        spacePairs,
        customPairs,
    } = opts;

    const system: FluidDesignSystemCSSInput = {
        typeScale: {},
        spaceSteps: {},
        spacePairs: {},
        customPairs: {},
    };

    if (typeScaleSteps.length) {
        const minFluidTypeStep = typeScaleSteps[0];
        const maxFluidTypeStep = typeScaleSteps[typeScaleSteps.length - 1];

        if (minFluidTypeStep && maxFluidTypeStep) {
            for (let i = minFluidTypeStep; i <= maxFluidTypeStep; i++) {
                const valueMin = round(
                    minViewport.fontSize * Math.pow(scaleSteps[minViewport.typeScale], i)
                );
                const valueMax = round(
                    maxViewport.fontSize * Math.pow(scaleSteps[maxViewport.typeScale], i)
                );

                system.typeScale[i] = {
                    min: valueMin,
                    max: valueMax,
                    clamp: clampBuilder(
                        minViewport.width,
                        maxViewport.width,
                        valueMin,
                        valueMax
                    ),
                };
            }
        } else {
            console.error(`For fluid type scales 'typeScaleSteps' must be set `);
        }
    }

    if (system.typeScale[0]) {
        for (const step of Object.keys(spaceSteps)) {
            const stepValue = spaceSteps[step];
            if (!stepValue) {
                continue;
            }
            const valueMin = round(system.typeScale[0].min * stepValue);
            const valueMax = round(system.typeScale[0].max * stepValue);
            system.spaceSteps[step] = {
                min: valueMin,
                max: valueMax,
                clamp: clampBuilder(
                    minViewport.width,
                    maxViewport.width,
                    valueMin,
                    valueMax
                ),
            };
        }
    }

    for (const [min, max] of Object.entries(spacePairs)) {
        const minSpaceStep = system.spaceSteps[min];
        const maxSpaceStep = system.spaceSteps[max];
        if (!minSpaceStep || !maxSpaceStep) {
            throw new Error(
                `space steps isn't available for spacePair: ${min}, ${max}`
            );
        }
        const valueMin = minSpaceStep.min;
        const valueMax = maxSpaceStep.max;
        system.spacePairs[`${min}${max}`] = {
            min: valueMin,
            max: valueMax,
            clamp: clampBuilder(
                minViewport.width,
                maxViewport.width,
                valueMin,
                valueMax
            ),
        };
    }

    for (const [min, max] of Object.entries(customPairs)) {
        const minSpaceStep = system.spaceSteps[min];
        const maxSpaceStep = system.spaceSteps[max];
        if (!minSpaceStep || !maxSpaceStep) {
            throw new Error(
                `space steps isn't available for customPair: ${min}, ${max}`
            );
        }
        const valueMin = minSpaceStep.min;
        const valueMax = maxSpaceStep.max;
        system.customPairs[`${min}${max}`] = {
            min: valueMin,
            max: valueMax,
            clamp: clampBuilder(
                minViewport.width,
                maxViewport.width,
                valueMin,
                valueMax
            ),
        };
    }

    return system;
}

export function generateCSS(
    config: Configuration,
    injectSelector = 'html'
) {
    const system = buildFluidDesignSystem(createEffectiveConfig(config));

    let css = '';

    const { typeScale, spaceSteps, spacePairs, customPairs } = system;

    for (const [step, { clamp }] of Object.entries(typeScale)) {
        css += `--step-${step}: ${clamp};`;
    }

    for (const [step, { clamp }] of Object.entries(spaceSteps)) {
        css += `--space${step.toLowerCase()}: ${clamp};`;
    }

    for (const [step, { clamp }] of Object.entries(spacePairs)) {
        css += `--space${step.toLowerCase()}: ${clamp};`;
    }

    for (const [step, { clamp }] of Object.entries(customPairs)) {
        css += `--space${step.toLowerCase()}: ${clamp};`;
    }

    return `
      :where(${injectSelector}) {
        ${css}
      }
    `;
}