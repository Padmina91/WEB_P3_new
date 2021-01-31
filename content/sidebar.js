'use strict'

class Sidebar {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   do_render() {
      let markup = APPUTIL.template_manager.execute(this.template, null);
      let element = document.getElementById(this.element);
      if (element != null) {
         element.innerHTML = markup;
      }
      this.configHandleEvent();
   }

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