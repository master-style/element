import 'reflect-metadata';

const DEFAULT_ATTR_OPTION = {
    render: true
};

export interface PropertyOptions {
    render?: boolean;
    parse?: (element: any, value: any, oldValue?: any) => any;
    onUpdate?: (element: any, value: any, oldValue?: any) => void;
    onRender?: (element: any) => any;
    readonly type?: string;
}

export function Prop(options?: PropertyOptions) {
    options = { ...DEFAULT_ATTR_OPTION, ...options };
    return (target, key: string): any => {
        (options as any).type = Reflect.getMetadata('design:type', target, key).name;
        const _key = '_' + key;
        const constructor = target.constructor;
        const parse = options.parse;
        const descriptor = {
            get() {
                return this[_key];
            },
            set(value: any) {
                const oldValue = this[_key];
                if (parse) {
                    value = parse.call(this, value, oldValue);
                }
                if (value === oldValue) return;
                this[_key] = value;
                if (this.initial) {
                    options.onUpdate?.call(this, value, oldValue);
                    if (options.render && this.render) {
                        this.render();
                        options.onRender?.call(this)
                    }
                }
            }
        };

        // 必須 assign，否則會污染到繼承的父元素
        constructor.propsOptions = Object.assign({}, constructor.propsOptions);
        constructor.propsOptions[key] = options;

        return descriptor;
    };
}
