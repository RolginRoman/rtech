# Astro Fluid Design

[![npm](https://img.shields.io/npm/v/%40rtech-public/astro-fluid-design?style=flat-square&logo=npm&color=%236ef34d)](https://www.npmjs.com/package/@rtech-public/astro-fluid-design)

<img src="https://raw.githubusercontent.com/RolginRoman/rtech/main/assets/astrologo.svg" width="44" height="44" />

Integration project that enables using [Utopia](https://utopia.fyi/) fluid design system

Easy use:

```html
<head>
  <AstroFluidDesign />
</head>
```

It this case only default config will be applied according to [type face configuration](https://utopia.fyi/type/calculator?c=320,18,1.2,1240,20,1.25,5,2,&s=0.75%7C0.5%7C0.25,1.5%7C2%7C3%7C4%7C6,s-l&g=s,l,xl,12)

## Custom configuration for the fluid typeface and spacing

```ts
---
const fluidConfig = {
  minViewport: {
    width: 320,
    fontSize: 34,
    typeScale: 'minor-third'
  },
  maxViewport: {
    width: 1400,
    fontSize: 52,
    typeScale: 'major-third',
  }
};
---
<head>
  <AstroFluidDesign config="{fluidConfig}" />
</head>
```
