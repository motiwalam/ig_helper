// ==UserScript==
// @name IG Helper
// @version 1.0.0
// @description Provides scripting functionality to instagram.com
// @author chosen

// @match https://www.instagram.com*
// @match https://www.instagram.com/*


// ==/UserScript==

// magic module that contains definition of sendTextMessage
// is required in sdm
const MM = window.__r(13435555);

// generate random string of digits
grandom = n => Array(n).fill(null).map(c => Math.floor(Math.random()*10)).join("");

// send a direct message s to thread t
sdm = (t, s) => MM.sendTextMessage(`${t}`, `${s}`, grandom(15));

// get thread id from window location
gtid = () => window.location.toString().split('/t/')[1];

// schedule a message s in thread t to run in d milliseconds
schedule = (d, t, s) => setTimeout(sdm, d, t, s);
