const{slice:p,forEach:h}=[];function m(n){return h.call(p.call(arguments,1),e=>{if(e)for(const t in e)n[t]===void 0&&(n[t]=e[t])}),n}const c=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,w=(n,e,t)=>{const o=t||{};o.path=o.path||"/";const i=encodeURIComponent(e);let a=`${n}=${i}`;if(o.maxAge>0){const r=o.maxAge-0;if(Number.isNaN(r))throw new Error("maxAge should be a Number");a+=`; Max-Age=${Math.floor(r)}`}if(o.domain){if(!c.test(o.domain))throw new TypeError("option domain is invalid");a+=`; Domain=${o.domain}`}if(o.path){if(!c.test(o.path))throw new TypeError("option path is invalid");a+=`; Path=${o.path}`}if(o.expires){if(typeof o.expires.toUTCString!="function")throw new TypeError("option expires is invalid");a+=`; Expires=${o.expires.toUTCString()}`}if(o.httpOnly&&(a+="; HttpOnly"),o.secure&&(a+="; Secure"),o.sameSite)switch(typeof o.sameSite=="string"?o.sameSite.toLowerCase():o.sameSite){case!0:a+="; SameSite=Strict";break;case"lax":a+="; SameSite=Lax";break;case"strict":a+="; SameSite=Strict";break;case"none":a+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}return a},d={create(n,e,t,o){let i=arguments.length>4&&arguments[4]!==void 0?arguments[4]:{path:"/",sameSite:"strict"};t&&(i.expires=new Date,i.expires.setTime(i.expires.getTime()+t*60*1e3)),o&&(i.domain=o),document.cookie=w(n,encodeURIComponent(e),i)},read(n){const e=`${n}=`,t=document.cookie.split(";");for(let o=0;o<t.length;o++){let i=t[o];for(;i.charAt(0)===" ";)i=i.substring(1,i.length);if(i.indexOf(e)===0)return i.substring(e.length,i.length)}return null},remove(n){this.create(n,"",-1)}};var S={name:"cookie",lookup(n){let{lookupCookie:e}=n;if(e&&typeof document<"u")return d.read(e)||void 0},cacheUserLanguage(n,e){let{lookupCookie:t,cookieMinutes:o,cookieDomain:i,cookieOptions:a}=e;t&&typeof document<"u"&&d.create(t,n,o,i,a)}},k={name:"querystring",lookup(n){let{lookupQuerystring:e}=n,t;if(typeof window<"u"){let{search:o}=window.location;!window.location.search&&window.location.hash?.indexOf("?")>-1&&(o=window.location.hash.substring(window.location.hash.indexOf("?")));const a=o.substring(1).split("&");for(let r=0;r<a.length;r++){const l=a[r].indexOf("=");l>0&&a[r].substring(0,l)===e&&(t=a[r].substring(l+1))}}return t}};let s=null;const g=()=>{if(s!==null)return s;try{s=window!=="undefined"&&window.localStorage!==null;const n="i18next.translate.boo";window.localStorage.setItem(n,"foo"),window.localStorage.removeItem(n)}catch{s=!1}return s};var x={name:"localStorage",lookup(n){let{lookupLocalStorage:e}=n;if(e&&g())return window.localStorage.getItem(e)||void 0},cacheUserLanguage(n,e){let{lookupLocalStorage:t}=e;t&&g()&&window.localStorage.setItem(t,n)}};let u=null;const f=()=>{if(u!==null)return u;try{u=window!=="undefined"&&window.sessionStorage!==null;const n="i18next.translate.boo";window.sessionStorage.setItem(n,"foo"),window.sessionStorage.removeItem(n)}catch{u=!1}return u};var y={name:"sessionStorage",lookup(n){let{lookupSessionStorage:e}=n;if(e&&f())return window.sessionStorage.getItem(e)||void 0},cacheUserLanguage(n,e){let{lookupSessionStorage:t}=e;t&&f()&&window.sessionStorage.setItem(t,n)}},v={name:"navigator",lookup(n){const e=[];if(typeof navigator<"u"){const{languages:t,userLanguage:o,language:i}=navigator;if(t)for(let a=0;a<t.length;a++)e.push(t[a]);o&&e.push(o),i&&e.push(i)}return e.length>0?e:void 0}},b={name:"htmlTag",lookup(n){let{htmlTag:e}=n,t;const o=e||(typeof document<"u"?document.documentElement:null);return o&&typeof o.getAttribute=="function"&&(t=o.getAttribute("lang")),t}},D={name:"path",lookup(n){let{lookupFromPathIndex:e}=n;if(typeof window>"u")return;const t=window.location.pathname.match(/\/([a-zA-Z-]*)/g);return Array.isArray(t)?t[typeof e=="number"?e:0]?.replace("/",""):void 0}},L={name:"subdomain",lookup(n){let{lookupFromSubdomainIndex:e}=n;const t=typeof e=="number"?e+1:1,o=typeof window<"u"&&window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);if(o)return o[t]}};function I(){return{order:["querystring","cookie","localStorage","sessionStorage","navigator","htmlTag"],lookupQuerystring:"lng",lookupCookie:"i18next",lookupLocalStorage:"i18nextLng",lookupSessionStorage:"i18nextLng",caches:["localStorage"],excludeCacheFor:["cimode"],convertDetectedLanguage:n=>n}}class C{constructor(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};this.type="languageDetector",this.detectors={},this.init(e,t)}init(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};this.services=e||{languageUtils:{}},this.options=m(t,this.options||{},I()),typeof this.options.convertDetectedLanguage=="string"&&this.options.convertDetectedLanguage.indexOf("15897")>-1&&(this.options.convertDetectedLanguage=i=>i.replace("-","_")),this.options.lookupFromUrlIndex&&(this.options.lookupFromPathIndex=this.options.lookupFromUrlIndex),this.i18nOptions=o,this.addDetector(S),this.addDetector(k),this.addDetector(x),this.addDetector(y),this.addDetector(v),this.addDetector(b),this.addDetector(D),this.addDetector(L)}addDetector(e){return this.detectors[e.name]=e,this}detect(e){e||(e=this.options.order);let t=[];return e.forEach(o=>{if(this.detectors[o]){let i=this.detectors[o].lookup(this.options);i&&typeof i=="string"&&(i=[i]),i&&(t=t.concat(i))}}),t=t.map(o=>this.options.convertDetectedLanguage(o)),this.services.languageUtils.getBestMatchFromCodes?t:t.length>0?t[0]:null}cacheUserLanguage(e,t){t||(t=this.options.caches),t&&(this.options.excludeCacheFor&&this.options.excludeCacheFor.indexOf(e)>-1||t.forEach(o=>{this.detectors[o]&&this.detectors[o].cacheUserLanguage(e,this.options)}))}}C.type="languageDetector";export{C as B};
