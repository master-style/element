import { Attr, Element, MasterElement } from '../../../src';

@Element('test-element')
export class TestElement extends MasterElement {

    onConnected() {
        this.shadowRoot.innerHTML = 'test'
    }

    @Attr()
    prop1: string;

    @Attr()
    prop2: string;
}