'use strict'

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
      this.participation_employees = new ParticipationEmployees("content", "participation_employees.html");
      this.participation_employee = new ParticipationEmployee("content", "participation_employee.html");
      this.participation_trainings = new ParticipationTrainings("content", "participation_trainings.html");
      this.participation_training_ongoing = new ParticipationTrainingOngoing("content", "participation_training_ongoing.html");
      this.participation_training_finished = new ParticipationTrainingFinished("content", "participation_training_finished.html");
      this.evaluation_employees = new EvaluationEmployees("content", "evaluation_employees.html");
      this.evaluation_trainings = new EvaluationTrainings("content", "evaluation_trainings.html");
      this.evaluation_certificates = new EvaluationCertificates("content", "evaluation_certificates.html");
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
               this.participation_employees.render();
               break;
            case "participation_employee":
               this.participation_employee.render(data[1]);
               break;
            case "participation_trainings":
               this.participation_trainings.render();
               break;
            case "participation_training_ongoing":
               this.participation_training_ongoing.render(data[1]);
               break;
            case "participation_training_finished":
               this.participation_training_finished.render(data[1]);
               break;
            case "evaluation_employees":
               this.evaluation_employees.render();
               break;
            case "evaluation_trainings":
               this.evaluation_trainings.render();
               break;
            case "evaluation_certificates":
               this.evaluation_certificates.render();
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