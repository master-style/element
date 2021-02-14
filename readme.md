
<a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</a>

# Master Element
### A lightweight, performant and run-time builder for web components.

&nbsp;

```bash
npm install @master/element @master/template
```

## Usage

```tsx
// my-element.ts

import { Element, MasterElement, Attr, Prop, Event } from '@master/element';
import { Template } from '@master/template';

import css from './my-element.scss';

@Element('my-element')
export class MyElement extends MasterElement {
    static css = css;

    @Attr()
    active: boolean;

    @Prop()
    value: any;

    @Event()
    changeEmitter: EventEmitter;

    // @master/template
    template = new Template(() => [
        'button', {
            class: 'blue'
        }
    ]);

    myFunction() {
        this.changeEmitter.emit('hello world')
    }

    onConnected(): void {};

    onDisconnected(): void {};

    onAttrChanged(attrKey: string, value: any, oldValue: any): void {};

    render(): void {
        this.template.render();
    };
}
```

### `@Element(tagName: string)`
Decorate as custom element

### `@Attr(options?: AttributeOptions)`
Decorate property and attach the behaviors of attribute

```ts
interface AttributeOptions {
    // specify attribute key
    key?: string;
    // whether or not the value of the attribute should be observed
    observe?: boolean;
    // whether or not the value of the attribute should be reflected into the DOM
    reflect?: boolean;
    // whether or not the render() should be called when value updated
    render?: boolean;
    // parse and return value before value updated
    parse?: (element: any, value: any, oldValue?: any) => any;
    // callback after value updated
    onUpdate?: (element: any, value: any, oldValue?: any) => void;
    // callback after value updated and render() called
    onRender?: (element: any) => any;
    readonly propKey?: string;
    readonly set?: Function;
    readonly type?: string;
}
```

### `@Prop(options?: PropertyOptions)`
Decorate property and attach some behaviors

```ts
interface PropertyOptions {
    // whether or not the render() should be called when value updated
    render?: boolean;
    // parse and return value before value updated
    parse?: (element: any, value: any, oldValue?: any) => any;
    // callback after value updated
    onUpdate?: (element: any, value: any, oldValue?: any) => void;
    // callback after value updated and render() called
    onRender?: (element: any) => any;
    readonly type?: string;
}
```

### `@Event(options?: EventOptions)`
Decorate property as custom event

```ts
interface EventOptions {
    // whether or not the event bubbles up through the DOM
    bubbles?: boolean;
    // whether or not the event is cancelable
    cancelable?: boolean;
    // whether or not the event can bubble across the boundary between the shadow DOM and the regular DOM
    composed?: boolean;
    // Event if the value of .emit is set to false, it's enforced to emit
    force?: boolean;
}
```

### `class MasterElement`

```ts
export class MasterElement extends HTMLElement {

    static readonly observedAttributes = [];
    static readonly attrsOptions = {};
    static readonly propsOptions = {};

    // connecting: false (render) -> true (before update)
    readonly initial: boolean = false;
    // connecting: false (render) -> false (before update) -> true (after update)
    readonly ready: boolean = false;

    // your css style
    static css: string;
    // whehter or not shadow dom should be enabled
    static shadow = true;

    // whether or not all of event emitters should be emitted
    emit = false;

    // @master/dom
    on = on;
    off = off;
    attr = attr;
    toggleAttr = toggleAttr;
    css = css;
    addClass = addClass;
    rmClass = rmClass;
    toggleClass = toggleClass;
}
```