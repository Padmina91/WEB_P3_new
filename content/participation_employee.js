'use strict'

class ParticipationEmployee {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   render (id) {
      this.employee_id = id;
      let path = "/app?participation=True&employee=True&id=" + this.employee_id;
      let requester = new APPUTIL.Requester();
      requester.GET(path)
      .then (result => {
         this.do_render(JSON.parse(result));
         this.configHandleEvent();
      })
      .catch (error => {
         alert("fetch-error (get): " + error);
      });
   }

   do_render (data = null) {
      let markup = APPUTIL.template_manager.execute(this.template, data);
      let element = document.getElementById(this.element);
      if (element != null) {
         element.innerHTML = markup;
      }
   }

   configHandleEvent () {
      let entries1 = document.getElementsByClassName("entry-1");
      for (let entry of entries1) {
         entry.addEventListener("click", this.handleSelectEvent1);
      }
      let entries2 = document.getElementsByClassName("entry-2");
      for (let entry of entries2) {
         entry.addEventListener("click", this.handleSelectEvent2);
      }
      let register_button = document.getElementById("register-button");
      if (register_button != null) {
         register_button.addEventListener("click", this.handleRegisterEvent.bind(this));
      }
      let cancel_button = document.getElementById("cancel-button");
      if (cancel_button != null) {
         cancel_button.addEventListener("click", this.handleCancelEvent.bind(this));
      }
      let back_button = document.getElementById("back-button");
      back_button.addEventListener("click", this.handleBackEvent);
   }

   handleSelectEvent1(event) {
      let allClasses = this.classList;
      let id_of_entry = "id-0";
      for (let singleClass of allClasses) {
         if (singleClass.startsWith("id")) {
            id_of_entry = singleClass;
            break;
         }
      }
      let all_entries = document.getElementsByClassName("entry-1");
      for (let one_entry of all_entries) {
         if (one_entry.classList.contains("selected-1")) {
            one_entry.classList.remove("selected-1");
         }
      }
      let all_cells_of_selected_id = document.getElementsByClassName(id_of_entry);
      for (let single_cell of all_cells_of_selected_id) {
         single_cell.classList.add("selected-1");
      }
   }

   handleSelectEvent2(event) {
      let allClasses = this.classList;
      let id_of_entry = "id-0";
      for (let singleClass of allClasses) {
         if (singleClass.startsWith("id")) {
            id_of_entry = singleClass;
            break;
         }
      }
      let all_entries = document.getElementsByClassName("entry-2");
      for (let one_entry of all_entries) {
         if (one_entry.classList.contains("selected-2")) {
            one_entry.classList.remove("selected-2");
         }
      }
      let all_cells_of_selected_id = document.getElementsByClassName(id_of_entry);
      for (let single_cell of all_cells_of_selected_id) {
         single_cell.classList.add("selected-2");
      }
   }

   handleRegisterEvent(event) {
      let selected_entry = document.getElementsByClassName("selected-1");
      if (selected_entry.length == 0) {
         alert("Bitte zuerst einen Eintrag auswählen!");
      } else {
         let all_classes_of_selected_entry = selected_entry[0].classList;
         let id_of_selected_entry = "";
         for (let singleClass of all_classes_of_selected_entry) {
            if (singleClass.startsWith("id")) {
               id_of_selected_entry = singleClass.substr(3);
               break;
            }
         }
         this.registerAndReload(event, id_of_selected_entry);
      }
   }

   handleCancelEvent(event) {
      let selected_entry = document.getElementsByClassName("selected-2");
      if (selected_entry.length == 0) {
         alert("Bitte zuerst einen Eintrag auswählen!");
      } else {
         let all_classes_of_selected_entry = selected_entry[0].classList;
         let id_of_selected_entry = "";
         for (let singleClass of all_classes_of_selected_entry) {
            if (singleClass.startsWith("id")) {
               id_of_selected_entry = singleClass.substr(3);
               break;
            }
         }
         this.cancelAndReload(event, id_of_selected_entry);
      }
   }

   handleBackEvent(event) {
      APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.employee_id]);
   }

   registerAndReload(event, training_id) {
      let path = "/app?register=True&id_training=" + training_id + "&id_employee=" + this.employee_id;
      let requester = new APPUTIL.Requester();
      requester.PUT(path)
      .then (result => {
         APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.employee_id]);
      })
      .catch (error => {
         alert("fetch-error (get): " + error);
      });
   }

   cancelAndReload(event, training_id) {
      let path = "/app?cancel=True&id_training=" + training_id + "&id_employee=" + this.employee_id;
      let requester = new APPUTIL.Requester();
      requester.PUT(path)
      .then (result => {
         APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.employee_id]);
      })
      .catch (error => {
         alert("fetch-error (get): " + error);
      });
   }
}