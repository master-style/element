import { Element, MasterElement } from '../../../src';

@Element('test-element')
export class TestElement extends MasterElement {
    onConnected() {
        this.shadowRoot.innerHTML = 'test'
    }
}