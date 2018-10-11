!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SlVueTree=t():e.SlVueTree=t()}(window,function(){return function(e){var t={};function s(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,s),i.l=!0,i.exports}return s.m=e,s.c=t,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},s.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,s){"use strict";s.r(t);var o={name:"sl-vue-tree",props:{value:{type:Array,default:()=>[]},edgeSize:{type:Number,default:3},showBranches:{type:Boolean,default:!1},level:{type:Number,default:0},parentInd:{type:Number},allowMultiselect:{type:Boolean,default:!0},multiselectKey:{type:[String,Array],default:function(){return["ctrlKey","metaKey"]},validator:function(e){let t=["ctrlKey","metaKey","altKey"],s=Array.isArray(e)?e:[e];return!!(s=s.filter(e=>-1!==t.indexOf(e))).length}},scrollAreaHeight:{type:Number,default:70},maxScrollSpeed:{type:Number,default:20}},data(){return{rootCursorPosition:null,scrollIntervalId:0,scrollSpeed:0,lastSelectedNode:null,mouseIsDown:!1,isDragging:!1,lastMousePos:{x:0,y:0},preventDrag:!1,currentValue:this.value}},mounted(){this.isRoot&&document.addEventListener("mouseup",this.onDocumentMouseupHandler)},beforeDestroy(){document.removeEventListener("mouseup",this.onDocumentMouseupHandler)},watch:{value:function(e){this.currentValue=e}},computed:{cursorPosition(){return this.isRoot?this.rootCursorPosition:this.getParent().cursorPosition},nodes(){if(this.isRoot){const e=this.copy(this.currentValue);return this.getNodes(e)}return this.getParent().nodes[this.parentInd].children},gaps(){const e=[];let t=this.level-1;for(this.showBranches||t++;t-- >0;)e.push(t);return e},isRoot(){return!this.level},selectionSize(){return this.getSelected().length},dragSize(){return this.getDraggable().length}},methods:{setCursorPosition(e){this.isRoot?this.rootCursorPosition=e:this.getParent().setCursorPosition(e)},getNodes(e,t=[],s=!0){return e.map((o,i)=>{const r=t.concat(i);return this.getNode(r,o,e,s)})},getNode(e,t=null,s=null,o=null){const i=e.slice(-1)[0];if(s=s||this.getNodeSiblings(this.currentValue,e),t=t||s&&s[i]||null,null==o&&(o=this.isVisible(e)),!t)return null;const r=void 0==t.isExpanded||!!t.isExpanded,n=void 0==t.isDraggable||!!t.isDraggable,l=void 0==t.isSelectable||!!t.isSelectable;return{title:t.title,isLeaf:!!t.isLeaf,children:t.children?this.getNodes(t.children,e,r):[],isSelected:!!t.isSelected,isExpanded:r,isVisible:o,isDraggable:n,isSelectable:l,data:void 0!==t.data?t.data:{},path:e,pathStr:JSON.stringify(e),level:e.length,ind:i,isFirstChild:0==i,isLastChild:i===s.length-1}},isVisible(e){if(e.length<2)return!0;let t=this.currentValue;for(let s=0;s<e.length-1;s++){let o=t[e[s]];if(!(void 0==o.isExpanded||!!o.isExpanded))return!1;t=o.children}return!0},emitInput(e){this.currentValue=e,this.getRoot().$emit("input",e)},emitSelect(e,t){this.getRoot().$emit("select",e,t)},emitDrop(e,t,s){this.getRoot().$emit("drop",e,t,s)},emitToggle(e,t){this.getRoot().$emit("toggle",e,t)},emitNodeClick(e,t){this.getRoot().$emit("nodeclick",e,t)},emitNodeDblclick(e,t){this.getRoot().$emit("nodedblclick",e,t)},emitNodeContextmenu(e,t){this.getRoot().$emit("nodecontextmenu",e,t)},onExternalDragoverHandler(e,t){t.preventDefault();const s=this.getRoot(),o=s.getCursorPositionFromCoords(t.clientX,t.clientY);s.setCursorPosition(o),s.$emit("externaldragover",o,t)},onExternalDropHandler(e,t){const s=this.getRoot(),o=s.getCursorPositionFromCoords(t.clientX,t.clientY);s.$emit("externaldrop",o,t),this.setCursorPosition(null)},select(e,t=!1,s=null){const o=Array.isArray(this.multiselectKey)?this.multiselectKey:[this.multiselectKey],i=s&&!!o.find(e=>s[e]);t=(i||t)&&this.allowMultiselect;const r=this.getNode(e);if(!r)return null;const n=this.copy(this.currentValue),l=this.allowMultiselect&&s&&s.shiftKey&&this.lastSelectedNode,a=[];let u=!1;return this.traverse((e,s)=>{l?(e.pathStr!==r.pathStr&&e.pathStr!==this.lastSelectedNode.pathStr||(s.isSelected=e.isSelectable,u=!u),u&&(s.isSelected=e.isSelectable)):e.pathStr===r.pathStr?s.isSelected=e.isSelectable:t||s.isSelected&&(s.isSelected=!1),s.isSelected&&a.push(e)},n),this.lastSelectedNode=r,this.emitInput(n),this.emitSelect(a,s),r},onMousemoveHandler(e){if(!this.isRoot)return void this.getRoot().onMousemoveHandler(e);if(this.preventDrag)return;const t=this.isDragging,s=this.isDragging||this.mouseIsDown&&(this.lastMousePos.x!==e.clientX||this.lastMousePos.y!==e.clientY),o=!1===t&&!0===s;if(this.lastMousePos={x:e.clientX,y:e.clientY},!s)return;const i=this.getRoot().$el,r=i.getBoundingClientRect(),n=this.$refs.dragInfo,l=e.clientY-r.top+i.scrollTop-(0|n.style.marginBottom),a=e.clientX-r.left;n.style.top=l+"px",n.style.left=a+"px";const u=this.getCursorPositionFromCoords(e.clientX,e.clientY),d=u.node,c=u.placement;if(o&&!d.isSelected&&this.select(d.path,!1,e),!this.getDraggable().length)return void(this.preventDrag=!0);this.isDragging=s,this.setCursorPosition({node:d,placement:c});const h=window.innerHeight-this.scrollAreaHeight,g=(e.clientY-h)/this.scrollAreaHeight,p=(r.top,this.scrollAreaHeight,(this.scrollAreaHeight-e.clientY)/this.scrollAreaHeight);g>0?this.startScroll(g):p>0?this.startScroll(-p):this.stopScroll()},getCursorPositionFromCoords(e,t){const s=document.elementFromPoint(e,t),o=s.getAttribute("path")?s:s.closest("[path]");let i,r;if(o){if(!o)return;i=this.getNode(JSON.parse(o.getAttribute("path")));const e=o.offsetHeight,s=this.edgeSize,n=t-o.getBoundingClientRect().top;r=i.isLeaf?n>=e/2?"after":"before":n<=s?"before":n>=e-s?"after":"inside"}else{const e=this.getRoot().$el.getBoundingClientRect();t>e.top+e.height/2?(r="after",i=this.getLastNode()):(r="before",i=this.getFirstNode())}return{node:i,placement:r}},onMouseleaveHandler(e){if(!this.isRoot||!this.isDragging)return;const t=this.getRoot().$el.getBoundingClientRect();e.clientY>=t.bottom?this.setCursorPosition({node:this.nodes.slice(-1)[0],placement:"after"}):e.clientY<t.top&&this.setCursorPosition({node:this.getFirstNode(),placement:"before"})},getNodeEl(e){this.getRoot().$el.querySelector(`[path="${JSON.stringify(e)}"]`)},getLastNode(){let e=null;return this.traverse(t=>{e=t}),e},getFirstNode(){return this.getNode([0])},getNextNode(e,t=null){let s=null;return this.traverse(o=>{if(!(this.comparePaths(o.path,e)<1))return!t||t(o)?(s=o,!1):void 0}),s},getPrevNode(e,t){let s=[];this.traverse(t=>{if(this.comparePaths(t.path,e)>=0)return!1;s.push(t)});let o=s.length;for(;o--;){const e=s[o];if(!t||t(e))return e}return null},comparePaths(e,t){for(let s=0;s<e.length;s++){if(void 0==t[s])return 1;if(e[s]>t[s])return 1;if(e[s]<t[s])return-1}return void 0==t[e.length]?0:-1},onNodeMousedownHandler(e,t){0===e.button&&(this.isRoot?this.mouseIsDown=!0:this.getRoot().onNodeMousedownHandler(e,t))},startScroll(e){this.getRoot().$el;this.scrollSpeed!==e&&(this.scrollIntervalId&&this.stopScroll(),this.scrollSpeed=e,this.scrollIntervalId=setInterval(()=>{scrollBy(0,this.maxScrollSpeed*e)},20))},stopScroll(){clearInterval(this.scrollIntervalId),this.scrollIntervalId=0,this.scrollSpeed=0},onDocumentMouseupHandler(e){this.isDragging&&this.onNodeMouseupHandler(e)},onNodeMouseupHandler(e,t=null){if(0!==e.button)return;if(!this.isRoot)return void this.getRoot().onNodeMouseupHandler(e,t);if(this.mouseIsDown=!1,this.isDragging||!t||this.preventDrag||this.select(t.path,!1,e),this.preventDrag=!1,!this.cursorPosition)return void this.stopDrag();const s=this.getDraggable();for(let e of s){if(e.pathStr==this.cursorPosition.node.pathStr)return void this.stopDrag();if(this.checkNodeIsParent(e,this.cursorPosition.node))return void this.stopDrag()}const o=this.copy(this.currentValue),i=[];for(let e of s){const t=this.getNodeSiblings(o,e.path)[e.ind];i.push(this.copy(t)),t._markToDelete=!0}const r=this.cursorPosition.node,n=this.getNodeSiblings(o,r.path),l=n[r.ind];if("inside"===this.cursorPosition.placement)l.children=l.children||[],l.children.unshift(...i);else{const e="before"===this.cursorPosition.placement?r.ind:r.ind+1;n.splice(e,0,...i)}this.traverseModels((e,t,s)=>{e._markToDelete&&t.splice(s,1)},o),this.lastSelectedNode=null,this.emitInput(o),this.emitDrop(s,this.cursorPosition,e),this.stopDrag()},onToggleHandler(e,t){this.updateNode(t.path,{isExpanded:!t.isExpanded}),this.emitToggle(t,e),e.stopPropagation()},stopDrag(){this.isDragging=!1,this.mouseIsDown=!1,this.setCursorPosition(null),this.stopScroll()},getParent(){return this.$parent},getRoot(){return this.isRoot?this:this.getParent().getRoot()},getNodeSiblings(e,t){return 1===t.length?e:this.getNodeSiblings(e[t[0]].children,t.slice(1))},updateNode(e,t){if(!this.isRoot)return void this.getParent().updateNode(e,t);const s=JSON.stringify(e),o=this.copy(this.currentValue);this.traverse((e,o)=>{e.pathStr===s&&Object.assign(o,t)},o),this.emitInput(o)},getSelected(){const e=[];return this.traverse(t=>{t.isSelected&&e.push(t)}),e},getDraggable(){const e=[];return this.traverse(t=>{t.isSelected&&t.isDraggable&&e.push(t)}),e},traverse(e,t=null,s=[]){t||(t=this.currentValue);let o=!1;const i=[];for(let r=0;r<t.length;r++){const n=t[r],l=s.concat(r),a=this.getNode(l,n,t);if(o=!1===e(a,n,t),i.push(a),o)break;if(n.children&&(o=!1===this.traverse(e,n.children,l)))break}return!o&&i},traverseModels(e,t){let s=t.length;for(;s--;){const o=t[s];o.children&&this.traverseModels(e,o.children),e(o,t,s)}return t},remove(e){const t=e.map(e=>JSON.stringify(e)),s=this.copy(this.currentValue);this.traverse((e,s,o)=>{for(const o of t)e.pathStr===o&&(s._markToDelete=!0)},s),this.traverseModels((e,t,s)=>{e._markToDelete&&t.splice(s,1)},s),this.emitInput(s)},checkNodeIsParent(e,t){const s=t.path;return JSON.stringify(s.slice(0,e.path.length))==e.pathStr},copy:e=>JSON.parse(JSON.stringify(e))}},i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"sl-vue-tree",class:{"sl-vue-tree-root":e.isRoot},on:{mousemove:e.onMousemoveHandler,mouseleave:e.onMouseleaveHandler,dragend:function(t){e.onDragendHandler(null,t)}}},[s("div",{ref:"nodes",staticClass:"sl-vue-tree-nodes-list"},[e._l(e.nodes,function(t,o){return s("div",{staticClass:"sl-vue-tree-node",class:{"sl-vue-tree-selected":t.isSelected}},[s("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_before",style:{visibility:e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr&&"before"===e.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(e){e.preventDefault()}}}),e._v(" "),s("div",{staticClass:"sl-vue-tree-node-item",class:{"sl-vue-tree-cursor-hover":e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr,"sl-vue-tree-cursor-inside":e.cursorPosition&&"inside"===e.cursorPosition.placement&&e.cursorPosition.node.pathStr===t.pathStr,"sl-vue-tree-node-is-leaf":t.isLeaf,"sl-vue-tree-node-is-folder":!t.isLeaf},attrs:{path:t.pathStr},on:{mousedown:function(s){e.onNodeMousedownHandler(s,t)},mouseup:function(s){e.onNodeMouseupHandler(s,t)},contextmenu:function(s){e.emitNodeContextmenu(t,s)},dblclick:function(s){e.emitNodeDblclick(t,s)},click:function(s){e.emitNodeClick(t,s)},dragover:function(s){e.onExternalDragoverHandler(t,s)},drop:function(s){e.onExternalDropHandler(t,s)}}},[e._l(e.gaps,function(e){return s("div",{staticClass:"sl-vue-tree-gap"})}),e._v(" "),e.level&&e.showBranches?s("div",{staticClass:"sl-vue-tree-branch"},[e._t("branch",[t.isLastChild?e._e():s("span",[e._v("\n            "+e._s(String.fromCharCode(9500))+e._s(String.fromCharCode(9472))+" \n          ")]),e._v(" "),t.isLastChild?s("span",[e._v("\n            "+e._s(String.fromCharCode(9492))+e._s(String.fromCharCode(9472))+" \n          ")]):e._e()],{node:t})],2):e._e(),e._v(" "),s("div",{staticClass:"sl-vue-tree-title"},[t.isLeaf?e._e():s("span",{staticClass:"sl-vue-tree-toggle",on:{click:function(s){e.onToggleHandler(s,t)}}},[e._t("toggle",[s("span",[e._v("\n             "+e._s(t.isLeaf?"":t.isExpanded?"-":"+")+"\n            ")])],{node:t})],2),e._v(" "),e._t("title",[e._v(e._s(t.title))],{node:t}),e._v(" "),!t.isLeaf&&0==t.children.length&&t.isExpanded?e._t("empty-node",null,{node:t}):e._e()],2),e._v(" "),s("div",{staticClass:"sl-vue-tree-sidebar"},[e._t("sidebar",null,{node:t})],2)],2),e._v(" "),t.children&&t.children.length&&t.isExpanded?s("sl-vue-tree",{attrs:{value:t.children,level:t.level,parentInd:o,allowMultiselect:e.allowMultiselect,edgeSize:e.edgeSize,showBranches:e.showBranches},on:{dragover:function(e){e.preventDefault()}},scopedSlots:e._u([{key:"title",fn:function(t){var s=t.node;return[e._t("title",[e._v(e._s(s.title))],{node:s})]}},{key:"toggle",fn:function(t){var o=t.node;return[e._t("toggle",[s("span",[e._v("\n             "+e._s(o.isLeaf?"":o.isExpanded?"-":"+")+"\n          ")])],{node:o})]}},{key:"sidebar",fn:function(t){var s=t.node;return[e._t("sidebar",null,{node:s})]}},{key:"empty-node",fn:function(t){var s=t.node;return[!s.isLeaf&&0==s.children.length&&s.isExpanded?e._t("empty-node",null,{node:s}):e._e()]}}])}):e._e(),e._v(" "),s("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_after",style:{visibility:e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr&&"after"===e.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(e){e.preventDefault()}}})],1)}),e._v(" "),e.isRoot?s("div",{directives:[{name:"show",rawName:"v-show",value:e.isDragging,expression:"isDragging"}],ref:"dragInfo",staticClass:"sl-vue-tree-drag-info"},[e._t("draginfo",[e._v("\n        Items: "+e._s(e.selectionSize)+"\n      ")])],2):e._e()],2)])};i._withStripped=!0;var r=function(e,t,s,o,i,r,n,l){var a=typeof(e=e||{}).default;"object"!==a&&"function"!==a||(e=e.default);var u,d="function"==typeof e?e.options:e;if(t&&(d.render=t,d.staticRenderFns=s,d._compiled=!0),o&&(d.functional=!0),r&&(d._scopeId=r),n?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(n)},d._ssrRegister=u):i&&(u=l?function(){i.call(this,this.$root.$options.shadowRoot)}:i),u)if(d.functional){d._injectStyles=u;var c=d.render;d.render=function(e,t){return u.call(t),c(e,t)}}else{var h=d.beforeCreate;d.beforeCreate=h?[].concat(h,u):[u]}return{exports:e,options:d}}(o,i,[],!1,null,null,null);r.options.__file="src/sl-vue-tree.vue";t.default=r.exports}]).default});
//# sourceMappingURL=sl-vue-tree.js.map