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
Value of this attribute is JSON, compliant with `schemas/animations.json` schema specification.

#### Single stage animations
**Element A** `data-animations=`
```json
[
  {
    "id": 1,
    "animations": [
      {
        "classes": [...]
      },
      {
        "classes": [...]
      },
    ]
  }
]
```

This configuration defines two animations.
These will be played in their specified order - consecutively.

Animations will begin playing immediately after `play()` is invoked (CG PLAY command).

#### Multiple stage animations
**Element A** `data-animations=`
```json
[
  {
    "id": 1,
    "animations": [
      {
        "classes": [...]
      },
      {
        "classes": [...]
      },
    ]
  },
  {
    "id": 2,
    "animations": [
      {
        "classes": [...]
      },
      {
        "classes": [...]
      },
    ]
  },
]
```

This configuration defines four animations in two separate stages.
Animations in each stage will be played in their specified order - consecutively.

First animation stage will begin playing immediately after `play()` is invoked (CG PLAY command).
Second animation stage will only begin playing after `next()` is invoked (CG NEXT command).

#### Depending animations
Animations may depend on each other - after some animation is played and finishes, any dependent animations are played.
This behaviour is specified by animation's `after` property.

**Element A** `data-animations=`
```json
[
  {
    "id": 1,
    "animations": [
      {
        "id": "first",
        "classes": [...]
      }
    ]
  }
]
```

**Element B** `data-animations=`
```json
[
  {
    "id": 1,
    "animations": [
      {
        "id": "second",
        "after": "first",
        "classes": [...]
      }
    ]
  }
]
```

This configuration defines one animation on each two different elements.
Animation `second` will be played after animation `first` due to specified dependency `after: first`.

Animations will begin playing immediately after `play()` is invoked (CG PLAY command).

#### Update depending animations
Animations may also depend on element updates (due to `update()` - CG UPDATE commands).
This behaviour is also specified by animation's `after` property, but value being prefixed by `$`.

**Element A**
```html
<span class="js-update" id="element_id" data-module="ExampleModule" data-module-args='["Module", "arguments"]'></span>
```

**Element B** `data-animations=`
```json
[
  {
    "id": 0,
    "animations": [
      {
        "after": "$element_id",
        "classes": [...]
      }
    ]
  }
]
```

This configuration defines single animation on `Element B`.
This animation depends on update event of element with id `element_id` (symbol `$` marks update dependency).
Immediately after `ExampleModule` module finishes element update, this animation will be triggered and played.

### Variability
Variable elements are required to have `js-update` class and unique `id` defined.
Update module is specified by `data-module` element attribute.
Any module specific arguments can be passed by `data-module-args` element attribute.

#### Modules overview
_TBD_

##### ReplaceContents module
_TBD_


## Behaviour details
_TBD_

### Animations
1. When no animation `id` is specified, random string prefixed by `_` with total length of 6 characters is generated.
2. If no dependency is defined (`after` property):<br>
   a. animation is also first in current stage for given element: that animation is immediately played.<br>
   b. animation is **not** first in current stage for given element: that animation is added as a dependent to any previous animation.
3. If there is dependency defined: that animation is added as a dependent to either specified element's update event or animation.

#### Stage
_TBD_

#### Animation
_TBD_