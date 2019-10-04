(window.webpackJsonpdoi_react_app=window.webpackJsonpdoi_react_app||[]).push([[0],{198:function(e,t,n){e.exports=n(390)},203:function(e,t,n){},204:function(e,t,n){},215:function(e,t){},217:function(e,t){},254:function(e,t){},255:function(e,t){},390:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),o=n(54),l=n.n(o),r=(n(203),n(41)),i=n(3),u=(n(204),n(414)),s=n(418),d=function(e){var t,n=e.addContact;return c.a.createElement("div",null,c.a.createElement("input",{onKeyPress:function(e){"Enter"===e.key&&(n(t.value),t.value="")},ref:function(e){t=e}}),c.a.createElement("button",{onClick:function(){n(t.value),t.value=""}}," + "))},m=function(e){var t=e.contact,n=e.remove;return c.a.createElement("li",{onClick:function(){n(t.id)}},t.email,c.a.createElement("input",{readOnly:!0,type:"checkbox",checked:t.confirmed}))},f=function(e){var t=e.contacts,n=e.remove,a=t.map((function(e){return c.a.createElement(m,{contact:e,key:e.ID,remove:n})}));return c.a.createElement("ul",null,a)},b=n(67),p=n.n(b),v=n(12),E=n(128),g=n(98),y=function(){var e=new p.a("doiworks",localStorage);!e.isNew()&&e.tableExists("contacts")||(e.createTable("contacts",["email","confirmed"]),e.insert("contacts",{email:"nico@le-space.de",confirmed:!0}),e.commit());var t={data:e.queryAll("contacts",{})};return c.a.createElement("div",null," ",c.a.createElement("h1",null,"Doi Contacts"),c.a.createElement(d,{addContact:function(t){console.log("adding contacgt");var n=e.queryAll("wallets")[0],a=n.privateKey,c=Number(v.a.constants.VALIDATOR_FEE.btc)+Number(v.a.constants.NETWORK_FEE.btc)+Number(v.a.constants.TRANSACTION_FEE.btc),o="alice-montevideo-230920191250@le-space.de",l=t,r=l.split("@"),i=r[r.length-1];Object(E.a)(i).then((function(e){console.log("validatorPublicKeyData",e.key);var t=v.a.PublicKey(e.key),r=v.a.getAddressOfPublicKey(t).toString();v.a.createDoichainEntry(a,t.toString(),o,l).then((function(i){console.log("entry",i);var u=v.a.getAddressOfPublicKey(n.publicKey).toString(),s=u;v.a.getUTXOAndBalance(u,c).then((function(u){if(u.utxos.length>0){console.log("using utxos for ".concat(c," DOI"),u);var d=v.a.createRawDoichainTX(i.nameId,i.nameValue,r,s,a,u,v.a.constants.NETWORK_FEE.btc,v.a.constants.VALIDATOR_FEE.btc),m={recipient:l,content:"Dear Irina, please give me permission to write you an email.\n${confirmation_url}\n Yours\nNico",redirect:"http://www.le-space.de",subject:"hi Irina",contentType:"text/plain",returnPath:"office@le-space.de"};"default"!==e.type&&"delegated"!==e.type||(m.verifyLocalHash=Object(g.a)({data:o+l})),v.a.encryptMessage(n.privateKey,t.toString(),JSON.stringify(m)).then((function(e){console.log("encryptedTemplateData",e),v.a.broadcastTransaction(i.nameId,d,e,t.toString()).then((function(e){console.log("broadcasted doichain transaction to doichain node with txId",e)}))}))}else console.log("insufficient funds ")}))}))}))}}),c.a.createElement(f,{contacts:t.data,remove:function(e){console.log("not removing",e)}}))},h=n(20),w=n.n(h),O=n(10),k=n.n(O),x=n(22),j=n(131),S=n.n(j),A=function(e){var t=e.publicKey,n=Object(h.useState)(0),a=Object(r.a)(n,2),c=a[0],o=a[1],l=Object(h.useState)(!1),i=Object(r.a)(l,2),u=i[0],s=i[1];v.a.Networks.defaultNetwork=v.a.Networks.get("doichain-testnet");var d=v.a.getAddressOfPublicKey(t);return Object(h.useEffect)((function(){function e(){return(e=Object(x.a)(k.a.mark((function e(){var n,a;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v.a.getUTXOAndBalance(d.toString());case 3:n=e.sent,a=n.balanceAllUTXOs,o(a),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log("error while fetching utxos from server",t);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()})),w.a.createElement("li",{style:{fontSize:"9px"},onClick:function(){s(!u)}},"DoiCoin-Address: ",d.toString()," Balance: ",c," DOI",u?w.a.createElement("div",{style:{fontSize:"9px",border:"2px solid lightgrey"}},w.a.createElement(S.a,{value:"doicoin:addr.toString()"}),w.a.createElement("br",null),w.a.createElement("b",null,"PublicKey:",t),w.a.createElement("br",null)):null)},K=function(){var e=new p.a("doiworks",localStorage);if(e.tableExists("wallets")){var t=e.queryAll("wallets",{}).map((function(e){return c.a.createElement(A,{key:e.ID,publicKey:e.publicKey})}));return c.a.createElement("ul",null,t)}return null},I=function(){var e=Object(h.useState)({walletItemsChanged:!1}),t=Object(r.a)(e,2),n=t[0],a=t[1];return Object(h.useEffect)((function(){a(!1)}),[n]),w.a.createElement("div",null,w.a.createElement("h1",null,"DoiCoin Wallets"),w.a.createElement("button",{onClick:function(){!function(){var e=v.a.createWallet("some name"),t=v.a.getUrl()+"/api/v1/importpubkey";v.a.registerPublicKey(t,e.publicKey),a(!0)}()}},"Add Wallet "),w.a.createElement(K,null))},T=n(417),C=n(415),D=n(413),N=n(416),_=function(){function e(e){var t=e.children,n=e.value,a=e.index,o=Object(i.a)(e,["children","value","index"]);return c.a.createElement(D.a,Object.assign({component:"div",role:"tabpanel",hidden:n!==a,id:"simple-tabpanel-".concat(a),"aria-labelledby":"simple-tab-".concat(a)},o),c.a.createElement(N.a,{p:3},t))}function t(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}Object(u.a)((function(e){return{root:{flexGrow:1,backgroundColor:e.palette.background.paper}}}))();var n=c.a.useState(0),a=Object(r.a)(n,2),o=a[0],l=a[1];return c.a.createElement("div",null,c.a.createElement(s.a,{position:"static"},c.a.createElement(T.a,{value:o,onChange:function(e,t){l(t)},"aria-label":"simple tabs example"},c.a.createElement(C.a,Object.assign({label:"Contacts"},t(0))),c.a.createElement(C.a,Object.assign({label:"Wallets"},t(1))),c.a.createElement(C.a,Object.assign({label:"Settings"},t(2))))),c.a.createElement(e,{value:o,index:0},c.a.createElement(y,null)),c.a.createElement(e,{value:o,index:1},c.a.createElement(I,null)),c.a.createElement(e,{value:o,index:2},"Item Three"))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var P=function(){l.a.render(c.a.createElement(_,null),document.getElementById("root"))};"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})),window.cordova?document.addEventListener("deviceready",P,!1):P()}},[[198,1,2]]]);
//# sourceMappingURL=main.9df8d4e7.chunk.js.map