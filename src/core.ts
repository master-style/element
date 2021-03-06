import { on, off, attr, toggleAttr, css, addClass, rmClass, toggleClass } from '@master/dom';
import { AttributeOptions } from './attr';

const readyEvent = new CustomEvent('ready');

export function Element(tagName: string) {
    return function (constructor: any) {
        constructor['elementName'] = tagName.replace('m-', '');
        window.customElements.define(tagName, constructor);
    };
}

export interface MasterElement {
    onConnected(): void;
    onDisconnected(): void;
    onAttrChanged(attrKey: string, value: any, oldValue: any): void;
    render(): void;
}

export class MasterElement extends HTMLElement {

    readonly ready: boolean = false;
    readonly initial: boolean = false;

    static readonly observedAttributes = [];
    static readonly attrsOptions = {};
    static readonly propsOptions = {};

    static css: string;
    static shadow = true;

    emit = false;

    on = on;
    off = off;
    attr = attr;
    toggleAttr = toggleAttr;
    css = css;
    addClass = addClass;
    rmClass = rmClass;
    toggleClass = toggleClass;

    connectedCallback() {
        const attrsOptions = this.constructor['attrsOptions'];
        const propsOptions = this.constructor['propsOptions'];
        const css = this.constructor['css'];

        if (propsOptions) {
            for (const eachPropKey in propsOptions) {
                const eachPropOption: AttributeOptions = propsOptions[eachPropKey];
                const eachPropValue = this['_' + eachPropKey];
                eachPropOption.onUpdate?.call(this, this, eachPropValue);
            }
        }
        if (attrsOptions) {
            // 取得當前 attr 與 prop 比對，避免重複設置相同 attr
            const attributes = this.attributes;
            for (const eachAttrKey in attrsOptions) {
                const eachAttrOptions: AttributeOptions = attrsOptions[eachAttrKey];
                const eachpropKey = eachAttrOptions.propKey;
                const eachPropValue = this['_' + eachpropKey];
                const eachAttr = attributes[eachAttrKey];
                if (eachPropValue === undefined) continue;
                let value: any;
                let eachAttrValue: any;
                if (eachAttr) {
                    eachAttrValue = parseAttrValue(eachAttr.value, eachAttrOptions.type);
                }
                if (eachAttrValue === eachPropValue) {
                    continue;
                } else if (eachAttrValue !== undefined) {
                    value = eachAttrValue;
                } else if (eachPropValue !== undefined) {
                    value = eachPropValue;
                } else {
                    continue;
                }

                if (eachAttrOptions.reflect) {
                    if (eachAttrOptions.type === 'Boolean') {
                        this.toggleAttribute(eachAttrKey, value);
                    } else {
                        this.setAttribute(eachAttrKey, value);
                    }
                }
            }
        }
        if (this.constructor['shadow'] && !this.shadowRoot) {
            // https://www.npmjs.com/package/construct-style-sheets-polyfill
            const shadowRoot = this.attachShadow({ mode: 'open' });
            if (css && shadowRoot['adoptedStyleSheets']) {
                const styleSheet = new CSSStyleSheet();
                styleSheet['replaceSync'](css);
                shadowRoot['adoptedStyleSheets'] = [styleSheet];
            } else if (css) {
                const styleElement = document.createElement('style');
                styleElement.innerHTML = css;
                shadowRoot.appendChild(styleElement);
            }
        }

        this.render?.();

        (this as any).initial = true;

        if (attrsOptions) {
            for (const eachAttrKey in attrsOptions) {
                const eachAttrOptions: AttributeOptions = attrsOptions[eachAttrKey];
                const eachPropKey = eachAttrOptions.propKey;
                const eachPropValue = this['_' + eachPropKey];
                eachAttrOptions.onUpdate?.call(this, this, eachPropValue);
            }
        }

        (this as any).ready = true;
        this.emit && this.dispatchEvent(readyEvent);
        this.onConnected?.();
    };

    attributeChangedCallback(attrKey, oldValue, value) {
        if (value === oldValue) return;
        const eachAttrOptions = this.constructor['attrsOptions'][attrKey];
        const type = eachAttrOptions?.type;
        value = parseAttrValue(value, type);
        oldValue = parseAttrValue(oldValue, type);
        eachAttrOptions.set.call(this, value, true);
        this.onAttrChanged?.(attrKey, value, oldValue);
    };

    disconnectedCallback() {
        Object.defineProperty(this, 'ready', {
            value: false
        })
        Object.defineProperty(this, 'initial', {
            value: false
        })
        this.onDisconnected?.();
    };

}

const parseAttrValue = (value: any, type: string) => {
    if (value === 'undefined')
        return undefined;
    switch (type) {
        case 'Number':
            if (value === '' || value === null) return null;
            return isNaN(+value) ? value : +value;
        case 'Boolean':
            return (value === '' || value) ? true : false;
        default:
            return value;
    }
};
