!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";function o(e){var t=document.querySelector("#tbody");t.innerHTML="",e.forEach((function(e){var n=document.createElement("tr");n.innerHTML="\n        <td>".concat(e.name,"</td>\n        <td>").concat(e.value,"</td>\n      "),t.appendChild(n)}))}function r(e){var t=e.reduce((function(e,t){return e+parseInt(t.value)}),0);document.querySelector("#total").textContent=t}n.r(t),n.d(t,"populateTable",(function(){return o})),n.d(t,"populateTotal",(function(){return r}))},function(e,t,n){"use strict";var o;function r(e){var t=e.slice().reverse(),n=0,r=t.map((function(e){var t=new Date(e.date);return"".concat(t.getMonth()+1,"/").concat(t.getDate(),"/").concat(t.getFullYear())})),a=t.map((function(e){return n+=parseInt(e.value)}));o&&o.destroy();var c=document.getElementById("myChart").getContext("2d");o=new Chart(c,{type:"line",data:{labels:r,datasets:[{label:"Total Over Time",fill:!0,backgroundColor:"#6666ff",data:a}]}})}n.r(t),n.d(t,"populateChart",(function(){return r}))},function(e,t,n){"use strict";var o;n.r(t),n.d(t,"saveRecord",(function(){return c}));var r=indexedDB.open("budget",21);function a(){console.log("Check database invoked");var e=o.transaction(["transactions"],"readwrite"),t=e.objectStore("transactions").getAll();t.onsuccess=function(){t.result.length>0&&fetch("/api/transaction/bulk",{method:"POST",body:JSON.stringify(t.result),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(t){0!==t.length&&((e=o.transaction(["transactions"],"readwrite")).objectStore("transactions").clear(),console.log("Clearing store..."))}))}}r.onupgradeneeded=function(e){console.log("Upgrade needed in local database");var t=e.oldVersion,n=e.newVersion||o.version;console.log("DB Updated from version ".concat(t," to ").concat(n)),0===(o=e.target.result).objectStoreNames.length&&o.createObjectStore("transactions",{autoIncrement:!0})},r.onerror=function(e){console.log("Error: ".concat(e.target.errorCode))},r.onsuccess=function(e){console.log("Success"),o=e.target.result,navigator.onLine&&(console.log("Backend online!"),a())};var c=function(e){console.log("Save record invoked"),o.transaction(["transactions"],"readwrite").objectStore("transactions").add(e)};window.addEventListener("online",a)},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n(1),a=n(2),c=[];function u(e){var t=document.querySelector("#t-name"),n=document.querySelector("#t-amount"),u=document.querySelector(".form .error");if(""!==t.value&&""!==n.value){u.textContent="";var i={name:t.value,value:n.value,date:(new Date).toISOString()};e||(i.value*=-1),c.unshift(i),Object(r.populateChart)(c),Object(o.populateTable)(c),Object(o.populateTotal)(c),fetch("/api/transaction",{method:"POST",body:JSON.stringify(i),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){e.errors?u.textContent="Missing Information":(t.value="",n.value="")})).catch((function(){Object(a.saveRecord)(i),t.value="",n.value=""}))}else u.textContent="Missing Information"}fetch("/api/transaction").then((function(e){return e.json()})).then((function(e){c=e,Object(o.populateTotal)(c),Object(o.populateTable)(c),Object(r.populateChart)(c)})),document.querySelector("#add-btn").onclick=function(){u(!0)},document.querySelector("#sub-btn").onclick=function(){u(!1)}}]);