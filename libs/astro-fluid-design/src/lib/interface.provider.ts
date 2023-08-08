export const scaleSteps = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.2,
  'major-third': 1.25,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.5,
  'golden-ratio': 1.618,
  'major-sixth': 1.667,
  'minor-seventh': 1.778,
  'major-seventh': 1.875,
  octave: 2,
} as const;

export type TypeScaleNames = keyof typeof scaleSteps;

export type FluidDesignSystemConfig = {
  minViewport: {
    width: number;
    fontSize: number;
    typeScale: TypeScaleNames;
  };
  maxViewport: {
    width: number;
    fontSize: number;
    typeScale: TypeScaleNames;
  };
  typeScaleSteps: [number, number];
  spaceSteps: Record<string, number>;
  spacePairs: Record<string, string>;
  customPairs: Record<string, string>;
};

export type ClampedValue = { clamp: string; min: number; max: number };

export type FluidDesignSystemCSSInput = {
  typeScale: { [stepName: number]: ClampedValue };
  spaceSteps: { [stepName: string]: ClampedValue };
  spacePairs: { [stepName: string]: ClampedValue };
  customPairs: { [stepName: string]: ClampedValue };
};

export type ConfigurationSize = {
  width: number;
  fontSize: number;
  typeScale: TypeScaleNames;
};

export type Configuration = Partial<FluidDesignSystemConfig> & Pick<FluidDesignSystemConfig, 'minViewport' | 'maxViewport'>;