'use strict'

class Sidebar {

    constructor () {}
 
    configHandleEvent () {
       const links = document.getElementsByClassName("sidebar-link");
       for (let link of links) {
          link.addEventListener('click', this.handleEvent);
       }
    }
 
    handleEvent (event) {
       APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, null]); // zweites Argument ist optional, zusätzliche Info, z.B. ID
       event.preventDefault();
    }
 }