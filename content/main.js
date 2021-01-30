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

class Application {

   constructor () {
      APPUTIL.event_service.subscribe(this, "templates.loaded");
      APPUTIL.event_service.subscribe(this, "templates.failed");
      APPUTIL.event_service.subscribe(this, "app.cmd");
      this.sidebar = new Sidebar("sidebar", "sidebar.html");
      this.home = new Home("content", "home.html");
      this.list_employee_view = new ListEmployeesView("content", "list_employees.html");
      this.list_training_view = new ListTrainingsView("content", "list_trainings.html");
      this.form_employee = new FormEmployee("content", "form_employee.html");
      this.form_training = new FormTraining("content", "form_training.html");
      this.show_employee = new ShowEmployee("content", "show_employee.html");
      this.show_training = new ShowTraining("content", "show_training.html");
      this.form_qualification = new FormQualification("content", "form_qualification.html")
      this.participation_employees_view = new ParticipationEmployeesView("content", "participation_employees.html");
      this.participation_trainings_view = new ParticipationTrainingsView("content", "participation_trainings.html");
      this.evaluation_employees_view = new EvaluationEmployeesView("content", "evaluation_employees.html");
      this.evaluation_trainings_view = new EvaluationTrainingsView("content", "evaluation_trainings.html");
      this.evaluation_certificates_view = new EvaluationCertificatesView("content", "evaluation_certificates.html");
      this.detail_view = new DetailView("content", "detail.html");
   }

   do_render(tpl_name, html_id) {
      let markup = APPUTIL.template_manager.execute(tpl_name, null);
      let element = document.getElementById(html_id);
      if (element != null) {
         element.innerHTML = markup;
      }
   }

   notify(self, message, data) {
      switch (message) {
      case "templates.failed":
         alert("Vorlagen konnten nicht geladen werden.");
         break;
      case "templates.loaded":
         this.do_render("header.html", "head-flex-container");
         this.sidebar.do_render();
         this.home.render();
         break;
      case "app.cmd":
         switch (data[0]) {
            case "home":
               this.home.render();
               break;
            case "list_employees":
               this.list_employee_view.render();
               break;
            case "list_trainings":
               this.list_training_view.render();
               break;
            case "edit_employee":
               this.form_employee.render(data[1]);
               break;
            case "add_employee":
               this.form_employee.render();
               break;
            case "show_employee":
               this.show_employee.render(data[1]);
               break;
            case "edit_training":
               this.form_training.render(data[1]);
               break;
            case "add_training":
               this.form_training.render();
               break;
            case "show_training":
               this.show_training.render(data[1]);
               break;
            case "edit_qualification":
               this.form_qualification.render(data[1]);
               break;
            case "add_qualification":
               this.form_qualification.render(data[1]);
               break;
            case "participation_employees":
               this.participation_employees_view.render();
               break;
            case "participation_trainings":
               this.participation_trainings_view.render();
               break;
            case "evaluation_employees":
               this.evaluation_employees_view.render();
               break;
            case "evaluation_trainings":
               this.evaluation_trainings_view.render();
               break;
            case "evaluation_certificates":
               this.evaluation_certificates_view.render();
               break;
            case "detail": // noch zu entfernen
               this.detail_view.render(data[1]); // in data[1] kann die ID drin stehen, wenn ich sie dort rein schreibe
               break;
            case "idBack": // was ist das??
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