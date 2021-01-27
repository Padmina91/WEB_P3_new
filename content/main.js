//------------------------------------------------------------------------------
// rev. 1, 18.12.2020, Bm
// rev. 0, 21.11.2018, Bm
//------------------------------------------------------------------------------
// hier zur Vereinfachung (!) die Klassen in einer Datei

'use strict'

class DetailView {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   render (id) {
      // Daten anfordern
      let path = "/app/" + id;
      let requester = new APPUTIL.Requester();
      requester.GET(path)
      .then (result => {
            this.do_render(JSON.parse(result));
      })
      .catch (error => {
         alert("fetch-error (get)");
      });
   }

   do_render (data) {
      let markup = APPUTIL.template_manager.execute(this.template, data);
      let element = document.querySelector(this.element);
      if (element != null) {
         element.innerHTML = markup;
         this.configHandleEvent();
      }
   }

   configHandleEvent () {
      let element = document.querySelector("form");
      if (element != null) {
         element.addEventListener("click", this.handleEvent);
      }
   }

   handleEvent (event) {
      if (event.target.id == "idBack") {
         APPUTIL.event_service.publish("app.cmd", ["idBack", null]);
         event.preventDefault();
      }
   }
}

class ListEmployeesView {

   constructor (element, template) {
      this.element = element;
      this.template = template;
      this.configHandleEvent();
   }

   render () {
      // Daten anfordern
      this.do_render();
      /*let path = "/app/";
      let requester_o = new APPUTIL.Requester();
      requester_o.GET(path)
      .then (result => {
            this.do_render(JSON.parse(result));
      })
      .catch (error => {
         alert("fetch-error (get)");
      });*/
   }

   do_render (data = null) {
      let markup = APPUTIL.template_manager.execute(this.template, data);
      let element = document.getElementById(this.element);
      if (element != null) {
         element.innerHTML = markup;
      }
   }

   configHandleEvent () {
      let element = document.getElementById(this.element);
      if (element != null) {
         element.addEventListener("click", this.handleEvent);
      }
   }

   handleEvent (event) {
      if (event.target.tagName.toUpperCase() == "TD") {
         let elx = document.querySelector(".clSelected");
         if (elx != null) {
            elx.classList.remove("clSelected");
         }
         event.target.parentNode.classList.add("clSelected");
         event.preventDefault();
      } else if (event.target.id == "idShowListEntry") {
         let elx = document.querySelector(".clSelected");
         if (elx == null) {
            alert("Bitte zuerst einen Eintrag auswählen!");
         } else {
            APPUTIL.event_service.publish("app.cmd", ["detail", elx.id] );
         }
         event.preventDefault();
      }
   }
}

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

class Application {

   constructor () {
      APPUTIL.event_service.subscribe(this, "templates.loaded");
      APPUTIL.event_service.subscribe(this, "templates.failed");
      APPUTIL.event_service.subscribe(this, "app.cmd");
      this.sidebar = new Sidebar();
      this.list_employee_view = new ListEmployeesView("content", "list_employees.html");
      this.detail_view = new DetailView("content", "detail.html");
   }

   fill_inner_html(tpl_name, html_id) {
      let markup = APPUTIL.template_manager.execute(tpl_name, null);
      let element = document.getElementById(html_id);
      if (element != null) {
         element.innerHTML = markup;
      }
   }

   notify (self, message, data) {
      switch (message) {
      case "templates.failed":
         alert("Vorlagen konnten nicht geladen werden.");
         break;
      case "templates.loaded":
         this.fill_inner_html("header.html", "head-flex-container");
         this.fill_inner_html("sidebar.html", "sidebar");
         this.sidebar.configHandleEvent();
         this.fill_inner_html("home.html", "content");
         break;
      case "app.cmd":
         switch (data[0]) {
            case "home":
               this.fill_inner_html("home.html", "content");
               break;
            case "list_employees":
               this.list_employee_view.render();
               break;
            case "list_trainings":
               // TODO: Hier weitermachen.
               break;
            case "participation_employees":

               break;
            case "participation_trainings":

               break;
            case "evaluation_employees":

               break;
            case "evaluation_trainings":

               break;
            case "evaluation_certificates":

               break;
            case "detail":
               this.detail_view.render(data[1]);
               break;
            case "idBack":
               APPUTIL.event_service.publish("app.cmd", ["list", null]);
               break;
         }
         break;
      }
   }
}

window.onload = function () {
   APPUTIL.event_service = new APPUTIL.EventService();
   var app = new Application();
   APPUTIL.createTemplateManager();
}