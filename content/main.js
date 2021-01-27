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
      let markup = APPUTIL.template_manager.execute_px(this.template, data);
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
         APPUTIL.event_service.publish_px("app.cmd", ["idBack", null]);
         event.preventDefault();
      }
   }
}

class ListView {

   constructor (element, template) {
      this.element = element;
      this.template = template;
      this.configHandleEvent();
   }

   render () {
      // Daten anfordern
      let path = "/app/";
      let requester_o = new APPUTIL.Requester();
      requester_o.GET(path)
      .then (result => {
            this.do_render(JSON.parse(result));
      })
      .catch (error => {
         alert("fetch-error (get)");
      });
   }

   do_render (data) {
      let markup = APPUTIL.template_manager.execute_px(this.template, data);
      let element = document.querySelector(this.element);
      if (element != null) {
         element.innerHTML = markup;
      }
   }

   configHandleEvent () {
      let element = document.querySelector(this.element);
      if (element != null) {
         element.addEventListener("click", this.handleEvent);
      }
   }

   handleEvent (event_opl) {
      if (event_opl.target.tagName.toUpperCase() == "TD") {
         let elx = document.querySelector(".clSelected");
         if (elx != null) {
            elx.classList.remove("clSelected");
         }
         event_opl.target.parentNode.classList.add("clSelected");
         event_opl.preventDefault();
      } else if (event_opl.target.id == "idShowListEntry") {
         let elx = document.querySelector(".clSelected");
         if (elx == null) {
            alert("Bitte zuerst einen Eintrag auswählen!");
         } else {
            APPUTIL.event_service.publish_px("app.cmd", ["detail", elx.id] );
         }
         event_opl.preventDefault();
      }
   }
}

class SideBar {

   constructor (element, template) {
      this.element = element;
      this.template = template;
      this.configHandleEvent();
   }

   render (data_opl) {
      let markup_s = APPUTIL.template_manager.execute_px(this.template, data_opl);
      let el_o = document.getElementById(this.element);
      if (el_o != null) {
         el_o.innerHTML = markup_s;
      }
   }

   configHandleEvent () {
      let el_o = document.getElementById(this.element);
      if (el_o != null) {
         el_o.addEventListener("click", this.handleEvent);
      }
   }

   handleEvent (event_opl) {
      let cmd_s = event_opl.target.dataset.action;
      APPUTIL.event_service.publish_px("app.cmd", [cmd_s, null]);
   }
}

class Application {

   constructor () {
      // Registrieren zum Empfang von Nachrichten
      APPUTIL.event_service.subscribe_px(this, "templates.loaded");
      APPUTIL.event_service.subscribe_px(this, "templates.failed");
      APPUTIL.event_service.subscribe_px(this, "app.cmd");
      this.sideBar_o = new SideBar("sidebar", "sidebar.tpl.html");
      this.listView_o = new ListView("index", "list.tpl.html");
      this.detailView_o = new DetailView("index", "detail.tpl.html");
   }

   notify (self, message_spl, data_opl) {
      switch (message_spl) {
      case "templates.failed":
         alert("Vorlagen konnten nicht geladen werden.");
         break;
      case "templates.loaded":
         let markup_header = APPUTIL.template_manager.execute_px("header.tpl.html", null);
         let header_element = document.getElementById("head-flex-container");
         if (header_element != null) {
            header_element.innerHTML = markup_header;
         }
         let markup_sidebar = APPUTIL.template_manager.execute_px("sidebar.tpl.html", null);
         let sidebar_element = document.getElementById("sidebar");
         if (sidebar_element != null) {
            sidebar_element.innerHTML = markup_sidebar;
         }
         let markup_body = APPUTIL.template_manager.execute_px("home.tpl.html", null);
         let body_element = document.getElementById("content");
         if (body_element != null) {
            body_element.innerHTML = markup_body;
         }
         break;
      case "app.cmd":
         // hier müsste man überprüfen, ob der Inhalt gewechselt werden darf
         switch (data_opl[0]) {
         case "home":
            let markup_s = APPUTIL.template_manager.execute_px("home.tpl.html", null);
            let el_o = document.querySelector("index");
            if (el_o != null) {
               el_o.innerHTML = markup_s;
            }
            break;
         case "list":
            // Daten anfordern und darstellen
            this.listView_o.render();
            break;
         case "detail":
            this.detailView_o.render(data_opl[1]);
            break;
         case "idBack":
            APPUTIL.event_service.publish_px("app.cmd", ["list", null]);
            break;
         }
         break;
      }
   }
}

window.onload = function () {
   APPUTIL.event_service = new APPUTIL.EventService();
   var app = new Application();
   APPUTIL.createTemplateManager_px();
}