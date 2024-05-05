var c={exports:{}},f={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u=window.React;function a(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var d=typeof Object.is=="function"?Object.is:a,p=u.useState,v=u.useEffect,S=u.useLayoutEffect,l=u.useDebugValue;function y(t,e){var r=e(),o=p({inst:{value:r,getSnapshot:e}}),n=o[0].inst,i=o[1];return S(function(){n.value=r,n.getSnapshot=e,s(n)&&i({inst:n})},[t,r,e]),v(function(){return s(n)&&i({inst:n}),t(function(){s(n)&&i({inst:n})})},[t]),l(r),r}function s(t){var e=t.getSnapshot;t=t.value;try{var r=e();return!d(t,r)}catch{return!0}}function x(t,e){return e()}var h=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?x:y;f.useSyncExternalStore=u.useSyncExternalStore!==void 0?u.useSyncExternalStore:h;c.exports=f;var m=c.exports;export{m as s};
