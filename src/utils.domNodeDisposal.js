import {nextDomDataKey,
        getCurriedDomDataArrayInvokeEachAndClearDomDataFunctionForArrayDomDataKey,
        getCurriedDomDataArrayItemAddFunctionForArrayDomDataKey,
        getCurriedDomDataArrayItemRemovalFunctionForArrayDomDataKey} from './utils.domData';
import {ignoreDependencyDetection} from './subscribables/dependencyDetection';

const DISPOSE_CALLBACKS_DOM_DATA_KEY = nextDomDataKey();
const CLEANABLE_NODE_TYPES = {1: true, 8: true, 9: true};                   // Element, Comment, Document
const CLEANABLE_NODE_TYPES_WITH_DESCENDENTS = {1: true, 8: false, 9: true}; // Element, Comment(not), Document


/** @type {function} */
export let _cleanExternalData = null;
export const _overrideCleanExternalData = (fn) => _cleanExternalData = fn;

const _runDisposalCallbacksAndClearDomData = getCurriedDomDataArrayInvokeEachAndClearDomDataFunctionForArrayDomDataKey(DISPOSE_CALLBACKS_DOM_DATA_KEY);

const _cleanSingleNode = (node) => {
    // Run all the dispose callbacks & ease the DOM data
    _runDisposalCallbacksAndClearDomData(node);

    // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
    if (_cleanExternalData) {
        _cleanExternalData(node);
    }
    
    // Clear any immediate-child comment nodes, as these wouldn't have been found by
    // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
    if (CLEANABLE_NODE_TYPES_WITH_DESCENDENTS[node.nodeType]) {
        let cleanableNodesList = node.childNodes;
        if (cleanableNodesList.length) {
            _cleanNodesInList(cleanableNodesList, true /*onlyComments*/);
        }
    }
};

/**
 * @param {HTMLCollection|NodeList} nodeList
 * @param {boolean} [onlyComments]
 * @private
 */
const _cleanNodesInList = (nodeList, onlyComments) => {
    let cleanedNodes = [],
        cleanedNodesIndex = -1,    
        lastCleanedNode;
    
    for (let i = 0, node; i < nodeList.length; i++) {
        node = nodeList[i]; 
        if (!onlyComments || node.nodeType === 8) {
            _cleanSingleNode(cleanedNodes[++cleanedNodesIndex] = lastCleanedNode = node);
            if (nodeList[i] !== lastCleanedNode) {
                while (i-- && !cleanedNodes.includes(nodeList[i])) {
                    // just do
                }
            }
        }
    }
};

/** @type {function(Node, Function): void} */
export const addDisposeCallback = getCurriedDomDataArrayItemAddFunctionForArrayDomDataKey(DISPOSE_CALLBACKS_DOM_DATA_KEY);

/** @type {function(Node, Function): void} */
export const removeDisposeCallback = getCurriedDomDataArrayItemRemovalFunctionForArrayDomDataKey(DISPOSE_CALLBACKS_DOM_DATA_KEY); 

export const cleanNode = (node) => {
    if (CLEANABLE_NODE_TYPES[node.nodeType]) {
        ignoreDependencyDetection(() => {
            // First clean this node, where applicable
            _cleanSingleNode(node);
            // ... then its descendants, where applicable
            if (CLEANABLE_NODE_TYPES_WITH_DESCENDENTS[node.nodeType]) {
                let cleanableNodesList = node.getElementsByTagName('*');
                if (cleanableNodesList.length) {
                    _cleanNodesInList(cleanableNodesList);
                }
            }
        });
    }
    return node;
};

export const removeNode = (node) => cleanNode(node).remove();
