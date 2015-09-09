var CSRFToken,Click,ComponentUrl,EVENTS,Link,ProgressBar,ProgressBarAPI,browserIsntBuggy,browserSupportsCustomEvents,browserSupportsPushState,browserSupportsTurbolinks,bypassOnLoadPopstate,cacheCurrentPage,cacheSize,changePage,clone,constrainPageCacheTo,createDocument,crossOriginRedirect,currentState,disableRequestCaching,enableTransitionCache,executeScriptTags,extractTitleAndBody,fetch,fetchHistory,fetchReplacement,findNodes,findNodesMatchingKeys,historyStateIsDefined,initializeTurbolinks,installDocumentReadyPageEventTriggers,installHistoryChangeHandler,installJqueryAjaxSuccessPageUpdateTrigger,loadedAssets,manuallyTriggerHashChangeForFirefox,pageCache,pageChangePrevented,pagesCached,popCookie,processResponse,progressBar,recallScrollPosition,ref,referer,reflectNewUrl,reflectRedirectedUrl,rememberCurrentState,rememberCurrentUrl,rememberReferer,removeNoscriptTags,replace,requestCachingEnabled,requestMethodIsSafe,resetScrollPosition,setAutofocusElement,swapNodes,transitionCacheEnabled,transitionCacheFor,triggerEvent,uniqueId,visit,xhr,indexOf=[].indexOf||function(e){for(var t=0,r=this.length;r>t;t++)if(t in this&&this[t]===e)return t;return-1},extend=function(e,t){function r(){this.constructor=e}for(var n in t)hasProp.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},hasProp={}.hasOwnProperty,slice=[].slice,bind=function(e,t){return function(){return e.apply(t,arguments)}};pageCache={},cacheSize=10,transitionCacheEnabled=!1,requestCachingEnabled=!0,progressBar=null,currentState=null,loadedAssets=null,referer=null,xhr=null,EVENTS={BEFORE_CHANGE:"page:before-change",FETCH:"page:fetch",RECEIVE:"page:receive",CHANGE:"page:change",UPDATE:"page:update",LOAD:"page:load",RESTORE:"page:restore",BEFORE_UNLOAD:"page:before-unload",EXPIRE:"page:expire"},fetch=function(e,t){var r;return null==t&&(t={}),e=new ComponentUrl(e),rememberReferer(),cacheCurrentPage(),null!=progressBar&&progressBar.start(),transitionCacheEnabled&&(r=transitionCacheFor(e.absolute))?(fetchHistory(r),t.showProgressBar=!1,fetchReplacement(e,t)):(t.onLoadFunction=resetScrollPosition,fetchReplacement(e,t))},transitionCacheFor=function(e){var t;return t=pageCache[e],t&&!t.transitionCacheDisabled?t:void 0},enableTransitionCache=function(e){return null==e&&(e=!0),transitionCacheEnabled=e},disableRequestCaching=function(e){return null==e&&(e=!0),requestCachingEnabled=!e,e},fetchReplacement=function(e,t){return null==t.cacheRequest&&(t.cacheRequest=requestCachingEnabled),null==t.showProgressBar&&(t.showProgressBar=!0),triggerEvent(EVENTS.FETCH,{url:e.absolute}),null!=xhr&&xhr.abort(),xhr=new XMLHttpRequest,xhr.open("GET",e.formatForXHR({cache:t.cacheRequest}),!0),xhr.setRequestHeader("Accept","text/html, application/xhtml+xml, application/xml"),xhr.setRequestHeader("X-XHR-Referer",referer),xhr.onload=function(){var r;return triggerEvent(EVENTS.RECEIVE,{url:e.absolute}),(r=processResponse())?(reflectNewUrl(e),reflectRedirectedUrl(),changePage(r,t),t.showProgressBar&&null!=progressBar&&progressBar.done(),manuallyTriggerHashChangeForFirefox(),"function"==typeof t.onLoadFunction&&t.onLoadFunction(),triggerEvent(EVENTS.LOAD)):(null!=progressBar&&progressBar.done(),document.location.href=crossOriginRedirect()||e.absolute)},progressBar&&t.showProgressBar&&(xhr.onprogress=function(){return function(e){var t;return t=e.lengthComputable?e.loaded/e.total*100:progressBar.value+(100-progressBar.value)/10,progressBar.advanceTo(t)}}(this)),xhr.onloadend=function(){return xhr=null},xhr.onerror=function(){return document.location.href=e.absolute},xhr.send()},fetchHistory=function(e){return null!=xhr&&xhr.abort(),changePage(createDocument(e.body.outerHTML),{title:e.title,runScripts:!1}),null!=progressBar&&progressBar.done(),recallScrollPosition(e),triggerEvent(EVENTS.RESTORE)},cacheCurrentPage=function(){var e;return e=new ComponentUrl(currentState.url),pageCache[e.absolute]={url:e.relative,body:document.body,title:document.title,positionY:window.pageYOffset,positionX:window.pageXOffset,cachedAt:(new Date).getTime(),transitionCacheDisabled:null!=document.querySelector("[data-no-transition-cache]")},constrainPageCacheTo(cacheSize)},pagesCached=function(e){return null==e&&(e=cacheSize),/^[\d]+$/.test(e)?cacheSize=parseInt(e):void 0},constrainPageCacheTo=function(e){var t,r,n,o,i,s;for(i=Object.keys(pageCache),t=i.map(function(e){return pageCache[e].cachedAt}).sort(function(e,t){return t-e}),s=[],r=0,o=i.length;o>r;r++)n=i[r],pageCache[n].cachedAt<=t[e]&&(triggerEvent(EVENTS.EXPIRE,pageCache[n]),s.push(delete pageCache[n]));return s},replace=function(e,t){return null==t&&(t={}),changePage(createDocument(e),t)},changePage=function(e,t){var r,n,o,i,s;return o=extractTitleAndBody(e),s=o[0],i=o[1],r=o[2],null==s&&(s=t.title),triggerEvent(EVENTS.BEFORE_UNLOAD),document.title=s,swapNodes(i,findNodes(document.body,"[data-turbolinks-temporary]"),{keep:!1}),t.change?swapNodes(i,findNodesMatchingKeys(document.body,t.change),{keep:!1}):(t.flush||(n=findNodes(document.body,"[data-turbolinks-permanent]"),t.keep&&n.push.apply(n,findNodesMatchingKeys(document.body,t.keep)),swapNodes(i,n,{keep:!0})),document.documentElement.replaceChild(i,document.body),null!=r&&CSRFToken.update(r),setAutofocusElement()),t.runScripts!==!1&&executeScriptTags(),currentState=window.history.state,triggerEvent(EVENTS.CHANGE),triggerEvent(EVENTS.UPDATE)},findNodes=function(e,t){return Array.prototype.slice.apply(e.querySelectorAll(t))},findNodesMatchingKeys=function(e,t){var r,n,o,i,s;for(i=[],s=Array.isArray(t)?t:[t],r=0,o=s.length;o>r;r++)n=s[r],i.push.apply(i,findNodes(e,'[id^="'+n+':"], [id="'+n+'"]'));return i},swapNodes=function(e,t,r){var n,o,i,s,a;for(o=0,i=t.length;i>o;o++){if(n=t[o],!(s=n.getAttribute("id")))throw new Error("Turbolinks partial replace: turbolinks elements must have an id.");(a=e.querySelector('[id="'+s+'"]'))&&(r.keep?(n.parentNode.insertBefore(n.cloneNode(!0),n),e.ownerDocument.adoptNode(n),a.parentNode.replaceChild(n,a)):(a=a.cloneNode(!0),n.parentNode.replaceChild(a,n)))}},executeScriptTags=function(){var e,t,r,n,o,i,s,a,u,c,l,h;for(h=document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'),r=0,o=h.length;o>r;r++)if(l=h[r],""===(u=l.type)||"text/javascript"===u){for(t=document.createElement("script"),c=l.attributes,n=0,i=c.length;i>n;n++)e=c[n],t.setAttribute(e.name,e.value);l.hasAttribute("async")||(t.async=!1),t.appendChild(document.createTextNode(l.innerHTML)),a=l.parentNode,s=l.nextSibling,a.removeChild(l),a.insertBefore(t,s)}},removeNoscriptTags=function(e){return e.innerHTML=e.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/gi,""),e},setAutofocusElement=function(){var e,t;return e=(t=document.querySelectorAll("input[autofocus], textarea[autofocus]"))[t.length-1],e&&document.activeElement!==e?e.focus():void 0},reflectNewUrl=function(e){return(e=new ComponentUrl(e)).absolute!==referer?window.history.pushState({turbolinks:!0,url:e.absolute},"",e.absolute):void 0},reflectRedirectedUrl=function(){var e,t;return(e=xhr.getResponseHeader("X-XHR-Redirected-To"))?(e=new ComponentUrl(e),t=e.hasNoHash()?document.location.hash:"",window.history.replaceState(window.history.state,"",e.href+t)):void 0},crossOriginRedirect=function(){var e;return null!=(e=xhr.getResponseHeader("Location"))&&new ComponentUrl(e).crossOrigin()?e:void 0},rememberReferer=function(){return referer=document.location.href},rememberCurrentUrl=function(){return window.history.replaceState({turbolinks:!0,url:document.location.href},"",document.location.href)},rememberCurrentState=function(){return currentState=window.history.state},manuallyTriggerHashChangeForFirefox=function(){var e;return navigator.userAgent.match(/Firefox/)&&!(e=new ComponentUrl).hasNoHash()?(window.history.replaceState(currentState,"",e.withoutHash()),document.location.hash=e.hash):void 0},recallScrollPosition=function(e){return window.scrollTo(e.positionX,e.positionY)},resetScrollPosition=function(){return document.location.hash?document.location.href=document.location.href:window.scrollTo(0,0)},clone=function(e){var t,r,n;if(null==e||"object"!=typeof e)return e;t=new e.constructor;for(r in e)n=e[r],t[r]=clone(n);return t},popCookie=function(e){var t,r;return r=(null!=(t=document.cookie.match(new RegExp(e+"=(\\w+)")))?t[1].toUpperCase():void 0)||"",document.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/",r},uniqueId=function(){return(new Date).getTime().toString(36)},triggerEvent=function(e,t){var r;return"undefined"!=typeof Prototype&&Event.fire(document,e,t,!0),r=document.createEvent("Events"),t&&(r.data=t),r.initEvent(e,!0,!0),document.dispatchEvent(r)},pageChangePrevented=function(e){return!triggerEvent(EVENTS.BEFORE_CHANGE,{url:e})},processResponse=function(){var e,t,r,n,o,i,s;return t=function(){var e;return 400<=(e=xhr.status)&&600>e},s=function(){var e;return null!=(e=xhr.getResponseHeader("Content-Type"))&&e.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/)},n=function(){var e;return null!=(e=xhr.getResponseHeader("Content-Disposition"))&&e.match(/^attachment/)},o=function(e){var t,r,n,o,i;for(o=e.querySelector("head").childNodes,i=[],t=0,r=o.length;r>t;t++)n=o[t],null!=("function"==typeof n.getAttribute?n.getAttribute("data-turbolinks-track"):void 0)&&i.push(n.getAttribute("src")||n.getAttribute("href"));return i},e=function(e){var t;return loadedAssets||(loadedAssets=o(document)),t=o(e),t.length!==loadedAssets.length||i(t,loadedAssets).length!==loadedAssets.length},i=function(e,t){var r,n,o,i,s;for(e.length>t.length&&(o=[t,e],e=o[0],t=o[1]),i=[],r=0,n=e.length;n>r;r++)s=e[r],indexOf.call(t,s)>=0&&i.push(s);return i},t()||!s()||n()||(r=createDocument(xhr.responseText),!r||e(r))?void 0:r},extractTitleAndBody=function(e){var t;return t=e.querySelector("title"),[null!=t?t.textContent:void 0,removeNoscriptTags(e.querySelector("body")),CSRFToken.get(e).token]},CSRFToken={get:function(e){var t;return null==e&&(e=document),{node:t=e.querySelector('meta[name="csrf-token"]'),token:null!=t&&"function"==typeof t.getAttribute?t.getAttribute("content"):void 0}},update:function(e){var t;return t=this.get(),null!=t.token&&null!=e&&t.token!==e?t.node.setAttribute("content",e):void 0}},createDocument=function(e){var t;return t=document.documentElement.cloneNode(),t.innerHTML=e,t.head=t.querySelector("head"),t.body=t.querySelector("body"),t},ComponentUrl=function(){function e(t){return this.original=null!=t?t:document.location.href,this.original.constructor===e?this.original:void this._parse()}return e.prototype.withoutHash=function(){return this.href.replace(this.hash,"").replace("#","")},e.prototype.withoutHashForIE10compatibility=function(){return this.withoutHash()},e.prototype.hasNoHash=function(){return 0===this.hash.length},e.prototype.crossOrigin=function(){return this.origin!==(new e).origin},e.prototype.formatForXHR=function(e){return null==e&&(e={}),(e.cache?this:this.withAntiCacheParam()).withoutHashForIE10compatibility()},e.prototype.withAntiCacheParam=function(){return new e(/([?&])_=[^&]*/.test(this.absolute)?this.absolute.replace(/([?&])_=[^&]*/,"$1_="+uniqueId()):new e(this.absolute+(/\?/.test(this.absolute)?"&":"?")+("_="+uniqueId())))},e.prototype._parse=function(){var e;return(null!=this.link?this.link:this.link=document.createElement("a")).href=this.original,e=this.link,this.href=e.href,this.protocol=e.protocol,this.host=e.host,this.hostname=e.hostname,this.port=e.port,this.pathname=e.pathname,this.search=e.search,this.hash=e.hash,this.origin=[this.protocol,"//",this.hostname].join(""),0!==this.port.length&&(this.origin+=":"+this.port),this.relative=[this.pathname,this.search,this.hash].join(""),this.absolute=this.href},e}(),Link=function(e){function t(e){return this.link=e,this.link.constructor===t?this.link:(this.original=this.link.href,this.originalElement=this.link,this.link=this.link.cloneNode(!1),void t.__super__.constructor.apply(this,arguments))}return extend(t,e),t.HTML_EXTENSIONS=["html"],t.allowExtensions=function(){var e,r,n,o;for(r=1<=arguments.length?slice.call(arguments,0):[],n=0,o=r.length;o>n;n++)e=r[n],t.HTML_EXTENSIONS.push(e);return t.HTML_EXTENSIONS},t.prototype.shouldIgnore=function(){return this.crossOrigin()||this._anchored()||this._nonHtml()||this._optOut()||this._target()},t.prototype._anchored=function(){return(this.hash.length>0||"#"===this.href.charAt(this.href.length-1))&&this.withoutHash()===(new ComponentUrl).withoutHash()},t.prototype._nonHtml=function(){return this.pathname.match(/\.[a-z]+$/g)&&!this.pathname.match(new RegExp("\\.(?:"+t.HTML_EXTENSIONS.join("|")+")?$","g"))},t.prototype._optOut=function(){var e,t;for(t=this.originalElement;!e&&t!==document;)e=null!=t.getAttribute("data-no-turbolink"),t=t.parentNode;return e},t.prototype._target=function(){return 0!==this.link.target.length},t}(ComponentUrl),Click=function(){function e(e){this.event=e,this.event.defaultPrevented||(this._extractLink(),this._validForTurbolinks()&&(pageChangePrevented(this.link.absolute)||visit(this.link.href),this.event.preventDefault()))}return e.installHandlerLast=function(t){return t.defaultPrevented?void 0:(document.removeEventListener("click",e.handle,!1),document.addEventListener("click",e.handle,!1))},e.handle=function(t){return new e(t)},e.prototype._extractLink=function(){var e;for(e=this.event.target;e.parentNode&&"A"!==e.nodeName;)e=e.parentNode;return"A"===e.nodeName&&0!==e.href.length?this.link=new Link(e):void 0},e.prototype._validForTurbolinks=function(){return null!=this.link&&!(this.link.shouldIgnore()||this._nonStandardClick())},e.prototype._nonStandardClick=function(){return this.event.which>1||this.event.metaKey||this.event.ctrlKey||this.event.shiftKey||this.event.altKey},e}(),ProgressBar=function(){function e(e){this.elementSelector=e,this._trickle=bind(this._trickle,this),this._reset=bind(this._reset,this),this.value=0,this.content="",this.speed=300,this.opacity=r,this.install()}var t,r;return t="turbolinks-progress-bar",r=.99,e.enable=function(){return null!=progressBar?progressBar:progressBar=new e("html")},e.disable=function(){return null!=progressBar&&progressBar.uninstall(),progressBar=null},e.prototype.install=function(){return this.element=document.querySelector(this.elementSelector),this.element.classList.add(t),this.styleElement=document.createElement("style"),document.head.appendChild(this.styleElement),this._updateStyle()},e.prototype.uninstall=function(){return this.element.classList.remove(t),document.head.removeChild(this.styleElement)},e.prototype.start=function(){return this.value>0&&(this._reset(),this._reflow()),this.advanceTo(5)},e.prototype.advanceTo=function(e){var t;if(e>(t=this.value)&&100>=t){if(this.value=e,this._updateStyle(),100===this.value)return this._stopTrickle();if(this.value>0)return this._startTrickle()}},e.prototype.done=function(){return this.value>0?(this.advanceTo(100),this._finish()):void 0},e.prototype._finish=function(){return this.fadeTimer=setTimeout(function(e){return function(){return e.opacity=0,e._updateStyle()}}(this),this.speed/2),this.resetTimer=setTimeout(this._reset,this.speed)},e.prototype._reflow=function(){return this.element.offsetHeight},e.prototype._reset=function(){return this._stopTimers(),this.value=0,this.opacity=r,this._withSpeed(0,function(e){return function(){return e._updateStyle(!0)}}(this))},e.prototype._stopTimers=function(){return this._stopTrickle(),clearTimeout(this.fadeTimer),clearTimeout(this.resetTimer)},e.prototype._startTrickle=function(){return this.trickleTimer?void 0:this.trickleTimer=setTimeout(this._trickle,this.speed)},e.prototype._stopTrickle=function(){return clearTimeout(this.trickleTimer),delete this.trickleTimer},e.prototype._trickle=function(){return this.advanceTo(this.value+Math.random()/2),this.trickleTimer=setTimeout(this._trickle,this.speed)},e.prototype._withSpeed=function(e,t){var r,n;return r=this.speed,this.speed=e,n=t(),this.speed=r,n},e.prototype._updateStyle=function(e){return null==e&&(e=!1),e&&this._changeContentToForceRepaint(),this.styleElement.textContent=this._createCSSRule()},e.prototype._changeContentToForceRepaint=function(){return this.content=""===this.content?" ":""},e.prototype._createCSSRule=function(){return this.elementSelector+"."+t+"::before {\n  content: '"+this.content+"';\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2000;\n  background-color: #0076ff;\n  height: 3px;\n  opacity: "+this.opacity+";\n  width: "+this.value+"%;\n  transition: width "+this.speed+"ms ease-out, opacity "+this.speed/2+"ms ease-in;\n  transform: translate3d(0,0,0);\n}"},e}(),ProgressBarAPI={enable:ProgressBar.enable,disable:ProgressBar.disable,start:function(){return ProgressBar.enable().start()},advanceTo:function(e){return null!=progressBar?progressBar.advanceTo(e):void 0},done:function(){return null!=progressBar?progressBar.done():void 0}},bypassOnLoadPopstate=function(e){return setTimeout(e,500)},installDocumentReadyPageEventTriggers=function(){return document.addEventListener("DOMContentLoaded",function(){return triggerEvent(EVENTS.CHANGE),triggerEvent(EVENTS.UPDATE)},!0)},installJqueryAjaxSuccessPageUpdateTrigger=function(){return"undefined"!=typeof jQuery?jQuery(document).on("ajaxSuccess",function(e,t){return jQuery.trim(t.responseText)?triggerEvent(EVENTS.UPDATE):void 0}):void 0},installHistoryChangeHandler=function(e){var t,r;return(null!=(r=e.state)?r.turbolinks:void 0)?(t=pageCache[new ComponentUrl(e.state.url).absolute])?(cacheCurrentPage(),fetchHistory(t)):visit(e.target.location.href):void 0},initializeTurbolinks=function(){return rememberCurrentUrl(),rememberCurrentState(),ProgressBar.enable(),document.addEventListener("click",Click.installHandlerLast,!0),window.addEventListener("hashchange",function(){return rememberCurrentUrl(),rememberCurrentState()},!1),bypassOnLoadPopstate(function(){return window.addEventListener("popstate",installHistoryChangeHandler,!1)})},historyStateIsDefined=void 0!==window.history.state||navigator.userAgent.match(/Firefox\/2[6|7]/),browserSupportsPushState=window.history&&window.history.pushState&&window.history.replaceState&&historyStateIsDefined,browserIsntBuggy=!navigator.userAgent.match(/CriOS\//),requestMethodIsSafe="GET"===(ref=popCookie("request_method"))||""===ref,browserSupportsTurbolinks=browserSupportsPushState&&browserIsntBuggy&&requestMethodIsSafe,browserSupportsCustomEvents=document.addEventListener&&document.createEvent,browserSupportsCustomEvents&&(installDocumentReadyPageEventTriggers(),installJqueryAjaxSuccessPageUpdateTrigger()),browserSupportsTurbolinks?(visit=fetch,initializeTurbolinks()):visit=function(e){return document.location.href=e},this.Turbolinks={visit:visit,replace:replace,pagesCached:pagesCached,cacheCurrentPage:cacheCurrentPage,enableTransitionCache:enableTransitionCache,disableRequestCaching:disableRequestCaching,ProgressBar:ProgressBarAPI,allowLinkExtensions:Link.allowExtensions,supported:browserSupportsTurbolinks,EVENTS:clone(EVENTS)};