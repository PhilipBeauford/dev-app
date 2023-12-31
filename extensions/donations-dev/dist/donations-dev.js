(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/@remote-ui/core/build/esm/component.mjs
  function createRemoteComponent(componentType) {
    return componentType;
  }

  // node_modules/@remote-ui/core/build/esm/types.mjs
  var ACTION_MOUNT = 0;
  var ACTION_INSERT_CHILD = 1;
  var ACTION_REMOVE_CHILD = 2;
  var ACTION_UPDATE_TEXT = 3;
  var ACTION_UPDATE_PROPS = 4;
  var KIND_ROOT = 0;
  var KIND_COMPONENT = 1;
  var KIND_TEXT = 2;
  var KIND_FRAGMENT = 3;

  // node_modules/@remote-ui/core/build/esm/utilities.mjs
  function isRemoteFragment(object) {
    return object != null && object.kind === KIND_FRAGMENT;
  }

  // node_modules/@remote-ui/core/build/esm/root.mjs
  var FUNCTION_CURRENT_IMPLEMENTATION_KEY = "__current";
  var EMPTY_OBJECT = {};
  var EMPTY_ARRAY = [];
  function createRemoteRoot(channel, {
    strict = true,
    components
  } = {}) {
    let currentId = 0;
    const rootInternals = {
      strict,
      mounted: false,
      channel,
      children: EMPTY_ARRAY,
      nodes: /* @__PURE__ */ new WeakSet(),
      parents: /* @__PURE__ */ new WeakMap(),
      tops: /* @__PURE__ */ new WeakMap(),
      components: /* @__PURE__ */ new WeakMap(),
      fragments: /* @__PURE__ */ new WeakMap()
    };
    if (strict)
      Object.freeze(components);
    const remoteRoot = {
      kind: KIND_ROOT,
      options: strict ? Object.freeze({
        strict,
        components
      }) : {
        strict,
        components
      },
      get children() {
        return rootInternals.children;
      },
      createComponent(type, ...rest) {
        if (components && components.indexOf(type) < 0) {
          throw new Error(`Unsupported component: ${type}`);
        }
        const [initialProps, initialChildren, ...moreChildren] = rest;
        const normalizedInitialProps = initialProps !== null && initialProps !== void 0 ? initialProps : {};
        const normalizedInitialChildren = [];
        const normalizedInternalProps = {};
        if (initialProps) {
          for (const key of Object.keys(initialProps)) {
            if (key === "children")
              continue;
            normalizedInternalProps[key] = makeValueHotSwappable(serializeProp(initialProps[key]));
          }
        }
        if (initialChildren) {
          if (Array.isArray(initialChildren)) {
            for (const child of initialChildren) {
              normalizedInitialChildren.push(normalizeChild(child, remoteRoot));
            }
          } else {
            normalizedInitialChildren.push(normalizeChild(initialChildren, remoteRoot));
            for (const child of moreChildren) {
              normalizedInitialChildren.push(normalizeChild(child, remoteRoot));
            }
          }
        }
        const id = `${currentId++}`;
        const internals = {
          externalProps: strict ? Object.freeze(normalizedInitialProps) : normalizedInitialProps,
          internalProps: normalizedInternalProps,
          children: strict ? Object.freeze(normalizedInitialChildren) : normalizedInitialChildren
        };
        const component = __spreadValues({
          kind: KIND_COMPONENT,
          get children() {
            return internals.children;
          },
          get props() {
            return internals.externalProps;
          },
          get remoteProps() {
            return internals.internalProps;
          },
          updateProps: (newProps) => updateProps(component, newProps, internals, rootInternals),
          appendChild: (child) => appendChild(component, normalizeChild(child, remoteRoot), internals, rootInternals),
          removeChild: (child) => removeChild(component, child, internals, rootInternals),
          insertChildBefore: (child, before) => insertChildBefore(component, normalizeChild(child, remoteRoot), before, internals, rootInternals)
        }, EMPTY_OBJECT);
        rootInternals.components.set(component, internals);
        Object.defineProperty(component, "type", {
          value: type,
          configurable: false,
          writable: false,
          enumerable: true
        });
        makePartOfTree(component, rootInternals);
        makeRemote(component, id, remoteRoot);
        for (const child of internals.children) {
          moveNodeToContainer(component, child, rootInternals);
        }
        return component;
      },
      createText(content = "") {
        const id = `${currentId++}`;
        const internals = {
          text: content
        };
        const text = __spreadValues({
          kind: KIND_TEXT,
          get text() {
            return internals.text;
          },
          updateText: (newText) => updateText(text, newText, internals, rootInternals)
        }, EMPTY_OBJECT);
        makePartOfTree(text, rootInternals);
        makeRemote(text, id, remoteRoot);
        return text;
      },
      createFragment() {
        const id = `${currentId++}`;
        const internals = {
          children: strict ? Object.freeze([]) : []
        };
        const fragment = __spreadValues({
          kind: KIND_FRAGMENT,
          get children() {
            return internals.children;
          },
          appendChild: (child) => appendChild(fragment, normalizeChild(child, remoteRoot), internals, rootInternals),
          removeChild: (child) => removeChild(fragment, child, internals, rootInternals),
          insertChildBefore: (child, before) => insertChildBefore(fragment, normalizeChild(child, remoteRoot), before, internals, rootInternals)
        }, EMPTY_OBJECT);
        rootInternals.fragments.set(fragment, internals);
        makePartOfTree(fragment, rootInternals);
        makeRemote(fragment, id, remoteRoot);
        return fragment;
      },
      appendChild: (child) => appendChild(remoteRoot, normalizeChild(child, remoteRoot), rootInternals, rootInternals),
      removeChild: (child) => removeChild(remoteRoot, child, rootInternals, rootInternals),
      insertChildBefore: (child, before) => insertChildBefore(remoteRoot, normalizeChild(child, remoteRoot), before, rootInternals, rootInternals),
      mount() {
        if (rootInternals.mounted)
          return Promise.resolve();
        rootInternals.mounted = true;
        return Promise.resolve(channel(ACTION_MOUNT, rootInternals.children.map(serializeChild)));
      }
    };
    return remoteRoot;
  }
  function connected(element, {
    tops
  }) {
    var _tops$get;
    return ((_tops$get = tops.get(element)) === null || _tops$get === void 0 ? void 0 : _tops$get.kind) === KIND_ROOT;
  }
  function allDescendants(element, withEach) {
    const recurse = (element2) => {
      if ("children" in element2) {
        for (const child of element2.children) {
          withEach(child);
          recurse(child);
        }
      }
    };
    recurse(element);
  }
  function perform(element, rootInternals, {
    remote,
    local
  }) {
    const {
      mounted,
      channel
    } = rootInternals;
    if (mounted && (element.kind === KIND_ROOT || connected(element, rootInternals))) {
      remote(channel);
    }
    local();
  }
  function updateText(text, newText, internals, rootInternals) {
    return perform(text, rootInternals, {
      remote: (channel) => channel(ACTION_UPDATE_TEXT, text.id, newText),
      local: () => {
        internals.text = newText;
      }
    });
  }
  var IGNORE = Symbol("ignore");
  function updateProps(component, newProps, internals, rootInternals) {
    const {
      strict
    } = rootInternals;
    const {
      internalProps: currentProps,
      externalProps: currentExternalProps
    } = internals;
    const normalizedNewProps = {};
    const hotSwapFunctions = [];
    let hasRemoteChange = false;
    for (const key of Object.keys(newProps)) {
      if (key === "children")
        continue;
      const currentExternalValue = currentExternalProps[key];
      const newExternalValue = newProps[key];
      const currentValue = currentProps[key];
      const newValue = serializeProp(newExternalValue);
      if (currentValue === newValue && (newValue == null || typeof newValue !== "object")) {
        continue;
      }
      const [value, hotSwaps] = tryHotSwappingValues(currentValue, newValue);
      if (hotSwaps) {
        hotSwapFunctions.push(...hotSwaps);
      }
      if (value === IGNORE)
        continue;
      hasRemoteChange = true;
      normalizedNewProps[key] = value;
      if (isRemoteFragment(currentExternalValue)) {
        removeNodeFromContainer(currentExternalValue, rootInternals);
      }
      if (isRemoteFragment(newExternalValue)) {
        moveNodeToContainer(component, newExternalValue, rootInternals);
      }
    }
    return perform(component, rootInternals, {
      remote: (channel) => {
        if (hasRemoteChange) {
          channel(ACTION_UPDATE_PROPS, component.id, normalizedNewProps);
        }
      },
      local: () => {
        const mergedExternalProps = __spreadValues(__spreadValues({}, currentExternalProps), newProps);
        internals.externalProps = strict ? Object.freeze(mergedExternalProps) : mergedExternalProps;
        internals.internalProps = __spreadValues(__spreadValues({}, internals.internalProps), normalizedNewProps);
        for (const [hotSwappable, newValue] of hotSwapFunctions) {
          hotSwappable[FUNCTION_CURRENT_IMPLEMENTATION_KEY] = newValue;
        }
      }
    });
  }
  function tryHotSwappingValues(currentValue, newValue) {
    if (typeof currentValue === "function" && FUNCTION_CURRENT_IMPLEMENTATION_KEY in currentValue) {
      return [typeof newValue === "function" ? IGNORE : makeValueHotSwappable(newValue), [[currentValue, newValue]]];
    }
    if (Array.isArray(currentValue)) {
      return tryHotSwappingArrayValues(currentValue, newValue);
    }
    if (typeof currentValue === "object" && currentValue != null && !isRemoteFragment(currentValue)) {
      return tryHotSwappingObjectValues(currentValue, newValue);
    }
    return [currentValue === newValue ? IGNORE : newValue];
  }
  function makeValueHotSwappable(value) {
    if (isRemoteFragment(value)) {
      return value;
    }
    if (typeof value === "function") {
      const wrappedFunction = (...args) => {
        return wrappedFunction[FUNCTION_CURRENT_IMPLEMENTATION_KEY](...args);
      };
      Object.defineProperty(wrappedFunction, FUNCTION_CURRENT_IMPLEMENTATION_KEY, {
        enumerable: false,
        configurable: false,
        writable: true,
        value
      });
      return wrappedFunction;
    } else if (Array.isArray(value)) {
      return value.map(makeValueHotSwappable);
    } else if (typeof value === "object" && value != null) {
      return Object.keys(value).reduce((newValue, key) => {
        newValue[key] = makeValueHotSwappable(value[key]);
        return newValue;
      }, {});
    }
    return value;
  }
  function collectNestedHotSwappableValues(value) {
    if (typeof value === "function") {
      if (FUNCTION_CURRENT_IMPLEMENTATION_KEY in value)
        return [value];
    } else if (Array.isArray(value)) {
      return value.reduce((all, element) => {
        const nested = collectNestedHotSwappableValues(element);
        return nested ? [...all, ...nested] : all;
      }, []);
    } else if (typeof value === "object" && value != null) {
      return Object.keys(value).reduce((all, key) => {
        const nested = collectNestedHotSwappableValues(value[key]);
        return nested ? [...all, ...nested] : all;
      }, []);
    }
  }
  function appendChild(container, child, internals, rootInternals) {
    var _currentParent$childr;
    const {
      nodes,
      strict
    } = rootInternals;
    if (!nodes.has(child)) {
      throw new Error(`Cannot append a node that was not created by this remote root`);
    }
    const currentParent = child.parent;
    const existingIndex = (_currentParent$childr = currentParent === null || currentParent === void 0 ? void 0 : currentParent.children.indexOf(child)) !== null && _currentParent$childr !== void 0 ? _currentParent$childr : -1;
    return perform(container, rootInternals, {
      remote: (channel) => {
        channel(ACTION_INSERT_CHILD, container.id, existingIndex < 0 ? container.children.length : container.children.length - 1, serializeChild(child), currentParent ? currentParent.id : false);
      },
      local: () => {
        moveNodeToContainer(container, child, rootInternals);
        let newChildren;
        if (currentParent) {
          const currentInternals = getCurrentInternals(currentParent, rootInternals);
          const currentChildren = [...currentInternals.children];
          currentChildren.splice(existingIndex, 1);
          if (currentParent === container) {
            newChildren = currentChildren;
          } else {
            currentInternals.children = strict ? Object.freeze(currentChildren) : currentChildren;
            newChildren = [...internals.children];
          }
        } else {
          newChildren = [...internals.children];
        }
        newChildren.push(child);
        internals.children = strict ? Object.freeze(newChildren) : newChildren;
      }
    });
  }
  function removeChild(container, child, internals, rootInternals) {
    const {
      strict
    } = rootInternals;
    return perform(container, rootInternals, {
      remote: (channel) => channel(ACTION_REMOVE_CHILD, container.id, container.children.indexOf(child)),
      local: () => {
        removeNodeFromContainer(child, rootInternals);
        const newChildren = [...internals.children];
        newChildren.splice(newChildren.indexOf(child), 1);
        internals.children = strict ? Object.freeze(newChildren) : newChildren;
      }
    });
  }
  function insertChildBefore(container, child, before, internals, rootInternals) {
    var _currentParent$childr2;
    const {
      strict,
      nodes
    } = rootInternals;
    if (!nodes.has(child)) {
      throw new Error(`Cannot insert a node that was not created by this remote root`);
    }
    const currentParent = child.parent;
    const existingIndex = (_currentParent$childr2 = currentParent === null || currentParent === void 0 ? void 0 : currentParent.children.indexOf(child)) !== null && _currentParent$childr2 !== void 0 ? _currentParent$childr2 : -1;
    return perform(container, rootInternals, {
      remote: (channel) => {
        const beforeIndex = container.children.indexOf(before);
        channel(ACTION_INSERT_CHILD, container.id, beforeIndex < existingIndex || existingIndex < 0 ? beforeIndex : beforeIndex - 1, serializeChild(child), currentParent ? currentParent.id : false);
      },
      local: () => {
        moveNodeToContainer(container, child, rootInternals);
        let newChildren;
        if (currentParent) {
          const currentInternals = getCurrentInternals(currentParent, rootInternals);
          const currentChildren = [...currentInternals.children];
          currentChildren.splice(existingIndex, 1);
          if (currentParent === container) {
            newChildren = currentChildren;
          } else {
            currentInternals.children = strict ? Object.freeze(currentChildren) : currentChildren;
            newChildren = [...internals.children];
          }
        } else {
          newChildren = [...internals.children];
        }
        newChildren.splice(newChildren.indexOf(before), 0, child);
        internals.children = strict ? Object.freeze(newChildren) : newChildren;
      }
    });
  }
  function normalizeChild(child, root) {
    return typeof child === "string" ? root.createText(child) : child;
  }
  function moveNodeToContainer(container, node, rootInternals) {
    const {
      tops,
      parents
    } = rootInternals;
    const newTop = container.kind === KIND_ROOT ? container : tops.get(container);
    tops.set(node, newTop);
    parents.set(node, container);
    moveFragmentToContainer(node, rootInternals);
    allDescendants(node, (descendant) => {
      tops.set(descendant, newTop);
      moveFragmentToContainer(descendant, rootInternals);
    });
  }
  function moveFragmentToContainer(node, rootInternals) {
    if (node.kind !== KIND_COMPONENT)
      return;
    const props = node.props;
    if (!props)
      return;
    Object.values(props).forEach((prop) => {
      if (!isRemoteFragment(prop))
        return;
      moveNodeToContainer(node, prop, rootInternals);
    });
  }
  function removeNodeFromContainer(node, rootInternals) {
    const {
      tops,
      parents
    } = rootInternals;
    tops.delete(node);
    parents.delete(node);
    allDescendants(node, (descendant) => {
      tops.delete(descendant);
      removeFragmentFromContainer(descendant, rootInternals);
    });
    removeFragmentFromContainer(node, rootInternals);
  }
  function removeFragmentFromContainer(node, rootInternals) {
    if (node.kind !== KIND_COMPONENT)
      return;
    const props = node.remoteProps;
    for (const key of Object.keys(props !== null && props !== void 0 ? props : {})) {
      const prop = props[key];
      if (!isRemoteFragment(prop))
        continue;
      removeNodeFromContainer(prop, rootInternals);
    }
  }
  function makePartOfTree(node, {
    parents,
    tops,
    nodes
  }) {
    nodes.add(node);
    Object.defineProperty(node, "parent", {
      get() {
        return parents.get(node);
      },
      configurable: true,
      enumerable: true
    });
    Object.defineProperty(node, "top", {
      get() {
        return tops.get(node);
      },
      configurable: true,
      enumerable: true
    });
  }
  function serializeChild(value) {
    return value.kind === KIND_TEXT ? {
      id: value.id,
      kind: value.kind,
      text: value.text
    } : {
      id: value.id,
      kind: value.kind,
      type: value.type,
      props: value.remoteProps,
      children: value.children.map((child) => serializeChild(child))
    };
  }
  function serializeProp(prop) {
    if (isRemoteFragment(prop)) {
      return serializeFragment(prop);
    }
    return prop;
  }
  function serializeFragment(value) {
    return {
      id: value.id,
      kind: value.kind,
      get children() {
        return value.children.map((child) => serializeChild(child));
      }
    };
  }
  function getCurrentInternals(currentParent, rootInternals) {
    if (currentParent.kind === KIND_ROOT) {
      return rootInternals;
    }
    if (currentParent.kind === KIND_FRAGMENT) {
      return rootInternals.fragments.get(currentParent);
    }
    return rootInternals.components.get(currentParent);
  }
  function makeRemote(value, id, root) {
    Object.defineProperty(value, "id", {
      value: id,
      configurable: true,
      writable: false,
      enumerable: false
    });
    Object.defineProperty(value, "root", {
      value: root,
      configurable: true,
      writable: false,
      enumerable: false
    });
  }
  function tryHotSwappingObjectValues(currentValue, newValue) {
    if (typeof newValue !== "object" || newValue == null) {
      var _collectNestedHotSwap;
      return [makeValueHotSwappable(newValue), (_collectNestedHotSwap = collectNestedHotSwappableValues(currentValue)) === null || _collectNestedHotSwap === void 0 ? void 0 : _collectNestedHotSwap.map((hotSwappable) => [hotSwappable, void 0])];
    }
    let hasChanged = false;
    const hotSwaps = [];
    const normalizedNewValue = {};
    for (const key in currentValue) {
      const currentObjectValue = currentValue[key];
      if (!(key in newValue)) {
        hasChanged = true;
        const nestedHotSwappables = collectNestedHotSwappableValues(currentObjectValue);
        if (nestedHotSwappables) {
          hotSwaps.push(...nestedHotSwappables.map((hotSwappable) => [hotSwappable, void 0]));
        }
      }
      const newObjectValue = newValue[key];
      const [updatedValue, elementHotSwaps] = tryHotSwappingValues(currentObjectValue, newObjectValue);
      if (elementHotSwaps)
        hotSwaps.push(...elementHotSwaps);
      if (updatedValue !== IGNORE) {
        hasChanged = true;
        normalizedNewValue[key] = updatedValue;
      }
    }
    for (const key in newValue) {
      if (key in normalizedNewValue)
        continue;
      hasChanged = true;
      normalizedNewValue[key] = makeValueHotSwappable(newValue[key]);
    }
    return [hasChanged ? normalizedNewValue : IGNORE, hotSwaps];
  }
  function tryHotSwappingArrayValues(currentValue, newValue) {
    if (!Array.isArray(newValue)) {
      var _collectNestedHotSwap2;
      return [makeValueHotSwappable(newValue), (_collectNestedHotSwap2 = collectNestedHotSwappableValues(currentValue)) === null || _collectNestedHotSwap2 === void 0 ? void 0 : _collectNestedHotSwap2.map((hotSwappable) => [hotSwappable, void 0])];
    }
    let hasChanged = false;
    const hotSwaps = [];
    const newLength = newValue.length;
    const currentLength = currentValue.length;
    const maxLength = Math.max(currentLength, newLength);
    const normalizedNewValue = [];
    for (let i = 0; i < maxLength; i++) {
      const currentArrayValue = currentValue[i];
      const newArrayValue = newValue[i];
      if (i < newLength) {
        if (i >= currentLength) {
          hasChanged = true;
          normalizedNewValue[i] = makeValueHotSwappable(newArrayValue);
          continue;
        }
        const [updatedValue, elementHotSwaps] = tryHotSwappingValues(currentArrayValue, newArrayValue);
        if (elementHotSwaps)
          hotSwaps.push(...elementHotSwaps);
        if (updatedValue === IGNORE) {
          normalizedNewValue[i] = currentArrayValue;
          continue;
        }
        hasChanged = true;
        normalizedNewValue[i] = updatedValue;
      } else {
        hasChanged = true;
        const nestedHotSwappables = collectNestedHotSwappableValues(currentArrayValue);
        if (nestedHotSwappables) {
          hotSwaps.push(...nestedHotSwappables.map((hotSwappable) => [hotSwappable, void 0]));
        }
      }
    }
    return [hasChanged ? normalizedNewValue : IGNORE, hotSwaps];
  }

  // node_modules/@shopify/ui-extensions/build/esm/utilities/registration.mjs
  function createExtensionRegistrationFunction() {
    const extensionWrapper = (target, implementation) => {
      var _shopify;
      function extension2(...args) {
        return __async(this, null, function* () {
          if (args.length === 1) {
            return implementation(...args);
          }
          const [{
            channel,
            components
          }, api] = args;
          const root = createRemoteRoot(channel, {
            components,
            strict: true
          });
          let renderResult = implementation(root, api);
          if (typeof renderResult === "object" && renderResult != null && "then" in renderResult) {
            renderResult = yield renderResult;
          }
          root.mount();
          return renderResult;
        });
      }
      (_shopify = globalThis.shopify) === null || _shopify === void 0 ? void 0 : _shopify.extend(target, extension2);
      return extension2;
    };
    return extensionWrapper;
  }

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/extension.mjs
  var extension = createExtensionRegistrationFunction();

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Banner/Banner.mjs
  var Banner = createRemoteComponent("Banner");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/BlockStack/BlockStack.mjs
  var BlockStack = createRemoteComponent("BlockStack");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Button/Button.mjs
  var Button = createRemoteComponent("Button");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Disclosure/Disclosure.mjs
  var Disclosure = createRemoteComponent("Disclosure");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Form/Form.mjs
  var Form = createRemoteComponent("Form");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Icon/Icon.mjs
  var Icon = createRemoteComponent("Icon");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Image/Image.mjs
  var Image = createRemoteComponent("Image");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/InlineLayout/InlineLayout.mjs
  var InlineLayout = createRemoteComponent("InlineLayout");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Pressable/Pressable.mjs
  var Pressable = createRemoteComponent("Pressable");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/Text/Text.mjs
  var Text = createRemoteComponent("Text");

  // node_modules/@shopify/ui-extensions/build/esm/surfaces/checkout/components/View/View.mjs
  var View = createRemoteComponent("View");

  // extensions/donations-dev/src/Checkout.js
  var Checkout_default = extension("Checkout::Dynamic::Render", (root, { lines, applyCartLinesChange, storage }) => {
    lines.subscribe((value) => __async(void 0, null, function* () {
      if (value) {
        let filteredArray = [];
        lines.current.forEach((lineObj) => {
          if (lineObj.merchandise.title == "Carry On Foundation Donation") {
            filteredArray.push(lineObj);
          }
        });
        if (filteredArray.length > 1 && filteredArray[0] != filteredArray.lastItem) {
          const result2 = yield applyCartLinesChange({
            type: "removeCartLine",
            id: filteredArray[0].id,
            // Needs reliable line item id number
            quantity: 1
          });
        }
        if (filteredArray.length == 1) {
          if (filteredArray[0].merchandise.subtitle == "$1") {
            disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "primary" });
            disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "secondary" });
            disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "secondary" });
          } else if (filteredArray[0].merchandise.subtitle == "$5") {
            disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "secondary" });
            disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "primary" });
            disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "secondary" });
          } else if (filteredArray[0].merchandise.subtitle == "$10") {
            disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "secondary" });
            disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "secondary" });
            disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "primary" });
          }
        }
      }
    }));
    function updateDropValue(key) {
      return __async(this, null, function* () {
        try {
          const storedValue = storage.read(key);
          const value = yield storedValue;
          donationWidget.updateProps({ open: value });
          return value;
        } catch (error) {
          console.error(error);
        }
      });
    }
    updateDropValue("dropValue");
    const checkDrop = root.createComponent(
      InlineLayout,
      {
        blockAlignment: "center",
        spacing: "base",
        columns: [],
        padding: "loose",
        border: ["none", "none", "none", "none"]
      },
      [
        root.createComponent(
          Pressable,
          {
            toggles: "one",
            onPress: () => __async(void 0, null, function* () {
              if (donationWidget.props.open == "false" || donationWidget.props.open == null) {
                return;
              } else if (donationWidget.props.open == "one") {
                disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "secondary" });
                disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "secondary" });
                disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "secondary" });
                storage.delete("dropValue");
                let filteredArrayOne = [];
                lines.current.forEach((lineObj) => {
                  if (lineObj.merchandise.title == "Carry On Foundation Donation") {
                    filteredArrayOne.push(lineObj);
                  }
                });
                filteredArrayOne.forEach((donation) => __async(void 0, null, function* () {
                  const result = yield applyCartLinesChange({
                    type: "removeCartLine",
                    id: donation.id,
                    // Needs reliable line item id number
                    quantity: donation.quantity
                  });
                  if (result.type === "error") {
                    console.error("error", result.message);
                    const errorComponent = root.createComponent(
                      Banner,
                      { status: "critical" },
                      ["There was an issue adding this product. Please try again."]
                    );
                    const topLevelComponent = root.children[0];
                    topLevelComponent.appendChild(errorComponent);
                    setTimeout(
                      () => topLevelComponent.removeChild(errorComponent),
                      3e3
                    );
                  }
                }));
              }
            })
          },
          [
            root.createComponent(
              BlockStack,
              {},
              [
                root.createComponent(Image, {
                  source: "https://cdn.shopify.com/s/files/1/0728/3494/1235/files/logo_3.svg?v=1690579006"
                }),
                root.createComponent(
                  InlineLayout,
                  {
                    blockAlignment: "center",
                    spacing: "base",
                    columns: ["fill", "auto"],
                    padding: "none",
                    border: ["none", "none", "none", "none"]
                  },
                  [
                    root.createComponent(Text, { size: "base" }, "Support Carry On\u2019s mission to teach resilience skills to youth through action sports and outdoor recreation."),
                    root.createComponent(Icon, { source: "chevronDown", size: "small" })
                  ]
                )
              ]
            )
          ]
        )
      ]
    );
    const disclosureView = root.createComponent(
      View,
      {
        id: "one",
        padding: ["base", "base", "base", "base"]
      },
      [
        root.createComponent(
          Form,
          {
            onSubmit: () => {
            }
          },
          [
            root.createComponent(BlockStack, {}, [
              root.createComponent(
                InlineLayout,
                {
                  columns: ["fill", "fill"],
                  spacing: "base"
                },
                [
                  root.createComponent(Button, {
                    kind: "secondary",
                    accessibilityRole: "submit",
                    id: "Button1",
                    onPress: () => __async(void 0, null, function* () {
                      disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "primary" });
                      disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "secondary" });
                      disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "secondary" });
                      let filteredArray = [];
                      lines.current.forEach((lineObj) => {
                        if (lineObj.merchandise.title == "Carry On Foundation Donation") {
                          filteredArray.push(lineObj);
                        }
                      });
                      if (filteredArray.length == 0) {
                        const result = yield applyCartLinesChange({
                          type: "addCartLine",
                          merchandiseId: "gid://shopify/ProductVariant/46322811928883",
                          quantity: 1
                        });
                        if (result.type === "error") {
                          console.error("error", result.message);
                          const errorComponent = root.createComponent(
                            Banner,
                            { status: "critical" },
                            ["There was an issue adding this product. Please try again."]
                          );
                          const topLevelComponent = root.children[0];
                          topLevelComponent.appendChild(errorComponent);
                          setTimeout(
                            () => topLevelComponent.removeChild(errorComponent),
                            3e3
                          );
                        }
                      } else {
                        if (filteredArray[0].merchandise.subtitle == "$1") {
                          return;
                        } else {
                          const result = yield applyCartLinesChange({
                            type: "addCartLine",
                            merchandiseId: "gid://shopify/ProductVariant/46322811928883",
                            quantity: 1
                          });
                          if (result.type === "error") {
                            console.error("error", result.message);
                            const errorComponent = root.createComponent(
                              Banner,
                              { status: "critical" },
                              ["There was an issue adding this product. Please try again."]
                            );
                            const topLevelComponent = root.children[0];
                            topLevelComponent.appendChild(errorComponent);
                            setTimeout(
                              () => topLevelComponent.removeChild(errorComponent),
                              3e3
                            );
                          }
                        }
                      }
                    })
                  }, "$1"),
                  root.createComponent(Button, {
                    kind: "secondary",
                    accessibilityRole: "submit",
                    id: "Button5",
                    onPress: () => __async(void 0, null, function* () {
                      disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "secondary" });
                      disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "primary" });
                      disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "secondary" });
                      let filteredArray = [];
                      lines.current.forEach((lineObj) => {
                        if (lineObj.merchandise.title == "Carry On Foundation Donation") {
                          filteredArray.push(lineObj);
                        }
                      });
                      if (filteredArray.length == 0) {
                        const result = yield applyCartLinesChange({
                          type: "addCartLine",
                          merchandiseId: "gid://shopify/ProductVariant/46322811961651",
                          quantity: 1
                        });
                        if (result.type === "error") {
                          console.error("error", result.message);
                          const errorComponent = root.createComponent(
                            Banner,
                            { status: "critical" },
                            ["There was an issue adding this product. Please try again."]
                          );
                          const topLevelComponent = root.children[0];
                          topLevelComponent.appendChild(errorComponent);
                          setTimeout(
                            () => topLevelComponent.removeChild(errorComponent),
                            3e3
                          );
                        }
                      } else {
                        if (filteredArray[0].merchandise.subtitle == "$5") {
                          return;
                        } else {
                          const result = yield applyCartLinesChange({
                            type: "addCartLine",
                            merchandiseId: "gid://shopify/ProductVariant/46322811961651",
                            quantity: 1
                          });
                          if (result.type === "error") {
                            console.error("error", result.message);
                            const errorComponent = root.createComponent(
                              Banner,
                              { status: "critical" },
                              ["There was an issue adding this product. Please try again."]
                            );
                            const topLevelComponent = root.children[0];
                            topLevelComponent.appendChild(errorComponent);
                            setTimeout(
                              () => topLevelComponent.removeChild(errorComponent),
                              3e3
                            );
                          }
                        }
                      }
                    })
                  }, "$5"),
                  root.createComponent(Button, {
                    kind: "secondary",
                    accessibilityRole: "submit",
                    id: "Button10",
                    onPress: () => __async(void 0, null, function* () {
                      disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "secondary" });
                      disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "secondary" });
                      disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "primary" });
                      let filteredArray = [];
                      lines.current.forEach((lineObj) => {
                        if (lineObj.merchandise.title == "Carry On Foundation Donation") {
                          filteredArray.push(lineObj);
                        }
                      });
                      if (filteredArray.length == 0) {
                        const result = yield applyCartLinesChange({
                          type: "addCartLine",
                          merchandiseId: "gid://shopify/ProductVariant/46322811994419",
                          quantity: 1
                        });
                        if (result.type === "error") {
                          console.error("error", result.message);
                          const errorComponent = root.createComponent(
                            Banner,
                            { status: "critical" },
                            ["There was an issue adding this product. Please try again."]
                          );
                          const topLevelComponent = root.children[0];
                          topLevelComponent.appendChild(errorComponent);
                          setTimeout(
                            () => topLevelComponent.removeChild(errorComponent),
                            3e3
                          );
                        }
                      } else {
                        if (filteredArray[0].merchandise.subtitle == "$10") {
                          return;
                        } else {
                          const result = yield applyCartLinesChange({
                            type: "addCartLine",
                            merchandiseId: "gid://shopify/ProductVariant/46322811994419",
                            quantity: 1
                          });
                          if (result.type === "error") {
                            console.error("error", result.message);
                            const errorComponent = root.createComponent(
                              Banner,
                              { status: "critical" },
                              ["There was an issue adding this product. Please try again."]
                            );
                            const topLevelComponent = root.children[0];
                            topLevelComponent.appendChild(errorComponent);
                            setTimeout(
                              () => topLevelComponent.removeChild(errorComponent),
                              3e3
                            );
                          }
                        }
                      }
                    })
                  }, "$10")
                ]
              ),
              root.createComponent(Button, {
                kind: "secondary",
                id: "RemoveDonation",
                onPress: () => __async(void 0, null, function* () {
                  disclosureView.children[0].children[0].children[0].children[0].updateProps({ kind: "secondary" });
                  disclosureView.children[0].children[0].children[0].children[1].updateProps({ kind: "secondary" });
                  disclosureView.children[0].children[0].children[0].children[2].updateProps({ kind: "secondary" });
                  if (donationWidget.props.open == "one") {
                    donationWidget.updateProps({ open: "false" });
                    storage.delete("dropValue");
                    let removalArray = [];
                    lines.current.forEach((lineObj) => {
                      if (lineObj.merchandise.title == "Carry On Foundation Donation") {
                        removalArray.push(lineObj);
                      }
                    });
                    removalArray.forEach((donation) => __async(void 0, null, function* () {
                      const result = yield applyCartLinesChange({
                        type: "removeCartLine",
                        id: donation.id,
                        // Needs reliable line item id number
                        quantity: donation.quantity
                      });
                      if (result.type === "error") {
                        console.error("error", result.message);
                        const errorComponent = root.createComponent(
                          Banner,
                          { status: "critical" },
                          ["There was an issue adding this product. Please try again."]
                        );
                        const topLevelComponent = root.children[0];
                        topLevelComponent.appendChild(errorComponent);
                        setTimeout(
                          () => topLevelComponent.removeChild(errorComponent),
                          3e3
                        );
                      }
                    }));
                  }
                })
              }, "Remove Donation"),
              root.createComponent(
                Text,
                {
                  size: "base"
                },
                "Thank you for your contribution, every dollar counts! Carry On is a 501(C)(3) Nonprofit. EIN: 87-2350234"
              )
            ])
          ]
        )
      ]
    );
    const donationWidget = root.createComponent(
      Disclosure,
      {
        open: "false",
        onToggle: (open) => {
          if (donationWidget.props.open == "false" || donationWidget.props.open == null) {
            storage.write("dropValue", "one");
            updateDropValue("dropValue");
          } else {
            storage.write("dropValue", "false");
            updateDropValue("dropValue");
          }
        }
      },
      [checkDrop, disclosureView]
    );
    const donationsContainer = root.createComponent(
      View,
      {
        maxInlineSize: "fill",
        cornerRadius: "large",
        border: "base"
      },
      [
        root.createComponent(
          BlockStack,
          {
            spacing: "none"
          },
          [
            donationWidget
          ]
        )
      ]
    );
    root.appendChild(donationsContainer);
  });
})();
