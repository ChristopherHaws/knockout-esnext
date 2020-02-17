import {unwrapObservable, setTextContent} from '../../utils';
import {bindingHandlers} from '../bindingHandlers';
import {allowedVirtualElementBindings} from '../../virtualElements';

bindingHandlers.text = {
    init() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return {controlsDescendantBindings: true};
    },
    update(element, valueAccessor) {
        
        if (element.nodeType === 1) {
            let text = unwrapObservable(valueAccessor());
            // We have an element node and 'controlsDescendantBindings' is true, so there is no point in 
            // wasting cycles trying to cleanup any child nodes, because whatever there is, it wasn't generated by knockout.  
            // (see thrown error "trying to control descendant bindings of the same element" in 'bindingAttributeSyntax.js')
            element.textContent = (text === undefined || text === null) ? '' : text;
            return;
        }
        
        setTextContent(element, valueAccessor());
    }
};

allowedVirtualElementBindings.text = true;
