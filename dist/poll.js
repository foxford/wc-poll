(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WCPoll = {})));
}(this, (function (exports) { 'use strict';

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  window.JSCompiler_renameProperty = function (prop) {
    return prop;
  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // unique global id for deduping mixins.
  var dedupeId = 0;

  /* eslint-disable valid-jsdoc */
  /**
   * Wraps an ES6 class expression mixin such that the mixin is only applied
   * if it has not already been applied its base argument. Also memoizes mixin
   * applications.
   *
   * @template T
   * @param {T} mixin ES6 class expression mixin to wrap
   * @return {T}
   * @suppress {invalidCasts}
   */
  var dedupingMixin = function dedupingMixin(mixin) {
    var mixinApplications = /** @type {!MixinFunction} */mixin.__mixinApplications;
    if (!mixinApplications) {
      mixinApplications = new WeakMap();
      /** @type {!MixinFunction} */mixin.__mixinApplications = mixinApplications;
    }
    // maintain a unique id for each mixin
    var mixinDedupeId = dedupeId++;
    function dedupingMixin(base) {
      var baseSet = /** @type {!MixinFunction} */base.__mixinSet;
      if (baseSet && baseSet[mixinDedupeId]) {
        return base;
      }
      var map = mixinApplications;
      var extended = map.get(base);
      if (!extended) {
        extended = /** @type {!Function} */mixin(base);
        map.set(base, extended);
      }
      // copy inherited mixin set from the extended class, or the base class
      // NOTE: we avoid use of Set here because some browser (IE11)
      // cannot extend a base Set via the constructor.
      var mixinSet = Object.create( /** @type {!MixinFunction} */extended.__mixinSet || baseSet || null);
      mixinSet[mixinDedupeId] = true;
      /** @type {!MixinFunction} */extended.__mixinSet = mixinSet;
      return extended;
    }

    return dedupingMixin;
  };
  /* eslint-enable valid-jsdoc */

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // Microtask implemented using Mutation Observer
  var microtaskCurrHandle = 0;
  var microtaskLastHandle = 0;
  var microtaskCallbacks = [];
  var microtaskNodeContent = 0;
  var microtaskNode = document.createTextNode('');
  new window.MutationObserver(microtaskFlush).observe(microtaskNode, { characterData: true });

  function microtaskFlush() {
    var len = microtaskCallbacks.length;
    for (var i = 0; i < len; i++) {
      var cb = microtaskCallbacks[i];
      if (cb) {
        try {
          cb();
        } catch (e) {
          setTimeout(function () {
            throw e;
          });
        }
      }
    }
    microtaskCallbacks.splice(0, len);
    microtaskLastHandle += len;
  }

  /**
   * Async interface for enqueuing callbacks that run at microtask timing.
   *
   * Note that microtask timing is achieved via a single `MutationObserver`,
   * and thus callbacks enqueued with this API will all run in a single
   * batch, and not interleaved with other microtasks such as promises.
   * Promises are avoided as an implementation choice for the time being
   * due to Safari bugs that cause Promises to lack microtask guarantees.
   *
   * @namespace
   * @summary Async interface for enqueuing callbacks that run at microtask
   *   timing.
   */
  var microTask = {

    /**
     * Enqueues a function called at microtask timing.
     *
     * @memberof microTask
     * @param {!Function=} callback Callback to run
     * @return {number} Handle used for canceling task
     */
    run: function run(callback) {
      microtaskNode.textContent = microtaskNodeContent++;
      microtaskCallbacks.push(callback);
      return microtaskCurrHandle++;
    },


    /**
     * Cancels a previously enqueued `microTask` callback.
     *
     * @memberof microTask
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel: function cancel(handle) {
      var idx = handle - microtaskLastHandle;
      if (idx >= 0) {
        if (!microtaskCallbacks[idx]) {
          throw new Error('invalid async handle: ' + handle);
        }
        microtaskCallbacks[idx] = null;
      }
    }
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var taggedTemplateLiteral = function (strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  };

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /** @const {!AsyncInterface} */
  var microtask = microTask;

  /**
   * Element class mixin that provides basic meta-programming for creating one
   * or more property accessors (getter/setter pair) that enqueue an async
   * (batched) `_propertiesChanged` callback.
   *
   * For basic usage of this mixin, call `MyClass.createProperties(props)`
   * once at class definition time to create property accessors for properties
   * named in props, implement `_propertiesChanged` to react as desired to
   * property changes, and implement `static get observedAttributes()` and
   * include lowercase versions of any property names that should be set from
   * attributes. Last, call `this._enableProperties()` in the element's
   * `connectedCallback` to enable the accessors.
   *
   * @mixinFunction
   * @polymer
   * @summary Element class mixin for reacting to property changes from
   *   generated property accessors.
   */
  var PropertiesChanged = dedupingMixin(
  /**
   * @template T
   * @param {function(new:T)} superClass Class to apply mixin to.
   * @return {function(new:T)} superClass with mixin applied.
   */
  function (superClass) {

    /**
     * @polymer
     * @mixinClass
     * @implements {Polymer_PropertiesChanged}
     * @unrestricted
     */
    var PropertiesChanged = function (_superClass) {
      inherits(PropertiesChanged, _superClass);
      createClass(PropertiesChanged, [{
        key: '_createPropertyAccessor',
        //eslint-disable-line no-unused-vars

        /**
         * Creates a setter/getter pair for the named property with its own
         * local storage.  The getter returns the value in the local storage,
         * and the setter calls `_setProperty`, which updates the local storage
         * for the property and enqueues a `_propertiesChanged` callback.
         *
         * This method may be called on a prototype or an instance.  Calling
         * this method may overwrite a property value that already exists on
         * the prototype/instance by creating the accessor.
         *
         * @param {string} property Name of the property
         * @param {boolean=} readOnly When true, no setter is created; the
         *   protected `_setProperty` function must be used to set the property
         * @return {void}
         * @protected
         * @override
         */
        value: function _createPropertyAccessor(property, readOnly) {
          this._addPropertyToAttributeMap(property);
          if (!this.hasOwnProperty('__dataHasAccessor')) {
            this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor);
          }
          if (!this.__dataHasAccessor[property]) {
            this.__dataHasAccessor[property] = true;
            this._definePropertyAccessor(property, readOnly);
          }
        }

        /**
         * Adds the given `property` to a map matching attribute names
         * to property names, using `attributeNameForProperty`. This map is
         * used when deserializing attribute values to properties.
         *
         * @param {string} property Name of the property
         * @override
         */

      }, {
        key: '_addPropertyToAttributeMap',
        value: function _addPropertyToAttributeMap(property) {
          if (!this.hasOwnProperty('__dataAttributes')) {
            this.__dataAttributes = Object.assign({}, this.__dataAttributes);
          }
          if (!this.__dataAttributes[property]) {
            var attr = this.constructor.attributeNameForProperty(property);
            this.__dataAttributes[attr] = property;
          }
        }

        /**
         * Defines a property accessor for the given property.
         * @param {string} property Name of the property
         * @param {boolean=} readOnly When true, no setter is created
         * @return {void}
         * @override
         */

      }, {
        key: '_definePropertyAccessor',
        value: function _definePropertyAccessor(property, readOnly) {
          Object.defineProperty(this, property, {
            /* eslint-disable valid-jsdoc */
            /** @this {PropertiesChanged} */
            get: function get$$1() {
              return this._getProperty(property);
            },

            /** @this {PropertiesChanged} */
            set: readOnly ? function () {} : function (value) {
              this._setProperty(property, value);
            }
            /* eslint-enable */
          });
        }
      }], [{
        key: 'createProperties',


        /**
         * Creates property accessors for the given property names.
         * @param {!Object} props Object whose keys are names of accessors.
         * @return {void}
         * @protected
         */
        value: function createProperties(props) {
          var proto = this.prototype;
          for (var prop in props) {
            // don't stomp an existing accessor
            if (!(prop in proto)) {
              proto._createPropertyAccessor(prop);
            }
          }
        }

        /**
         * Returns an attribute name that corresponds to the given property.
         * The attribute name is the lowercased property name. Override to
         * customize this mapping.
         * @param {string} property Property to convert
         * @return {string} Attribute name corresponding to the given property.
         *
         * @protected
         */

      }, {
        key: 'attributeNameForProperty',
        value: function attributeNameForProperty(property) {
          return property.toLowerCase();
        }

        /**
         * Override point to provide a type to which to deserialize a value to
         * a given property.
         * @param {string} name Name of property
         *
         * @protected
         */

      }, {
        key: 'typeForProperty',
        value: function typeForProperty(name) {}
      }]);

      function PropertiesChanged() {
        classCallCheck(this, PropertiesChanged);

        var _this = possibleConstructorReturn(this, (PropertiesChanged.__proto__ || Object.getPrototypeOf(PropertiesChanged)).call(this));

        _this.__dataEnabled = false;
        _this.__dataReady = false;
        _this.__dataInvalid = false;
        _this.__data = {};
        _this.__dataPending = null;
        _this.__dataOld = null;
        _this.__dataInstanceProps = null;
        _this.__serializing = false;
        _this._initializeProperties();
        return _this;
      }

      /**
       * Lifecycle callback called when properties are enabled via
       * `_enableProperties`.
       *
       * Users may override this function to implement behavior that is
       * dependent on the element having its property data initialized, e.g.
       * from defaults (initialized from `constructor`, `_initializeProperties`),
       * `attributeChangedCallback`, or values propagated from host e.g. via
       * bindings.  `super.ready()` must be called to ensure the data system
       * becomes enabled.
       *
       * @return {void}
       * @public
       * @override
       */


      createClass(PropertiesChanged, [{
        key: 'ready',
        value: function ready() {
          this.__dataReady = true;
          this._flushProperties();
        }

        /**
         * Initializes the local storage for property accessors.
         *
         * Provided as an override point for performing any setup work prior
         * to initializing the property accessor system.
         *
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_initializeProperties',
        value: function _initializeProperties() {
          // Capture instance properties; these will be set into accessors
          // during first flush. Don't set them here, since we want
          // these to overwrite defaults/constructor assignments
          for (var p in this.__dataHasAccessor) {
            if (this.hasOwnProperty(p)) {
              this.__dataInstanceProps = this.__dataInstanceProps || {};
              this.__dataInstanceProps[p] = this[p];
              delete this[p];
            }
          }
        }

        /**
         * Called at ready time with bag of instance properties that overwrote
         * accessors when the element upgraded.
         *
         * The default implementation sets these properties back into the
         * setter at ready time.  This method is provided as an override
         * point for customizing or providing more efficient initialization.
         *
         * @param {Object} props Bag of property values that were overwritten
         *   when creating property accessors.
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_initializeInstanceProperties',
        value: function _initializeInstanceProperties(props) {
          Object.assign(this, props);
        }

        /**
         * Updates the local storage for a property (via `_setPendingProperty`)
         * and enqueues a `_proeprtiesChanged` callback.
         *
         * @param {string} property Name of the property
         * @param {*} value Value to set
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_setProperty',
        value: function _setProperty(property, value) {
          if (this._setPendingProperty(property, value)) {
            this._invalidateProperties();
          }
        }

        /**
         * Returns the value for the given property.
         * @param {string} property Name of property
         * @return {*} Value for the given property
         * @protected
         * @override
         */

      }, {
        key: '_getProperty',
        value: function _getProperty(property) {
          return this.__data[property];
        }

        /* eslint-disable no-unused-vars */
        /**
         * Updates the local storage for a property, records the previous value,
         * and adds it to the set of "pending changes" that will be passed to the
         * `_propertiesChanged` callback.  This method does not enqueue the
         * `_propertiesChanged` callback.
         *
         * @param {string} property Name of the property
         * @param {*} value Value to set
         * @param {boolean=} ext Not used here; affordance for closure
         * @return {boolean} Returns true if the property changed
         * @protected
         * @override
         */

      }, {
        key: '_setPendingProperty',
        value: function _setPendingProperty(property, value, ext) {
          var old = this.__data[property];
          var changed = this._shouldPropertyChange(property, value, old);
          if (changed) {
            if (!this.__dataPending) {
              this.__dataPending = {};
              this.__dataOld = {};
            }
            // Ensure old is captured from the last turn
            if (this.__dataOld && !(property in this.__dataOld)) {
              this.__dataOld[property] = old;
            }
            this.__data[property] = value;
            this.__dataPending[property] = value;
          }
          return changed;
        }
        /* eslint-enable */

        /**
         * Marks the properties as invalid, and enqueues an async
         * `_propertiesChanged` callback.
         *
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_invalidateProperties',
        value: function _invalidateProperties() {
          var _this2 = this;

          if (!this.__dataInvalid && this.__dataReady) {
            this.__dataInvalid = true;
            microtask.run(function () {
              if (_this2.__dataInvalid) {
                _this2.__dataInvalid = false;
                _this2._flushProperties();
              }
            });
          }
        }

        /**
         * Call to enable property accessor processing. Before this method is
         * called accessor values will be set but side effects are
         * queued. When called, any pending side effects occur immediately.
         * For elements, generally `connectedCallback` is a normal spot to do so.
         * It is safe to call this method multiple times as it only turns on
         * property accessors once.
         *
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_enableProperties',
        value: function _enableProperties() {
          if (!this.__dataEnabled) {
            this.__dataEnabled = true;
            if (this.__dataInstanceProps) {
              this._initializeInstanceProperties(this.__dataInstanceProps);
              this.__dataInstanceProps = null;
            }
            this.ready();
          }
        }

        /**
         * Calls the `_propertiesChanged` callback with the current set of
         * pending changes (and old values recorded when pending changes were
         * set), and resets the pending set of changes. Generally, this method
         * should not be called in user code.
         *
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_flushProperties',
        value: function _flushProperties() {
          var props = this.__data;
          var changedProps = this.__dataPending;
          var old = this.__dataOld;
          if (this._shouldPropertiesChange(props, changedProps, old)) {
            this.__dataPending = null;
            this.__dataOld = null;
            this._propertiesChanged(props, changedProps, old);
          }
        }

        /**
         * Called in `_flushProperties` to determine if `_propertiesChanged`
         * should be called. The default implementation returns true if
         * properties are pending. Override to customize when
         * `_propertiesChanged` is called.
         * @param {!Object} currentProps Bag of all current accessor values
         * @param {?Object} changedProps Bag of properties changed since the last
         *   call to `_propertiesChanged`
         * @param {?Object} oldProps Bag of previous values for each property
         *   in `changedProps`
         * @return {boolean} true if changedProps is truthy
         * @override
         */

      }, {
        key: '_shouldPropertiesChange',
        value: function _shouldPropertiesChange(currentProps, changedProps, oldProps) {
          // eslint-disable-line no-unused-vars
          return Boolean(changedProps);
        }

        /**
         * Callback called when any properties with accessors created via
         * `_createPropertyAccessor` have been set.
         *
         * @param {!Object} currentProps Bag of all current accessor values
         * @param {?Object} changedProps Bag of properties changed since the last
         *   call to `_propertiesChanged`
         * @param {?Object} oldProps Bag of previous values for each property
         *   in `changedProps`
         * @return {void}
         * @protected
         * @override
         */

      }, {
        key: '_propertiesChanged',
        value: function _propertiesChanged(currentProps, changedProps, oldProps) {} // eslint-disable-line no-unused-vars


        /**
         * Method called to determine whether a property value should be
         * considered as a change and cause the `_propertiesChanged` callback
         * to be enqueued.
         *
         * The default implementation returns `true` if a strict equality
         * check fails. The method always returns false for `NaN`.
         *
         * Override this method to e.g. provide stricter checking for
         * Objects/Arrays when using immutable patterns.
         *
         * @param {string} property Property name
         * @param {*} value New property value
         * @param {*} old Previous property value
         * @return {boolean} Whether the property should be considered a change
         *   and enqueue a `_proeprtiesChanged` callback
         * @protected
         * @override
         */

      }, {
        key: '_shouldPropertyChange',
        value: function _shouldPropertyChange(property, value, old) {
          return (
            // Strict equality check
            old !== value && (
            // This ensures (old==NaN, value==NaN) always returns false
            old === old || value === value)
          );
        }

        /**
         * Implements native Custom Elements `attributeChangedCallback` to
         * set an attribute value to a property via `_attributeToProperty`.
         *
         * @param {string} name Name of attribute that changed
         * @param {?string} old Old attribute value
         * @param {?string} value New attribute value
         * @param {?string} namespace Attribute namespace.
         * @return {void}
         * @suppress {missingProperties} Super may or may not implement the callback
         * @override
         */

      }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(name, old, value, namespace) {
          if (old !== value) {
            this._attributeToProperty(name, value);
          }
          if (get(PropertiesChanged.prototype.__proto__ || Object.getPrototypeOf(PropertiesChanged.prototype), 'attributeChangedCallback', this)) {
            get(PropertiesChanged.prototype.__proto__ || Object.getPrototypeOf(PropertiesChanged.prototype), 'attributeChangedCallback', this).call(this, name, old, value, namespace);
          }
        }

        /**
         * Deserializes an attribute to its associated property.
         *
         * This method calls the `_deserializeValue` method to convert the string to
         * a typed value.
         *
         * @param {string} attribute Name of attribute to deserialize.
         * @param {?string} value of the attribute.
         * @param {*=} type type to deserialize to, defaults to the value
         * returned from `typeForProperty`
         * @return {void}
         * @override
         */

      }, {
        key: '_attributeToProperty',
        value: function _attributeToProperty(attribute, value, type) {
          if (!this.__serializing) {
            var map = this.__dataAttributes;
            var property = map && map[attribute] || attribute;
            this[property] = this._deserializeValue(value, type || this.constructor.typeForProperty(property));
          }
        }

        /**
         * Serializes a property to its associated attribute.
         *
         * @suppress {invalidCasts} Closure can't figure out `this` is an element.
         *
         * @param {string} property Property name to reflect.
         * @param {string=} attribute Attribute name to reflect to.
         * @param {*=} value Property value to refect.
         * @return {void}
         * @override
         */

      }, {
        key: '_propertyToAttribute',
        value: function _propertyToAttribute(property, attribute, value) {
          this.__serializing = true;
          value = arguments.length < 3 ? this[property] : value;
          this._valueToNodeAttribute( /** @type {!HTMLElement} */this, value, attribute || this.constructor.attributeNameForProperty(property));
          this.__serializing = false;
        }

        /**
         * Sets a typed value to an HTML attribute on a node.
         *
         * This method calls the `_serializeValue` method to convert the typed
         * value to a string.  If the `_serializeValue` method returns `undefined`,
         * the attribute will be removed (this is the default for boolean
         * type `false`).
         *
         * @param {Element} node Element to set attribute to.
         * @param {*} value Value to serialize.
         * @param {string} attribute Attribute name to serialize to.
         * @return {void}
         * @override
         */

      }, {
        key: '_valueToNodeAttribute',
        value: function _valueToNodeAttribute(node, value, attribute) {
          var str = this._serializeValue(value);
          if (str === undefined) {
            node.removeAttribute(attribute);
          } else {
            node.setAttribute(attribute, str);
          }
        }

        /**
         * Converts a typed JavaScript value to a string.
         *
         * This method is called when setting JS property values to
         * HTML attributes.  Users may override this method to provide
         * serialization for custom types.
         *
         * @param {*} value Property value to serialize.
         * @return {string | undefined} String serialized from the provided
         * property  value.
         * @override
         */

      }, {
        key: '_serializeValue',
        value: function _serializeValue(value) {
          switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
            case 'boolean':
              return value ? '' : undefined;
            default:
              return value != null ? value.toString() : undefined;
          }
        }

        /**
         * Converts a string to a typed JavaScript value.
         *
         * This method is called when reading HTML attribute values to
         * JS properties.  Users may override this method to provide
         * deserialization for custom `type`s. Types for `Boolean`, `String`,
         * and `Number` convert attributes to the expected types.
         *
         * @param {?string} value Value to deserialize.
         * @param {*=} type Type to deserialize the string to.
         * @return {*} Typed value deserialized from the provided string.
         * @override
         */

      }, {
        key: '_deserializeValue',
        value: function _deserializeValue(value, type) {
          switch (type) {
            case Boolean:
              return value !== null;
            case Number:
              return Number(value);
            default:
              return value;
          }
        }
      }]);
      return PropertiesChanged;
    }(superClass);

    return PropertiesChanged;
  });

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * Creates a copy of `props` with each property normalized such that
   * upgraded it is an object with at least a type property { type: Type}.
   *
   * @param {Object} props Properties to normalize
   * @return {Object} Copy of input `props` with normalized properties that
   * are in the form {type: Type}
   * @private
   */
  function normalizeProperties(props) {
    var output = {};
    for (var p in props) {
      var o = props[p];
      output[p] = typeof o === 'function' ? { type: o } : o;
    }
    return output;
  }

  /**
   * Mixin that provides a minimal starting point to using the PropertiesChanged
   * mixin by providing a mechanism to declare properties in a static
   * getter (e.g. static get properties() { return { foo: String } }). Changes
   * are reported via the `_propertiesChanged` method.
   *
   * This mixin provides no specific support for rendering. Users are expected
   * to create a ShadowRoot and put content into it and update it in whatever
   * way makes sense. This can be done in reaction to properties changing by
   * implementing `_propertiesChanged`.
   *
   * @mixinFunction
   * @polymer
   * @appliesMixin PropertiesChanged
   * @summary Mixin that provides a minimal starting point for using
   * the PropertiesChanged mixin by providing a declarative `properties` object.
   */
  var PropertiesMixin = dedupingMixin(function (superClass) {

    /**
     * @constructor
     * @implements {Polymer_PropertiesChanged}
     * @private
     */
    var base = PropertiesChanged(superClass);

    /**
     * Returns the super class constructor for the given class, if it is an
     * instance of the PropertiesMixin.
     *
     * @param {!PropertiesMixinConstructor} constructor PropertiesMixin constructor
     * @return {?PropertiesMixinConstructor} Super class constructor
     */
    function superPropertiesClass(constructor) {
      var superCtor = Object.getPrototypeOf(constructor);

      // Note, the `PropertiesMixin` class below only refers to the class
      // generated by this call to the mixin; the instanceof test only works
      // because the mixin is deduped and guaranteed only to apply once, hence
      // all constructors in a proto chain will see the same `PropertiesMixin`
      return superCtor.prototype instanceof PropertiesMixin ?
      /** @type {!PropertiesMixinConstructor} */superCtor : null;
    }

    /**
     * Returns a memoized version of the `properties` object for the
     * given class. Properties not in object format are converted to at
     * least {type}.
     *
     * @param {PropertiesMixinConstructor} constructor PropertiesMixin constructor
     * @return {Object} Memoized properties object
     */
    function ownProperties(constructor) {
      if (!constructor.hasOwnProperty(JSCompiler_renameProperty('__ownProperties', constructor))) {
        var props = null;

        if (constructor.hasOwnProperty(JSCompiler_renameProperty('properties', constructor)) && constructor.properties) {
          props = normalizeProperties(constructor.properties);
        }

        constructor.__ownProperties = props;
      }
      return constructor.__ownProperties;
    }

    /**
     * @polymer
     * @mixinClass
     * @extends {base}
     * @implements {Polymer_PropertiesMixin}
     * @unrestricted
     */

    var PropertiesMixin = function (_base) {
      inherits(PropertiesMixin, _base);

      function PropertiesMixin() {
        classCallCheck(this, PropertiesMixin);
        return possibleConstructorReturn(this, (PropertiesMixin.__proto__ || Object.getPrototypeOf(PropertiesMixin)).apply(this, arguments));
      }

      createClass(PropertiesMixin, [{
        key: '_initializeProperties',


        /**
         * Overrides `PropertiesChanged` method and adds a call to
         * `finalize` which lazily configures the element's property accessors.
         * @override
         * @return {void}
         */
        value: function _initializeProperties() {
          this.constructor.finalize();
          get(PropertiesMixin.prototype.__proto__ || Object.getPrototypeOf(PropertiesMixin.prototype), '_initializeProperties', this).call(this);
        }

        /**
         * Called when the element is added to a document.
         * Calls `_enableProperties` to turn on property system from
         * `PropertiesChanged`.
         * @suppress {missingProperties} Super may or may not implement the callback
         * @return {void}
         * @override
         */

      }, {
        key: 'connectedCallback',
        value: function connectedCallback() {
          if (get(PropertiesMixin.prototype.__proto__ || Object.getPrototypeOf(PropertiesMixin.prototype), 'connectedCallback', this)) {
            get(PropertiesMixin.prototype.__proto__ || Object.getPrototypeOf(PropertiesMixin.prototype), 'connectedCallback', this).call(this);
          }
          this._enableProperties();
        }

        /**
         * Called when the element is removed from a document
         * @suppress {missingProperties} Super may or may not implement the callback
         * @return {void}
         * @override
         */

      }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
          if (get(PropertiesMixin.prototype.__proto__ || Object.getPrototypeOf(PropertiesMixin.prototype), 'disconnectedCallback', this)) {
            get(PropertiesMixin.prototype.__proto__ || Object.getPrototypeOf(PropertiesMixin.prototype), 'disconnectedCallback', this).call(this);
          }
        }
      }], [{
        key: 'finalize',


        /**
         * Finalizes an element definition, including ensuring any super classes
         * are also finalized. This includes ensuring property
         * accessors exist on the element prototype. This method calls
         * `_finalizeClass` to finalize each constructor in the prototype chain.
         * @return {void}
         */
        value: function finalize() {
          if (!this.hasOwnProperty(JSCompiler_renameProperty('__finalized', this))) {
            var superCtor = superPropertiesClass( /** @type {!PropertiesMixinConstructor} */this);
            if (superCtor) {
              superCtor.finalize();
            }
            this.__finalized = true;
            this._finalizeClass();
          }
        }

        /**
         * Finalize an element class. This includes ensuring property
         * accessors exist on the element prototype. This method is called by
         * `finalize` and finalizes the class constructor.
         *
         * @protected
         */

      }, {
        key: '_finalizeClass',
        value: function _finalizeClass() {
          var props = ownProperties( /** @type {!PropertiesMixinConstructor} */this);
          if (props) {
            this.createProperties(props);
          }
        }

        /**
         * Returns a memoized version of all properties, including those inherited
         * from super classes. Properties not in object format are converted to
         * at least {type}.
         *
         * @return {Object} Object containing properties for this class
         * @protected
         */

      }, {
        key: 'typeForProperty',


        /**
         * Overrides `PropertiesChanged` method to return type specified in the
         * static `properties` object for the given property.
         * @param {string} name Name of property
         * @return {*} Type to which to deserialize attribute
         *
         * @protected
         */
        value: function typeForProperty(name) {
          var info = this._properties[name];
          return info && info.type;
        }
      }, {
        key: 'observedAttributes',


        /**
         * Implements standard custom elements getter to observes the attributes
         * listed in `properties`.
         * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
         */
        get: function get$$1() {
          var _this2 = this;

          var props = this._properties;
          return props ? Object.keys(props).map(function (p) {
            return _this2.attributeNameForProperty(p);
          }) : [];
        }
      }, {
        key: '_properties',
        get: function get$$1() {
          if (!this.hasOwnProperty(JSCompiler_renameProperty('__properties', this))) {
            var superCtor = superPropertiesClass( /** @type {!PropertiesMixinConstructor} */this);
            this.__properties = Object.assign({}, superCtor && superCtor._properties, ownProperties( /** @type {PropertiesMixinConstructor} */this));
          }
          return this.__properties;
        }
      }]);
      return PropertiesMixin;
    }(base);

    return PropertiesMixin;
  });

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // The first argument to JS template tags retain identity across multiple
  // calls to a tag for the same literal, so we can cache work done per literal
  // in a Map.
  var templateCaches = new Map();
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  var TemplateResult = function () {
      function TemplateResult(strings, values, type) {
          var partCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultPartCallback;
          classCallCheck(this, TemplateResult);

          this.strings = strings;
          this.values = values;
          this.type = type;
          this.partCallback = partCallback;
      }
      /**
       * Returns a string of HTML used to create a <template> element.
       */


      createClass(TemplateResult, [{
          key: 'getHTML',
          value: function getHTML() {
              var l = this.strings.length - 1;
              var html = '';
              var isTextBinding = true;
              for (var i = 0; i < l; i++) {
                  var s = this.strings[i];
                  html += s;
                  // We're in a text position if the previous string closed its tags.
                  // If it doesn't have any tags, then we use the previous text position
                  // state.
                  var closing = findTagClose(s);
                  isTextBinding = closing > -1 ? closing < s.length : isTextBinding;
                  html += isTextBinding ? nodeMarker : marker;
              }
              html += this.strings[l];
              return html;
          }
      }, {
          key: 'getTemplateElement',
          value: function getTemplateElement() {
              var template = document.createElement('template');
              template.innerHTML = this.getHTML();
              return template;
          }
      }]);
      return TemplateResult;
  }();
  /**
   * A TemplateResult for SVG fragments.
   *
   * This class wraps HTMl in an <svg> tag in order to parse its contents in the
   * SVG namespace, then modifies the template to remove the <svg> tag so that
   * clones only container the original fragment.
   */
  var SVGTemplateResult = function (_TemplateResult) {
      inherits(SVGTemplateResult, _TemplateResult);

      function SVGTemplateResult() {
          classCallCheck(this, SVGTemplateResult);
          return possibleConstructorReturn(this, (SVGTemplateResult.__proto__ || Object.getPrototypeOf(SVGTemplateResult)).apply(this, arguments));
      }

      createClass(SVGTemplateResult, [{
          key: 'getHTML',
          value: function getHTML() {
              return '<svg>' + get(SVGTemplateResult.prototype.__proto__ || Object.getPrototypeOf(SVGTemplateResult.prototype), 'getHTML', this).call(this) + '</svg>';
          }
      }, {
          key: 'getTemplateElement',
          value: function getTemplateElement() {
              var template = get(SVGTemplateResult.prototype.__proto__ || Object.getPrototypeOf(SVGTemplateResult.prototype), 'getTemplateElement', this).call(this);
              var content = template.content;
              var svgElement = content.firstChild;
              content.removeChild(svgElement);
              reparentNodes(content, svgElement.firstChild);
              return template;
          }
      }]);
      return SVGTemplateResult;
  }(TemplateResult);
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  var marker = '{{lit-' + String(Math.random()).slice(2) + '}}';
  /**
   * An expression marker used text-positions, not attribute positions,
   * in template.
   */
  var nodeMarker = '<!--' + marker + '-->';
  var markerRegex = new RegExp(marker + '|' + nodeMarker);
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#attributes-0
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-character
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  var lastAttributeNameRegex = /[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;
  /**
   * Finds the closing index of the last closed HTML tag.
   * This has 3 possible return values:
   *   - `-1`, meaning there is no tag in str.
   *   - `string.length`, meaning the last opened tag is unclosed.
   *   - Some positive number < str.length, meaning the index of the closing '>'.
   */
  function findTagClose(str) {
      var close = str.lastIndexOf('>');
      var open = str.indexOf('<', close + 1);
      return open > -1 ? str.length : close;
  }
  /**
   * A placeholder for a dynamic expression in an HTML template.
   *
   * There are two built-in part types: AttributePart and NodePart. NodeParts
   * always represent a single dynamic expression, while AttributeParts may
   * represent as many expressions are contained in the attribute.
   *
   * A Template's parts are mutable, so parts can be replaced or modified
   * (possibly to implement different template semantics). The contract is that
   * parts can only be replaced, not removed, added or reordered, and parts must
   * always consume the correct number of values in their `update()` method.
   *
   * TODO(justinfagnani): That requirement is a little fragile. A
   * TemplateInstance could instead be more careful about which values it gives
   * to Part.update().
   */
  var TemplatePart = function TemplatePart(type, index, name, rawName, strings) {
      classCallCheck(this, TemplatePart);

      this.type = type;
      this.index = index;
      this.name = name;
      this.rawName = rawName;
      this.strings = strings;
  };
  var isTemplatePartActive = function isTemplatePartActive(part) {
      return part.index !== -1;
  };
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */
  var Template = function Template(result, element) {
      classCallCheck(this, Template);

      this.parts = [];
      this.element = element;
      var content = this.element.content;
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
      var walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                                                          NodeFilter.SHOW_TEXT */, null, false);
      var index = -1;
      var partIndex = 0;
      var nodesToRemove = [];
      // The actual previous node, accounting for removals: if a node is removed
      // it will never be the previousNode.
      var previousNode = void 0;
      // Used to set previousNode at the top of the loop.
      var currentNode = void 0;
      while (walker.nextNode()) {
          index++;
          previousNode = currentNode;
          var node = currentNode = walker.currentNode;
          if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                  if (!node.hasAttributes()) {
                      continue;
                  }
                  var attributes = node.attributes;
                  // Per https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                  // attributes are not guaranteed to be returned in document order. In
                  // particular, Edge/IE can return them out of order, so we cannot assume
                  // a correspondance between part index and attribute index.
                  var count = 0;
                  for (var i = 0; i < attributes.length; i++) {
                      if (attributes[i].value.indexOf(marker) >= 0) {
                          count++;
                      }
                  }
                  while (count-- > 0) {
                      // Get the template literal section leading up to the first
                      // expression in this attribute
                      var stringForPart = result.strings[partIndex];
                      // Find the attribute name
                      var attributeNameInPart = lastAttributeNameRegex.exec(stringForPart)[1];
                      // Find the corresponding attribute
                      // TODO(justinfagnani): remove non-null assertion
                      var attribute = attributes.getNamedItem(attributeNameInPart);
                      var stringsForAttributeValue = attribute.value.split(markerRegex);
                      this.parts.push(new TemplatePart('attribute', index, attribute.name, attributeNameInPart, stringsForAttributeValue));
                      node.removeAttribute(attribute.name);
                      partIndex += stringsForAttributeValue.length - 1;
                  }
              } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                  var nodeValue = node.nodeValue;
                  if (nodeValue.indexOf(marker) < 0) {
                      continue;
                  }
                  var parent = node.parentNode;
                  var strings = nodeValue.split(markerRegex);
                  var lastIndex = strings.length - 1;
                  // We have a part for each match found
                  partIndex += lastIndex;
                  // Generate a new text node for each literal section
                  // These nodes are also used as the markers for node parts
                  for (var _i = 0; _i < lastIndex; _i++) {
                      parent.insertBefore(strings[_i] === '' ? document.createComment('') : document.createTextNode(strings[_i]), node);
                      this.parts.push(new TemplatePart('node', index++));
                  }
                  parent.insertBefore(strings[lastIndex] === '' ? document.createComment('') : document.createTextNode(strings[lastIndex]), node);
                  nodesToRemove.push(node);
              } else if (node.nodeType === 8 /* Node.COMMENT_NODE */ && node.nodeValue === marker) {
              var _parent = node.parentNode;
              // Add a new marker node to be the startNode of the Part if any of the
              // following are true:
              //  * We don't have a previousSibling
              //  * previousSibling is being removed (thus it's not the
              //    `previousNode`)
              //  * previousSibling is not a Text node
              //
              // TODO(justinfagnani): We should be able to use the previousNode here
              // as the marker node and reduce the number of extra nodes we add to a
              // template. See https://github.com/PolymerLabs/lit-html/issues/147
              var previousSibling = node.previousSibling;
              if (previousSibling === null || previousSibling !== previousNode || previousSibling.nodeType !== Node.TEXT_NODE) {
                  _parent.insertBefore(document.createComment(''), node);
              } else {
                  index--;
              }
              this.parts.push(new TemplatePart('node', index++));
              nodesToRemove.push(node);
              // If we don't have a nextSibling add a marker node.
              // We don't have to check if the next node is going to be removed,
              // because that node will induce a new marker if so.
              if (node.nextSibling === null) {
                  _parent.insertBefore(document.createComment(''), node);
              } else {
                  index--;
              }
              currentNode = previousNode;
              partIndex++;
          }
      }
      // Remove text binding nodes after the walk to not disturb the TreeWalker
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
          for (var _iterator = nodesToRemove[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var n = _step.value;

              n.parentNode.removeChild(n);
          }
      } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
      } finally {
          try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
              }
          } finally {
              if (_didIteratorError) {
                  throw _iteratorError;
              }
          }
      }
  };
  /**
   * Returns a value ready to be inserted into a Part from a user-provided value.
   *
   * If the user value is a directive, this invokes the directive with the given
   * part. If the value is null, it's converted to undefined to work better
   * with certain DOM APIs, like textContent.
   */
  var getValue = function getValue(part, value) {
      // `null` as the value of a Text node will render the string 'null'
      // so we convert it to undefined
      if (isDirective(value)) {
          value = value(part);
          return noChange;
      }
      return value === null ? undefined : value;
  };
  var isDirective = function isDirective(o) {
      return typeof o === 'function' && o.__litDirective === true;
  };
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  var noChange = {};
  var isPrimitiveValue = function isPrimitiveValue(value) {
      return value === null || !((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function');
  };
  var AttributePart = function () {
      function AttributePart(instance, element, name, strings) {
          classCallCheck(this, AttributePart);

          this.instance = instance;
          this.element = element;
          this.name = name;
          this.strings = strings;
          this.size = strings.length - 1;
          this._previousValues = [];
      }

      createClass(AttributePart, [{
          key: '_interpolate',
          value: function _interpolate(values, startIndex) {
              var strings = this.strings;
              var l = strings.length - 1;
              var text = '';
              for (var i = 0; i < l; i++) {
                  text += strings[i];
                  var v = getValue(this, values[startIndex + i]);
                  if (v && v !== noChange && (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                      var _iteratorNormalCompletion2 = true;
                      var _didIteratorError2 = false;
                      var _iteratorError2 = undefined;

                      try {
                          for (var _iterator2 = v[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                              var t = _step2.value;

                              // TODO: we need to recursively call getValue into iterables...
                              text += t;
                          }
                      } catch (err) {
                          _didIteratorError2 = true;
                          _iteratorError2 = err;
                      } finally {
                          try {
                              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                  _iterator2.return();
                              }
                          } finally {
                              if (_didIteratorError2) {
                                  throw _iteratorError2;
                              }
                          }
                      }
                  } else {
                      text += v;
                  }
              }
              return text + strings[l];
          }
      }, {
          key: '_equalToPreviousValues',
          value: function _equalToPreviousValues(values, startIndex) {
              for (var i = startIndex; i < startIndex + this.size; i++) {
                  if (this._previousValues[i] !== values[i] || !isPrimitiveValue(values[i])) {
                      return false;
                  }
              }
              return true;
          }
      }, {
          key: 'setValue',
          value: function setValue(values, startIndex) {
              if (this._equalToPreviousValues(values, startIndex)) {
                  return;
              }
              var s = this.strings;
              var value = void 0;
              if (s.length === 2 && s[0] === '' && s[1] === '') {
                  // An expression that occupies the whole attribute value will leave
                  // leading and trailing empty strings.
                  value = getValue(this, values[startIndex]);
                  if (Array.isArray(value)) {
                      value = value.join('');
                  }
              } else {
                  value = this._interpolate(values, startIndex);
              }
              if (value !== noChange) {
                  this.element.setAttribute(this.name, value);
              }
              this._previousValues = values;
          }
      }]);
      return AttributePart;
  }();
  var NodePart = function () {
      function NodePart(instance, startNode, endNode) {
          classCallCheck(this, NodePart);

          this.instance = instance;
          this.startNode = startNode;
          this.endNode = endNode;
          this._previousValue = undefined;
      }

      createClass(NodePart, [{
          key: 'setValue',
          value: function setValue(value) {
              value = getValue(this, value);
              if (value === noChange) {
                  return;
              }
              if (isPrimitiveValue(value)) {
                  // Handle primitive values
                  // If the value didn't change, do nothing
                  if (value === this._previousValue) {
                      return;
                  }
                  this._setText(value);
              } else if (value instanceof TemplateResult) {
                  this._setTemplateResult(value);
              } else if (Array.isArray(value) || value[Symbol.iterator]) {
                  this._setIterable(value);
              } else if (value instanceof Node) {
                  this._setNode(value);
              } else if (value.then !== undefined) {
                  this._setPromise(value);
              } else {
                  // Fallback, will render the string representation
                  this._setText(value);
              }
          }
      }, {
          key: '_insert',
          value: function _insert(node) {
              this.endNode.parentNode.insertBefore(node, this.endNode);
          }
      }, {
          key: '_setNode',
          value: function _setNode(value) {
              if (this._previousValue === value) {
                  return;
              }
              this.clear();
              this._insert(value);
              this._previousValue = value;
          }
      }, {
          key: '_setText',
          value: function _setText(value) {
              var node = this.startNode.nextSibling;
              value = value === undefined ? '' : value;
              if (node === this.endNode.previousSibling && node.nodeType === Node.TEXT_NODE) {
                  // If we only have a single text node between the markers, we can just
                  // set its value, rather than replacing it.
                  // TODO(justinfagnani): Can we just check if _previousValue is
                  // primitive?
                  node.textContent = value;
              } else {
                  this._setNode(document.createTextNode(value));
              }
              this._previousValue = value;
          }
      }, {
          key: '_setTemplateResult',
          value: function _setTemplateResult(value) {
              var template = this.instance._getTemplate(value);
              var instance = void 0;
              if (this._previousValue && this._previousValue.template === template) {
                  instance = this._previousValue;
              } else {
                  instance = new TemplateInstance(template, this.instance._partCallback, this.instance._getTemplate);
                  this._setNode(instance._clone());
                  this._previousValue = instance;
              }
              instance.update(value.values);
          }
      }, {
          key: '_setIterable',
          value: function _setIterable(value) {
              // For an Iterable, we create a new InstancePart per item, then set its
              // value to the item. This is a little bit of overhead for every item in
              // an Iterable, but it lets us recurse easily and efficiently update Arrays
              // of TemplateResults that will be commonly returned from expressions like:
              // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
              // If _previousValue is an array, then the previous render was of an
              // iterable and _previousValue will contain the NodeParts from the previous
              // render. If _previousValue is not an array, clear this part and make a new
              // array for NodeParts.
              if (!Array.isArray(this._previousValue)) {
                  this.clear();
                  this._previousValue = [];
              }
              // Lets us keep track of how many items we stamped so we can clear leftover
              // items from a previous render
              var itemParts = this._previousValue;
              var partIndex = 0;
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = value[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var item = _step3.value;

                      // Try to reuse an existing part
                      var itemPart = itemParts[partIndex];
                      // If no existing part, create a new one
                      if (itemPart === undefined) {
                          // If we're creating the first item part, it's startNode should be the
                          // container's startNode
                          var itemStart = this.startNode;
                          // If we're not creating the first part, create a new separator marker
                          // node, and fix up the previous part's endNode to point to it
                          if (partIndex > 0) {
                              var previousPart = itemParts[partIndex - 1];
                              itemStart = previousPart.endNode = document.createTextNode('');
                              this._insert(itemStart);
                          }
                          itemPart = new NodePart(this.instance, itemStart, this.endNode);
                          itemParts.push(itemPart);
                      }
                      itemPart.setValue(item);
                      partIndex++;
                  }
              } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                          _iterator3.return();
                      }
                  } finally {
                      if (_didIteratorError3) {
                          throw _iteratorError3;
                      }
                  }
              }

              if (partIndex === 0) {
                  this.clear();
                  this._previousValue = undefined;
              } else if (partIndex < itemParts.length) {
                  var lastPart = itemParts[partIndex - 1];
                  // Truncate the parts array so _previousValue reflects the current state
                  itemParts.length = partIndex;
                  this.clear(lastPart.endNode.previousSibling);
                  lastPart.endNode = this.endNode;
              }
          }
      }, {
          key: '_setPromise',
          value: function _setPromise(value) {
              var _this2 = this;

              this._previousValue = value;
              value.then(function (v) {
                  if (_this2._previousValue === value) {
                      _this2.setValue(v);
                  }
              });
          }
      }, {
          key: 'clear',
          value: function clear() {
              var startNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.startNode;

              removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
          }
      }]);
      return NodePart;
  }();
  var defaultPartCallback = function defaultPartCallback(instance, templatePart, node) {
      if (templatePart.type === 'attribute') {
          return new AttributePart(instance, node, templatePart.name, templatePart.strings);
      } else if (templatePart.type === 'node') {
          return new NodePart(instance, node, node.nextSibling);
      }
      throw new Error('Unknown part type ' + templatePart.type);
  };
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  var TemplateInstance = function () {
      function TemplateInstance(template, partCallback, getTemplate) {
          classCallCheck(this, TemplateInstance);

          this._parts = [];
          this.template = template;
          this._partCallback = partCallback;
          this._getTemplate = getTemplate;
      }

      createClass(TemplateInstance, [{
          key: 'update',
          value: function update(values) {
              var valueIndex = 0;
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                  for (var _iterator4 = this._parts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var part = _step4.value;

                      if (!part) {
                          valueIndex++;
                      } else if (part.size === undefined) {
                          part.setValue(values[valueIndex]);
                          valueIndex++;
                      } else {
                          part.setValue(values, valueIndex);
                          valueIndex += part.size;
                      }
                  }
              } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return) {
                          _iterator4.return();
                      }
                  } finally {
                      if (_didIteratorError4) {
                          throw _iteratorError4;
                      }
                  }
              }
          }
      }, {
          key: '_clone',
          value: function _clone() {
              // Clone the node, rather than importing it, to keep the fragment in the
              // template's document. This leaves the fragment inert so custom elements
              // won't upgrade until after the main document adopts the node.
              var fragment = this.template.element.content.cloneNode(true);
              var parts = this.template.parts;
              if (parts.length > 0) {
                  // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
                  // null
                  var _walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                                                                        NodeFilter.SHOW_TEXT */, null, false);
                  var _index = -1;
                  for (var i = 0; i < parts.length; i++) {
                      var part = parts[i];
                      var partActive = isTemplatePartActive(part);
                      // An inactive part has no coresponding Template node.
                      if (partActive) {
                          while (_index < part.index) {
                              _index++;
                              _walker.nextNode();
                          }
                      }
                      this._parts.push(partActive ? this._partCallback(this, part, _walker.currentNode) : undefined);
                  }
              }
              return fragment;
          }
      }]);
      return TemplateInstance;
  }();
  /**
   * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), into another container (could be the same container), before
   * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
   * container.
   */
  var reparentNodes = function reparentNodes(container, start) {
      var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var before = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var node = start;
      while (node !== end) {
          var n = node.nextSibling;
          container.insertBefore(node, before);
          node = n;
      }
  };
  /**
   * Removes nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), from `container`.
   */
  var removeNodes = function removeNodes(container, startNode) {
      var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var node = startNode;
      while (node !== endNode) {
          var n = node.nextSibling;
          container.removeChild(node);
          node = n;
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var walkerNodeFilter = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1, removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
      var content = template.element.content,
          parts = template.parts;

      var walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      var partIndex = 0;
      var part = parts[0];
      var nodeIndex = -1;
      var removeCount = 0;
      var nodesToRemoveInTemplate = [];
      var currentRemovingNode = null;
      while (walker.nextNode()) {
          nodeIndex++;
          var node = walker.currentNode;
          // End removal if stepped past the removing node
          if (node.previousSibling === currentRemovingNode) {
              currentRemovingNode = null;
          }
          // A node to remove was found in the template
          if (nodesToRemove.has(node)) {
              nodesToRemoveInTemplate.push(node);
              // Track node we're removing
              if (currentRemovingNode === null) {
                  currentRemovingNode = node;
              }
          }
          // When removing, increment count by which to adjust subsequent part indices
          if (currentRemovingNode !== null) {
              removeCount++;
          }
          while (part !== undefined && part.index === nodeIndex) {
              // If part is in a removed node deactivate it by setting index to -1 or
              // adjust the index as needed.
              part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
              part = parts[++partIndex];
          }
      }
      nodesToRemoveInTemplate.forEach(function (n) {
          return n.parentNode.removeChild(n);
      });
  }
  var countNodes = function countNodes(node) {
      var count = 1;
      var walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
      while (walker.nextNode()) {
          count++;
      }
      return count;
  };
  var nextActiveIndexInTemplateParts = function nextActiveIndexInTemplateParts(parts) {
      var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      for (var i = startIndex + 1; i < parts.length; i++) {
          var part = parts[i];
          if (isTemplatePartActive(part)) {
              return i;
          }
      }
      return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node) {
      var refNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var content = template.element.content,
          parts = template.parts;
      // If there's no refNode, then put node at end of template.
      // No part indices need to be shifted in this case.

      if (refNode === null || refNode === undefined) {
          content.appendChild(node);
          return;
      }
      var walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      var partIndex = nextActiveIndexInTemplateParts(parts);
      var insertCount = 0;
      var walkerIndex = -1;
      while (walker.nextNode()) {
          walkerIndex++;
          var walkerNode = walker.currentNode;
          if (walkerNode === refNode) {
              refNode.parentNode.insertBefore(node, refNode);
              insertCount = countNodes(node);
          }
          while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
              // If we've inserted the node, simply adjust all subsequent parts
              if (insertCount > 0) {
                  while (partIndex !== -1) {
                      parts[partIndex].index += insertCount;
                      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                  }
                  return;
              }
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  var getTemplateCacheKey = function getTemplateCacheKey(type, scopeName) {
      return type + '--' + scopeName;
  };
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  var shadyTemplateFactory = function shadyTemplateFactory(scopeName) {
      return function (result) {
          var cacheKey = getTemplateCacheKey(result.type, scopeName);
          var templateCache = templateCaches.get(cacheKey);
          if (templateCache === undefined) {
              templateCache = new Map();
              templateCaches.set(cacheKey, templateCache);
          }
          var template = templateCache.get(result.strings);
          if (template === undefined) {
              var element = result.getTemplateElement();
              if (_typeof(window.ShadyCSS) === 'object') {
                  window.ShadyCSS.prepareTemplateDom(element, scopeName);
              }
              template = new Template(result, element);
              templateCache.set(result.strings, template);
          }
          return template;
      };
  };
  var TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  function removeStylesFromLitTemplates(scopeName) {
      TEMPLATE_TYPES.forEach(function (type) {
          var templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
          if (templates !== undefined) {
              templates.forEach(function (template) {
                  var content = template.element.content;

                  var styles = content.querySelectorAll('style');
                  removeNodesFromTemplate(template, new Set(Array.from(styles)));
              });
          }
      });
  }
  var shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered output.
   */
  var ensureStylesScoped = function ensureStylesScoped(fragment, template, scopeName) {
      // only scope element template once per scope name
      if (!shadyRenderSet.has(scopeName)) {
          shadyRenderSet.add(scopeName);
          var styleTemplate = document.createElement('template');
          Array.from(fragment.querySelectorAll('style')).forEach(function (s) {
              styleTemplate.content.appendChild(s);
          });
          window.ShadyCSS.prepareTemplateStyles(styleTemplate, scopeName);
          // Fix templates: note the expectation here is that the given `fragment`
          // has been generated from the given `template` which contains
          // the set of templates rendered into this scope.
          // It is only from this set of initial templates from which styles
          // will be scoped and removed.
          removeStylesFromLitTemplates(scopeName);
          // ApplyShim case
          if (window.ShadyCSS.nativeShadow) {
              var style = styleTemplate.content.querySelector('style');
              if (style !== null) {
                  // Insert style into rendered fragment
                  fragment.insertBefore(style, fragment.firstChild);
                  // Insert into lit-template (for subsequent renders)
                  insertNodeIntoTemplate(template, style.cloneNode(true), template.element.content.firstChild);
              }
          }
      }
  };
  // NOTE: We're copying code from lit-html's `render` method here.
  // We're doing this explicitly because the API for rendering templates is likely
  // to change in the near term.
  function render$1(result, container, scopeName) {
      var templateFactory = shadyTemplateFactory(scopeName);
      var template = templateFactory(result);
      var instance = container.__templateInstance;
      // Repeat render, just call update()
      if (instance !== undefined && instance.template === template && instance._partCallback === result.partCallback) {
          instance.update(result.values);
          return;
      }
      // First render, create a new TemplateInstance and append it
      instance = new TemplateInstance(template, result.partCallback, templateFactory);
      container.__templateInstance = instance;
      var fragment = instance._clone();
      instance.update(result.values);
      var host = container instanceof ShadowRoot ? container.host : undefined;
      // If there's a shadow host, do ShadyCSS scoping...
      if (host !== undefined && _typeof(window.ShadyCSS) === 'object') {
          ensureStylesScoped(fragment, template, scopeName);
          window.ShadyCSS.styleElement(host);
      }
      removeNodes(container, container.firstChild);
      container.appendChild(fragment);
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Interprets a template literal as a lit-extended HTML template.
   */
  var html$1 = function html$$1(strings) {
      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          values[_key - 1] = arguments[_key];
      }

      return new TemplateResult(strings, values, 'html', extendedPartCallback);
  };
  /**
   * A PartCallback which allows templates to set properties and declarative
   * event handlers.
   *
   * Properties are set by default, instead of attributes. Attribute names in
   * lit-html templates preserve case, so properties are case sensitive. If an
   * expression takes up an entire attribute value, then the property is set to
   * that value. If an expression is interpolated with a string or other
   * expressions then the property is set to the string result of the
   * interpolation.
   *
   * To set an attribute instead of a property, append a `$` suffix to the
   * attribute name.
   *
   * Example:
   *
   *     html`<button class$="primary">Buy Now</button>`
   *
   * To set an event handler, prefix the attribute name with `on-`:
   *
   * Example:
   *
   *     html`<button on-click=${(e)=> this.onClickHandler(e)}>Buy Now</button>`
   *
   */
  var extendedPartCallback = function extendedPartCallback(instance, templatePart, node) {
      if (templatePart.type === 'attribute') {
          if (templatePart.rawName.substr(0, 3) === 'on-') {
              var eventName = templatePart.rawName.slice(3);
              return new EventPart(instance, node, eventName);
          }
          var lastChar = templatePart.name.substr(templatePart.name.length - 1);
          if (lastChar === '$') {
              var name = templatePart.name.slice(0, -1);
              return new AttributePart(instance, node, name, templatePart.strings);
          }
          if (lastChar === '?') {
              var _name = templatePart.name.slice(0, -1);
              return new BooleanAttributePart(instance, node, _name, templatePart.strings);
          }
          return new PropertyPart(instance, node, templatePart.rawName, templatePart.strings);
      }
      return defaultPartCallback(instance, templatePart, node);
  };
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  var BooleanAttributePart = function (_AttributePart) {
      inherits(BooleanAttributePart, _AttributePart);

      function BooleanAttributePart() {
          classCallCheck(this, BooleanAttributePart);
          return possibleConstructorReturn(this, (BooleanAttributePart.__proto__ || Object.getPrototypeOf(BooleanAttributePart)).apply(this, arguments));
      }

      createClass(BooleanAttributePart, [{
          key: 'setValue',
          value: function setValue(values, startIndex) {
              var s = this.strings;
              if (s.length === 2 && s[0] === '' && s[1] === '') {
                  var value = getValue(this, values[startIndex]);
                  if (value === noChange) {
                      return;
                  }
                  if (value) {
                      this.element.setAttribute(this.name, '');
                  } else {
                      this.element.removeAttribute(this.name);
                  }
              } else {
                  throw new Error('boolean attributes can only contain a single expression');
              }
          }
      }]);
      return BooleanAttributePart;
  }(AttributePart);
  var PropertyPart = function (_AttributePart2) {
      inherits(PropertyPart, _AttributePart2);

      function PropertyPart() {
          classCallCheck(this, PropertyPart);
          return possibleConstructorReturn(this, (PropertyPart.__proto__ || Object.getPrototypeOf(PropertyPart)).apply(this, arguments));
      }

      createClass(PropertyPart, [{
          key: 'setValue',
          value: function setValue(values, startIndex) {
              var s = this.strings;
              var value = void 0;
              if (this._equalToPreviousValues(values, startIndex)) {
                  return;
              }
              if (s.length === 2 && s[0] === '' && s[1] === '') {
                  // An expression that occupies the whole attribute value will leave
                  // leading and trailing empty strings.
                  value = getValue(this, values[startIndex]);
              } else {
                  // Interpolation, so interpolate
                  value = this._interpolate(values, startIndex);
              }
              if (value !== noChange) {
                  this.element[this.name] = value;
              }
              this._previousValues = values;
          }
      }]);
      return PropertyPart;
  }(AttributePart);
  var EventPart = function () {
      function EventPart(instance, element, eventName) {
          classCallCheck(this, EventPart);

          this.instance = instance;
          this.element = element;
          this.eventName = eventName;
      }

      createClass(EventPart, [{
          key: 'setValue',
          value: function setValue(value) {
              var listener = getValue(this, value);
              if (listener === this._listener) {
                  return;
              }
              if (listener == null) {
                  this.element.removeEventListener(this.eventName, this);
              } else if (this._listener == null) {
                  this.element.addEventListener(this.eventName, this);
              }
              this._listener = listener;
          }
      }, {
          key: 'handleEvent',
          value: function handleEvent(event) {
              if (typeof this._listener === 'function') {
                  this._listener.call(this.element, event);
              } else if (typeof this._listener.handleEvent === 'function') {
                  this._listener.handleEvent(event);
              }
          }
      }]);
      return EventPart;
  }();

  /**
   * Returns a string of css class names formed by taking the properties
   * in the `classInfo` object and appending the property name to the string of
   * class names if the property value is truthy.
   * @param classInfo
   */
  function classString(classInfo) {
      var o = [];
      for (var name in classInfo) {
          var v = classInfo[name];
          if (v) {
              o.push(name);
          }
      }
      return o.join(' ');
  }
  var LitElement = function (_PropertiesMixin) {
      inherits(LitElement, _PropertiesMixin);

      function LitElement() {
          classCallCheck(this, LitElement);

          var _this = possibleConstructorReturn(this, (LitElement.__proto__ || Object.getPrototypeOf(LitElement)).apply(this, arguments));

          _this.__renderComplete = null;
          _this.__resolveRenderComplete = null;
          _this.__isInvalid = false;
          _this.__isChanging = false;
          return _this;
      }
      /**
       * Override which sets up element rendering by calling* `_createRoot`
       * and `_firstRendered`.
       */


      createClass(LitElement, [{
          key: 'ready',
          value: function ready() {
              this._root = this._createRoot();
              get(LitElement.prototype.__proto__ || Object.getPrototypeOf(LitElement.prototype), 'ready', this).call(this);
              this._firstRendered();
          }
      }, {
          key: 'connectedCallback',
          value: function connectedCallback() {
              if (window.ShadyCSS && this._root) {
                  window.ShadyCSS.styleElement(this);
              }
              get(LitElement.prototype.__proto__ || Object.getPrototypeOf(LitElement.prototype), 'connectedCallback', this).call(this);
          }
          /**
           * Called after the element DOM is rendered for the first time.
           * Implement to perform tasks after first rendering like capturing a
           * reference to a static node which must be directly manipulated.
           * This should not be commonly needed. For tasks which should be performed
           * before first render, use the element constructor.
           */

      }, {
          key: '_firstRendered',
          value: function _firstRendered() {}
          /**
           * Implement to customize where the element's template is rendered by
           * returning an element into which to render. By default this creates
           * a shadowRoot for the element. To render into the element's childNodes,
           * return `this`.
           * @returns {Element|DocumentFragment} Returns a node into which to render.
           */

      }, {
          key: '_createRoot',
          value: function _createRoot() {
              return this.attachShadow({ mode: 'open' });
          }
          /**
           * Override which returns the value of `_shouldRender` which users
           * should implement to control rendering. If this method returns false,
           * _propertiesChanged will not be called and no rendering will occur even
           * if property values change or `requestRender` is called.
           * @param _props Current element properties
           * @param _changedProps Changing element properties
           * @param _prevProps Previous element properties
           * @returns {boolean} Default implementation always returns true.
           */

      }, {
          key: '_shouldPropertiesChange',
          value: function _shouldPropertiesChange(_props, _changedProps, _prevProps) {
              var shouldRender = this._shouldRender(_props, _changedProps, _prevProps);
              if (!shouldRender && this.__resolveRenderComplete) {
                  this.__resolveRenderComplete(false);
              }
              return shouldRender;
          }
          /**
           * Implement to control if rendering should occur when property values
           * change or `requestRender` is called. By default, this method always
           * returns true, but this can be customized as an optimization to avoid
           * rendering work when changes occur which should not be rendered.
           * @param _props Current element properties
           * @param _changedProps Changing element properties
           * @param _prevProps Previous element properties
           * @returns {boolean} Default implementation always returns true.
           */

      }, {
          key: '_shouldRender',
          value: function _shouldRender(_props, _changedProps, _prevProps) {
              return true;
          }
          /**
           * Override which performs element rendering by calling
           * `_render`, `_applyRender`, and finally `_didRender`.
           * @param props Current element properties
           * @param changedProps Changing element properties
           * @param prevProps Previous element properties
           */

      }, {
          key: '_propertiesChanged',
          value: function _propertiesChanged(props, changedProps, prevProps) {
              get(LitElement.prototype.__proto__ || Object.getPrototypeOf(LitElement.prototype), '_propertiesChanged', this).call(this, props, changedProps, prevProps);
              var result = this._render(props);
              if (result && this._root !== undefined) {
                  this._applyRender(result, this._root);
              }
              this._didRender(props, changedProps, prevProps);
              if (this.__resolveRenderComplete) {
                  this.__resolveRenderComplete(true);
              }
          }
      }, {
          key: '_flushProperties',
          value: function _flushProperties() {
              this.__isChanging = true;
              this.__isInvalid = false;
              get(LitElement.prototype.__proto__ || Object.getPrototypeOf(LitElement.prototype), '_flushProperties', this).call(this);
              this.__isChanging = false;
          }
          /**
           * Override which warns when a user attempts to change a property during
           * the rendering lifecycle. This is an anti-pattern and should be avoided.
           * @param property {string}
           * @param value {any}
           * @param old {any}
           */
          // tslint:disable-next-line no-any

      }, {
          key: '_shouldPropertyChange',
          value: function _shouldPropertyChange(property, value, old) {
              var change = get(LitElement.prototype.__proto__ || Object.getPrototypeOf(LitElement.prototype), '_shouldPropertyChange', this).call(this, property, value, old);
              if (change && this.__isChanging) {
                  console.trace('Setting properties in response to other properties changing ' + ('considered harmful. Setting \'' + property + '\' from ') + ('\'' + this._getProperty(property) + '\' to \'' + value + '\'.'));
              }
              return change;
          }
          /**
           * Implement to describe the DOM which should be rendered in the element.
           * Ideally, the implementation is a pure function using only props to describe
           * the element template. The implementation must return a `lit-html`
           * TemplateResult. By default this template is rendered into the element's
           * shadowRoot. This can be customized by implementing `_createRoot`. This
           * method must be implemented.
           * @param {*} _props Current element properties
           * @returns {TemplateResult} Must return a lit-html TemplateResult.
           */

      }, {
          key: '_render',
          value: function _render(_props) {
              throw new Error('_render() not implemented');
          }
          /**
           * Renders the given lit-html template `result` into the given `node`.
           * Implement to customize the way rendering is applied. This is should not
           * typically be needed and is provided for advanced use cases.
           * @param result {TemplateResult} `lit-html` template result to render
           * @param node {Element|DocumentFragment} node into which to render
           */

      }, {
          key: '_applyRender',
          value: function _applyRender(result, node) {
              render$1(result, node, this.localName);
          }
          /**
           * Called after element DOM has been rendered. Implement to
           * directly control rendered DOM. Typically this is not needed as `lit-html`
           * can be used in the `_render` method to set properties, attributes, and
           * event listeners. However, it is sometimes useful for calling methods on
           * rendered elements, like calling `focus()` on an element to focus it.
           * @param _props Current element properties
           * @param _changedProps Changing element properties
           * @param _prevProps Previous element properties
           */

      }, {
          key: '_didRender',
          value: function _didRender(_props, _changedProps, _prevProps) {}
          /**
           * Call to request the element to asynchronously re-render regardless
           * of whether or not any property changes are pending.
           */

      }, {
          key: 'requestRender',
          value: function requestRender() {
              this._invalidateProperties();
          }
          /**
           * Override which provides tracking of invalidated state.
           */

      }, {
          key: '_invalidateProperties',
          value: function _invalidateProperties() {
              this.__isInvalid = true;
              get(LitElement.prototype.__proto__ || Object.getPrototypeOf(LitElement.prototype), '_invalidateProperties', this).call(this);
          }
          /**
           * Returns a promise which resolves after the element next renders.
           * The promise resolves to `true` if the element rendered and `false` if the
           * element did not render.
           * This is useful when users (e.g. tests) need to react to the rendered state
           * of the element after a change is made.
           * This can also be useful in event handlers if it is desireable to wait
           * to send an event until after rendering. If possible implement the
           * `_didRender` method to directly respond to rendering within the
           * rendering lifecycle.
           */

      }, {
          key: 'renderComplete',
          get: function get$$1() {
              var _this2 = this;

              if (!this.__renderComplete) {
                  this.__renderComplete = new Promise(function (resolve) {
                      _this2.__resolveRenderComplete = function (value) {
                          _this2.__resolveRenderComplete = _this2.__renderComplete = null;
                          resolve(value);
                      };
                  });
                  if (!this.__isInvalid && this.__resolveRenderComplete) {
                      Promise.resolve().then(function () {
                          return _this2.__resolveRenderComplete(false);
                      });
                  }
              }
              return this.__renderComplete;
          }
      }]);
      return LitElement;
  }(PropertiesMixin(HTMLElement));

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function _arity(n, fn) {
    /* eslint-disable no-unused-vars */
    switch (n) {
      case 0:
        return function () {
          return fn.apply(this, arguments);
        };
      case 1:
        return function (a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function (a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function (a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function (a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function (a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function (a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function (a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function (a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
  }

  function _pipe(f, g) {
    return function () {
      return g.call(this, f.apply(this, arguments));
    };
  }

  function _isPlaceholder(a) {
         return a != null && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a['@@functional/placeholder'] === true;
  }

  /**
   * Optimized internal one-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  /**
   * Optimized internal two-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function (_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  /**
   * Optimized internal three-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function (_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function (_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function (_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function (_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  /**
   * Tests whether or not an object is an array.
   *
   * @private
   * @param {*} val The object to test.
   * @return {Boolean} `true` if `val` is an array, `false` otherwise.
   * @example
   *
   *      _isArray([]); //=> true
   *      _isArray(null); //=> false
   *      _isArray({}); //=> false
   */
  var _isArray = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
  };

  function _isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
  }

  /**
   * Tests whether or not an object is similar to an array.
   *
   * @private
   * @category Type
   * @category List
   * @sig * -> Boolean
   * @param {*} x The object to test.
   * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
   * @example
   *
   *      _isArrayLike([]); //=> true
   *      _isArrayLike(true); //=> false
   *      _isArrayLike({}); //=> false
   *      _isArrayLike({length: 10}); //=> false
   *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
   */
  var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.nodeType === 1) {
      return !!x.length;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });

  var XWrap = /*#__PURE__*/function () {
    function XWrap(fn) {
      this.f = fn;
    }
    XWrap.prototype['@@transducer/init'] = function () {
      throw new Error('init not implemented on XWrap');
    };
    XWrap.prototype['@@transducer/result'] = function (acc) {
      return acc;
    };
    XWrap.prototype['@@transducer/step'] = function (acc, x) {
      return this.f(acc, x);
    };

    return XWrap;
  }();

  function _xwrap(fn) {
    return new XWrap(fn);
  }

  /**
   * Creates a function that is bound to a context.
   * Note: `R.bind` does not provide the additional argument-binding capabilities of
   * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
   *
   * @func
   * @memberOf R
   * @since v0.6.0
   * @category Function
   * @category Object
   * @sig (* -> *) -> {*} -> (* -> *)
   * @param {Function} fn The function to bind to context
   * @param {Object} thisObj The context to bind `fn` to
   * @return {Function} A function that will execute in the context of `thisObj`.
   * @see R.partial
   * @example
   *
   *      var log = R.bind(console.log, console);
   *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
   *      // logs {a: 2}
   * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
   */
  var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function () {
      return fn.apply(thisObj, arguments);
    });
  });

  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

  function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list, 'reduce');
    }

    throw new TypeError('reduce: list must be array or iterable');
  }

  /**
   * Returns a single item by iterating through the list, successively calling
   * the iterator function and passing it an accumulator value and the current
   * value from the array, and then passing the result to the next call.
   *
   * The iterator function receives two values: *(acc, value)*. It may use
   * [`R.reduced`](#reduced) to shortcut the iteration.
   *
   * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
   * is *(value, acc)*.
   *
   * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
   * arrays), unlike the native `Array.prototype.reduce` method. For more details
   * on this behavior, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
   *
   * Dispatches to the `reduce` method of the third argument, if present. When
   * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
   * shortcuting, as this is not implemented by `reduce`.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig ((a, b) -> a) -> a -> [b] -> a
   * @param {Function} fn The iterator function. Receives two values, the accumulator and the
   *        current element from the array.
   * @param {*} acc The accumulator value.
   * @param {Array} list The list to iterate over.
   * @return {*} The final, accumulated value.
   * @see R.reduced, R.addIndex, R.reduceRight
   * @example
   *
   *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
   *      //          -               -10
   *      //         / \              / \
   *      //        -   4           -6   4
   *      //       / \              / \
   *      //      -   3   ==>     -3   3
   *      //     / \              / \
   *      //    -   2           -1   2
   *      //   / \              / \
   *      //  0   1            0   1
   *
   * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
   */
  var reduce = /*#__PURE__*/_curry3(_reduce);

  /**
   * This checks whether a function has a [methodname] function. If it isn't an
   * array it will execute that function otherwise it will default to the ramda
   * implementation.
   *
   * @private
   * @param {Function} fn ramda implemtation
   * @param {String} methodname property to check for a custom implementation
   * @return {Object} Whatever the return value of the method is.
   */
  function _checkForMethod(methodname, fn) {
    return function () {
      var length = arguments.length;
      if (length === 0) {
        return fn();
      }
      var obj = arguments[length - 1];
      return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
  }

  /**
   * Returns the elements of the given list or string (or object with a `slice`
   * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
   *
   * Dispatches to the `slice` method of the third argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.4
   * @category List
   * @sig Number -> Number -> [a] -> [a]
   * @sig Number -> Number -> String -> String
   * @param {Number} fromIndex The start index (inclusive).
   * @param {Number} toIndex The end index (exclusive).
   * @param {*} list
   * @return {*}
   * @example
   *
   *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
   *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
   *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
   *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
   *      R.slice(0, 3, 'ramda');                     //=> 'ram'
   */
  var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
  }));

  /**
   * Returns all but the first element of the given list or string (or object
   * with a `tail` method).
   *
   * Dispatches to the `slice` method of the first argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a]
   * @sig String -> String
   * @param {*} list
   * @return {*}
   * @see R.head, R.init, R.last
   * @example
   *
   *      R.tail([1, 2, 3]);  //=> [2, 3]
   *      R.tail([1, 2]);     //=> [2]
   *      R.tail([1]);        //=> []
   *      R.tail([]);         //=> []
   *
   *      R.tail('abc');  //=> 'bc'
   *      R.tail('ab');   //=> 'b'
   *      R.tail('a');    //=> ''
   *      R.tail('');     //=> ''
   */
  var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));

  /**
   * Performs left-to-right function composition. The leftmost function may have
   * any arity; the remaining functions must be unary.
   *
   * In some libraries this function is named `sequence`.
   *
   * **Note:** The result of pipe is not automatically curried.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
   * @param {...Function} functions
   * @return {Function}
   * @see R.compose
   * @example
   *
   *      var f = R.pipe(Math.pow, R.negate, R.inc);
   *
   *      f(3, 4); // -(3^4) + 1
   * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
   */
  function pipe() {
    if (arguments.length === 0) {
      throw new Error('pipe requires at least one argument');
    }
    return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
  }

  /**
   * Returns a new list or string with the elements or characters in reverse
   * order.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig [a] -> [a]
   * @sig String -> String
   * @param {Array|String} list
   * @return {Array|String}
   * @example
   *
   *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
   *      R.reverse([1, 2]);     //=> [2, 1]
   *      R.reverse([1]);        //=> [1]
   *      R.reverse([]);         //=> []
   *
   *      R.reverse('abc');      //=> 'cba'
   *      R.reverse('ab');       //=> 'ba'
   *      R.reverse('a');        //=> 'a'
   *      R.reverse('');         //=> ''
   */
  var reverse = /*#__PURE__*/_curry1(function reverse(list) {
    return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
  });

  /**
   * Performs right-to-left function composition. The rightmost function may have
   * any arity; the remaining functions must be unary.
   *
   * **Note:** The result of compose is not automatically curried.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
   * @param {...Function} ...functions The functions to compose
   * @return {Function}
   * @see R.pipe
   * @example
   *
   *      var classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
   *      var yellGreeting = R.compose(R.toUpper, classyGreeting);
   *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
   *
   *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
   *
   * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
   */
  function compose() {
    if (arguments.length === 0) {
      throw new Error('compose requires at least one argument');
    }
    return pipe.apply(this, reverse(arguments));
  }

  var compose$1 = /*#__PURE__*/Object.freeze({
    default: compose
  });

  /**
   * Private `concat` function to merge two array-like objects.
   *
   * @private
   * @param {Array|Arguments} [set1=[]] An array-like object.
   * @param {Array|Arguments} [set2=[]] An array-like object.
   * @return {Array} A new, merged array.
   * @example
   *
   *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
   */
  function _concat(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = [];

    idx = 0;
    while (idx < len1) {
      result[result.length] = set1[idx];
      idx += 1;
    }
    idx = 0;
    while (idx < len2) {
      result[result.length] = set2[idx];
      idx += 1;
    }
    return result;
  }

  function _createPartialApplicator(concat) {
    return _curry2(function (fn, args) {
      return _arity(Math.max(0, fn.length - args.length), function () {
        return fn.apply(this, concat(args, arguments));
      });
    });
  }

  /**
   * Internal curryN function.
   *
   * @private
   * @category Function
   * @param {Number} length The arity of the curried function.
   * @param {Array} received An array of arguments received thus far.
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curryN(length, received, fn) {
    return function () {
      var combined = [];
      var argsIdx = 0;
      var left = length;
      var combinedIdx = 0;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        }
        combinedIdx += 1;
      }
      return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
    };
  }

  /**
   * Returns a curried equivalent of the provided function, with the specified
   * arity. The curried function has two unusual capabilities. First, its
   * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.5.0
   * @category Function
   * @sig Number -> (* -> a) -> (* -> a)
   * @param {Number} length The arity for the returned function.
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curry
   * @example
   *
   *      var sumArgs = (...args) => R.sum(args);
   *
   *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
   *      var f = curriedAddFourNumbers(1, 2);
   *      var g = f(3);
   *      g(4); //=> 10
   */
  var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
    if (length === 1) {
      return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
  });

  /**
   * Returns a new function much like the supplied one, except that the first two
   * arguments' order is reversed.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig ((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)
   * @param {Function} fn The function to invoke with its first two parameters reversed.
   * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
   * @example
   *
   *      var mergeThree = (a, b, c) => [].concat(a, b, c);
   *
   *      mergeThree(1, 2, 3); //=> [1, 2, 3]
   *
   *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
   * @symb R.flip(f)(a, b, c) = f(b, a, c)
   */
  var flip = /*#__PURE__*/_curry1(function flip(fn) {
    return curryN(fn.length, function (a, b) {
      var args = Array.prototype.slice.call(arguments, 0);
      args[0] = b;
      args[1] = a;
      return fn.apply(this, args);
    });
  });

  /**
   * Takes a function `f` and a list of arguments, and returns a function `g`.
   * When applied, `g` returns the result of applying `f` to the arguments
   * provided to `g` followed by the arguments provided initially.
   *
   * @func
   * @memberOf R
   * @since v0.10.0
   * @category Function
   * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
   * @param {Function} f
   * @param {Array} args
   * @return {Function}
   * @see R.partial
   * @example
   *
   *      var greet = (salutation, title, firstName, lastName) =>
   *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
   *
   *      var greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
   *
   *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
   * @symb R.partialRight(f, [a, b])(c, d) = f(c, d, a, b)
   */
  var partialRight = /*#__PURE__*/_createPartialApplicator( /*#__PURE__*/flip(_concat));

  var partialRight$1 = /*#__PURE__*/Object.freeze({
    default: partialRight
  });

  var _compose = ( compose$1 && compose ) || compose$1;

  var _partialRight = ( partialRight$1 && partialRight ) || partialRight$1;

  var utils = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.registerCustomElement = exports.toBinary = exports.bindMixins = exports.combineMixins = undefined;

    var _compose2 = /*#__PURE__*/_interopRequireDefault(_compose);

    var _partialRight2 = /*#__PURE__*/_interopRequireDefault(_partialRight);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }return arr2;
      } else {
        return Array.from(arr);
      }
    }

    function _toArray(arr) {
      return Array.isArray(arr) ? arr : Array.from(arr);
    }

    // it: Array<mixed>
    var apply = function apply(it) {
      return it.map(function (_ref) {
        var _ref2 = _toArray(_ref),
            mixin = _ref2[0],
            v = _ref2.slice(1);

        return (0, _partialRight2.default)(mixin, v);
      });
    };

    /**
     * Apply multiple mixins to the CustomElement
     *
     * var applyTo = combineMixins([
     *   [mixin: Mixin<mixed>, data]
     * ])
     * customElements.define('custom-element', applyTo(customElement))
     *
     * @param {Array<Array<[Mixin<mixed>, mixed]>>} it
     */
    var combineMixins = exports.combineMixins = function combineMixins(it) {
      return _compose2.default.apply(undefined, _toConsumableArray(apply(it)));
    };

    var bindMixins = exports.bindMixins = function bindMixins(context) {
      return function (map) {
        return Object.keys(map).reduce(function (acc, key) {
          acc[key] = acc[key].length >= 1 ? map[key](context) : map[key]();

          return acc;
        }, Object.assign({}, map));
      };
    };

    var toBinary = exports.toBinary = function toBinary(policy) {
      return parseInt(policy, 2);
    };

    var registerCustomElement = exports.registerCustomElement = function registerCustomElement(key, value) {
      if (!key || !value) throw new Error('CustomElement is not specified');
      !window.customElements.get(key) && window.customElements.define(key, value);
    };
  });

  unwrapExports(utils);
  var utils_1 = utils.registerCustomElement;
  var utils_2 = utils.toBinary;
  var utils_3 = utils.bindMixins;
  var utils_4 = utils.combineMixins;

  var _templateObject = taggedTemplateLiteral(['<style>', '</style>'], ['<style>', '</style>']),
      _templateObject2 = taggedTemplateLiteral(['\n        ', '\n        ', '\n      '], ['\n        ', '\n        ', '\n      ']);

  var withStyle = function withStyle(html$$1) {
    html$$1 = html$$1 || html$1; // eslint-disable-line no-param-reassign

    return function (base) {
      for (var _len = arguments.length, styles = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        styles[_key - 1] = arguments[_key];
      }

      return function (_base) {
        inherits(_class, _base);

        function _class() {
          classCallCheck(this, _class);
          return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
          key: '__renderStyles',
          value: function __renderStyles() {
            for (var _len2 = arguments.length, argv = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              argv[_key2] = arguments[_key2];
            }

            // eslint-disable-line class-methods-use-this
            return html$$1(_templateObject, argv.join(' '));
          }
        }, {
          key: '_render',
          value: function _render(props) {
            return html$$1(_templateObject2, this.__renderStyles.apply(this, styles), get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), '_render', this).call(this, props));
          }
        }]);
        return _class;
      }(base);
    };
  };

  var _templateObject$1 = taggedTemplateLiteral(['<style>', '</style>'], ['<style>', '</style>']),
      _templateObject2$1 = taggedTemplateLiteral(['\n        ', '\n        ', '\n      '], ['\n        ', '\n        ', '\n      ']);

  var withStyleAfter = function withStyleAfter(html$$1) {
    html$$1 = html$$1 || html$1; // eslint-disable-line no-param-reassign

    return function (base) {
      for (var _len = arguments.length, styles = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        styles[_key - 1] = arguments[_key];
      }

      return function (_base) {
        inherits(_class, _base);

        function _class() {
          classCallCheck(this, _class);
          return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
          key: '__renderStyles',
          value: function __renderStyles() {
            for (var _len2 = arguments.length, argv = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              argv[_key2] = arguments[_key2];
            }

            // eslint-disable-line class-methods-use-this
            return html$$1(_templateObject$1, argv.join(' '));
          }
        }, {
          key: '_render',
          value: function _render(props) {
            return html$$1(_templateObject2$1, get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), '_render', this).call(this, props), this.__renderStyles.apply(this, styles));
          }
        }]);
        return _class;
      }(base);
    };
  };

  var _templateObject$2 = taggedTemplateLiteral(['<link href$=\'', '\' rel=\'stylesheet\' type=\'text/css\' />'], ['<link href$=\'', '\' rel=\'stylesheet\' type=\'text/css\' />']),
      _templateObject2$2 = taggedTemplateLiteral(['\n        ', '\n        ', '\n      '], ['\n        ', '\n        ', '\n      ']);

  var withStyleLink = function withStyleLink(html$$1) {
    html$$1 = html$$1 || html$1; // eslint-disable-line no-param-reassign

    return function (base) {
      for (var _len = arguments.length, links = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        links[_key - 1] = arguments[_key];
      }

      return function (_base) {
        inherits(_class, _base);

        function _class() {
          classCallCheck(this, _class);
          return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
          key: '__renderStyleLink',
          value: function __renderStyleLink() {
            for (var _len2 = arguments.length, argv = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              argv[_key2] = arguments[_key2];
            }

            // eslint-disable-line class-methods-use-this
            return argv.map(function (link) {
              return html$$1(_templateObject$2, link);
            });
          }
        }, {
          key: '_render',
          value: function _render(props) {
            return html$$1(_templateObject2$2, this.__renderStyleLink.apply(this, links), get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), '_render', this).call(this, props));
          }
        }]);
        return _class;
      }(base);
    };
  };

  var toBinary = function toBinary(policy) {
    return parseInt(policy, 2);
  };

  var registerCustomElement = function registerCustomElement(key, value) {
    if (!key || !value) throw new Error('CustomElement is not specified');
    !window.customElements.get(key) && window.customElements.define(key, value);
  };

  var _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }return target;
  };

  var withPermissions = function withPermissions() {
    return function (base) {
      var permissions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '00000';
      return function (_base) {
        inherits(_class, _base);

        function _class() {
          classCallCheck(this, _class);
          return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
          key: '_getPermissions',
          value: function _getPermissions() {
            return this.permissions || permissions;
          }
        }, {
          key: '_isAllowed',
          value: function _isAllowed(policy) {
            return toBinary(policy) & toBinary(this._getPermissions()); // eslint-disable-line no-bitwise
          }
        }], [{
          key: 'properties',
          get: function get$$1() {
            return _extends$1({}, get(_class.__proto__ || Object.getPrototypeOf(_class), 'properties', this), {
              permissions: String
            });
          }
        }]);
        return _class;
      }(base);
    };
  };

  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  var ms = function ms(val, options) {
    options = options || {};
    var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'weeks':
      case 'week':
      case 'w':
        return n * w;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
  }

  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   */

  function setup(env) {
  	createDebug.debug = createDebug;
  	createDebug.default = createDebug;
  	createDebug.coerce = coerce;
  	createDebug.disable = disable;
  	createDebug.enable = enable;
  	createDebug.enabled = enabled;
  	createDebug.humanize = ms;

  	Object.keys(env).forEach(function (key) {
  		createDebug[key] = env[key];
  	});

  	/**
   * Active `debug` instances.
   */
  	createDebug.instances = [];

  	/**
   * The currently active debug mode names, and names to skip.
   */

  	createDebug.names = [];
  	createDebug.skips = [];

  	/**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */
  	createDebug.formatters = {};

  	/**
   * Selects a color for a debug namespace
   * @param {String} namespace The namespace string for the for the debug instance to be colored
   * @return {Number|String} An ANSI color code for the given namespace
   * @api private
   */
  	function selectColor(namespace) {
  		var hash = 0;

  		for (var i = 0; i < namespace.length; i++) {
  			hash = (hash << 5) - hash + namespace.charCodeAt(i);
  			hash |= 0; // Convert to 32bit integer
  		}

  		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  	}
  	createDebug.selectColor = selectColor;

  	/**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */
  	function createDebug(namespace) {
  		var prevTime = void 0;

  		function debug() {
  			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
  				args[_key] = arguments[_key];
  			}

  			// Disabled?
  			if (!debug.enabled) {
  				return;
  			}

  			var self = debug;

  			// Set `diff` timestamp
  			var curr = Number(new Date());
  			var ms$$1 = curr - (prevTime || curr);
  			self.diff = ms$$1;
  			self.prev = prevTime;
  			self.curr = curr;
  			prevTime = curr;

  			args[0] = createDebug.coerce(args[0]);

  			if (typeof args[0] !== 'string') {
  				// Anything else let's inspect with %O
  				args.unshift('%O');
  			}

  			// Apply any `formatters` transformations
  			var index = 0;
  			args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
  				// If we encounter an escaped % then don't increase the array index
  				if (match === '%%') {
  					return match;
  				}
  				index++;
  				var formatter = createDebug.formatters[format];
  				if (typeof formatter === 'function') {
  					var val = args[index];
  					match = formatter.call(self, val);

  					// Now we need to remove `args[index]` since it's inlined in the `format`
  					args.splice(index, 1);
  					index--;
  				}
  				return match;
  			});

  			// Apply env-specific formatting (colors, etc.)
  			createDebug.formatArgs.call(self, args);

  			var logFn = self.log || createDebug.log;
  			logFn.apply(self, args);
  		}

  		debug.namespace = namespace;
  		debug.enabled = createDebug.enabled(namespace);
  		debug.useColors = createDebug.useColors();
  		debug.color = selectColor(namespace);
  		debug.destroy = destroy;
  		debug.extend = extend;
  		// Debug.formatArgs = formatArgs;
  		// debug.rawLog = rawLog;

  		// env-specific initialization logic for debug instances
  		if (typeof createDebug.init === 'function') {
  			createDebug.init(debug);
  		}

  		createDebug.instances.push(debug);

  		return debug;
  	}

  	function destroy() {
  		var index = createDebug.instances.indexOf(this);
  		if (index !== -1) {
  			createDebug.instances.splice(index, 1);
  			return true;
  		}
  		return false;
  	}

  	function extend(namespace, delimiter) {
  		return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  	}

  	/**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */
  	function enable(namespaces) {
  		createDebug.save(namespaces);

  		createDebug.names = [];
  		createDebug.skips = [];

  		var i = void 0;
  		var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  		var len = split.length;

  		for (i = 0; i < len; i++) {
  			if (!split[i]) {
  				// ignore empty strings
  				continue;
  			}

  			namespaces = split[i].replace(/\*/g, '.*?');

  			if (namespaces[0] === '-') {
  				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
  			} else {
  				createDebug.names.push(new RegExp('^' + namespaces + '$'));
  			}
  		}

  		for (i = 0; i < createDebug.instances.length; i++) {
  			var instance = createDebug.instances[i];
  			instance.enabled = createDebug.enabled(instance.namespace);
  		}
  	}

  	/**
   * Disable debug output.
   *
   * @return {String} namespaces
   * @api public
   */
  	function disable() {
  		var namespaces = [].concat(toConsumableArray(createDebug.names.map(toNamespace)), toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
  			return '-' + namespace;
  		}))).join(',');
  		createDebug.enable('');
  		return namespaces;
  	}

  	/**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */
  	function enabled(name) {
  		if (name[name.length - 1] === '*') {
  			return true;
  		}

  		var i = void 0;
  		var len = void 0;

  		for (i = 0, len = createDebug.skips.length; i < len; i++) {
  			if (createDebug.skips[i].test(name)) {
  				return false;
  			}
  		}

  		for (i = 0, len = createDebug.names.length; i < len; i++) {
  			if (createDebug.names[i].test(name)) {
  				return true;
  			}
  		}

  		return false;
  	}

  	/**
   * Convert regexp to namespace
   *
   * @param {RegExp} regxep
   * @return {String} namespace
   * @api private
   */
  	function toNamespace(regexp) {
  		return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  	}

  	/**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */
  	function coerce(val) {
  		if (val instanceof Error) {
  			return val.stack || val.message;
  		}
  		return val;
  	}

  	createDebug.enable(createDebug.load());

  	return createDebug;
  }

  var common = setup;

  var browser = createCommonjsModule(function (module, exports) {
  	/* eslint-env browser */

  	/**
    * This is the web browser implementation of `debug()`.
    */

  	exports.log = log;
  	exports.formatArgs = formatArgs;
  	exports.save = save;
  	exports.load = load;
  	exports.useColors = useColors;
  	exports.storage = localstorage();

  	/**
    * Colors.
    */

  	exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

  	/**
    * Currently only WebKit-based Web Inspectors, Firefox >= v31,
    * and the Firebug extension (any Firefox version) are known
    * to support "%c" CSS customizations.
    *
    * TODO: add a `localStorage` variable to explicitly enable/disable colors
    */

  	// eslint-disable-next-line complexity
  	function useColors() {
  		// NB: In an Electron preload script, document will be defined but not fully
  		// initialized. Since we know we're in Chrome, we'll just detect this case
  		// explicitly
  		if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
  			return true;
  		}

  		// Internet Explorer and Edge do not support colors.
  		if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
  			return false;
  		}

  		// Is webkit? http://stackoverflow.com/a/16459606/376773
  		// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  		return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  		// Is firebug? http://stackoverflow.com/a/398120/376773
  		typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  		// Is firefox >= v31?
  		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  		typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  		// Double check webkit in userAgent just in case we are in a worker
  		typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  	}

  	/**
    * Colorize log arguments if enabled.
    *
    * @api public
    */

  	function formatArgs(args) {
  		args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  		if (!this.useColors) {
  			return;
  		}

  		var c = 'color: ' + this.color;
  		args.splice(1, 0, c, 'color: inherit');

  		// The final "%c" is somewhat tricky, because there could be other
  		// arguments passed either before or after the %c, so we need to
  		// figure out the correct index to insert the CSS into
  		var index = 0;
  		var lastC = 0;
  		args[0].replace(/%[a-zA-Z%]/g, function (match) {
  			if (match === '%%') {
  				return;
  			}
  			index++;
  			if (match === '%c') {
  				// We only are interested in the *last* %c
  				// (the user may have provided their own)
  				lastC = index;
  			}
  		});

  		args.splice(lastC, 0, c);
  	}

  	/**
    * Invokes `console.log()` when available.
    * No-op when `console.log` is not a "function".
    *
    * @api public
    */
  	function log() {
  		var _console;

  		// This hackery is required for IE8/9, where
  		// the `console.log` function doesn't have 'apply'
  		return (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
  	}

  	/**
    * Save `namespaces`.
    *
    * @param {String} namespaces
    * @api private
    */
  	function save(namespaces) {
  		try {
  			if (namespaces) {
  				exports.storage.setItem('debug', namespaces);
  			} else {
  				exports.storage.removeItem('debug');
  			}
  		} catch (error) {
  			// Swallow
  			// XXX (@Qix-) should we be logging these?
  		}
  	}

  	/**
    * Load `namespaces`.
    *
    * @return {String} returns the previously persisted debug modes
    * @api private
    */
  	function load() {
  		var r = void 0;
  		try {
  			r = exports.storage.getItem('debug');
  		} catch (error) {}
  		// Swallow
  		// XXX (@Qix-) should we be logging these?


  		// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  		if (!r && typeof process !== 'undefined' && 'env' in process) {
  			r = process.env.DEBUG;
  		}

  		return r;
  	}

  	/**
    * Localstorage attempts to return the localstorage.
    *
    * This is necessary because safari throws
    * when a user disables cookies/localstorage
    * and you attempt to access it.
    *
    * @return {LocalStorage}
    * @api private
    */

  	function localstorage() {
  		try {
  			// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
  			// The Browser also has localStorage in the global context.
  			return localStorage;
  		} catch (error) {
  			// Swallow
  			// XXX (@Qix-) should we be logging these?
  		}
  	}

  	module.exports = common(exports);

  	var formatters = module.exports.formatters;

  	/**
    * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
    */

  	formatters.j = function (v) {
  		try {
  			return JSON.stringify(v);
  		} catch (error) {
  			return '[UnexpectedJSONParseError]: ' + error.message;
  		}
  	};
  });
  var browser_1 = browser.log;
  var browser_2 = browser.formatArgs;
  var browser_3 = browser.save;
  var browser_4 = browser.load;
  var browser_5 = browser.useColors;
  var browser_6 = browser.storage;
  var browser_7 = browser.colors;

  var _from = "@netology-group/wc-utils@latest";
  var _id = "@netology-group/wc-utils@0.3.2";
  var _inBundle = false;
  var _integrity = "sha512-L71pgFjDqFaJugFdUzCnA2TXm3+bvQ++LydPLH/np7KT33/j2xA9/82UpG9kKMD4D+EQVXMxv/euJIR9CVEd/A==";
  var _location = "/@netology-group/wc-utils";
  var _phantomChildren = {};
  var _requested = {
  	type: "tag",
  	registry: true,
  	raw: "@netology-group/wc-utils@latest",
  	name: "@netology-group/wc-utils",
  	escapedName: "@netology-group%2fwc-utils",
  	scope: "@netology-group",
  	rawSpec: "latest",
  	saveSpec: null,
  	fetchSpec: "latest"
  };
  var _requiredBy = ["#USER", "/"];
  var _resolved = "https://registry.npmjs.org/@netology-group/wc-utils/-/wc-utils-0.3.2.tgz";
  var _shasum = "e63f770ccd3bc4fd76d5b650b7b5e11bb8ebf7b2";
  var _spec = "@netology-group/wc-utils@latest";
  var _where = "/Users/s.prokhorov/projects/@netology-group/wc-poll";
  var author = "";
  var bugs = {
  	url: "https://github.com/netology-group/wc-utils/issues"
  };
  var bundleDependencies = false;
  var dependencies = {
  	debug: "^4.1.0",
  	ramda: "^0.25.0"
  };
  var deprecated = false;
  var description = "Webcomponent's utilities";
  var devDependencies = {
  	"babel-cli": "^6.26.0",
  	"babel-plugin-annotate-pure-calls": "^0.3.0",
  	"babel-plugin-external-helpers": "^6.22.0",
  	"babel-plugin-transform-es2015-modules-commonjs": "^6.26.2",
  	"babel-plugin-transform-object-rest-spread": "^6.26.0",
  	"babel-preset-env": "^1.7.0",
  	eslint: "^5.0.1",
  	"eslint-config-adequate": "^1.1.0",
  	rollup: "^0.65.2",
  	"rollup-plugin-babel": "^3.0.7",
  	"rollup-plugin-commonjs": "^9.2.0",
  	"rollup-plugin-json": "^3.1.0",
  	"rollup-plugin-node-resolve": "^3.4.0",
  	"rollup-plugin-terser": "^1.0.1",
  	"rollup-plugin-uglify": "^6.0.0"
  };
  var directories = {
  	lib: "src"
  };
  var files = ["dist", "es", "lib"];
  var homepage = "https://github.com/netology-group/wc-utils#readme";
  var license = "MIT";
  var main = "lib/index.js";
  var module$1 = "es/index.js";
  var name = "@netology-group/wc-utils";
  var peerDependencies = {
  	"@polymer/lit-element": "~0.5.2"
  };
  var repository = {
  	url: "git+https://github.com/netology-group/wc-utils.git"
  };
  var scripts = {
  	build: "npm run build:cjs && npm run build:es && npm run build:umd && npm run build:umd:min",
  	"build:cjs": "BABEL_ENV=cjs babel src --out-dir lib",
  	"build:es": "BABEL_ENV=es babel src --out-dir es",
  	"build:umd": "BABEL_ENV=rollup rollup -c -o dist/index.js",
  	"build:umd:min": "NODE_ENV=production BABEL_ENV=rollup rollup -c -o dist/index.min.js",
  	prebuild: "rm -rf dist es lib",
  	prepublishOnly: "npm run test && npm run build",
  	test: "eslint ."
  };
  var version = "0.3.2";
  var pkg = {
  	_from: _from,
  	_id: _id,
  	_inBundle: _inBundle,
  	_integrity: _integrity,
  	_location: _location,
  	_phantomChildren: _phantomChildren,
  	_requested: _requested,
  	_requiredBy: _requiredBy,
  	_resolved: _resolved,
  	_shasum: _shasum,
  	_spec: _spec,
  	_where: _where,
  	author: author,
  	bugs: bugs,
  	bundleDependencies: bundleDependencies,
  	dependencies: dependencies,
  	deprecated: deprecated,
  	description: description,
  	devDependencies: devDependencies,
  	directories: directories,
  	files: files,
  	homepage: homepage,
  	license: license,
  	main: main,
  	module: module$1,
  	name: name,
  	peerDependencies: peerDependencies,
  	repository: repository,
  	scripts: scripts,
  	version: version
  };

  var debug = /*#__PURE__*/browser(pkg.name + ':with-custom-elements');

  var isMap = function isMap(it) {
    return it instanceof Map;
  };

  var withCustomElements = function withCustomElements() {
    return function (base, fn) {
      return function (_base) {
        inherits(_class, _base);

        function _class(props) {
          classCallCheck(this, _class);

          var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

          _this.__childrenElements = new Map();
          _this.__setup();
          return _this;
        }

        createClass(_class, [{
          key: '__registerCustomElements',
          value: function __registerCustomElements(children) {
            if (!isMap(children)) throw new TypeError('Wrong children type');

            debug('Default customElements:', this._childrenElements);
            debug('External customElements:', children);

            this._childrenElements.forEach(function (element, key) {
              registerCustomElement(key, children.has(key) ? children.get(key) : element);
            });
          }
        }, {
          key: '__setup',
          value: function __setup() {
            this.__registerCustomElements(fn(this._childrenElements));
          }
        }, {
          key: '_childrenElements',
          get: function get$$1() {
            return get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), '_childrenElements', this) || this.__childrenElements;
          }
        }]);
        return _class;
      }(base);
    };
  };



  var _ = /*#__PURE__*/Object.freeze({
    withStyle: withStyle,
    withStyleAfter: withStyleAfter,
    withStyleLink: withStyleLink,
    withPermissions: withPermissions,
    withCustomElements: withCustomElements
  });

  var withPoll = function withPoll() {
    return function (base) {
      var initialConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function (_base) {
        inherits(_class, _base);

        function _class(props) {
          classCallCheck(this, _class);

          var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

          Object.keys(initialConfig).map(function (it) {
            _this[it] = initialConfig[it];

            return it;
          });
          return _this;
        }

        return _class;
      }(base);
    };
  };

  var uiPadMarg = { "sizesLatin": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px)", "sizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "sizes": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "fontSizesLatin": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px)", "fontSizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "fontSizes": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "breakpoints": "(\"l\": 1239px, \"m\": 1023px, \"s\": 767px, \"xs\": 374px)", "sides": "(\"top\": \"top\", \"right\": \"right\", \"bottom\": \"bottom\", \"left\": \"left\")", "props": "(\"padding\": \"padding\", \"margin\": \"margin\")", "padding-xxxl": "PadMarg_padding-xxxl__3TZR6", "margin-xxxl": "PadMarg_margin-xxxl__2JK4v", "padding-xxl": "PadMarg_padding-xxl__2LNZn", "margin-xxl": "PadMarg_margin-xxl__117VQ", "padding-xl": "PadMarg_padding-xl__2LHOw", "margin-xl": "PadMarg_margin-xl__1nuYL", "padding-l": "PadMarg_padding-l__fIS2Z", "margin-l": "PadMarg_margin-l__3OYp5", "padding-m": "PadMarg_padding-m__RAXqm", "margin-m": "PadMarg_margin-m__27f7-", "padding-s": "PadMarg_padding-s__rgsDk", "margin-s": "PadMarg_margin-s__3F7J1", "padding-xs": "PadMarg_padding-xs__KtEb3", "margin-xs": "PadMarg_margin-xs__2idjD", "padding-xxs": "PadMarg_padding-xxs__1xozO", "margin-xxs": "PadMarg_margin-xxs__1Zsw2", "padding-xxxs": "PadMarg_padding-xxxs__GUD-P", "margin-xxxs": "PadMarg_margin-xxxs__k40sM", "padding-60": "PadMarg_padding-60__iAt5y", "margin-60": "PadMarg_margin-60__3-aH2", "padding-56": "PadMarg_padding-56__1zB9W", "margin-56": "PadMarg_margin-56__1SpSA", "padding-52": "PadMarg_padding-52__3QBt9", "margin-52": "PadMarg_margin-52__3jWT2", "padding-48": "PadMarg_padding-48__30Eh0", "margin-48": "PadMarg_margin-48__3fM0o", "padding-44": "PadMarg_padding-44__7J4Hj", "margin-44": "PadMarg_margin-44__3TQMd", "padding-40": "PadMarg_padding-40__1vpl4", "margin-40": "PadMarg_margin-40__3pnsV", "padding-36": "PadMarg_padding-36__3Nui9", "margin-36": "PadMarg_margin-36__pnLK2", "padding-32": "PadMarg_padding-32__QeOjc", "margin-32": "PadMarg_margin-32__1CU1K", "padding-28": "PadMarg_padding-28__2qhGC", "margin-28": "PadMarg_margin-28__2Mqll", "padding-24": "PadMarg_padding-24__2CFfz", "margin-24": "PadMarg_margin-24__C15ed", "padding-20": "PadMarg_padding-20__3bUfI", "margin-20": "PadMarg_margin-20__3uzuj", "padding-16": "PadMarg_padding-16__3qXSj", "margin-16": "PadMarg_margin-16__18j9Y", "padding-12": "PadMarg_padding-12__3-EUI", "margin-12": "PadMarg_margin-12__3gKI4", "padding-8": "PadMarg_padding-8__2ekB8", "margin-8": "PadMarg_margin-8__3qASZ", "padding-4": "PadMarg_padding-4__2NmD-", "margin-4": "PadMarg_margin-4__QD19A", "padding-2": "PadMarg_padding-2__3urO9", "margin-2": "PadMarg_margin-2__2hFpN", "padding-0": "PadMarg_padding-0__3V7lk", "margin-0": "PadMarg_margin-0__TEraV", "padding-l-xxxl": "PadMarg_padding-l-xxxl__1iCg2", "margin-l-xxxl": "PadMarg_margin-l-xxxl__25yNE", "padding-l-xxl": "PadMarg_padding-l-xxl__1uIIk", "margin-l-xxl": "PadMarg_margin-l-xxl__p0I38", "padding-l-xl": "PadMarg_padding-l-xl__3UBgW", "margin-l-xl": "PadMarg_margin-l-xl__3tW5J", "padding-l-l": "PadMarg_padding-l-l__3fwYs", "margin-l-l": "PadMarg_margin-l-l__1JJ_N", "padding-l-m": "PadMarg_padding-l-m__hWS4N", "margin-l-m": "PadMarg_margin-l-m__1mhKY", "padding-l-s": "PadMarg_padding-l-s__1ScRy", "margin-l-s": "PadMarg_margin-l-s__2zqeu", "padding-l-xs": "PadMarg_padding-l-xs__24hgg", "margin-l-xs": "PadMarg_margin-l-xs__a7AN2", "padding-l-xxs": "PadMarg_padding-l-xxs__T-3FB", "margin-l-xxs": "PadMarg_margin-l-xxs__wRped", "padding-l-xxxs": "PadMarg_padding-l-xxxs__137eN", "margin-l-xxxs": "PadMarg_margin-l-xxxs__WVrPS", "padding-l-60": "PadMarg_padding-l-60__2eV98", "margin-l-60": "PadMarg_margin-l-60__3wbh-", "padding-l-56": "PadMarg_padding-l-56__uIfXf", "margin-l-56": "PadMarg_margin-l-56__1Ix8Y", "padding-l-52": "PadMarg_padding-l-52__3JcWi", "margin-l-52": "PadMarg_margin-l-52__2Nu89", "padding-l-48": "PadMarg_padding-l-48__3jmQ0", "margin-l-48": "PadMarg_margin-l-48__1JJ8a", "padding-l-44": "PadMarg_padding-l-44__3zlSs", "margin-l-44": "PadMarg_margin-l-44__1WyYY", "padding-l-40": "PadMarg_padding-l-40__2iR1p", "margin-l-40": "PadMarg_margin-l-40__3lFwq", "padding-l-36": "PadMarg_padding-l-36__9dTxN", "margin-l-36": "PadMarg_margin-l-36__1sqIw", "padding-l-32": "PadMarg_padding-l-32__2g82E", "margin-l-32": "PadMarg_margin-l-32__2Pj7v", "padding-l-28": "PadMarg_padding-l-28__2jyxh", "margin-l-28": "PadMarg_margin-l-28__1Nvug", "padding-l-24": "PadMarg_padding-l-24__3fSWD", "margin-l-24": "PadMarg_margin-l-24__2wyi6", "padding-l-20": "PadMarg_padding-l-20__1oEbw", "margin-l-20": "PadMarg_margin-l-20__1YZf4", "padding-l-16": "PadMarg_padding-l-16__25hm6", "margin-l-16": "PadMarg_margin-l-16__19V9Q", "padding-l-12": "PadMarg_padding-l-12__38tIu", "margin-l-12": "PadMarg_margin-l-12__PFqD9", "padding-l-8": "PadMarg_padding-l-8__2sDIK", "margin-l-8": "PadMarg_margin-l-8__23eoB", "padding-l-4": "PadMarg_padding-l-4__wj6W4", "margin-l-4": "PadMarg_margin-l-4__19PV5", "padding-l-2": "PadMarg_padding-l-2__3-Unn", "margin-l-2": "PadMarg_margin-l-2__2r6He", "padding-l-0": "PadMarg_padding-l-0__1HvDB", "margin-l-0": "PadMarg_margin-l-0__1-xaS", "padding-m-xxxl": "PadMarg_padding-m-xxxl__3HiWV", "margin-m-xxxl": "PadMarg_margin-m-xxxl__wD3JJ", "padding-m-xxl": "PadMarg_padding-m-xxl__sncXn", "margin-m-xxl": "PadMarg_margin-m-xxl__P-gmU", "padding-m-xl": "PadMarg_padding-m-xl__NWfe8", "margin-m-xl": "PadMarg_margin-m-xl__2PKK5", "padding-m-l": "PadMarg_padding-m-l__3RfOc", "margin-m-l": "PadMarg_margin-m-l__3pXpZ", "padding-m-m": "PadMarg_padding-m-m__2V_9y", "margin-m-m": "PadMarg_margin-m-m__2ia31", "padding-m-s": "PadMarg_padding-m-s__2K4g0", "margin-m-s": "PadMarg_margin-m-s__1kDKa", "padding-m-xs": "PadMarg_padding-m-xs__2gsaG", "margin-m-xs": "PadMarg_margin-m-xs__3AUPg", "padding-m-xxs": "PadMarg_padding-m-xxs__3EvGa", "margin-m-xxs": "PadMarg_margin-m-xxs__2c-8b", "padding-m-xxxs": "PadMarg_padding-m-xxxs__211Zc", "margin-m-xxxs": "PadMarg_margin-m-xxxs__334nV", "padding-m-60": "PadMarg_padding-m-60__3wAWL", "margin-m-60": "PadMarg_margin-m-60__bnofQ", "padding-m-56": "PadMarg_padding-m-56__Rq9SI", "margin-m-56": "PadMarg_margin-m-56__1PQ4j", "padding-m-52": "PadMarg_padding-m-52__3YIAz", "margin-m-52": "PadMarg_margin-m-52__16--t", "padding-m-48": "PadMarg_padding-m-48__3KrHw", "margin-m-48": "PadMarg_margin-m-48__CjnBL", "padding-m-44": "PadMarg_padding-m-44__rB6yz", "margin-m-44": "PadMarg_margin-m-44__30--2", "padding-m-40": "PadMarg_padding-m-40__2qVMn", "margin-m-40": "PadMarg_margin-m-40__1-H3F", "padding-m-36": "PadMarg_padding-m-36__2ei7W", "margin-m-36": "PadMarg_margin-m-36__3bdD1", "padding-m-32": "PadMarg_padding-m-32__2Uc13", "margin-m-32": "PadMarg_margin-m-32__3krcF", "padding-m-28": "PadMarg_padding-m-28__d9HQR", "margin-m-28": "PadMarg_margin-m-28__17OJE", "padding-m-24": "PadMarg_padding-m-24__8tpL1", "margin-m-24": "PadMarg_margin-m-24__-kDxk", "padding-m-20": "PadMarg_padding-m-20__2-DTs", "margin-m-20": "PadMarg_margin-m-20__2Dynt", "padding-m-16": "PadMarg_padding-m-16__34MuZ", "margin-m-16": "PadMarg_margin-m-16__3SYjl", "padding-m-12": "PadMarg_padding-m-12__1C1HB", "margin-m-12": "PadMarg_margin-m-12__1aa_v", "padding-m-8": "PadMarg_padding-m-8__1Eupf", "margin-m-8": "PadMarg_margin-m-8__3F_pN", "padding-m-4": "PadMarg_padding-m-4__3HJQW", "margin-m-4": "PadMarg_margin-m-4__1H0sm", "padding-m-2": "PadMarg_padding-m-2__1_fcH", "margin-m-2": "PadMarg_margin-m-2__1j2TI", "padding-m-0": "PadMarg_padding-m-0__15lbB", "margin-m-0": "PadMarg_margin-m-0__1yRkh", "padding-s-xxxl": "PadMarg_padding-s-xxxl__J4jzx", "margin-s-xxxl": "PadMarg_margin-s-xxxl__1bP_6", "padding-s-xxl": "PadMarg_padding-s-xxl__31GvG", "margin-s-xxl": "PadMarg_margin-s-xxl__5yuQw", "padding-s-xl": "PadMarg_padding-s-xl__CYCzx", "margin-s-xl": "PadMarg_margin-s-xl__YTFTJ", "padding-s-l": "PadMarg_padding-s-l__3Szil", "margin-s-l": "PadMarg_margin-s-l__y46nq", "padding-s-m": "PadMarg_padding-s-m__1Y2Y7", "margin-s-m": "PadMarg_margin-s-m__2eB-M", "padding-s-s": "PadMarg_padding-s-s__Vzseo", "margin-s-s": "PadMarg_margin-s-s__2LcIU", "padding-s-xs": "PadMarg_padding-s-xs__17ihm", "margin-s-xs": "PadMarg_margin-s-xs__2YW2q", "padding-s-xxs": "PadMarg_padding-s-xxs__1oZbg", "margin-s-xxs": "PadMarg_margin-s-xxs__2DJgc", "padding-s-xxxs": "PadMarg_padding-s-xxxs__FlzH-", "margin-s-xxxs": "PadMarg_margin-s-xxxs__2E8wd", "padding-s-60": "PadMarg_padding-s-60__2tjCA", "margin-s-60": "PadMarg_margin-s-60__3JWnl", "padding-s-56": "PadMarg_padding-s-56__2BdPn", "margin-s-56": "PadMarg_margin-s-56__3n0l4", "padding-s-52": "PadMarg_padding-s-52__3A7eQ", "margin-s-52": "PadMarg_margin-s-52__-Kf_1", "padding-s-48": "PadMarg_padding-s-48__2lMtT", "margin-s-48": "PadMarg_margin-s-48__2gYfB", "padding-s-44": "PadMarg_padding-s-44__2pN2I", "margin-s-44": "PadMarg_margin-s-44__1-s_C", "padding-s-40": "PadMarg_padding-s-40__1j4vw", "margin-s-40": "PadMarg_margin-s-40__39XZR", "padding-s-36": "PadMarg_padding-s-36__g5xSz", "margin-s-36": "PadMarg_margin-s-36__2MiPP", "padding-s-32": "PadMarg_padding-s-32__rPvKK", "margin-s-32": "PadMarg_margin-s-32__3asAM", "padding-s-28": "PadMarg_padding-s-28__2KEIl", "margin-s-28": "PadMarg_margin-s-28__3gVOv", "padding-s-24": "PadMarg_padding-s-24__3xpmU", "margin-s-24": "PadMarg_margin-s-24__27pQP", "padding-s-20": "PadMarg_padding-s-20__3Xfjc", "margin-s-20": "PadMarg_margin-s-20__2bAWY", "padding-s-16": "PadMarg_padding-s-16__2V2Ft", "margin-s-16": "PadMarg_margin-s-16__1VBQl", "padding-s-12": "PadMarg_padding-s-12__2QfXk", "margin-s-12": "PadMarg_margin-s-12__W4NJO", "padding-s-8": "PadMarg_padding-s-8__33AmA", "margin-s-8": "PadMarg_margin-s-8__cgRgn", "padding-s-4": "PadMarg_padding-s-4__263ER", "margin-s-4": "PadMarg_margin-s-4__CdzhE", "padding-s-2": "PadMarg_padding-s-2__3IOzx", "margin-s-2": "PadMarg_margin-s-2__JJ3G2", "padding-s-0": "PadMarg_padding-s-0__JV_jK", "margin-s-0": "PadMarg_margin-s-0__7hGo-", "padding-xs-xxxl": "PadMarg_padding-xs-xxxl__1zXjx", "margin-xs-xxxl": "PadMarg_margin-xs-xxxl__3W0vE", "padding-xs-xxl": "PadMarg_padding-xs-xxl__I3vG1", "margin-xs-xxl": "PadMarg_margin-xs-xxl__3opOU", "padding-xs-xl": "PadMarg_padding-xs-xl__39Mro", "margin-xs-xl": "PadMarg_margin-xs-xl__1TaDc", "padding-xs-l": "PadMarg_padding-xs-l__MFjYj", "margin-xs-l": "PadMarg_margin-xs-l__DH8kI", "padding-xs-m": "PadMarg_padding-xs-m__1-jkj", "margin-xs-m": "PadMarg_margin-xs-m__3vCxv", "padding-xs-s": "PadMarg_padding-xs-s__pBQsk", "margin-xs-s": "PadMarg_margin-xs-s__2CDUf", "padding-xs-xs": "PadMarg_padding-xs-xs__3YnnP", "margin-xs-xs": "PadMarg_margin-xs-xs__3pVjh", "padding-xs-xxs": "PadMarg_padding-xs-xxs__3FOTK", "margin-xs-xxs": "PadMarg_margin-xs-xxs__enaN_", "padding-xs-xxxs": "PadMarg_padding-xs-xxxs__19Je1", "margin-xs-xxxs": "PadMarg_margin-xs-xxxs__2Mxyf", "padding-xs-60": "PadMarg_padding-xs-60__P7LqV", "margin-xs-60": "PadMarg_margin-xs-60__2N7VZ", "padding-xs-56": "PadMarg_padding-xs-56__2n-zX", "margin-xs-56": "PadMarg_margin-xs-56__3HbGl", "padding-xs-52": "PadMarg_padding-xs-52__3oQsX", "margin-xs-52": "PadMarg_margin-xs-52__1aQaO", "padding-xs-48": "PadMarg_padding-xs-48__Tica4", "margin-xs-48": "PadMarg_margin-xs-48__ebwHi", "padding-xs-44": "PadMarg_padding-xs-44__1H18h", "margin-xs-44": "PadMarg_margin-xs-44__2I2Hs", "padding-xs-40": "PadMarg_padding-xs-40__3qO2m", "margin-xs-40": "PadMarg_margin-xs-40__3737E", "padding-xs-36": "PadMarg_padding-xs-36__Obxw0", "margin-xs-36": "PadMarg_margin-xs-36__2eknR", "padding-xs-32": "PadMarg_padding-xs-32__1aNgm", "margin-xs-32": "PadMarg_margin-xs-32__39BWp", "padding-xs-28": "PadMarg_padding-xs-28__hZsro", "margin-xs-28": "PadMarg_margin-xs-28__18GTY", "padding-xs-24": "PadMarg_padding-xs-24__2xB0T", "margin-xs-24": "PadMarg_margin-xs-24__2_2MH", "padding-xs-20": "PadMarg_padding-xs-20__ZZxkI", "margin-xs-20": "PadMarg_margin-xs-20__3xNNX", "padding-xs-16": "PadMarg_padding-xs-16__6XmNh", "margin-xs-16": "PadMarg_margin-xs-16__30lmt", "padding-xs-12": "PadMarg_padding-xs-12__302Y4", "margin-xs-12": "PadMarg_margin-xs-12__24CJV", "padding-xs-8": "PadMarg_padding-xs-8__fqe2s", "margin-xs-8": "PadMarg_margin-xs-8__2AUci", "padding-xs-4": "PadMarg_padding-xs-4__27tLY", "margin-xs-4": "PadMarg_margin-xs-4__3e3yQ", "padding-xs-2": "PadMarg_padding-xs-2__3enI6", "margin-xs-2": "PadMarg_margin-xs-2__Ds7c_", "padding-xs-0": "PadMarg_padding-xs-0__TlgI9", "margin-xs-0": "PadMarg_margin-xs-0__8cm5u", "padding-top-xxxl": "PadMarg_padding-top-xxxl__HFU9J", "margin-top-xxxl": "PadMarg_margin-top-xxxl__wUs4b", "padding-top-xxl": "PadMarg_padding-top-xxl__2aN2u", "margin-top-xxl": "PadMarg_margin-top-xxl__K8cBr", "padding-top-xl": "PadMarg_padding-top-xl__Z3bOI", "margin-top-xl": "PadMarg_margin-top-xl__1i7rV", "padding-top-l": "PadMarg_padding-top-l__3Z3Pz", "margin-top-l": "PadMarg_margin-top-l__1aLrL", "padding-top-m": "PadMarg_padding-top-m__226k7", "margin-top-m": "PadMarg_margin-top-m__sgb6s", "padding-top-s": "PadMarg_padding-top-s__2zayk", "margin-top-s": "PadMarg_margin-top-s__3wb5D", "padding-top-xs": "PadMarg_padding-top-xs__PND-s", "margin-top-xs": "PadMarg_margin-top-xs__-ZzOH", "padding-top-xxs": "PadMarg_padding-top-xxs__1ETqL", "margin-top-xxs": "PadMarg_margin-top-xxs__1OsNb", "padding-top-xxxs": "PadMarg_padding-top-xxxs__3_2mr", "margin-top-xxxs": "PadMarg_margin-top-xxxs__3ByNa", "padding-top-60": "PadMarg_padding-top-60__2MIwB", "margin-top-60": "PadMarg_margin-top-60__35p46", "padding-top-56": "PadMarg_padding-top-56__3qnOO", "margin-top-56": "PadMarg_margin-top-56__3OzVU", "padding-top-52": "PadMarg_padding-top-52__Eosav", "margin-top-52": "PadMarg_margin-top-52__2kvAH", "padding-top-48": "PadMarg_padding-top-48__2Iljd", "margin-top-48": "PadMarg_margin-top-48__3P0fu", "padding-top-44": "PadMarg_padding-top-44__RUrQB", "margin-top-44": "PadMarg_margin-top-44__2EQVb", "padding-top-40": "PadMarg_padding-top-40__1m4JJ", "margin-top-40": "PadMarg_margin-top-40__1awvn", "padding-top-36": "PadMarg_padding-top-36__1q1H_", "margin-top-36": "PadMarg_margin-top-36__2mkTL", "padding-top-32": "PadMarg_padding-top-32__1V-_7", "margin-top-32": "PadMarg_margin-top-32__tsCsC", "padding-top-28": "PadMarg_padding-top-28__1L83Z", "margin-top-28": "PadMarg_margin-top-28__t43vh", "padding-top-24": "PadMarg_padding-top-24__2TXhM", "margin-top-24": "PadMarg_margin-top-24__1xkOs", "padding-top-20": "PadMarg_padding-top-20__241OX", "margin-top-20": "PadMarg_margin-top-20__23L1t", "padding-top-16": "PadMarg_padding-top-16__21ZqB", "margin-top-16": "PadMarg_margin-top-16__1aLAR", "padding-top-12": "PadMarg_padding-top-12__2qOUu", "margin-top-12": "PadMarg_margin-top-12__3J8TE", "padding-top-8": "PadMarg_padding-top-8__2V6dM", "margin-top-8": "PadMarg_margin-top-8__782Bs", "padding-top-4": "PadMarg_padding-top-4__z7-h_", "margin-top-4": "PadMarg_margin-top-4__2Kkyo", "padding-top-2": "PadMarg_padding-top-2__EGbf5", "margin-top-2": "PadMarg_margin-top-2__3qGr6", "padding-top-0": "PadMarg_padding-top-0__1yKpS", "margin-top-0": "PadMarg_margin-top-0__1RPpO", "padding-right-xxxl": "PadMarg_padding-right-xxxl__1Atr2", "margin-right-xxxl": "PadMarg_margin-right-xxxl__c-IZb", "padding-right-xxl": "PadMarg_padding-right-xxl__3wrQC", "margin-right-xxl": "PadMarg_margin-right-xxl__7dajX", "padding-right-xl": "PadMarg_padding-right-xl__NwDuD", "margin-right-xl": "PadMarg_margin-right-xl__2JIm1", "padding-right-l": "PadMarg_padding-right-l__3crdn", "margin-right-l": "PadMarg_margin-right-l__3E8tN", "padding-right-m": "PadMarg_padding-right-m__1I632", "margin-right-m": "PadMarg_margin-right-m__219tB", "padding-right-s": "PadMarg_padding-right-s__77VBf", "margin-right-s": "PadMarg_margin-right-s__3ROuZ", "padding-right-xs": "PadMarg_padding-right-xs__PGkOg", "margin-right-xs": "PadMarg_margin-right-xs__24FBf", "padding-right-xxs": "PadMarg_padding-right-xxs__3SFnh", "margin-right-xxs": "PadMarg_margin-right-xxs__315BB", "padding-right-xxxs": "PadMarg_padding-right-xxxs__3116W", "margin-right-xxxs": "PadMarg_margin-right-xxxs__1NYZO", "padding-right-60": "PadMarg_padding-right-60__1gTs0", "margin-right-60": "PadMarg_margin-right-60__26YQ2", "padding-right-56": "PadMarg_padding-right-56__2ICs1", "margin-right-56": "PadMarg_margin-right-56__1P52c", "padding-right-52": "PadMarg_padding-right-52__NTrTS", "margin-right-52": "PadMarg_margin-right-52__3mI1b", "padding-right-48": "PadMarg_padding-right-48__1cuZ1", "margin-right-48": "PadMarg_margin-right-48__cNq_p", "padding-right-44": "PadMarg_padding-right-44__2BloG", "margin-right-44": "PadMarg_margin-right-44__3QeQX", "padding-right-40": "PadMarg_padding-right-40__2CpAh", "margin-right-40": "PadMarg_margin-right-40__aS1gk", "padding-right-36": "PadMarg_padding-right-36__2mIRm", "margin-right-36": "PadMarg_margin-right-36__2IU1s", "padding-right-32": "PadMarg_padding-right-32__1byP6", "margin-right-32": "PadMarg_margin-right-32__3Qxy7", "padding-right-28": "PadMarg_padding-right-28__2cfaL", "margin-right-28": "PadMarg_margin-right-28__32lq7", "padding-right-24": "PadMarg_padding-right-24__3v_-I", "margin-right-24": "PadMarg_margin-right-24__24AEX", "padding-right-20": "PadMarg_padding-right-20__1boPc", "margin-right-20": "PadMarg_margin-right-20__14J9Z", "padding-right-16": "PadMarg_padding-right-16__2P3l5", "margin-right-16": "PadMarg_margin-right-16__zAikp", "padding-right-12": "PadMarg_padding-right-12__2PM7_", "margin-right-12": "PadMarg_margin-right-12__ST6qd", "padding-right-8": "PadMarg_padding-right-8__3wNIu", "margin-right-8": "PadMarg_margin-right-8__19MXB", "padding-right-4": "PadMarg_padding-right-4__j_KoF", "margin-right-4": "PadMarg_margin-right-4__2pYtw", "padding-right-2": "PadMarg_padding-right-2__aJlAk", "margin-right-2": "PadMarg_margin-right-2__1VYbb", "padding-right-0": "PadMarg_padding-right-0__37AeO", "margin-right-0": "PadMarg_margin-right-0__nH6Ot", "padding-bottom-xxxl": "PadMarg_padding-bottom-xxxl__2FApF", "margin-bottom-xxxl": "PadMarg_margin-bottom-xxxl__1ATWg", "padding-bottom-xxl": "PadMarg_padding-bottom-xxl__2mKg0", "margin-bottom-xxl": "PadMarg_margin-bottom-xxl__1-Slr", "padding-bottom-xl": "PadMarg_padding-bottom-xl__34r1C", "margin-bottom-xl": "PadMarg_margin-bottom-xl__3Vy-e", "padding-bottom-l": "PadMarg_padding-bottom-l__3FHwf", "margin-bottom-l": "PadMarg_margin-bottom-l__1psL0", "padding-bottom-m": "PadMarg_padding-bottom-m__wWhZk", "margin-bottom-m": "PadMarg_margin-bottom-m__cBzne", "padding-bottom-s": "PadMarg_padding-bottom-s__3U0Z3", "margin-bottom-s": "PadMarg_margin-bottom-s__1klsP", "padding-bottom-xs": "PadMarg_padding-bottom-xs__JR6jK", "margin-bottom-xs": "PadMarg_margin-bottom-xs__6sSwl", "padding-bottom-xxs": "PadMarg_padding-bottom-xxs__4DZCg", "margin-bottom-xxs": "PadMarg_margin-bottom-xxs__1T7J5", "padding-bottom-xxxs": "PadMarg_padding-bottom-xxxs__1zCwX", "margin-bottom-xxxs": "PadMarg_margin-bottom-xxxs__-kkCt", "padding-bottom-60": "PadMarg_padding-bottom-60__GLf4b", "margin-bottom-60": "PadMarg_margin-bottom-60__1lzMd", "padding-bottom-56": "PadMarg_padding-bottom-56__28pua", "margin-bottom-56": "PadMarg_margin-bottom-56__ZJyQ7", "padding-bottom-52": "PadMarg_padding-bottom-52__1aD6T", "margin-bottom-52": "PadMarg_margin-bottom-52__jEfPs", "padding-bottom-48": "PadMarg_padding-bottom-48__UwuI1", "margin-bottom-48": "PadMarg_margin-bottom-48__2D6Uq", "padding-bottom-44": "PadMarg_padding-bottom-44__fiiMX", "margin-bottom-44": "PadMarg_margin-bottom-44__2XNDF", "padding-bottom-40": "PadMarg_padding-bottom-40__1mHyp", "margin-bottom-40": "PadMarg_margin-bottom-40__2F6_M", "padding-bottom-36": "PadMarg_padding-bottom-36__3LSy1", "margin-bottom-36": "PadMarg_margin-bottom-36__rY511", "padding-bottom-32": "PadMarg_padding-bottom-32__3dwJm", "margin-bottom-32": "PadMarg_margin-bottom-32__TI5Ix", "padding-bottom-28": "PadMarg_padding-bottom-28__2eGc0", "margin-bottom-28": "PadMarg_margin-bottom-28__1qYBB", "padding-bottom-24": "PadMarg_padding-bottom-24__1gGhy", "margin-bottom-24": "PadMarg_margin-bottom-24__gh33y", "padding-bottom-20": "PadMarg_padding-bottom-20__19svc", "margin-bottom-20": "PadMarg_margin-bottom-20__1HxRU", "padding-bottom-16": "PadMarg_padding-bottom-16__2YM-f", "margin-bottom-16": "PadMarg_margin-bottom-16__CV0ox", "padding-bottom-12": "PadMarg_padding-bottom-12__2NQK2", "margin-bottom-12": "PadMarg_margin-bottom-12__3-8CM", "padding-bottom-8": "PadMarg_padding-bottom-8__KDC2k", "margin-bottom-8": "PadMarg_margin-bottom-8__3fRnG", "padding-bottom-4": "PadMarg_padding-bottom-4__2atyj", "margin-bottom-4": "PadMarg_margin-bottom-4__1nmss", "padding-bottom-2": "PadMarg_padding-bottom-2__28I7R", "margin-bottom-2": "PadMarg_margin-bottom-2__3TWYe", "padding-bottom-0": "PadMarg_padding-bottom-0__1Ri1C", "margin-bottom-0": "PadMarg_margin-bottom-0__26kEN", "padding-left-xxxl": "PadMarg_padding-left-xxxl__37UFU", "margin-left-xxxl": "PadMarg_margin-left-xxxl__1MJbU", "padding-left-xxl": "PadMarg_padding-left-xxl__nin96", "margin-left-xxl": "PadMarg_margin-left-xxl__3QOKn", "padding-left-xl": "PadMarg_padding-left-xl__1g4nK", "margin-left-xl": "PadMarg_margin-left-xl__3V-m-", "padding-left-l": "PadMarg_padding-left-l__3ml5x", "margin-left-l": "PadMarg_margin-left-l__7p-gN", "padding-left-m": "PadMarg_padding-left-m__1dN_A", "margin-left-m": "PadMarg_margin-left-m__26vDN", "padding-left-s": "PadMarg_padding-left-s__3oPOh", "margin-left-s": "PadMarg_margin-left-s__-aaLr", "padding-left-xs": "PadMarg_padding-left-xs__3yDGi", "margin-left-xs": "PadMarg_margin-left-xs__3154q", "padding-left-xxs": "PadMarg_padding-left-xxs__3wfNE", "margin-left-xxs": "PadMarg_margin-left-xxs__1MZFn", "padding-left-xxxs": "PadMarg_padding-left-xxxs__1mlMj", "margin-left-xxxs": "PadMarg_margin-left-xxxs__13ktf", "padding-left-60": "PadMarg_padding-left-60__1NKz9", "margin-left-60": "PadMarg_margin-left-60__1kBxe", "padding-left-56": "PadMarg_padding-left-56__2lj9L", "margin-left-56": "PadMarg_margin-left-56__1GCiI", "padding-left-52": "PadMarg_padding-left-52__3guuR", "margin-left-52": "PadMarg_margin-left-52__2OQQk", "padding-left-48": "PadMarg_padding-left-48__1ymbO", "margin-left-48": "PadMarg_margin-left-48__1H2I2", "padding-left-44": "PadMarg_padding-left-44__3TDbB", "margin-left-44": "PadMarg_margin-left-44__2AJFS", "padding-left-40": "PadMarg_padding-left-40__24_o4", "margin-left-40": "PadMarg_margin-left-40__2WCUe", "padding-left-36": "PadMarg_padding-left-36__3-loh", "margin-left-36": "PadMarg_margin-left-36__pOWBc", "padding-left-32": "PadMarg_padding-left-32__2yt0Y", "margin-left-32": "PadMarg_margin-left-32__LIjdn", "padding-left-28": "PadMarg_padding-left-28__xKykJ", "margin-left-28": "PadMarg_margin-left-28__2X8jn", "padding-left-24": "PadMarg_padding-left-24__2BpBK", "margin-left-24": "PadMarg_margin-left-24__2V433", "padding-left-20": "PadMarg_padding-left-20__2l04W", "margin-left-20": "PadMarg_margin-left-20__38nsE", "padding-left-16": "PadMarg_padding-left-16__NaFUC", "margin-left-16": "PadMarg_margin-left-16__2BaHm", "padding-left-12": "PadMarg_padding-left-12__3fQK3", "margin-left-12": "PadMarg_margin-left-12__3zUHC", "padding-left-8": "PadMarg_padding-left-8__2uHXF", "margin-left-8": "PadMarg_margin-left-8__Ho4PW", "padding-left-4": "PadMarg_padding-left-4__2F1N8", "margin-left-4": "PadMarg_margin-left-4__3P7V9", "padding-left-2": "PadMarg_padding-left-2__NL0De", "margin-left-2": "PadMarg_margin-left-2__2nKQJ", "padding-left-0": "PadMarg_padding-left-0__3ogj7", "margin-left-0": "PadMarg_margin-left-0__1bHYl", "padding-top-l-xxxl": "PadMarg_padding-top-l-xxxl__1UBAu", "margin-top-l-xxxl": "PadMarg_margin-top-l-xxxl__3OKpQ", "padding-top-l-xxl": "PadMarg_padding-top-l-xxl__Rckjx", "margin-top-l-xxl": "PadMarg_margin-top-l-xxl__3n2o0", "padding-top-l-xl": "PadMarg_padding-top-l-xl__1jFVC", "margin-top-l-xl": "PadMarg_margin-top-l-xl__Rini9", "padding-top-l-l": "PadMarg_padding-top-l-l__L536s", "margin-top-l-l": "PadMarg_margin-top-l-l__20JSC", "padding-top-l-m": "PadMarg_padding-top-l-m__1n0gh", "margin-top-l-m": "PadMarg_margin-top-l-m__2UuOq", "padding-top-l-s": "PadMarg_padding-top-l-s__lznua", "margin-top-l-s": "PadMarg_margin-top-l-s__10e5o", "padding-top-l-xs": "PadMarg_padding-top-l-xs__7nPzP", "margin-top-l-xs": "PadMarg_margin-top-l-xs__2c5cL", "padding-top-l-xxs": "PadMarg_padding-top-l-xxs__1dpdv", "margin-top-l-xxs": "PadMarg_margin-top-l-xxs__2hjDF", "padding-top-l-xxxs": "PadMarg_padding-top-l-xxxs__2xmbz", "margin-top-l-xxxs": "PadMarg_margin-top-l-xxxs__2v7c5", "padding-top-l-60": "PadMarg_padding-top-l-60__ErQZ5", "margin-top-l-60": "PadMarg_margin-top-l-60__2zOz7", "padding-top-l-56": "PadMarg_padding-top-l-56__xZqE3", "margin-top-l-56": "PadMarg_margin-top-l-56__y25wF", "padding-top-l-52": "PadMarg_padding-top-l-52__2uacz", "margin-top-l-52": "PadMarg_margin-top-l-52__3jWRT", "padding-top-l-48": "PadMarg_padding-top-l-48__1f2yq", "margin-top-l-48": "PadMarg_margin-top-l-48__16MaG", "padding-top-l-44": "PadMarg_padding-top-l-44__2yPO3", "margin-top-l-44": "PadMarg_margin-top-l-44__3BJv8", "padding-top-l-40": "PadMarg_padding-top-l-40__29O-h", "margin-top-l-40": "PadMarg_margin-top-l-40__1lspT", "padding-top-l-36": "PadMarg_padding-top-l-36__5iPhb", "margin-top-l-36": "PadMarg_margin-top-l-36__2qZRV", "padding-top-l-32": "PadMarg_padding-top-l-32__2gRL7", "margin-top-l-32": "PadMarg_margin-top-l-32__1M3sr", "padding-top-l-28": "PadMarg_padding-top-l-28__13vcW", "margin-top-l-28": "PadMarg_margin-top-l-28__vVtZt", "padding-top-l-24": "PadMarg_padding-top-l-24__2zcBV", "margin-top-l-24": "PadMarg_margin-top-l-24__KVZkp", "padding-top-l-20": "PadMarg_padding-top-l-20__2aqBU", "margin-top-l-20": "PadMarg_margin-top-l-20__3NYDY", "padding-top-l-16": "PadMarg_padding-top-l-16__2e04V", "margin-top-l-16": "PadMarg_margin-top-l-16__1zCT8", "padding-top-l-12": "PadMarg_padding-top-l-12__Kos02", "margin-top-l-12": "PadMarg_margin-top-l-12__1oBy4", "padding-top-l-8": "PadMarg_padding-top-l-8__3knBT", "margin-top-l-8": "PadMarg_margin-top-l-8__230Xv", "padding-top-l-4": "PadMarg_padding-top-l-4__1vu0N", "margin-top-l-4": "PadMarg_margin-top-l-4__W60f8", "padding-top-l-2": "PadMarg_padding-top-l-2__1NVyS", "margin-top-l-2": "PadMarg_margin-top-l-2__9e24q", "padding-top-l-0": "PadMarg_padding-top-l-0__1qZrH", "margin-top-l-0": "PadMarg_margin-top-l-0__287AA", "padding-right-l-xxxl": "PadMarg_padding-right-l-xxxl__37-xM", "margin-right-l-xxxl": "PadMarg_margin-right-l-xxxl__Rkn8M", "padding-right-l-xxl": "PadMarg_padding-right-l-xxl__1LBqw", "margin-right-l-xxl": "PadMarg_margin-right-l-xxl__1zkE8", "padding-right-l-xl": "PadMarg_padding-right-l-xl__2lett", "margin-right-l-xl": "PadMarg_margin-right-l-xl__3WAoO", "padding-right-l-l": "PadMarg_padding-right-l-l__2OzbP", "margin-right-l-l": "PadMarg_margin-right-l-l__3WKRg", "padding-right-l-m": "PadMarg_padding-right-l-m__3SGql", "margin-right-l-m": "PadMarg_margin-right-l-m__1p2Da", "padding-right-l-s": "PadMarg_padding-right-l-s__TpUI6", "margin-right-l-s": "PadMarg_margin-right-l-s__17_5Z", "padding-right-l-xs": "PadMarg_padding-right-l-xs__3MsmW", "margin-right-l-xs": "PadMarg_margin-right-l-xs__1LfKR", "padding-right-l-xxs": "PadMarg_padding-right-l-xxs__3Szj6", "margin-right-l-xxs": "PadMarg_margin-right-l-xxs__yBxef", "padding-right-l-xxxs": "PadMarg_padding-right-l-xxxs__1gTHA", "margin-right-l-xxxs": "PadMarg_margin-right-l-xxxs__1aMZk", "padding-right-l-60": "PadMarg_padding-right-l-60__NQav1", "margin-right-l-60": "PadMarg_margin-right-l-60__2qA_m", "padding-right-l-56": "PadMarg_padding-right-l-56__2KbQ4", "margin-right-l-56": "PadMarg_margin-right-l-56__2R68M", "padding-right-l-52": "PadMarg_padding-right-l-52__syG_2", "margin-right-l-52": "PadMarg_margin-right-l-52__rZZSl", "padding-right-l-48": "PadMarg_padding-right-l-48__3Mlch", "margin-right-l-48": "PadMarg_margin-right-l-48__1vInm", "padding-right-l-44": "PadMarg_padding-right-l-44__1P738", "margin-right-l-44": "PadMarg_margin-right-l-44__DjbtT", "padding-right-l-40": "PadMarg_padding-right-l-40__mteE6", "margin-right-l-40": "PadMarg_margin-right-l-40__3_WE6", "padding-right-l-36": "PadMarg_padding-right-l-36__14Rvj", "margin-right-l-36": "PadMarg_margin-right-l-36__WYCvq", "padding-right-l-32": "PadMarg_padding-right-l-32__3AGPf", "margin-right-l-32": "PadMarg_margin-right-l-32__1KnZu", "padding-right-l-28": "PadMarg_padding-right-l-28__1Gi9S", "margin-right-l-28": "PadMarg_margin-right-l-28__3aYYV", "padding-right-l-24": "PadMarg_padding-right-l-24__1Qby2", "margin-right-l-24": "PadMarg_margin-right-l-24__A1Zdb", "padding-right-l-20": "PadMarg_padding-right-l-20__1RreZ", "margin-right-l-20": "PadMarg_margin-right-l-20__21O3o", "padding-right-l-16": "PadMarg_padding-right-l-16__2n5co", "margin-right-l-16": "PadMarg_margin-right-l-16__1mFmA", "padding-right-l-12": "PadMarg_padding-right-l-12__2erNK", "margin-right-l-12": "PadMarg_margin-right-l-12__3HMk0", "padding-right-l-8": "PadMarg_padding-right-l-8__1b5Vq", "margin-right-l-8": "PadMarg_margin-right-l-8__321PI", "padding-right-l-4": "PadMarg_padding-right-l-4__OUSij", "margin-right-l-4": "PadMarg_margin-right-l-4__wGe7b", "padding-right-l-2": "PadMarg_padding-right-l-2__3kZRT", "margin-right-l-2": "PadMarg_margin-right-l-2__9nWR3", "padding-right-l-0": "PadMarg_padding-right-l-0__3gU0n", "margin-right-l-0": "PadMarg_margin-right-l-0__2Snyz", "padding-bottom-l-xxxl": "PadMarg_padding-bottom-l-xxxl__3BnDO", "margin-bottom-l-xxxl": "PadMarg_margin-bottom-l-xxxl__2tjp0", "padding-bottom-l-xxl": "PadMarg_padding-bottom-l-xxl__3MBAF", "margin-bottom-l-xxl": "PadMarg_margin-bottom-l-xxl__1k7ks", "padding-bottom-l-xl": "PadMarg_padding-bottom-l-xl__38-cG", "margin-bottom-l-xl": "PadMarg_margin-bottom-l-xl__2CEbV", "padding-bottom-l-l": "PadMarg_padding-bottom-l-l__32m_0", "margin-bottom-l-l": "PadMarg_margin-bottom-l-l__2qNMf", "padding-bottom-l-m": "PadMarg_padding-bottom-l-m__3Sc61", "margin-bottom-l-m": "PadMarg_margin-bottom-l-m__sLd8n", "padding-bottom-l-s": "PadMarg_padding-bottom-l-s__1qnZK", "margin-bottom-l-s": "PadMarg_margin-bottom-l-s__1tbiX", "padding-bottom-l-xs": "PadMarg_padding-bottom-l-xs__14vVj", "margin-bottom-l-xs": "PadMarg_margin-bottom-l-xs__3OXkW", "padding-bottom-l-xxs": "PadMarg_padding-bottom-l-xxs__BlEmM", "margin-bottom-l-xxs": "PadMarg_margin-bottom-l-xxs__MzbOY", "padding-bottom-l-xxxs": "PadMarg_padding-bottom-l-xxxs__dHbyH", "margin-bottom-l-xxxs": "PadMarg_margin-bottom-l-xxxs__2wXo1", "padding-bottom-l-60": "PadMarg_padding-bottom-l-60__1mRp5", "margin-bottom-l-60": "PadMarg_margin-bottom-l-60__1kiub", "padding-bottom-l-56": "PadMarg_padding-bottom-l-56__fLi4j", "margin-bottom-l-56": "PadMarg_margin-bottom-l-56__1k2rc", "padding-bottom-l-52": "PadMarg_padding-bottom-l-52__1SMkc", "margin-bottom-l-52": "PadMarg_margin-bottom-l-52__3GLC4", "padding-bottom-l-48": "PadMarg_padding-bottom-l-48__2ejjF", "margin-bottom-l-48": "PadMarg_margin-bottom-l-48__3uh9x", "padding-bottom-l-44": "PadMarg_padding-bottom-l-44__1Wm3B", "margin-bottom-l-44": "PadMarg_margin-bottom-l-44__1jN0o", "padding-bottom-l-40": "PadMarg_padding-bottom-l-40__2K_C0", "margin-bottom-l-40": "PadMarg_margin-bottom-l-40__1Bnir", "padding-bottom-l-36": "PadMarg_padding-bottom-l-36__2ihKa", "margin-bottom-l-36": "PadMarg_margin-bottom-l-36__3sUZz", "padding-bottom-l-32": "PadMarg_padding-bottom-l-32__1Frrz", "margin-bottom-l-32": "PadMarg_margin-bottom-l-32__1Ws34", "padding-bottom-l-28": "PadMarg_padding-bottom-l-28__2F73C", "margin-bottom-l-28": "PadMarg_margin-bottom-l-28__3fjhS", "padding-bottom-l-24": "PadMarg_padding-bottom-l-24__3gjck", "margin-bottom-l-24": "PadMarg_margin-bottom-l-24__2pOyL", "padding-bottom-l-20": "PadMarg_padding-bottom-l-20__2bKGh", "margin-bottom-l-20": "PadMarg_margin-bottom-l-20__1kZ5G", "padding-bottom-l-16": "PadMarg_padding-bottom-l-16__3LWVc", "margin-bottom-l-16": "PadMarg_margin-bottom-l-16__P_Pu1", "padding-bottom-l-12": "PadMarg_padding-bottom-l-12__1DkYA", "margin-bottom-l-12": "PadMarg_margin-bottom-l-12__17v4m", "padding-bottom-l-8": "PadMarg_padding-bottom-l-8__2l4ar", "margin-bottom-l-8": "PadMarg_margin-bottom-l-8__1AJed", "padding-bottom-l-4": "PadMarg_padding-bottom-l-4__1V_gH", "margin-bottom-l-4": "PadMarg_margin-bottom-l-4__FUWII", "padding-bottom-l-2": "PadMarg_padding-bottom-l-2__2Qj6C", "margin-bottom-l-2": "PadMarg_margin-bottom-l-2__3CDU8", "padding-bottom-l-0": "PadMarg_padding-bottom-l-0__34ALz", "margin-bottom-l-0": "PadMarg_margin-bottom-l-0__3FQIM", "padding-left-l-xxxl": "PadMarg_padding-left-l-xxxl__39grv", "margin-left-l-xxxl": "PadMarg_margin-left-l-xxxl__2Syjc", "padding-left-l-xxl": "PadMarg_padding-left-l-xxl__1SI0c", "margin-left-l-xxl": "PadMarg_margin-left-l-xxl__3Ze80", "padding-left-l-xl": "PadMarg_padding-left-l-xl__J2bwO", "margin-left-l-xl": "PadMarg_margin-left-l-xl__2eDFt", "padding-left-l-l": "PadMarg_padding-left-l-l__1_q1w", "margin-left-l-l": "PadMarg_margin-left-l-l__24kbT", "padding-left-l-m": "PadMarg_padding-left-l-m__2CDNU", "margin-left-l-m": "PadMarg_margin-left-l-m__2l5_c", "padding-left-l-s": "PadMarg_padding-left-l-s__1isP4", "margin-left-l-s": "PadMarg_margin-left-l-s__3okIR", "padding-left-l-xs": "PadMarg_padding-left-l-xs__dtIgP", "margin-left-l-xs": "PadMarg_margin-left-l-xs__E_xlq", "padding-left-l-xxs": "PadMarg_padding-left-l-xxs__1Ju5E", "margin-left-l-xxs": "PadMarg_margin-left-l-xxs__3lgUV", "padding-left-l-xxxs": "PadMarg_padding-left-l-xxxs__1mvfA", "margin-left-l-xxxs": "PadMarg_margin-left-l-xxxs__2CzPq", "padding-left-l-60": "PadMarg_padding-left-l-60__2PdUd", "margin-left-l-60": "PadMarg_margin-left-l-60__1llrH", "padding-left-l-56": "PadMarg_padding-left-l-56__2Btg9", "margin-left-l-56": "PadMarg_margin-left-l-56__2gNBl", "padding-left-l-52": "PadMarg_padding-left-l-52__3xsOj", "margin-left-l-52": "PadMarg_margin-left-l-52__2f9eS", "padding-left-l-48": "PadMarg_padding-left-l-48__2P0zW", "margin-left-l-48": "PadMarg_margin-left-l-48__2k9vV", "padding-left-l-44": "PadMarg_padding-left-l-44__3gNhq", "margin-left-l-44": "PadMarg_margin-left-l-44__2crMQ", "padding-left-l-40": "PadMarg_padding-left-l-40__2hVUl", "margin-left-l-40": "PadMarg_margin-left-l-40__3yeR7", "padding-left-l-36": "PadMarg_padding-left-l-36__3Ob8b", "margin-left-l-36": "PadMarg_margin-left-l-36__172Sy", "padding-left-l-32": "PadMarg_padding-left-l-32__3o46r", "margin-left-l-32": "PadMarg_margin-left-l-32__3k0GP", "padding-left-l-28": "PadMarg_padding-left-l-28__CnPl7", "margin-left-l-28": "PadMarg_margin-left-l-28__2d7Gw", "padding-left-l-24": "PadMarg_padding-left-l-24__1msXQ", "margin-left-l-24": "PadMarg_margin-left-l-24__10CiU", "padding-left-l-20": "PadMarg_padding-left-l-20__2IrlW", "margin-left-l-20": "PadMarg_margin-left-l-20__1rm8z", "padding-left-l-16": "PadMarg_padding-left-l-16__3sPTU", "margin-left-l-16": "PadMarg_margin-left-l-16__-FwAZ", "padding-left-l-12": "PadMarg_padding-left-l-12__1govo", "margin-left-l-12": "PadMarg_margin-left-l-12__2oIo9", "padding-left-l-8": "PadMarg_padding-left-l-8__XYFf8", "margin-left-l-8": "PadMarg_margin-left-l-8__Us7hy", "padding-left-l-4": "PadMarg_padding-left-l-4__3qxG4", "margin-left-l-4": "PadMarg_margin-left-l-4__2ttXW", "padding-left-l-2": "PadMarg_padding-left-l-2__1eDEe", "margin-left-l-2": "PadMarg_margin-left-l-2__2GDPa", "padding-left-l-0": "PadMarg_padding-left-l-0__17-KC", "margin-left-l-0": "PadMarg_margin-left-l-0__2We1F", "padding-top-m-xxxl": "PadMarg_padding-top-m-xxxl__1D8oI", "margin-top-m-xxxl": "PadMarg_margin-top-m-xxxl__3KBxM", "padding-top-m-xxl": "PadMarg_padding-top-m-xxl__3FQVR", "margin-top-m-xxl": "PadMarg_margin-top-m-xxl__1-Mnp", "padding-top-m-xl": "PadMarg_padding-top-m-xl__KWKO_", "margin-top-m-xl": "PadMarg_margin-top-m-xl__3jo3R", "padding-top-m-l": "PadMarg_padding-top-m-l__1ShsR", "margin-top-m-l": "PadMarg_margin-top-m-l__SsLpf", "padding-top-m-m": "PadMarg_padding-top-m-m__1lssQ", "margin-top-m-m": "PadMarg_margin-top-m-m__3GaMZ", "padding-top-m-s": "PadMarg_padding-top-m-s__cSrwq", "margin-top-m-s": "PadMarg_margin-top-m-s__3S9Q4", "padding-top-m-xs": "PadMarg_padding-top-m-xs__283aF", "margin-top-m-xs": "PadMarg_margin-top-m-xs__4DFg2", "padding-top-m-xxs": "PadMarg_padding-top-m-xxs__3Jvpk", "margin-top-m-xxs": "PadMarg_margin-top-m-xxs__idZRr", "padding-top-m-xxxs": "PadMarg_padding-top-m-xxxs__XLWD3", "margin-top-m-xxxs": "PadMarg_margin-top-m-xxxs__33gKV", "padding-top-m-60": "PadMarg_padding-top-m-60__3meit", "margin-top-m-60": "PadMarg_margin-top-m-60__1_VXK", "padding-top-m-56": "PadMarg_padding-top-m-56__3bMMG", "margin-top-m-56": "PadMarg_margin-top-m-56__2GQd-", "padding-top-m-52": "PadMarg_padding-top-m-52__d0m0t", "margin-top-m-52": "PadMarg_margin-top-m-52__3odbF", "padding-top-m-48": "PadMarg_padding-top-m-48__2CYmQ", "margin-top-m-48": "PadMarg_margin-top-m-48__2qczb", "padding-top-m-44": "PadMarg_padding-top-m-44___Si50", "margin-top-m-44": "PadMarg_margin-top-m-44__2Wssg", "padding-top-m-40": "PadMarg_padding-top-m-40__2LEjc", "margin-top-m-40": "PadMarg_margin-top-m-40__3JgPV", "padding-top-m-36": "PadMarg_padding-top-m-36__1r7EV", "margin-top-m-36": "PadMarg_margin-top-m-36__3iOLh", "padding-top-m-32": "PadMarg_padding-top-m-32__vllfU", "margin-top-m-32": "PadMarg_margin-top-m-32__382AZ", "padding-top-m-28": "PadMarg_padding-top-m-28__1sNaB", "margin-top-m-28": "PadMarg_margin-top-m-28__17PSO", "padding-top-m-24": "PadMarg_padding-top-m-24__2R2ZE", "margin-top-m-24": "PadMarg_margin-top-m-24__-VmCG", "padding-top-m-20": "PadMarg_padding-top-m-20__3KWsO", "margin-top-m-20": "PadMarg_margin-top-m-20__3ztMO", "padding-top-m-16": "PadMarg_padding-top-m-16__2l93M", "margin-top-m-16": "PadMarg_margin-top-m-16__CRCSL", "padding-top-m-12": "PadMarg_padding-top-m-12__3JL_P", "margin-top-m-12": "PadMarg_margin-top-m-12__3EkVQ", "padding-top-m-8": "PadMarg_padding-top-m-8__Y3irf", "margin-top-m-8": "PadMarg_margin-top-m-8__3yFex", "padding-top-m-4": "PadMarg_padding-top-m-4__22Ca6", "margin-top-m-4": "PadMarg_margin-top-m-4__1k9CK", "padding-top-m-2": "PadMarg_padding-top-m-2__1L5cn", "margin-top-m-2": "PadMarg_margin-top-m-2__3VwcF", "padding-top-m-0": "PadMarg_padding-top-m-0__3nRPY", "margin-top-m-0": "PadMarg_margin-top-m-0__cZIvJ", "padding-right-m-xxxl": "PadMarg_padding-right-m-xxxl__21yvv", "margin-right-m-xxxl": "PadMarg_margin-right-m-xxxl__12Zuw", "padding-right-m-xxl": "PadMarg_padding-right-m-xxl__1ZIkX", "margin-right-m-xxl": "PadMarg_margin-right-m-xxl__1SHeY", "padding-right-m-xl": "PadMarg_padding-right-m-xl__1Yzjw", "margin-right-m-xl": "PadMarg_margin-right-m-xl__2ya0Q", "padding-right-m-l": "PadMarg_padding-right-m-l__x2iba", "margin-right-m-l": "PadMarg_margin-right-m-l__3HN-4", "padding-right-m-m": "PadMarg_padding-right-m-m__2ccUx", "margin-right-m-m": "PadMarg_margin-right-m-m__2DU-f", "padding-right-m-s": "PadMarg_padding-right-m-s__2bBnp", "margin-right-m-s": "PadMarg_margin-right-m-s__ENCUz", "padding-right-m-xs": "PadMarg_padding-right-m-xs__3_4cf", "margin-right-m-xs": "PadMarg_margin-right-m-xs__39A_f", "padding-right-m-xxs": "PadMarg_padding-right-m-xxs__2om1a", "margin-right-m-xxs": "PadMarg_margin-right-m-xxs__1uS7O", "padding-right-m-xxxs": "PadMarg_padding-right-m-xxxs__35OSs", "margin-right-m-xxxs": "PadMarg_margin-right-m-xxxs__32KVl", "padding-right-m-60": "PadMarg_padding-right-m-60__30D20", "margin-right-m-60": "PadMarg_margin-right-m-60__1Q_TR", "padding-right-m-56": "PadMarg_padding-right-m-56__39X5n", "margin-right-m-56": "PadMarg_margin-right-m-56__1OCqN", "padding-right-m-52": "PadMarg_padding-right-m-52__2DsYt", "margin-right-m-52": "PadMarg_margin-right-m-52__1i11O", "padding-right-m-48": "PadMarg_padding-right-m-48__33H3Z", "margin-right-m-48": "PadMarg_margin-right-m-48__2gvFZ", "padding-right-m-44": "PadMarg_padding-right-m-44__3my_e", "margin-right-m-44": "PadMarg_margin-right-m-44__FcFUg", "padding-right-m-40": "PadMarg_padding-right-m-40__3Cles", "margin-right-m-40": "PadMarg_margin-right-m-40__1WWKt", "padding-right-m-36": "PadMarg_padding-right-m-36__1EDnR", "margin-right-m-36": "PadMarg_margin-right-m-36__1kK7g", "padding-right-m-32": "PadMarg_padding-right-m-32__2fHz0", "margin-right-m-32": "PadMarg_margin-right-m-32__2LZQT", "padding-right-m-28": "PadMarg_padding-right-m-28__3iDpb", "margin-right-m-28": "PadMarg_margin-right-m-28__3sND6", "padding-right-m-24": "PadMarg_padding-right-m-24__39Bby", "margin-right-m-24": "PadMarg_margin-right-m-24__d7ADo", "padding-right-m-20": "PadMarg_padding-right-m-20__3wuiO", "margin-right-m-20": "PadMarg_margin-right-m-20__31_7i", "padding-right-m-16": "PadMarg_padding-right-m-16__3ZgtN", "margin-right-m-16": "PadMarg_margin-right-m-16__2PKLZ", "padding-right-m-12": "PadMarg_padding-right-m-12__1exWe", "margin-right-m-12": "PadMarg_margin-right-m-12__3IGcq", "padding-right-m-8": "PadMarg_padding-right-m-8__3qWKy", "margin-right-m-8": "PadMarg_margin-right-m-8__3eLF4", "padding-right-m-4": "PadMarg_padding-right-m-4__E7wZo", "margin-right-m-4": "PadMarg_margin-right-m-4__rbOrR", "padding-right-m-2": "PadMarg_padding-right-m-2__2C7cm", "margin-right-m-2": "PadMarg_margin-right-m-2__dPt96", "padding-right-m-0": "PadMarg_padding-right-m-0__ufiSm", "margin-right-m-0": "PadMarg_margin-right-m-0__14GvE", "padding-bottom-m-xxxl": "PadMarg_padding-bottom-m-xxxl__3Lu_f", "margin-bottom-m-xxxl": "PadMarg_margin-bottom-m-xxxl__2oqDe", "padding-bottom-m-xxl": "PadMarg_padding-bottom-m-xxl__3N1hB", "margin-bottom-m-xxl": "PadMarg_margin-bottom-m-xxl__3Wi5W", "padding-bottom-m-xl": "PadMarg_padding-bottom-m-xl__1L7cE", "margin-bottom-m-xl": "PadMarg_margin-bottom-m-xl__1bJm1", "padding-bottom-m-l": "PadMarg_padding-bottom-m-l__25el0", "margin-bottom-m-l": "PadMarg_margin-bottom-m-l__3HOOI", "padding-bottom-m-m": "PadMarg_padding-bottom-m-m__1PumQ", "margin-bottom-m-m": "PadMarg_margin-bottom-m-m__10R84", "padding-bottom-m-s": "PadMarg_padding-bottom-m-s__1n5xB", "margin-bottom-m-s": "PadMarg_margin-bottom-m-s__2T44X", "padding-bottom-m-xs": "PadMarg_padding-bottom-m-xs__23f1t", "margin-bottom-m-xs": "PadMarg_margin-bottom-m-xs__1zzdV", "padding-bottom-m-xxs": "PadMarg_padding-bottom-m-xxs__2JvGK", "margin-bottom-m-xxs": "PadMarg_margin-bottom-m-xxs__1N6JJ", "padding-bottom-m-xxxs": "PadMarg_padding-bottom-m-xxxs__36kN9", "margin-bottom-m-xxxs": "PadMarg_margin-bottom-m-xxxs__1_rTr", "padding-bottom-m-60": "PadMarg_padding-bottom-m-60__2h3hW", "margin-bottom-m-60": "PadMarg_margin-bottom-m-60__GoxwL", "padding-bottom-m-56": "PadMarg_padding-bottom-m-56__3N6yU", "margin-bottom-m-56": "PadMarg_margin-bottom-m-56__2kxAS", "padding-bottom-m-52": "PadMarg_padding-bottom-m-52__EZQZf", "margin-bottom-m-52": "PadMarg_margin-bottom-m-52__31MpD", "padding-bottom-m-48": "PadMarg_padding-bottom-m-48__2hOBk", "margin-bottom-m-48": "PadMarg_margin-bottom-m-48__rLVpS", "padding-bottom-m-44": "PadMarg_padding-bottom-m-44__2HVDl", "margin-bottom-m-44": "PadMarg_margin-bottom-m-44__178G4", "padding-bottom-m-40": "PadMarg_padding-bottom-m-40__2aLd7", "margin-bottom-m-40": "PadMarg_margin-bottom-m-40__asXCO", "padding-bottom-m-36": "PadMarg_padding-bottom-m-36__1Jep9", "margin-bottom-m-36": "PadMarg_margin-bottom-m-36__jg2__", "padding-bottom-m-32": "PadMarg_padding-bottom-m-32__3Zb7G", "margin-bottom-m-32": "PadMarg_margin-bottom-m-32__1XK32", "padding-bottom-m-28": "PadMarg_padding-bottom-m-28__3g1Ww", "margin-bottom-m-28": "PadMarg_margin-bottom-m-28__1oNPV", "padding-bottom-m-24": "PadMarg_padding-bottom-m-24__1n-So", "margin-bottom-m-24": "PadMarg_margin-bottom-m-24__1I0f1", "padding-bottom-m-20": "PadMarg_padding-bottom-m-20__3dhQE", "margin-bottom-m-20": "PadMarg_margin-bottom-m-20__4LoR5", "padding-bottom-m-16": "PadMarg_padding-bottom-m-16__rNRUv", "margin-bottom-m-16": "PadMarg_margin-bottom-m-16__3o7VY", "padding-bottom-m-12": "PadMarg_padding-bottom-m-12__10hx5", "margin-bottom-m-12": "PadMarg_margin-bottom-m-12__3btID", "padding-bottom-m-8": "PadMarg_padding-bottom-m-8__3aRhy", "margin-bottom-m-8": "PadMarg_margin-bottom-m-8__2SJVe", "padding-bottom-m-4": "PadMarg_padding-bottom-m-4__1icy_", "margin-bottom-m-4": "PadMarg_margin-bottom-m-4__3aTVT", "padding-bottom-m-2": "PadMarg_padding-bottom-m-2__3IW_r", "margin-bottom-m-2": "PadMarg_margin-bottom-m-2__1Rw2H", "padding-bottom-m-0": "PadMarg_padding-bottom-m-0__5g0eA", "margin-bottom-m-0": "PadMarg_margin-bottom-m-0__3hbfr", "padding-left-m-xxxl": "PadMarg_padding-left-m-xxxl__3Go-2", "margin-left-m-xxxl": "PadMarg_margin-left-m-xxxl__1sulf", "padding-left-m-xxl": "PadMarg_padding-left-m-xxl__sMR3M", "margin-left-m-xxl": "PadMarg_margin-left-m-xxl__1wo6M", "padding-left-m-xl": "PadMarg_padding-left-m-xl__1YYtk", "margin-left-m-xl": "PadMarg_margin-left-m-xl__3YM1D", "padding-left-m-l": "PadMarg_padding-left-m-l__1jwK4", "margin-left-m-l": "PadMarg_margin-left-m-l__3MvC3", "padding-left-m-m": "PadMarg_padding-left-m-m__2wTCw", "margin-left-m-m": "PadMarg_margin-left-m-m__35T82", "padding-left-m-s": "PadMarg_padding-left-m-s__1SG5S", "margin-left-m-s": "PadMarg_margin-left-m-s__3kI8I", "padding-left-m-xs": "PadMarg_padding-left-m-xs__3UuNr", "margin-left-m-xs": "PadMarg_margin-left-m-xs__WH2-T", "padding-left-m-xxs": "PadMarg_padding-left-m-xxs__16TAF", "margin-left-m-xxs": "PadMarg_margin-left-m-xxs__iLWW7", "padding-left-m-xxxs": "PadMarg_padding-left-m-xxxs__1oSps", "margin-left-m-xxxs": "PadMarg_margin-left-m-xxxs__1tUAB", "padding-left-m-60": "PadMarg_padding-left-m-60__yNHWv", "margin-left-m-60": "PadMarg_margin-left-m-60__3NfkR", "padding-left-m-56": "PadMarg_padding-left-m-56__3CqVs", "margin-left-m-56": "PadMarg_margin-left-m-56__2HzTS", "padding-left-m-52": "PadMarg_padding-left-m-52__29oFL", "margin-left-m-52": "PadMarg_margin-left-m-52__187AO", "padding-left-m-48": "PadMarg_padding-left-m-48__Zxp-w", "margin-left-m-48": "PadMarg_margin-left-m-48__oeBpq", "padding-left-m-44": "PadMarg_padding-left-m-44__39Q2m", "margin-left-m-44": "PadMarg_margin-left-m-44__3cMX_", "padding-left-m-40": "PadMarg_padding-left-m-40__3GK61", "margin-left-m-40": "PadMarg_margin-left-m-40__3SQIH", "padding-left-m-36": "PadMarg_padding-left-m-36__2pzEr", "margin-left-m-36": "PadMarg_margin-left-m-36__25lCR", "padding-left-m-32": "PadMarg_padding-left-m-32__suEBt", "margin-left-m-32": "PadMarg_margin-left-m-32__3sE-l", "padding-left-m-28": "PadMarg_padding-left-m-28__2w_pO", "margin-left-m-28": "PadMarg_margin-left-m-28__3b5yA", "padding-left-m-24": "PadMarg_padding-left-m-24__yZIEk", "margin-left-m-24": "PadMarg_margin-left-m-24__3GfpV", "padding-left-m-20": "PadMarg_padding-left-m-20__20-Lk", "margin-left-m-20": "PadMarg_margin-left-m-20__1q56f", "padding-left-m-16": "PadMarg_padding-left-m-16__1S589", "margin-left-m-16": "PadMarg_margin-left-m-16__1qwIh", "padding-left-m-12": "PadMarg_padding-left-m-12__1FPJI", "margin-left-m-12": "PadMarg_margin-left-m-12__1ugkp", "padding-left-m-8": "PadMarg_padding-left-m-8__3jGvC", "margin-left-m-8": "PadMarg_margin-left-m-8__24avN", "padding-left-m-4": "PadMarg_padding-left-m-4__2-XH7", "margin-left-m-4": "PadMarg_margin-left-m-4__2HnEX", "padding-left-m-2": "PadMarg_padding-left-m-2__3NW3C", "margin-left-m-2": "PadMarg_margin-left-m-2__1jw_2", "padding-left-m-0": "PadMarg_padding-left-m-0__1SEKv", "margin-left-m-0": "PadMarg_margin-left-m-0__3Hd2w", "padding-top-s-xxxl": "PadMarg_padding-top-s-xxxl__3FJQe", "margin-top-s-xxxl": "PadMarg_margin-top-s-xxxl__3Q5p_", "padding-top-s-xxl": "PadMarg_padding-top-s-xxl__uvVGG", "margin-top-s-xxl": "PadMarg_margin-top-s-xxl__3qsHI", "padding-top-s-xl": "PadMarg_padding-top-s-xl__7_Ghg", "margin-top-s-xl": "PadMarg_margin-top-s-xl__WrG8J", "padding-top-s-l": "PadMarg_padding-top-s-l__A2Za4", "margin-top-s-l": "PadMarg_margin-top-s-l__3C67h", "padding-top-s-m": "PadMarg_padding-top-s-m__X5VPR", "margin-top-s-m": "PadMarg_margin-top-s-m__Ppavu", "padding-top-s-s": "PadMarg_padding-top-s-s__2Tqfk", "margin-top-s-s": "PadMarg_margin-top-s-s__wLvzP", "padding-top-s-xs": "PadMarg_padding-top-s-xs__2-jH-", "margin-top-s-xs": "PadMarg_margin-top-s-xs__1MlpT", "padding-top-s-xxs": "PadMarg_padding-top-s-xxs__3-vrb", "margin-top-s-xxs": "PadMarg_margin-top-s-xxs__OmhpN", "padding-top-s-xxxs": "PadMarg_padding-top-s-xxxs__1Pbgw", "margin-top-s-xxxs": "PadMarg_margin-top-s-xxxs__iFIts", "padding-top-s-60": "PadMarg_padding-top-s-60__1ULMj", "margin-top-s-60": "PadMarg_margin-top-s-60__XF3ha", "padding-top-s-56": "PadMarg_padding-top-s-56__wl8vN", "margin-top-s-56": "PadMarg_margin-top-s-56__3WX1x", "padding-top-s-52": "PadMarg_padding-top-s-52__sYEXr", "margin-top-s-52": "PadMarg_margin-top-s-52__331iL", "padding-top-s-48": "PadMarg_padding-top-s-48__Et9JC", "margin-top-s-48": "PadMarg_margin-top-s-48__1F5Rx", "padding-top-s-44": "PadMarg_padding-top-s-44__35t75", "margin-top-s-44": "PadMarg_margin-top-s-44__2tHJH", "padding-top-s-40": "PadMarg_padding-top-s-40__75zY_", "margin-top-s-40": "PadMarg_margin-top-s-40__UP63v", "padding-top-s-36": "PadMarg_padding-top-s-36__274M6", "margin-top-s-36": "PadMarg_margin-top-s-36__gOHCR", "padding-top-s-32": "PadMarg_padding-top-s-32__31Hb1", "margin-top-s-32": "PadMarg_margin-top-s-32__1W6Kh", "padding-top-s-28": "PadMarg_padding-top-s-28__1hee8", "margin-top-s-28": "PadMarg_margin-top-s-28__2F7lO", "padding-top-s-24": "PadMarg_padding-top-s-24__3Ghml", "margin-top-s-24": "PadMarg_margin-top-s-24__19TFV", "padding-top-s-20": "PadMarg_padding-top-s-20__2bUyW", "margin-top-s-20": "PadMarg_margin-top-s-20__97rIM", "padding-top-s-16": "PadMarg_padding-top-s-16__EfPpF", "margin-top-s-16": "PadMarg_margin-top-s-16__1iA5m", "padding-top-s-12": "PadMarg_padding-top-s-12__3Bb5l", "margin-top-s-12": "PadMarg_margin-top-s-12__31E80", "padding-top-s-8": "PadMarg_padding-top-s-8__1KtEi", "margin-top-s-8": "PadMarg_margin-top-s-8__1gYtJ", "padding-top-s-4": "PadMarg_padding-top-s-4__1tugP", "margin-top-s-4": "PadMarg_margin-top-s-4__1B0QV", "padding-top-s-2": "PadMarg_padding-top-s-2__1wrY3", "margin-top-s-2": "PadMarg_margin-top-s-2__1qhl5", "padding-top-s-0": "PadMarg_padding-top-s-0__2VbX-", "margin-top-s-0": "PadMarg_margin-top-s-0__Wb2MG", "padding-right-s-xxxl": "PadMarg_padding-right-s-xxxl__3bvhK", "margin-right-s-xxxl": "PadMarg_margin-right-s-xxxl__TfKxs", "padding-right-s-xxl": "PadMarg_padding-right-s-xxl__3nvoe", "margin-right-s-xxl": "PadMarg_margin-right-s-xxl__1bNZL", "padding-right-s-xl": "PadMarg_padding-right-s-xl__1OMaF", "margin-right-s-xl": "PadMarg_margin-right-s-xl__2jVL-", "padding-right-s-l": "PadMarg_padding-right-s-l__2y_7W", "margin-right-s-l": "PadMarg_margin-right-s-l__31lnG", "padding-right-s-m": "PadMarg_padding-right-s-m__18lCS", "margin-right-s-m": "PadMarg_margin-right-s-m__1_oKZ", "padding-right-s-s": "PadMarg_padding-right-s-s__3kGeQ", "margin-right-s-s": "PadMarg_margin-right-s-s__36fj8", "padding-right-s-xs": "PadMarg_padding-right-s-xs__3hIdF", "margin-right-s-xs": "PadMarg_margin-right-s-xs__aa87O", "padding-right-s-xxs": "PadMarg_padding-right-s-xxs__2ShZv", "margin-right-s-xxs": "PadMarg_margin-right-s-xxs__32Q7-", "padding-right-s-xxxs": "PadMarg_padding-right-s-xxxs__1wl8X", "margin-right-s-xxxs": "PadMarg_margin-right-s-xxxs__1m4EZ", "padding-right-s-60": "PadMarg_padding-right-s-60__dER33", "margin-right-s-60": "PadMarg_margin-right-s-60__2fXEi", "padding-right-s-56": "PadMarg_padding-right-s-56__1dxa7", "margin-right-s-56": "PadMarg_margin-right-s-56__2JRGr", "padding-right-s-52": "PadMarg_padding-right-s-52___K8ow", "margin-right-s-52": "PadMarg_margin-right-s-52__3cAFs", "padding-right-s-48": "PadMarg_padding-right-s-48__23gQS", "margin-right-s-48": "PadMarg_margin-right-s-48__2No_I", "padding-right-s-44": "PadMarg_padding-right-s-44__3Gas2", "margin-right-s-44": "PadMarg_margin-right-s-44__1eYvU", "padding-right-s-40": "PadMarg_padding-right-s-40__2mDuB", "margin-right-s-40": "PadMarg_margin-right-s-40__6SheH", "padding-right-s-36": "PadMarg_padding-right-s-36__2oHUA", "margin-right-s-36": "PadMarg_margin-right-s-36__1tf_5", "padding-right-s-32": "PadMarg_padding-right-s-32__3h9Qs", "margin-right-s-32": "PadMarg_margin-right-s-32__eWmJ3", "padding-right-s-28": "PadMarg_padding-right-s-28__c2JP-", "margin-right-s-28": "PadMarg_margin-right-s-28__1EvV6", "padding-right-s-24": "PadMarg_padding-right-s-24__3dmUU", "margin-right-s-24": "PadMarg_margin-right-s-24__-mL4f", "padding-right-s-20": "PadMarg_padding-right-s-20__3ClHn", "margin-right-s-20": "PadMarg_margin-right-s-20__1UwJi", "padding-right-s-16": "PadMarg_padding-right-s-16__3EUj3", "margin-right-s-16": "PadMarg_margin-right-s-16__PoQ0t", "padding-right-s-12": "PadMarg_padding-right-s-12__1tN44", "margin-right-s-12": "PadMarg_margin-right-s-12__2j-9-", "padding-right-s-8": "PadMarg_padding-right-s-8__18T8r", "margin-right-s-8": "PadMarg_margin-right-s-8__2a3Ym", "padding-right-s-4": "PadMarg_padding-right-s-4__1ja1e", "margin-right-s-4": "PadMarg_margin-right-s-4__2Ee5f", "padding-right-s-2": "PadMarg_padding-right-s-2__2TCh_", "margin-right-s-2": "PadMarg_margin-right-s-2__1BM7M", "padding-right-s-0": "PadMarg_padding-right-s-0__3gtaB", "margin-right-s-0": "PadMarg_margin-right-s-0__18joG", "padding-bottom-s-xxxl": "PadMarg_padding-bottom-s-xxxl__IQlze", "margin-bottom-s-xxxl": "PadMarg_margin-bottom-s-xxxl__1LAe6", "padding-bottom-s-xxl": "PadMarg_padding-bottom-s-xxl__23xuQ", "margin-bottom-s-xxl": "PadMarg_margin-bottom-s-xxl__2DToE", "padding-bottom-s-xl": "PadMarg_padding-bottom-s-xl__lrf_R", "margin-bottom-s-xl": "PadMarg_margin-bottom-s-xl__ulhOV", "padding-bottom-s-l": "PadMarg_padding-bottom-s-l__2DA-I", "margin-bottom-s-l": "PadMarg_margin-bottom-s-l__1jqpJ", "padding-bottom-s-m": "PadMarg_padding-bottom-s-m__FiC9x", "margin-bottom-s-m": "PadMarg_margin-bottom-s-m__OnKaN", "padding-bottom-s-s": "PadMarg_padding-bottom-s-s__1I8dD", "margin-bottom-s-s": "PadMarg_margin-bottom-s-s__DVpRy", "padding-bottom-s-xs": "PadMarg_padding-bottom-s-xs__J8ply", "margin-bottom-s-xs": "PadMarg_margin-bottom-s-xs__1YBhD", "padding-bottom-s-xxs": "PadMarg_padding-bottom-s-xxs__v48bH", "margin-bottom-s-xxs": "PadMarg_margin-bottom-s-xxs__5YHDU", "padding-bottom-s-xxxs": "PadMarg_padding-bottom-s-xxxs___47HT", "margin-bottom-s-xxxs": "PadMarg_margin-bottom-s-xxxs__1gVXz", "padding-bottom-s-60": "PadMarg_padding-bottom-s-60__2iDwv", "margin-bottom-s-60": "PadMarg_margin-bottom-s-60__1guFs", "padding-bottom-s-56": "PadMarg_padding-bottom-s-56__3UO0g", "margin-bottom-s-56": "PadMarg_margin-bottom-s-56__2bL0v", "padding-bottom-s-52": "PadMarg_padding-bottom-s-52__iebYg", "margin-bottom-s-52": "PadMarg_margin-bottom-s-52__2NwsK", "padding-bottom-s-48": "PadMarg_padding-bottom-s-48__2ERPo", "margin-bottom-s-48": "PadMarg_margin-bottom-s-48__30h4A", "padding-bottom-s-44": "PadMarg_padding-bottom-s-44__BBY64", "margin-bottom-s-44": "PadMarg_margin-bottom-s-44__3Gmq5", "padding-bottom-s-40": "PadMarg_padding-bottom-s-40__2oB_o", "margin-bottom-s-40": "PadMarg_margin-bottom-s-40__1TMWC", "padding-bottom-s-36": "PadMarg_padding-bottom-s-36__kE7Cn", "margin-bottom-s-36": "PadMarg_margin-bottom-s-36__2o65U", "padding-bottom-s-32": "PadMarg_padding-bottom-s-32__1Mh_e", "margin-bottom-s-32": "PadMarg_margin-bottom-s-32__27OJO", "padding-bottom-s-28": "PadMarg_padding-bottom-s-28__3iFyE", "margin-bottom-s-28": "PadMarg_margin-bottom-s-28__3iahx", "padding-bottom-s-24": "PadMarg_padding-bottom-s-24__VxacH", "margin-bottom-s-24": "PadMarg_margin-bottom-s-24__2E5I_", "padding-bottom-s-20": "PadMarg_padding-bottom-s-20__5zmww", "margin-bottom-s-20": "PadMarg_margin-bottom-s-20__3cxmM", "padding-bottom-s-16": "PadMarg_padding-bottom-s-16__3eWV5", "margin-bottom-s-16": "PadMarg_margin-bottom-s-16__3hYk2", "padding-bottom-s-12": "PadMarg_padding-bottom-s-12__1XlVb", "margin-bottom-s-12": "PadMarg_margin-bottom-s-12__2FR_M", "padding-bottom-s-8": "PadMarg_padding-bottom-s-8__1lmSs", "margin-bottom-s-8": "PadMarg_margin-bottom-s-8__XXIyx", "padding-bottom-s-4": "PadMarg_padding-bottom-s-4__1I-34", "margin-bottom-s-4": "PadMarg_margin-bottom-s-4__2HEiI", "padding-bottom-s-2": "PadMarg_padding-bottom-s-2__24mag", "margin-bottom-s-2": "PadMarg_margin-bottom-s-2__gjtMf", "padding-bottom-s-0": "PadMarg_padding-bottom-s-0__x34GZ", "margin-bottom-s-0": "PadMarg_margin-bottom-s-0__Yaanb", "padding-left-s-xxxl": "PadMarg_padding-left-s-xxxl__KsoTF", "margin-left-s-xxxl": "PadMarg_margin-left-s-xxxl__2_ZAt", "padding-left-s-xxl": "PadMarg_padding-left-s-xxl__1dkls", "margin-left-s-xxl": "PadMarg_margin-left-s-xxl__JgqHb", "padding-left-s-xl": "PadMarg_padding-left-s-xl__3upvR", "margin-left-s-xl": "PadMarg_margin-left-s-xl__2RiVM", "padding-left-s-l": "PadMarg_padding-left-s-l__1pNzL", "margin-left-s-l": "PadMarg_margin-left-s-l__n-Lj_", "padding-left-s-m": "PadMarg_padding-left-s-m__3Ay8G", "margin-left-s-m": "PadMarg_margin-left-s-m__3srnA", "padding-left-s-s": "PadMarg_padding-left-s-s__3ob0D", "margin-left-s-s": "PadMarg_margin-left-s-s__3Qm4V", "padding-left-s-xs": "PadMarg_padding-left-s-xs__2qv16", "margin-left-s-xs": "PadMarg_margin-left-s-xs__UONJ6", "padding-left-s-xxs": "PadMarg_padding-left-s-xxs__33YTh", "margin-left-s-xxs": "PadMarg_margin-left-s-xxs__3QkJk", "padding-left-s-xxxs": "PadMarg_padding-left-s-xxxs__3e3Fz", "margin-left-s-xxxs": "PadMarg_margin-left-s-xxxs__3rf-u", "padding-left-s-60": "PadMarg_padding-left-s-60__3ZaCU", "margin-left-s-60": "PadMarg_margin-left-s-60__2xDhW", "padding-left-s-56": "PadMarg_padding-left-s-56__3Yail", "margin-left-s-56": "PadMarg_margin-left-s-56__BWqpc", "padding-left-s-52": "PadMarg_padding-left-s-52__3KoV7", "margin-left-s-52": "PadMarg_margin-left-s-52__359I8", "padding-left-s-48": "PadMarg_padding-left-s-48__2kd6W", "margin-left-s-48": "PadMarg_margin-left-s-48__1NiRY", "padding-left-s-44": "PadMarg_padding-left-s-44__3foqy", "margin-left-s-44": "PadMarg_margin-left-s-44__28Fg6", "padding-left-s-40": "PadMarg_padding-left-s-40__26wwl", "margin-left-s-40": "PadMarg_margin-left-s-40__1XwI7", "padding-left-s-36": "PadMarg_padding-left-s-36__1mxZy", "margin-left-s-36": "PadMarg_margin-left-s-36__SQA-l", "padding-left-s-32": "PadMarg_padding-left-s-32__1XPa1", "margin-left-s-32": "PadMarg_margin-left-s-32__1tb0U", "padding-left-s-28": "PadMarg_padding-left-s-28__3_xV-", "margin-left-s-28": "PadMarg_margin-left-s-28__bjIXv", "padding-left-s-24": "PadMarg_padding-left-s-24__1NPUI", "margin-left-s-24": "PadMarg_margin-left-s-24__17Yl3", "padding-left-s-20": "PadMarg_padding-left-s-20__2ubTq", "margin-left-s-20": "PadMarg_margin-left-s-20__v-XEf", "padding-left-s-16": "PadMarg_padding-left-s-16__WBWWL", "margin-left-s-16": "PadMarg_margin-left-s-16__3izPS", "padding-left-s-12": "PadMarg_padding-left-s-12__-un0D", "margin-left-s-12": "PadMarg_margin-left-s-12__D_BT2", "padding-left-s-8": "PadMarg_padding-left-s-8__3mfph", "margin-left-s-8": "PadMarg_margin-left-s-8__1G8H8", "padding-left-s-4": "PadMarg_padding-left-s-4__lfVgU", "margin-left-s-4": "PadMarg_margin-left-s-4__1j5lq", "padding-left-s-2": "PadMarg_padding-left-s-2__29u3v", "margin-left-s-2": "PadMarg_margin-left-s-2__3YAvM", "padding-left-s-0": "PadMarg_padding-left-s-0__tWL1K", "margin-left-s-0": "PadMarg_margin-left-s-0__1i9s4", "padding-top-xs-xxxl": "PadMarg_padding-top-xs-xxxl__J2T-D", "margin-top-xs-xxxl": "PadMarg_margin-top-xs-xxxl__5hThZ", "padding-top-xs-xxl": "PadMarg_padding-top-xs-xxl__wpYcA", "margin-top-xs-xxl": "PadMarg_margin-top-xs-xxl__ohJGk", "padding-top-xs-xl": "PadMarg_padding-top-xs-xl__1nJd-", "margin-top-xs-xl": "PadMarg_margin-top-xs-xl__27Yad", "padding-top-xs-l": "PadMarg_padding-top-xs-l__20xc4", "margin-top-xs-l": "PadMarg_margin-top-xs-l__WAQla", "padding-top-xs-m": "PadMarg_padding-top-xs-m__1HRBl", "margin-top-xs-m": "PadMarg_margin-top-xs-m__N8gb9", "padding-top-xs-s": "PadMarg_padding-top-xs-s__7oR1N", "margin-top-xs-s": "PadMarg_margin-top-xs-s__1oNwK", "padding-top-xs-xs": "PadMarg_padding-top-xs-xs__2saGG", "margin-top-xs-xs": "PadMarg_margin-top-xs-xs__2hMAA", "padding-top-xs-xxs": "PadMarg_padding-top-xs-xxs__2Ztzx", "margin-top-xs-xxs": "PadMarg_margin-top-xs-xxs__9oyFw", "padding-top-xs-xxxs": "PadMarg_padding-top-xs-xxxs__o9vVi", "margin-top-xs-xxxs": "PadMarg_margin-top-xs-xxxs__231l6", "padding-top-xs-60": "PadMarg_padding-top-xs-60__3eo86", "margin-top-xs-60": "PadMarg_margin-top-xs-60__ypYb6", "padding-top-xs-56": "PadMarg_padding-top-xs-56__3vtWw", "margin-top-xs-56": "PadMarg_margin-top-xs-56__24gDB", "padding-top-xs-52": "PadMarg_padding-top-xs-52__4Jb9W", "margin-top-xs-52": "PadMarg_margin-top-xs-52__1xorV", "padding-top-xs-48": "PadMarg_padding-top-xs-48__wjvN8", "margin-top-xs-48": "PadMarg_margin-top-xs-48__1FdO3", "padding-top-xs-44": "PadMarg_padding-top-xs-44__37R4z", "margin-top-xs-44": "PadMarg_margin-top-xs-44__1K2Rc", "padding-top-xs-40": "PadMarg_padding-top-xs-40__1DaG1", "margin-top-xs-40": "PadMarg_margin-top-xs-40__2lYSB", "padding-top-xs-36": "PadMarg_padding-top-xs-36__1QMHk", "margin-top-xs-36": "PadMarg_margin-top-xs-36__1S-X4", "padding-top-xs-32": "PadMarg_padding-top-xs-32__3liuS", "margin-top-xs-32": "PadMarg_margin-top-xs-32__kUsx9", "padding-top-xs-28": "PadMarg_padding-top-xs-28__25-4h", "margin-top-xs-28": "PadMarg_margin-top-xs-28__3-Fcf", "padding-top-xs-24": "PadMarg_padding-top-xs-24__1f4mj", "margin-top-xs-24": "PadMarg_margin-top-xs-24__oU1cF", "padding-top-xs-20": "PadMarg_padding-top-xs-20__1_aus", "margin-top-xs-20": "PadMarg_margin-top-xs-20__hOGY1", "padding-top-xs-16": "PadMarg_padding-top-xs-16__3-bHX", "margin-top-xs-16": "PadMarg_margin-top-xs-16__3T9jv", "padding-top-xs-12": "PadMarg_padding-top-xs-12__1uLuO", "margin-top-xs-12": "PadMarg_margin-top-xs-12__zCmGS", "padding-top-xs-8": "PadMarg_padding-top-xs-8__3JYFN", "margin-top-xs-8": "PadMarg_margin-top-xs-8__3bi6T", "padding-top-xs-4": "PadMarg_padding-top-xs-4__3XD1_", "margin-top-xs-4": "PadMarg_margin-top-xs-4__348IN", "padding-top-xs-2": "PadMarg_padding-top-xs-2__3GCbI", "margin-top-xs-2": "PadMarg_margin-top-xs-2__2_yyK", "padding-top-xs-0": "PadMarg_padding-top-xs-0__14jKW", "margin-top-xs-0": "PadMarg_margin-top-xs-0__2Xz52", "padding-right-xs-xxxl": "PadMarg_padding-right-xs-xxxl__1lmpM", "margin-right-xs-xxxl": "PadMarg_margin-right-xs-xxxl__3vcrw", "padding-right-xs-xxl": "PadMarg_padding-right-xs-xxl__2qJ1F", "margin-right-xs-xxl": "PadMarg_margin-right-xs-xxl__3f8K3", "padding-right-xs-xl": "PadMarg_padding-right-xs-xl__2olK1", "margin-right-xs-xl": "PadMarg_margin-right-xs-xl__RolNI", "padding-right-xs-l": "PadMarg_padding-right-xs-l__1Y1q3", "margin-right-xs-l": "PadMarg_margin-right-xs-l___8DZm", "padding-right-xs-m": "PadMarg_padding-right-xs-m__3bqUg", "margin-right-xs-m": "PadMarg_margin-right-xs-m__3mzEI", "padding-right-xs-s": "PadMarg_padding-right-xs-s__1S3bD", "margin-right-xs-s": "PadMarg_margin-right-xs-s__zArWE", "padding-right-xs-xs": "PadMarg_padding-right-xs-xs__2nhNi", "margin-right-xs-xs": "PadMarg_margin-right-xs-xs__2m5Ju", "padding-right-xs-xxs": "PadMarg_padding-right-xs-xxs__NxPqM", "margin-right-xs-xxs": "PadMarg_margin-right-xs-xxs__3vB-V", "padding-right-xs-xxxs": "PadMarg_padding-right-xs-xxxs__2FH46", "margin-right-xs-xxxs": "PadMarg_margin-right-xs-xxxs__3WRDD", "padding-right-xs-60": "PadMarg_padding-right-xs-60__1cDbG", "margin-right-xs-60": "PadMarg_margin-right-xs-60__2v8ii", "padding-right-xs-56": "PadMarg_padding-right-xs-56__1zBwr", "margin-right-xs-56": "PadMarg_margin-right-xs-56__3cWgN", "padding-right-xs-52": "PadMarg_padding-right-xs-52__2_31P", "margin-right-xs-52": "PadMarg_margin-right-xs-52__2ayCA", "padding-right-xs-48": "PadMarg_padding-right-xs-48__3B3Ii", "margin-right-xs-48": "PadMarg_margin-right-xs-48__1SpK_", "padding-right-xs-44": "PadMarg_padding-right-xs-44__D0Fw9", "margin-right-xs-44": "PadMarg_margin-right-xs-44__2v2Sm", "padding-right-xs-40": "PadMarg_padding-right-xs-40__3xKda", "margin-right-xs-40": "PadMarg_margin-right-xs-40__14wjE", "padding-right-xs-36": "PadMarg_padding-right-xs-36__2ROVA", "margin-right-xs-36": "PadMarg_margin-right-xs-36__2ieKB", "padding-right-xs-32": "PadMarg_padding-right-xs-32__1KNFS", "margin-right-xs-32": "PadMarg_margin-right-xs-32__6v513", "padding-right-xs-28": "PadMarg_padding-right-xs-28__32gRr", "margin-right-xs-28": "PadMarg_margin-right-xs-28__Ewdb5", "padding-right-xs-24": "PadMarg_padding-right-xs-24__2u79n", "margin-right-xs-24": "PadMarg_margin-right-xs-24__2Wkgx", "padding-right-xs-20": "PadMarg_padding-right-xs-20__1TdM5", "margin-right-xs-20": "PadMarg_margin-right-xs-20__3_cyj", "padding-right-xs-16": "PadMarg_padding-right-xs-16__SyvnP", "margin-right-xs-16": "PadMarg_margin-right-xs-16__37rSd", "padding-right-xs-12": "PadMarg_padding-right-xs-12__1TPRa", "margin-right-xs-12": "PadMarg_margin-right-xs-12__xW-EE", "padding-right-xs-8": "PadMarg_padding-right-xs-8__InHKk", "margin-right-xs-8": "PadMarg_margin-right-xs-8__2UNlg", "padding-right-xs-4": "PadMarg_padding-right-xs-4__TMJSt", "margin-right-xs-4": "PadMarg_margin-right-xs-4__2OH4o", "padding-right-xs-2": "PadMarg_padding-right-xs-2__1xWFY", "margin-right-xs-2": "PadMarg_margin-right-xs-2__2t4Hq", "padding-right-xs-0": "PadMarg_padding-right-xs-0__1z3lG", "margin-right-xs-0": "PadMarg_margin-right-xs-0__1QWcr", "padding-bottom-xs-xxxl": "PadMarg_padding-bottom-xs-xxxl__1CB6_", "margin-bottom-xs-xxxl": "PadMarg_margin-bottom-xs-xxxl__2qFBO", "padding-bottom-xs-xxl": "PadMarg_padding-bottom-xs-xxl__ZCoXR", "margin-bottom-xs-xxl": "PadMarg_margin-bottom-xs-xxl__9TI7G", "padding-bottom-xs-xl": "PadMarg_padding-bottom-xs-xl__3sH7M", "margin-bottom-xs-xl": "PadMarg_margin-bottom-xs-xl__PIEC7", "padding-bottom-xs-l": "PadMarg_padding-bottom-xs-l__7KGxW", "margin-bottom-xs-l": "PadMarg_margin-bottom-xs-l__NN_BJ", "padding-bottom-xs-m": "PadMarg_padding-bottom-xs-m__-ccvg", "margin-bottom-xs-m": "PadMarg_margin-bottom-xs-m__237BB", "padding-bottom-xs-s": "PadMarg_padding-bottom-xs-s__3JVhg", "margin-bottom-xs-s": "PadMarg_margin-bottom-xs-s__2mKbg", "padding-bottom-xs-xs": "PadMarg_padding-bottom-xs-xs__3Nu9i", "margin-bottom-xs-xs": "PadMarg_margin-bottom-xs-xs__3v1sa", "padding-bottom-xs-xxs": "PadMarg_padding-bottom-xs-xxs__2pUVd", "margin-bottom-xs-xxs": "PadMarg_margin-bottom-xs-xxs__1YBHs", "padding-bottom-xs-xxxs": "PadMarg_padding-bottom-xs-xxxs__2qByg", "margin-bottom-xs-xxxs": "PadMarg_margin-bottom-xs-xxxs__2mcqT", "padding-bottom-xs-60": "PadMarg_padding-bottom-xs-60__29T5m", "margin-bottom-xs-60": "PadMarg_margin-bottom-xs-60__3C-Rg", "padding-bottom-xs-56": "PadMarg_padding-bottom-xs-56__XpPd5", "margin-bottom-xs-56": "PadMarg_margin-bottom-xs-56__37FwG", "padding-bottom-xs-52": "PadMarg_padding-bottom-xs-52__3HApe", "margin-bottom-xs-52": "PadMarg_margin-bottom-xs-52__1hdLJ", "padding-bottom-xs-48": "PadMarg_padding-bottom-xs-48__3ZtAU", "margin-bottom-xs-48": "PadMarg_margin-bottom-xs-48__2eIxN", "padding-bottom-xs-44": "PadMarg_padding-bottom-xs-44__2YYOA", "margin-bottom-xs-44": "PadMarg_margin-bottom-xs-44__2HARV", "padding-bottom-xs-40": "PadMarg_padding-bottom-xs-40__3nLBJ", "margin-bottom-xs-40": "PadMarg_margin-bottom-xs-40__1ckfN", "padding-bottom-xs-36": "PadMarg_padding-bottom-xs-36__2fuIe", "margin-bottom-xs-36": "PadMarg_margin-bottom-xs-36__2SrRV", "padding-bottom-xs-32": "PadMarg_padding-bottom-xs-32__1s86S", "margin-bottom-xs-32": "PadMarg_margin-bottom-xs-32__14BcN", "padding-bottom-xs-28": "PadMarg_padding-bottom-xs-28__3qz4c", "margin-bottom-xs-28": "PadMarg_margin-bottom-xs-28__1U4r7", "padding-bottom-xs-24": "PadMarg_padding-bottom-xs-24__sH7Ld", "margin-bottom-xs-24": "PadMarg_margin-bottom-xs-24__3PA71", "padding-bottom-xs-20": "PadMarg_padding-bottom-xs-20__2jBNh", "margin-bottom-xs-20": "PadMarg_margin-bottom-xs-20__2KSZw", "padding-bottom-xs-16": "PadMarg_padding-bottom-xs-16__3qEW3", "margin-bottom-xs-16": "PadMarg_margin-bottom-xs-16__BH3nL", "padding-bottom-xs-12": "PadMarg_padding-bottom-xs-12__38Dw8", "margin-bottom-xs-12": "PadMarg_margin-bottom-xs-12__3UX-_", "padding-bottom-xs-8": "PadMarg_padding-bottom-xs-8__3xcKo", "margin-bottom-xs-8": "PadMarg_margin-bottom-xs-8__2VM_5", "padding-bottom-xs-4": "PadMarg_padding-bottom-xs-4__Moxj_", "margin-bottom-xs-4": "PadMarg_margin-bottom-xs-4__19HvT", "padding-bottom-xs-2": "PadMarg_padding-bottom-xs-2__3ZQRl", "margin-bottom-xs-2": "PadMarg_margin-bottom-xs-2__e4miV", "padding-bottom-xs-0": "PadMarg_padding-bottom-xs-0__2nQdK", "margin-bottom-xs-0": "PadMarg_margin-bottom-xs-0__3gJx1", "padding-left-xs-xxxl": "PadMarg_padding-left-xs-xxxl__2QyUs", "margin-left-xs-xxxl": "PadMarg_margin-left-xs-xxxl__2jb79", "padding-left-xs-xxl": "PadMarg_padding-left-xs-xxl__2s6J1", "margin-left-xs-xxl": "PadMarg_margin-left-xs-xxl__3ZpUP", "padding-left-xs-xl": "PadMarg_padding-left-xs-xl__9I-U_", "margin-left-xs-xl": "PadMarg_margin-left-xs-xl__2od7C", "padding-left-xs-l": "PadMarg_padding-left-xs-l__3IW2G", "margin-left-xs-l": "PadMarg_margin-left-xs-l__1g2Sy", "padding-left-xs-m": "PadMarg_padding-left-xs-m__3v_af", "margin-left-xs-m": "PadMarg_margin-left-xs-m__2gwFf", "padding-left-xs-s": "PadMarg_padding-left-xs-s__amtpH", "margin-left-xs-s": "PadMarg_margin-left-xs-s__cKZOE", "padding-left-xs-xs": "PadMarg_padding-left-xs-xs__2yNvL", "margin-left-xs-xs": "PadMarg_margin-left-xs-xs__22qTU", "padding-left-xs-xxs": "PadMarg_padding-left-xs-xxs__1hGVf", "margin-left-xs-xxs": "PadMarg_margin-left-xs-xxs__twAfQ", "padding-left-xs-xxxs": "PadMarg_padding-left-xs-xxxs__2HA_p", "margin-left-xs-xxxs": "PadMarg_margin-left-xs-xxxs__2Pziw", "padding-left-xs-60": "PadMarg_padding-left-xs-60__glpVN", "margin-left-xs-60": "PadMarg_margin-left-xs-60__vRtKe", "padding-left-xs-56": "PadMarg_padding-left-xs-56__1Aqp_", "margin-left-xs-56": "PadMarg_margin-left-xs-56__2mi8E", "padding-left-xs-52": "PadMarg_padding-left-xs-52___29UE", "margin-left-xs-52": "PadMarg_margin-left-xs-52__1vg6V", "padding-left-xs-48": "PadMarg_padding-left-xs-48__2LRk-", "margin-left-xs-48": "PadMarg_margin-left-xs-48__7q6tC", "padding-left-xs-44": "PadMarg_padding-left-xs-44__310bi", "margin-left-xs-44": "PadMarg_margin-left-xs-44__2R1ci", "padding-left-xs-40": "PadMarg_padding-left-xs-40__VodR2", "margin-left-xs-40": "PadMarg_margin-left-xs-40__2NJII", "padding-left-xs-36": "PadMarg_padding-left-xs-36__26dwN", "margin-left-xs-36": "PadMarg_margin-left-xs-36__25vjd", "padding-left-xs-32": "PadMarg_padding-left-xs-32__1ERZk", "margin-left-xs-32": "PadMarg_margin-left-xs-32__2BDuc", "padding-left-xs-28": "PadMarg_padding-left-xs-28__15zIN", "margin-left-xs-28": "PadMarg_margin-left-xs-28__19Efn", "padding-left-xs-24": "PadMarg_padding-left-xs-24__1Dwxj", "margin-left-xs-24": "PadMarg_margin-left-xs-24__3kakF", "padding-left-xs-20": "PadMarg_padding-left-xs-20__1RXgE", "margin-left-xs-20": "PadMarg_margin-left-xs-20__1PjvE", "padding-left-xs-16": "PadMarg_padding-left-xs-16__13bz2", "margin-left-xs-16": "PadMarg_margin-left-xs-16__4v4Jo", "padding-left-xs-12": "PadMarg_padding-left-xs-12__3-H_i", "margin-left-xs-12": "PadMarg_margin-left-xs-12__6Qpks", "padding-left-xs-8": "PadMarg_padding-left-xs-8__1GwLp", "margin-left-xs-8": "PadMarg_margin-left-xs-8__767Hf", "padding-left-xs-4": "PadMarg_padding-left-xs-4__3VFOt", "margin-left-xs-4": "PadMarg_margin-left-xs-4__1qOGo", "padding-left-xs-2": "PadMarg_padding-left-xs-2__2Niok", "margin-left-xs-2": "PadMarg_margin-left-xs-2__BylQR", "padding-left-xs-0": "PadMarg_padding-left-xs-0__1wWTT", "margin-left-xs-0": "PadMarg_margin-left-xs-0__1ib98", "fadeInDown": "PadMarg_fadeInDown__2QBfA", "fadeInDownSmall": "PadMarg_fadeInDownSmall__3AQBs", "fadeInLeft": "PadMarg_fadeInLeft__5Nka8", "fadeInUp": "PadMarg_fadeInUp__1AM8H", "fadeInRight": "PadMarg_fadeInRight___nxSU", "fadeIn": "PadMarg_fadeIn__3NpJt", "fadeOut": "PadMarg_fadeOut__3ucbH", "upDown": "PadMarg_upDown__FOESX", "slideInUp": "PadMarg_slideInUp__15IuB", "slideInUpBig": "PadMarg_slideInUpBig__uSV7P", "pulse": "PadMarg_pulse__3wLfM" };

  var cn = function cn() {
    for (var _len = arguments.length, argv = Array(_len), _key = 0; _key < _len; _key++) {
      argv[_key] = arguments[_key];
    }

    return argv.join(' ').trim();
  };

  var getAll = function getAll(formdata) {
    return function (predicate) {
      var i = 0;
      var result = [];

      formdata.forEach(function (v, k) {
        if (typeof predicate === 'function') {
          result.push(predicate(v, k, i++));
        } else if (k === predicate) {
          result.push(v);
        }
      });

      return result;
    };
  };

  var pollImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCAzNCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM0IiBoZWlnaHQ9IjQ0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNCA3QzQgNS4zNDMxNSA1LjM0MzE1IDQgNyA0TDIzIDRMMzQgMTVWNDFDMzQgNDIuNjU2OSAzMi42NTY5IDQ0IDMxIDQ0SDdDNS4zNDMxNSA0NCA0IDQyLjY1NjkgNCA0MVY3WiIgZmlsbD0iIzQ4QTFFNiIgZmlsbC1vcGFjaXR5PSIwLjEwMjQ2OCIvPgo8cGF0aCBkPSJNMC41IDVDMC41IDIuNTE0NzIgMi41MTQ3MiAwLjUgNSAwLjVIMTguNzkyOUwyOS41IDExLjIwNzFWMzVDMjkuNSAzNy40ODUzIDI3LjQ4NTMgMzkuNSAyNSAzOS41SDVDMi41MTQ3MiAzOS41IDAuNSAzNy40ODUzIDAuNSAzNVY1WiIgc3Ryb2tlPSIjNDhBMUU2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTggMEwzMCAxMlYxNEgyOEgyNEMyMC42ODYzIDE0IDE4IDExLjMxMzcgMTggOFYwWiIgZmlsbD0iIzQ4QTFFNiIgZmlsbC1vcGFjaXR5PSIwLjE3OTEyMSIvPgo8cGF0aCBkPSJNMjkuNSAxMS4yMDcxVjExLjVIMjNDMjAuNTE0NyAxMS41IDE4LjUgOS40ODUyOCAxOC41IDdWMC41SDE4Ljc5MjlMMjkuNSAxMS4yMDcxWiIgc3Ryb2tlPSIjNDhBMUU2Ii8+CjxwYXRoIGQ9Ik0yMi42NTM3IDMzLjQ5MjdMMjQuNSAzMS41TDI1LjI4NzIgMzIuMjUzN0wyMi42NTM3IDM1LjAwMDFMMjEgMzMuNDE2OEwyMS43ODcyIDMyLjY2MzFMMjIuNjUzNyAzMy40OTI3WiIgZmlsbD0iIzdGQzkyRSIvPgo8cmVjdCB4PSI4IiB5PSIxNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzQ4QTFFNiIvPgo8cmVjdCB4PSIxMCIgeT0iMTUiIHdpZHRoPSIxMSIgaGVpZ2h0PSIxIiBmaWxsPSIjNDhBMUU2Ii8+CjxyZWN0IHg9IjgiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjNDhBMUU2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxOCIgd2lkdGg9IjExIiBoZWlnaHQ9IjEiIGZpbGw9IiM0OEExRTYiLz4KPHJlY3QgeD0iOCIgeT0iMjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM3RkM5MkUiLz4KPHJlY3QgeD0iMTAiIHk9IjIxIiB3aWR0aD0iMTEiIGhlaWdodD0iMSIgZmlsbD0iIzdGQzkyRSIvPgo8cmVjdCB4PSI4IiB5PSIyNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzQ4QTFFNiIvPgo8cmVjdCB4PSIxMCIgeT0iMjQiIHdpZHRoPSIxMSIgaGVpZ2h0PSIxIiBmaWxsPSIjNDhBMUU2Ii8+Cjwvc3ZnPg==';

  var uiButton = { "sizesLatin": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px)", "sizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "sizes": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "fontSizesLatin": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px)", "fontSizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "fontSizes": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "breakpoints": "(\"l\": 1239px, \"m\": 1023px, \"s\": 767px, \"xs\": 374px)", "props": "(\"height\": height)", "sizesRound": "(\"l\": 52px, \"m\": 48px, \"s\": 32px)", "widths": "(\"l\": 280px, \"m\": 245px, \"s\": 180px, \"xs\": 140px)", "heights": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "themes": "(\"default\": #48a1e6 #fff, \"primary\": #ff7256 #fff, \"secondary\": #7fc92e #fff, \"white\": #fff #333333 #e9e9e9, \"whiteAccent\": #fff #48a1e6 #e9e9e9, \"opacityWhite\": transparent #fff #e9e9e9 #333333, \"vk\": #4d75a2 #fff)", "root": "Button_root__3qAgI", "noSpacing": "Button_noSpacing__2-lj3", "round": "Button_round__26Gxg", "icon": "Button_icon__1RK9l", "text": "Button_text__a2Jgs", "theme-default": "Button_theme-default__3H68n", "disabled": "Button_disabled__3d-58", "basic": "Button_basic__3p34O", "opacity": "Button_opacity__3g-Ws", "inverted": "Button_inverted__1uVZw", "hovered": "Button_hovered__1jGLt", "pressed": "Button_pressed__1ubHS", "theme-primary": "Button_theme-primary__POFim", "theme-secondary": "Button_theme-secondary__3zJc-", "theme-white": "Button_theme-white__udtEQ", "theme-whiteAccent": "Button_theme-whiteAccent__2seLa", "theme-opacityWhite": "Button_theme-opacityWhite__2uMJ6", "theme-vk": "Button_theme-vk__1AYda", "width-l": "Button_width-l__2n2J3", "width-m": "Button_width-m__RRxW0", "width-s": "Button_width-s__1Mx52", "width-xs": "Button_width-xs__3rsNG", "height-60": "Button_height-60__2c568", "height-56": "Button_height-56__16ncZ", "height-52": "Button_height-52__3keR7", "height-48": "Button_height-48__UxQ6U", "height-44": "Button_height-44__3mr8q", "height-40": "Button_height-40__RtHfn", "height-36": "Button_height-36__m_plV", "height-32": "Button_height-32__2oS7d", "height-28": "Button_height-28__2fWQ6", "height-24": "Button_height-24__2hsoO", "height-20": "Button_height-20__3jQPj", "height-16": "Button_height-16__21QdG", "height-12": "Button_height-12__3JwVH", "height-8": "Button_height-8__A07qu", "height-4": "Button_height-4__gvJsN", "height-2": "Button_height-2__39bI1", "height-0": "Button_height-0__3Rxn-", "height-l-60": "Button_height-l-60__23MXi", "height-l-56": "Button_height-l-56__3G24J", "height-l-52": "Button_height-l-52__2ymsv", "height-l-48": "Button_height-l-48__3s10h", "height-l-44": "Button_height-l-44__2bua_", "height-l-40": "Button_height-l-40__2Ye0p", "height-l-36": "Button_height-l-36__2bdJV", "height-l-32": "Button_height-l-32__3_jDF", "height-l-28": "Button_height-l-28__2WOCg", "height-l-24": "Button_height-l-24__332O5", "height-l-20": "Button_height-l-20__2HePQ", "height-l-16": "Button_height-l-16__3oTw8", "height-l-12": "Button_height-l-12__1WVyx", "height-l-8": "Button_height-l-8__1IoH6", "height-l-4": "Button_height-l-4__XYFqO", "height-l-2": "Button_height-l-2__2u1KH", "height-l-0": "Button_height-l-0__pd2sA", "height-m-60": "Button_height-m-60__2ywKX", "height-m-56": "Button_height-m-56__2W9Av", "height-m-52": "Button_height-m-52__3Hlt_", "height-m-48": "Button_height-m-48__qRDf_", "height-m-44": "Button_height-m-44__2Wvjq", "height-m-40": "Button_height-m-40__3yoXk", "height-m-36": "Button_height-m-36__2YdR9", "height-m-32": "Button_height-m-32__1ehzT", "height-m-28": "Button_height-m-28__1SRu0", "height-m-24": "Button_height-m-24__1VnOA", "height-m-20": "Button_height-m-20__3B8hj", "height-m-16": "Button_height-m-16__kD3u4", "height-m-12": "Button_height-m-12__2w91K", "height-m-8": "Button_height-m-8__30kgw", "height-m-4": "Button_height-m-4__2A721", "height-m-2": "Button_height-m-2__1n54g", "height-m-0": "Button_height-m-0__1ddqs", "height-s-60": "Button_height-s-60__1MBGv", "height-s-56": "Button_height-s-56__3llZa", "height-s-52": "Button_height-s-52__1Rtyv", "height-s-48": "Button_height-s-48__2_Ncn", "height-s-44": "Button_height-s-44__16kTi", "height-s-40": "Button_height-s-40__3DghT", "height-s-36": "Button_height-s-36__18QNT", "height-s-32": "Button_height-s-32__2PUYR", "height-s-28": "Button_height-s-28__1nfnY", "height-s-24": "Button_height-s-24__3nvGS", "height-s-20": "Button_height-s-20__3pFkU", "height-s-16": "Button_height-s-16__3mL1b", "height-s-12": "Button_height-s-12__2-IaE", "height-s-8": "Button_height-s-8__1rvcy", "height-s-4": "Button_height-s-4__2ypE7", "height-s-2": "Button_height-s-2__2Ej8n", "height-s-0": "Button_height-s-0__xJCj_", "height-xs-60": "Button_height-xs-60__2eOSm", "height-xs-56": "Button_height-xs-56__t1hno", "height-xs-52": "Button_height-xs-52__2lhnk", "height-xs-48": "Button_height-xs-48__qCVg8", "height-xs-44": "Button_height-xs-44__14h1n", "height-xs-40": "Button_height-xs-40__5Hl8Z", "height-xs-36": "Button_height-xs-36__1DT2n", "height-xs-32": "Button_height-xs-32__2vIlp", "height-xs-28": "Button_height-xs-28__2MXBk", "height-xs-24": "Button_height-xs-24__3Vjz8", "height-xs-20": "Button_height-xs-20__25cxs", "height-xs-16": "Button_height-xs-16__3BHqP", "height-xs-12": "Button_height-xs-12__39XjW", "height-xs-8": "Button_height-xs-8__2hbvl", "height-xs-4": "Button_height-xs-4__g2N3z", "height-xs-2": "Button_height-xs-2__2Z5f2", "height-xs-0": "Button_height-xs-0__2OP_2", "rounded": "Button_rounded__jfpTk", "size-l": "Button_size-l__2yCFl", "size-m": "Button_size-m__16gmh", "size-s": "Button_size-s__xD0Ep", "fluid": "Button_fluid__2kR6E", "fluid-l": "Button_fluid-l__2mHoM", "fluid-m": "Button_fluid-m__2v00d", "fluid-s": "Button_fluid-s__1g4V1", "fluid-xs": "Button_fluid-xs__2B4tb", "fadeInDown": "Button_fadeInDown__3rnq1", "fadeInDownSmall": "Button_fadeInDownSmall__3ThkG", "fadeInLeft": "Button_fadeInLeft__2njPq", "fadeInUp": "Button_fadeInUp__3R65F", "fadeInRight": "Button_fadeInRight__3m2ZD", "fadeIn": "Button_fadeIn__3P7nq", "fadeOut": "Button_fadeOut__PoFcV", "upDown": "Button_upDown__JAJZ6", "slideInUp": "Button_slideInUp__26bNy", "slideInUpBig": "Button_slideInUpBig__1CGi5", "pulse": "Button_pulse__3QiCy" };

  var _templateObject$3 = taggedTemplateLiteral(['\n  <div class$=\'', '\'>\n    <button\n      disabled=\'', '\'\n      class$=\'', '\'\n      form$=\'', '\'\n      on-click=\'', '\'\n    >', '</button>\n  </div>\n'], ['\n  <div class$=\'', '\'>\n    <button\n      disabled=\'', '\'\n      class$=\'', '\'\n      form$=\'', '\'\n      on-click=\'', '\'\n    >', '</button>\n  </div>\n']);

  var buttonCls = cn('button', uiButton.root, uiButton.rounded, uiButton['fluid-m'], uiButton['height-52'], uiButton['theme-default'], uiButton['width-s']);

  var button = function button(_ref) {
    var disabled = _ref.disabled,
        forEl = _ref.forEl,
        onclick = _ref.onclick,
        _ref$text = _ref.text,
        text = _ref$text === undefined ? '' : _ref$text;
    return html$1(_templateObject$3, uiPadMarg['margin-top-12'], disabled, !disabled ? buttonCls : cn(buttonCls, 'disabled', uiButton.disabled), forEl, onclick, text);
  };

  var uiCheckbox = { "sizesLatin": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px)", "sizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "sizes": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "fontSizesLatin": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px)", "fontSizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "fontSizes": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "root": "Checkbox_root__1qOX0", "checked": "Checkbox_checked__kuEbV", "disabled": "Checkbox_disabled__T2hGV", "error": "Checkbox_error__1pX4p", "input": "Checkbox_input__23Y5j", "label": "Checkbox_label__R0ZPG", "group": "Checkbox_group__3Wcx9", "inline-left": "Checkbox_inline__1q9C-", "inline-right": "Checkbox_inline__1q9C-", "size-small": "Checkbox_size-small__1pJpM", "size-s": "Checkbox_size-s__1ZsmL", "size-medium": "Checkbox_size-medium__Ymci-", "size-m": "Checkbox_size-m__1vAfe", "size-large": "Checkbox_size-large__2zMXJ", "size-l": "Checkbox_size-l__16pOG", "size-extraLarge": "Checkbox_size-extraLarge__2CGi5", "size-xl": "Checkbox_size-xl__2IHm-" };

  var _templateObject$4 = taggedTemplateLiteral(['\n  <label class$=\'', '\' for=\'', '\'>\n    <input\n      checked$=\'', '\'\n      class$=\'', '\'\n      id=\'', '\'\n      name=\'', '\'\n      value=\'', '\'\n      type=\'checkbox\'\n    />\n    ', '\n  </label>\n'], ['\n  <label class$=\'', '\' for=\'', '\'>\n    <input\n      checked$=\'', '\'\n      class$=\'', '\'\n      id=\'', '\'\n      name=\'', '\'\n      value=\'', '\'\n      type=\'checkbox\'\n    />\n    ', '\n  </label>\n']),
      _templateObject2$3 = taggedTemplateLiteral(['<span class=\'label\'>', '</span>'], ['<span class=\'label\'>', '</span>']);

  var checkbox = function checkbox(_ref) {
    var checked = _ref.checked,
        children = _ref.children,
        classname = _ref.classname,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? '' : _ref$label,
        _ref$name = _ref.name,
        name = _ref$name === undefined ? '' : _ref$name,
        _ref$value = _ref.value,
        value = _ref$value === undefined ? '' : _ref$value;
    return html$1(_templateObject$4, cn('checkbox', uiCheckbox.root, uiCheckbox['size-medium']), label, checked, cn('input', classname), label, name, value, (label || children) && html$1(_templateObject2$3, label || children));
  };

  var uiProgress = { "sizesLatin": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px)", "sizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "sizes": "(\"xxxl\": 44px, \"xxl\": 40px, \"xl\": 36px, \"l\": 28px, \"m\": 24px, \"s\": 20px, \"xs\": 16px, \"xxs\": 8px, \"xxxs\": 4px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"8\": 8px, \"4\": 4px, \"2\": 2px, \"0\": 0px)", "fontSizesLatin": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px)", "fontSizesNumeric": "(\"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "fontSizes": "(\"xxxl\": 24px, \"xxl\": 22px, \"xl\": 20px, \"l\": 18px, \"m\": 16px, \"s\": 14px, \"xs\": 12px, \"xxs\": 10px, \"xxxs\": 8px, \"60\": 60px, \"56\": 56px, \"52\": 52px, \"48\": 48px, \"44\": 44px, \"40\": 40px, \"36\": 36px, \"32\": 32px, \"28\": 28px, \"24\": 24px, \"20\": 20px, \"16\": 16px, \"12\": 12px, \"10\": 10px, \"8\": 8px)", "root": "Progress_root__EmMoc", "bar": "Progress_bar__1T_IJ", "loading": "Progress_loading__2wiyu", "move": "Progress_move__flJ9X" };

  var _templateObject$5 = taggedTemplateLiteral(['\n  <div class$=\'', '\'>\n    ', '\n    <div class$=\'', '\' style$=\'width: ', '%;\'></div>\n  </div>\n'], ['\n  <div class$=\'', '\'>\n    ', '\n    <div class$=\'', '\' style$=\'width: ', '%;\'></div>\n  </div>\n']);

  var progress = function progress(_ref) {
    var active = _ref.active,
        classname = _ref.classname,
        children = _ref.children,
        selected = _ref.selected,
        width = _ref.width;
    return html$1(_templateObject$5, cn('progress', uiProgress.root, classname, classString({ active: active, selected: selected })), children, cn('bar', uiProgress.bar), width);
  };

  var uiRadio = { "root": "Radio_root__2hBYn", "checked": "Radio_checked__3mQ3b", "disabled": "Radio_disabled__H1kDg", "error": "Radio_error__2Kbfz", "input": "Radio_input__3-bTF", "label": "Radio_label__3hfma", "group": "Radio_group__3qKQw", "inline-left": "Radio_inline__6pW8y", "inline-right": "Radio_inline__6pW8y", "size-small": "Radio_size-small__2TKXd", "size-medium": "Radio_size-medium__3F-4p", "size-large": "Radio_size-large__2c0oo" };

  var _templateObject$6 = taggedTemplateLiteral(['<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect width="16" height="16" fill="black" fill-opacity="0"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M6.58594 8L0.292969 1.70703L1.70703 0.292847L8 6.58582L14.293 0.292847L15.707 1.70703L9.41406 8L15.707 14.2928L14.293 15.707L8 9.41406L1.70703 15.707L0.292969 14.2928L6.58594 8Z" fill="#B8B8B8"/>\n</svg>'], ['<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect width="16" height="16" fill="black" fill-opacity="0"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M6.58594 8L0.292969 1.70703L1.70703 0.292847L8 6.58582L14.293 0.292847L15.707 1.70703L9.41406 8L15.707 14.2928L14.293 15.707L8 9.41406L1.70703 15.707L0.292969 14.2928L6.58594 8Z" fill="#B8B8B8"/>\n</svg>']),
      _templateObject2$4 = taggedTemplateLiteral(['<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M0.416667 10C0.416667 4.70727 4.70727 0.416667 10 0.416667C15.2927 0.416667 19.5833 4.70727 19.5833 10C19.5833 15.2927 15.2927 19.5833 10 19.5833C4.70727 19.5833 0.416667 15.2927 0.416667 10Z" fill="white" stroke="#D4D4D4" stroke-width="0.833333"/>\n</svg>'], ['<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M0.416667 10C0.416667 4.70727 4.70727 0.416667 10 0.416667C15.2927 0.416667 19.5833 4.70727 19.5833 10C19.5833 15.2927 15.2927 19.5833 10 19.5833C4.70727 19.5833 0.416667 15.2927 0.416667 10Z" fill="white" stroke="#D4D4D4" stroke-width="0.833333"/>\n</svg>']),
      _templateObject3 = taggedTemplateLiteral(['<svg version="1.1" id="\u0421\u043B\u043E\u0439_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\nviewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">\n<style type="text/css">.st0{fill:url(#SVGID_1_);}.st1{fill:#FFFFFF;}</style>\n<radialGradient id="SVGID_1_" cx="-49.8333" cy="90.7323" r="1" gradientTransform="matrix(3.673941e-16 6 6 -3.673941e-16 -534.3937 309)" gradientUnits="userSpaceOnUse">\n<stop  offset="0" style="stop-color:#2F82C2"/>\n<stop  offset="1" style="stop-color:#48A1E6"/>\n</radialGradient>\n<path class="st0" d="M0,10C0,4.5,4.5,0,10,0c5.5,0,10,4.5,10,10c0,5.5-4.5,10-10,10C4.5,20,0,15.5,0,10z"/>\n<path class="st1" d="M7,10c0-1.7,1.3-3,3-3c1.7,0,3,1.3,3,3c0,1.7-1.3,3-3,3C8.3,13,7,11.7,7,10z"/>\n</svg>'], ['<svg version="1.1" id="\u0421\u043B\u043E\u0439_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\nviewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">\n<style type="text/css">.st0{fill:url(#SVGID_1_);}.st1{fill:#FFFFFF;}</style>\n<radialGradient id="SVGID_1_" cx="-49.8333" cy="90.7323" r="1" gradientTransform="matrix(3.673941e-16 6 6 -3.673941e-16 -534.3937 309)" gradientUnits="userSpaceOnUse">\n<stop  offset="0" style="stop-color:#2F82C2"/>\n<stop  offset="1" style="stop-color:#48A1E6"/>\n</radialGradient>\n<path class="st0" d="M0,10C0,4.5,4.5,0,10,0c5.5,0,10,4.5,10,10c0,5.5-4.5,10-10,10C4.5,20,0,15.5,0,10z"/>\n<path class="st1" d="M7,10c0-1.7,1.3-3,3-3c1.7,0,3,1.3,3,3c0,1.7-1.3,3-3,3C8.3,13,7,11.7,7,10z"/>\n</svg>']);

  var close = html$1(_templateObject$6);

  var radio = html$1(_templateObject2$4);

  var radioChecked = html$1(_templateObject3);

  var _templateObject$7 = taggedTemplateLiteral(['\n  <label class$=\'', '\' for=\'', '\'>\n    <input\n      checked$=\'', '\'\n      class$=\'', '\'\n      id=\'', '\'\n      name=\'', '\'\n      type=\'radio\'\n      value$=\'', '\'\n    />\n    ', '\n    ', '\n    ', '\n  </label>\n'], ['\n  <label class$=\'', '\' for=\'', '\'>\n    <input\n      checked$=\'', '\'\n      class$=\'', '\'\n      id=\'', '\'\n      name=\'', '\'\n      type=\'radio\'\n      value$=\'', '\'\n    />\n    ', '\n    ', '\n    ', '\n  </label>\n']),
      _templateObject2$5 = taggedTemplateLiteral(['<span class$=\'', '\'>', '</span>'], ['<span class$=\'', '\'>', '</span>']);

  var radio$1 = function radio$$1(_ref) {
    var checked = _ref.checked,
        classname = _ref.classname,
        children = _ref.children,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? '' : _ref$label,
        _ref$name = _ref.name,
        name = _ref$name === undefined ? '' : _ref$name,
        _ref$value = _ref.value,
        value = _ref$value === undefined ? '' : _ref$value;
    return html$1(_templateObject$7, cn('radio', uiRadio.root, uiRadio['size-medium']), label, checked, cn('input', uiRadio.input, classname), label, name, value, radio, radioChecked, (label || children) && html$1(_templateObject2$5, cn('label', uiRadio.label), label || children));
  };

  var _templateObject$8 = taggedTemplateLiteral(['\n  <div class=\'group\'>\n    <form on-submit=\'', '\'>\n      ', '\n    </form>\n  </div>\n'], ['\n  <div class=\'group\'>\n    <form on-submit=\'', '\'>\n      ', '\n    </form>\n  </div>\n']);

  var group = function group(_ref) {
    var children = _ref.children,
        onsubmit = _ref.onsubmit;
    return html$1(_templateObject$8, onsubmit, children);
  };

  var _templateObject$9 = taggedTemplateLiteral(['\n    <div class$=\'', '\'>', '</div>\n    <div class$=\'', '\'>', '</div>\n  '], ['\n    <div class$=\'', '\'>', '</div>\n    <div class$=\'', '\'>', '</div>\n  ']);

  var result = function result(data) {
    var value = isNaN(data.value * 1e2) ? '' : parseFloat(data.value * 1e2).toFixed(1) + '%';
    var active = classString({ active: data.winner });
    var selected = classString({ selected: data.selected });

    return html$1(_templateObject$9, cn('text', active, selected), data.label, cn('aftertext', active, selected), value);
  };

  var _templateObject$a = taggedTemplateLiteral(['\n      <div on-change=\'', '\'>\n        ', '\n      </div>\n    '], ['\n      <div on-change=\'', '\'>\n        ', '\n      </div>\n    ']),
      _templateObject2$6 = taggedTemplateLiteral(['\n      <div class=\'poll\'>\n        <img class=\'image\' src$=\'', '\' />\n        <section class=\'content\'>\n          <div class=\'question\'>', '</div>\n          ', '\n        </section>\n        ', '\n      </div>\n    '], ['\n      <div class=\'poll\'>\n        <img class=\'image\' src$=\'', '\' />\n        <section class=\'content\'>\n          <div class=\'question\'>', '</div>\n          ', '\n        </section>\n        ', '\n      </div>\n    ']);

  var PollElement = function (_LitElement) {
    inherits(PollElement, _LitElement);
    createClass(PollElement, null, [{
      key: 'properties',
      get: function get$$1() {
        return {
          complete: Boolean,
          list: Array,
          multiple: Boolean,
          text: String,
          users: Array,
          total: Number,
          selected: Boolean
        };
      }
    }]);

    function PollElement(props) {
      classCallCheck(this, PollElement);

      var _this = possibleConstructorReturn(this, (PollElement.__proto__ || Object.getPrototypeOf(PollElement)).call(this, props));

      _this.users = [];
      _this.selected = false;
      _this.list = [];
      _this.result = {
        total: 0,
        list: []
      };

      _this._boundVariantChange = _this._onVariantChange.bind(_this);
      _this._boundRenderVariant = _this._renderVariant.bind(_this);
      _this._boundRenderResult = _this._renderResult.bind(_this);
      _this._boundPollComplete = _this._onPollComplete.bind(_this);
      return _this;
    }

    createClass(PollElement, [{
      key: '_queryElement',
      value: function _queryElement(selector) {
        return this.shadowRoot ? this.shadowRoot.querySelector(selector) : undefined;
      }
    }, {
      key: '__processFormData',
      value: function __processFormData(fd) {
        var getAll$$1 = getAll(fd);

        return this.list.reduce(function (acc, it) {
          return ~acc[1].indexOf(it.name) ? acc : fd.get(it.name) ? [acc[0].concat(getAll$$1(it.name)), acc[1].concat(it.name)] : acc;
        }, [[], []]);
      }
    }, {
      key: '_onVariantChange',
      value: function _onVariantChange() {
        this.selected = true;

        var form = this._queryElement('form');
        var data = this.__processFormData(new FormData(form));

        this.dispatchEvent(new CustomEvent('poll-variant-change', { detail: { data: data } }));
      }
    }, {
      key: '_onPollComplete',
      value: function _onPollComplete(e) {
        e.preventDefault();

        var form = e.currentTarget;

        var data = this.__processFormData(new FormData(form));

        if (data[0].length) {
          this.complete = true;
          this._aggregateResult.apply(this, toConsumableArray(data));
        }
      }
    }, {
      key: '_aggregateResult',
      value: function _aggregateResult(values, names) {
        var _this2 = this;

        this.total = this.total + values.length;

        values.map(function (it) {
          var value = it;
          var name = names[0];

          _this2.list = _this2.list.map(function (that) {
            var exist = that.value === value && that.name === name;

            // eslint-disable-next-line object-curly-newline
            return !exist ? that : _extends({}, that, { count: that.count + 1, selected: true });
          });

          return it;
        });

        this.dispatchEvent(new CustomEvent('poll-result-aggregate', { detail: { result: this.result } }));
      }
    }, {
      key: '_renderVariant',
      value: function _renderVariant(data) {
        var variantEl = this.multiple ? checkbox : radio$1;

        return html$1(_templateObject$a, this._boundVariantChange, variantEl(data));
      }
    }, {
      key: '_renderResult',
      value: function _renderResult(data) {
        // eslint-disable-next-line no-param-reassign
        data = _extends({}, data, { value: data.count / this.total

          // eslint-disable-next-line no-param-reassign
        });data.value = data.weight / 1e2 || data.value;

        return progress({
          active: data.winner,
          children: result(data),
          classname: cn(uiPadMarg['margin-bottom-12']),
          selected: data.selected,
          width: data.value * 1e2
        });
      }
    }, {
      key: '_render',
      value: function _render(_ref) {
        var children = _ref.children,
            text = _ref.text,
            _ref$list = _ref.list,
            list = _ref$list === undefined ? [] : _ref$list,
            selected = _ref.selected,
            _ref$users = _ref.users,
            users = _ref$users === undefined ? [] : _ref$users,
            total = _ref.total;

        if (list.length) {
          // calculate most popular answer
          var max = list.reduce(function (acc, next) {
            return next.count > acc ? next.count : acc;
          }, 0);

          // eslint-disable-next-line no-param-reassign
          list = list.map(function (it) {
            return it.count !== max ? it : _extends({}, it, { winner: true });
          });
        }

        var _button = button({
          text: this.complete ? '\u041E\u0442\u0432\u0435\u0442\u0438\u043B\u043E ' + total + ' \u0438\u0437 ' + users.length : 'Ответить',
          disabled: !this.complete ? !selected : true
        });

        var poll = !this.complete ? group({
          onsubmit: this._boundPollComplete,
          children: [list.map(this._boundRenderVariant), _button]
        }) : group({
          children: [list.map(this._boundRenderResult), _button]
        });

        return html$1(_templateObject2$6, pollImage, text, poll, children);
      }
    }]);
    return PollElement;
  }(LitElement);

  var poll = withStyle(html$1)(PollElement, undefined, undefined, undefined, undefined, undefined);

  var mixins = utils_3(html$1)(_extends({}, _, {
    withPoll: withPoll
  }));

  var utils$2 = {
    combineMixins: utils_4,
    registerCustomElement: utils_1
  };

  exports.Poll = poll;
  exports.utils = utils$2;
  exports.mixins = mixins;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
