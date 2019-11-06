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

Animations will begin playing immediately after `play()` is invoked (`CG PLAY` command).

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

First animation stage will begin playing immediately after `play()` is invoked (`CG PLAY` command).
Second animation stage will only begin playing after `next()` is invoked (`CG NEXT` command).

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

Animations will begin playing immediately after `play()` is invoked (`CG PLAY` command).

#### Update depending animations
Animations may also depend on element updates (due to `update()` - `CG UPDATE` commands).
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
Contents of the template may be dynamically changed by invoking `update()` function.
This function is invoked by CasparCG on `CG UPDATE` command.

Variable elements are required to have `js-update` class and unique `id` defined.
Update module is specified by `data-module` element attribute.
Only one module may be used per element.
Any module-specific arguments can be passed by `data-module-args` element attribute.

#### Modules overview
Update modules define specific behaviour that will be applied during an element update.

#### ChangeAttribute module
This module allows input data to be used to change element's attributes.
Module arguments can be used to format input data before setting the value of the argument - see example below.

| `data-module`     | `data-module-args`  |
|-------------------|---------------------|
| `ReplaceContents` | `AttributeTemplate` |

**Attribute Template**
```json
{
  "attibute-name-1": "value_format_string",
  "attibute-name-2": "value_format_string",
  "attibute-name-3": "value_format_string"
}
```

Module argument is object.
Its keys are names of element's attributes and values are input format strings.
Format strings should then contain `{}` symbols, which represent variable from input data.

Attribute value (in update command data) may either be of type string or array of strings.
Simple string type is only allowed when value format string has not been specified in template for given attribute.
Array of strings is then used to replace `{}` symbols in their provided order.

**Example template definition**
```html
<img class="js-update" id="image" data-module="ChangeAttribute"
     data-module-args='{ "src": "path/to/{}/{}.png" }'>
```
**Example update command data**
```json
{
  "image": {
    "src": [ "dir", "image_name" ],
    "alt": "description"
  }
}
```
**Example result**
```html
<img src="path/to/image/dir/image_name.png" alt="description"
     class="js-update" id="image" data-module="ChangeAttribute"
     data-module-args='{ "src": "path/to/{}/{}.png" }'>
```

#### Countdown module
_TBD_

| `data-module` | `data-module-args` |
|---------------|--------------------|
| `Countdown`   | _None_             |

#### InsertElement module
This module uses predefined HTML element as a "input formatting" template.
For each `update()` invocation (`CG UPDATE` command), new element is created from pre-defined template.
Variable elements defined within template are filled with provided data and element is then added to the document.

| `data-module`   | `data-module-args` |
|-----------------|--------------------|
| `InsertElement` | _None_             |

Elements using this module (`data-module="InsertElement"`) are required to have unique `id` defined.

Template element must always be defined.
This element has `js-insert-template` class and is nested in updatable element.

Template variable elements are optional.
These elements have `js-insert-var` class, are nested in template element and are also required to have unique `id` defined.
Their `id` must have prefix consisting of updatable element's `id`.

**Example template definition**
```html
<div class="js-update" id="insert" data-module="InsertElement">
    <div class="js-insert-template">
        <span class="js-insert-var" id="insert-var1"></span>
        <span class="js-insert-var" id="insert-var2"></span>
    </div>
</div>
```
**Example update command data**
```json
{
  "insert": {
    "var1": "Secret value is: ",
    "var2": 123
  }
}
```
**Example result**
```html
<div class="js-update" id="insert" data-module="InsertElement">
    <div class="js-insert-template">
        <span class="js-insert-var" id="insert-var1-{id}">Secret value is: </span>
        <span class="js-insert-var" id="insert-var2-{id}">123</span>
    </div>
</div>
```

Element template can also define and use animations without dependencies (`after=XXX` is not allowed):

```html
<div class="js-update" id="insert" data-module="InsertElement">
    <div class="js-insert-template js-animate" id="insert-template"
         data-animations='[
             {"id": 1, "animations": [
                 { "classes": ["fadeInRight"] }
             ]}
         ]'>
        <span class="js-insert-var" id="insert-content"></span>
    </div>
</div>
```

#### ReplaceContents module
This is the most simple update module - it completely replaces whole content of given element with newly provided data.

| `data-module`     | `data-module-args` |
|-------------------|--------------------|
| `ReplaceContents` | _None_             |

**Example template definition**
```html
<div class="js-update" id="replace" data-module="ReplaceContents">Old content.</div>
```
**Example update command data**
```json
{
  "replace": "New content."
}
```
**Example result**
```html
<div class="js-update" id="replace" data-module="ReplaceContents">New content.</div>
```


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