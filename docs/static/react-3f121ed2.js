var f={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l=window.React,u=Symbol.for("react.element"),y=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,x=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function i(t,e,_){var r,o={},s=null,p=null;_!==void 0&&(s=""+_),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(p=e.ref);for(r in e)m.call(e,r)&&!a.hasOwnProperty(r)&&(o[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)o[r]===void 0&&(o[r]=e[r]);return{$$typeof:u,type:t,key:s,ref:p,props:o,_owner:x.current}}n.Fragment=y;n.jsx=i;n.jsxs=i;f.exports=n;var d=f.exports;export{d as j};
