// ==UserScript==
// @name IG Helper
// @version 1.2
// @description Provides scripting functionality to instagram.com
// @author chosen

// @match https://www.instagram.com*
// @match https://www.instagram.com/*


// @run-at document-start

// ==/UserScript==

_window = unsafeWindow;
// _window = window;

hijack = () => {
    /*
        this code is running at document-start, ideally before
        *any* of instagram's code is run.

        before any javascript files are loaded, a <script> tag is
        executed that defines logic for requiring and defining
        modules.

        the end result is that the window object contains two functions:
            __d(f, i, d) defines a module with a factory function f, an id i, and dependencies d
            __r(i) requires (and initializes, if necessary) the module with id i

        since these ids are susceptible to change, it is not feasible to hard code
        the id of the module that implements direct message functionality.
        the problem gets worse if we want functionality from yet other modules.

        the id's are also not named in a consistent, predictable way.

        to get access to all of them, we define __d *before* instagram defines it
        with a custom setter and getter.

        the set function should be used only once, when instagram defines it, and it
        serves the purpose of saving the correct functionality of __d under a different name

        the get function then returns a wrapper around the "real" __d that simply passes
        its arguments through unchanged, but stores the id used to define the module before
        it does so.

        at the end, all the modules are defined, and the ids of all of them are accessible
        in the all_ids object.

    */
    _window.__all_ids = [];
    _window.__all_calls = [];
    Object.defineProperty(_window, '__d', {
        set: f => _window.__dd = f,
        get: () => (...args) => {
            _window.__all_ids.push(args[1]);
            _window.__all_calls.push(args);
            return _window.__dd(...args);
        }
    });
}

init = () => {
    // everything below runs after
    // DOMContentLoaded

    // --------- HELPER FUNCTIONS ---------

    // find the ids of modules matching the key tp
    getMMId = (tp) => {
        // refer to hijack() to see where __all_ids comes from
        return _window.__all_ids.filter(i => {
            var m = _window.__r(i);
            return m && (m == tp || m.hasOwnProperty(tp));
        })
    }

    // generate random string of digits
    grandom = n => Array(n).fill(null).map(c => Math.floor(Math.random()*10)).join("");

    // send a direct message s to thread t
    sdm = (t, s) => DM_module.sendTextMessage(`${t}`, `${s}`, grandom(15));

    // get thread id from window location
    gtid = () => _window.location.toString().split('/t/')[1];

    // schedule a message s in thread t to run in d milliseconds
    schedule = (d, t, s) => setTimeout(sdm, d, t, s);

    // send a message s n times to thread t 
    spam = (n,t,s) => Array(n).fill(null).forEach(() => sdm(t,s));

    // --------- MODULE DEFINITIONS ---------

    // used for
    //  * sendTextMessage()
    const DM_module = _window.__r(getMMId("sendTextMessage")[0]);

    console.log("IG Helper running");
}

hijack();
document.addEventListener("DOMContentLoaded", init);
