var u={exports:{}},t={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var p;function v(){if(p)return t;p=1;var a=window.React,m=Symbol.for("react.element"),x=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,d=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function s(n,r,_){var e,o={},i=null,f=null;_!==void 0&&(i=""+_),r.key!==void 0&&(i=""+r.key),r.ref!==void 0&&(f=r.ref);for(e in r)c.call(r,e)&&!l.hasOwnProperty(e)&&(o[e]=r[e]);if(n&&n.defaultProps)for(e in r=n.defaultProps,r)o[e]===void 0&&(o[e]=r[e]);return{$$typeof:m,type:n,key:i,ref:f,props:o,_owner:d.current}}return t.Fragment=x,t.jsx=s,t.jsxs=s,t}var R;function y(){return R||(R=1,u.exports=v()),u.exports}var O=y();export{O as j,y as r};
