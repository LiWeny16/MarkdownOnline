import{c as G}from"./react-draggable-e660ef73.js";import{p as K}from"./prop-types-4dcdfe56.js";var C={exports:{}},b={},M={};M.__esModule=!0;M.cloneElement=te;var J=Q(window.React);function Q(e){return e&&e.__esModule?e:{default:e}}function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,r)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?N(Object(n),!0).forEach(function(r){Z(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function Z(e,t,n){return t=k(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function k(e){var t=ee(e,"string");return typeof t=="symbol"?t:String(t)}function ee(e,t){if(typeof e!="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function te(e,t){return t.style&&e.props.style&&(t.style=T(T({},e.props.style),t.style)),t.className&&e.props.className&&(t.className=e.props.className+" "+t.className),J.default.cloneElement(e,t)}var R={};R.__esModule=!0;R.resizableProps=void 0;var s=re(K);function re(e){return e&&e.__esModule?e:{default:e}}var ne={axis:s.default.oneOf(["both","x","y","none"]),className:s.default.string,children:s.default.element.isRequired,draggableOpts:s.default.shape({allowAnyClick:s.default.bool,cancel:s.default.string,children:s.default.node,disabled:s.default.bool,enableUserSelectHack:s.default.bool,offsetParent:s.default.node,grid:s.default.arrayOf(s.default.number),handle:s.default.string,nodeRef:s.default.object,onStart:s.default.func,onDrag:s.default.func,onStop:s.default.func,onMouseDown:s.default.func,scale:s.default.number}),height:function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];var a=n[0];if(a.axis==="both"||a.axis==="y"){var i;return(i=s.default.number).isRequired.apply(i,n)}return s.default.number.apply(s.default,n)},handle:s.default.oneOfType([s.default.node,s.default.func]),handleSize:s.default.arrayOf(s.default.number),lockAspectRatio:s.default.bool,maxConstraints:s.default.arrayOf(s.default.number),minConstraints:s.default.arrayOf(s.default.number),onResizeStop:s.default.func,onResizeStart:s.default.func,onResize:s.default.func,resizeHandles:s.default.arrayOf(s.default.oneOf(["s","w","e","n","sw","nw","se","ne"])),transformScale:s.default.number,width:function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];var a=n[0];if(a.axis==="both"||a.axis==="x"){var i;return(i=s.default.number).isRequired.apply(i,n)}return s.default.number.apply(s.default,n)}};R.resizableProps=ne;b.__esModule=!0;b.default=void 0;var y=le(window.React),ae=G,ie=M,oe=R,se=["children","className","draggableOpts","width","height","handle","handleSize","lockAspectRatio","axis","minConstraints","maxConstraints","onResize","onResizeStop","onResizeStart","resizeHandles","transformScale"];function I(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,n=new WeakMap;return(I=function(a){return a?n:t})(e)}function le(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var n=I(t);if(n&&n.has(e))return n.get(e);var r={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(i!=="default"&&Object.prototype.hasOwnProperty.call(e,i)){var o=a?Object.getOwnPropertyDescriptor(e,i):null;o&&(o.get||o.set)?Object.defineProperty(r,i,o):r[i]=e[i]}return r.default=e,n&&n.set(e,r),r}function D(){return D=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},D.apply(this,arguments)}function ue(e,t){if(e==null)return{};var n={},r=Object.keys(e),a,i;for(i=0;i<r.length;i++)a=r[i],!(t.indexOf(a)>=0)&&(n[a]=e[a]);return n}function A(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?A(Object(n),!0).forEach(function(r){fe(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):A(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function fe(e,t,n){return t=pe(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function pe(e){var t=ce(e,"string");return typeof t=="symbol"?t:String(t)}function ce(e,t){if(typeof e!="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function de(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,H(e,t)}function H(e,t){return H=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,a){return r.__proto__=a,r},H(e,t)}var E=function(e){de(t,e);function t(){for(var r,a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return r=e.call.apply(e,[this].concat(i))||this,r.handleRefs={},r.lastHandleRect=null,r.slack=null,r}var n=t.prototype;return n.componentWillUnmount=function(){this.resetData()},n.resetData=function(){this.lastHandleRect=this.slack=null},n.runConstraints=function(a,i){var o=this.props,l=o.minConstraints,u=o.maxConstraints,p=o.lockAspectRatio;if(!l&&!u&&!p)return[a,i];if(p){var c=this.props.width/this.props.height,f=a-this.props.width,d=i-this.props.height;Math.abs(f)>Math.abs(d*c)?i=a/c:a=i*c}var h=a,g=i,m=this.slack||[0,0],v=m[0],O=m[1];return a+=v,i+=O,l&&(a=Math.max(l[0],a),i=Math.max(l[1],i)),u&&(a=Math.min(u[0],a),i=Math.min(u[1],i)),this.slack=[v+(h-a),O+(g-i)],[a,i]},n.resizeHandler=function(a,i){var o=this;return function(l,u){var p=u.node,c=u.deltaX,f=u.deltaY;a==="onResizeStart"&&o.resetData();var d=(o.props.axis==="both"||o.props.axis==="x")&&i!=="n"&&i!=="s",h=(o.props.axis==="both"||o.props.axis==="y")&&i!=="e"&&i!=="w";if(!(!d&&!h)){var g=i[0],m=i[i.length-1],v=p.getBoundingClientRect();if(o.lastHandleRect!=null){if(m==="w"){var O=v.left-o.lastHandleRect.left;c+=O}if(g==="n"){var Y=v.top-o.lastHandleRect.top;f+=Y}}o.lastHandleRect=v,m==="w"&&(c=-c),g==="n"&&(f=-f);var z=o.props.width+(d?c/o.props.transformScale:0),w=o.props.height+(h?f/o.props.transformScale:0),W=o.runConstraints(z,w);z=W[0],w=W[1];var F=z!==o.props.width||w!==o.props.height,q=typeof o.props[a]=="function"?o.props[a]:null,V=a==="onResize"&&!F;q&&!V&&(l.persist==null||l.persist(),q(l,{node:p,size:{width:z,height:w},handle:i})),a==="onResizeStop"&&o.resetData()}}},n.renderResizeHandle=function(a,i){var o=this.props.handle;if(!o)return y.createElement("span",{className:"react-resizable-handle react-resizable-handle-"+a,ref:i});if(typeof o=="function")return o(a,i);var l=typeof o.type=="string",u=_({ref:i},l?{}:{handleAxis:a});return y.cloneElement(o,u)},n.render=function(){var a=this,i=this.props,o=i.children,l=i.className,u=i.draggableOpts;i.width,i.height,i.handle,i.handleSize,i.lockAspectRatio,i.axis,i.minConstraints,i.maxConstraints,i.onResize,i.onResizeStop,i.onResizeStart;var p=i.resizeHandles;i.transformScale;var c=ue(i,se);return(0,ie.cloneElement)(o,_(_({},c),{},{className:(l?l+" ":"")+"react-resizable",children:[].concat(o.props.children,p.map(function(f){var d,h=(d=a.handleRefs[f])!=null?d:a.handleRefs[f]=y.createRef();return y.createElement(ae.DraggableCore,D({},u,{nodeRef:h,key:"resizableHandle-"+f,onStop:a.resizeHandler("onResizeStop",f),onStart:a.resizeHandler("onResizeStart",f),onDrag:a.resizeHandler("onResize",f)}),a.renderResizeHandle(f,h))}))}))},t}(y.Component);b.default=E;E.propTypes=oe.resizableProps;E.defaultProps={axis:"both",handleSize:[20,20],lockAspectRatio:!1,minConstraints:[20,20],maxConstraints:[1/0,1/0],resizeHandles:["se"],transformScale:1};var S={};S.__esModule=!0;S.default=void 0;var x=Oe(window.React),he=L(K),ve=L(b),me=R,ge=["handle","handleSize","onResize","onResizeStart","onResizeStop","draggableOpts","minConstraints","maxConstraints","lockAspectRatio","axis","width","height","resizeHandles","style","transformScale"];function L(e){return e&&e.__esModule?e:{default:e}}function U(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,n=new WeakMap;return(U=function(a){return a?n:t})(e)}function Oe(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var n=U(t);if(n&&n.has(e))return n.get(e);var r={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(i!=="default"&&Object.prototype.hasOwnProperty.call(e,i)){var o=a?Object.getOwnPropertyDescriptor(e,i):null;o&&(o.get||o.set)?Object.defineProperty(r,i,o):r[i]=e[i]}return r.default=e,n&&n.set(e,r),r}function j(){return j=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},j.apply(this,arguments)}function B(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,r)}return n}function P(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?B(Object(n),!0).forEach(function(r){ye(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):B(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function ye(e,t,n){return t=be(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function be(e){var t=Re(e,"string");return typeof t=="symbol"?t:String(t)}function Re(e,t){if(typeof e!="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function ze(e,t){if(e==null)return{};var n={},r=Object.keys(e),a,i;for(i=0;i<r.length;i++)a=r[i],!(t.indexOf(a)>=0)&&(n[a]=e[a]);return n}function we(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,$(e,t)}function $(e,t){return $=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,a){return r.__proto__=a,r},$(e,t)}var X=function(e){we(t,e);function t(){for(var r,a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return r=e.call.apply(e,[this].concat(i))||this,r.state={width:r.props.width,height:r.props.height,propsWidth:r.props.width,propsHeight:r.props.height},r.onResize=function(l,u){var p=u.size;r.props.onResize?(l.persist==null||l.persist(),r.setState(p,function(){return r.props.onResize&&r.props.onResize(l,u)})):r.setState(p)},r}t.getDerivedStateFromProps=function(a,i){return i.propsWidth!==a.width||i.propsHeight!==a.height?{width:a.width,height:a.height,propsWidth:a.width,propsHeight:a.height}:null};var n=t.prototype;return n.render=function(){var a=this.props,i=a.handle,o=a.handleSize;a.onResize;var l=a.onResizeStart,u=a.onResizeStop,p=a.draggableOpts,c=a.minConstraints,f=a.maxConstraints,d=a.lockAspectRatio,h=a.axis;a.width,a.height;var g=a.resizeHandles,m=a.style,v=a.transformScale,O=ze(a,ge);return x.createElement(ve.default,{axis:h,draggableOpts:p,handle:i,handleSize:o,height:this.state.height,lockAspectRatio:d,maxConstraints:f,minConstraints:c,onResizeStart:l,onResize:this.onResize,onResizeStop:u,resizeHandles:g,transformScale:v,width:this.state.width},x.createElement("div",j({},O,{style:P(P({},m),{},{width:this.state.width+"px",height:this.state.height+"px"})})))},t}(x.Component);S.default=X;X.propTypes=P(P({},me.resizableProps),{},{children:he.default.element});C.exports=function(){throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable")};C.exports.Resizable=b.default;var _e=C.exports.ResizableBox=S.default;export{_e as R};