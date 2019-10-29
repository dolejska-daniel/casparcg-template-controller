# CasparCG HTML Template Controller
> v0.1.0


## Introduction
This library provides element animation processing and planning and variable element management.

Target elements are identified by special classes.
Template controller then loads predefined animation settings from selected elements' attributes.
Variable elements can select number of update modules which cause different behaviour on update.


## Installation
Download project and install dependencies:
```shell
git clone git@kaidou-ren.srv.dolejska.me:casparcg/template-controller.git
npm install
```

### Simple build
Compiles sources to `build/build.js`.
```shell
npm run build
```

### Minimalistic builds
Compiles sources to `build/build.js` and also minimizes generated output to `build/build.min.js`.
```shell
npm run build-all
```
or
```shell
npm run build-all-min
```


## Usage

### Animations
Animated elements are required to have `js-animate` class and unique `id` defined.
Animations are then parsed from `data-animations` element tag attributes.
Value of this attribute is JSON compliant with `schemas/animations.json` schema specification.

#### Single stage animations
_TBD_

#### Multiple stage animations
_TBD_

#### Depending animations
_TBD_

### Variability
Variable elements are required to have `js-update` class and unique `id` defined.
Update module is specified by `data-module` element attribute.
Any module specific arguments can be passed by `data-module-args` element attribute.

#### ReplaceContents module
_TBD_
