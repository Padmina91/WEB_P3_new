'use strict'

class ParticipationTrainingOngoing {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   render (id) {
      this.training_id = id
      let path = "/app?training=True&participation=True&id=" + this.training_id;
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

   configHandleEvent() {
      let back_button = document.getElementById("back");
      back_button.addEventListener("click", this.handleBackEvent.bind(this));
      let entries = document.getElementsByClassName("entry");
      for (let entry of entries) {
         entry.addEventListener("click", this.handleSelectEvent);
      }
      let drop_out_button = document.getElementById("drop_out");
      if (drop_out_button != null) {
         drop_out_button.addEventListener("click", this.handleDropOutEvent.bind(this))
      }
   }

   handleBackEvent(event) {
      APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.training_id]);
   }

   handleSelectEvent(event) {
      let allClasses = this.classList;
      let id_of_entry = "id-0";
      for (let singleClass of allClasses) {
         if (singleClass.startsWith("id")) {
            id_of_entry = singleClass;
            break;
         }
      }
      let all_entries = document.getElementsByClassName("entry");
      for (let one_entry of all_entries) {
         if (one_entry.classList.contains("selected")) {
            one_entry.classList.remove("selected");
         }
      }
      let all_cells_of_selected_id = document.getElementsByClassName(id_of_entry);
      for (let single_cell of all_cells_of_selected_id) {
         single_cell.classList.add("selected");
      }
   }

   handleDropOutEvent(event) {
      let selected_entry = document.getElementsByClassName("selected");
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
         this.dropOut(event, id_of_selected_entry);
      }
   }

   dropOut(event, id_employee) {
      let path = "/app?drop_out=True&id_training=" + this.training_id + "&id_employee=" + id_employee;
      let requester = new APPUTIL.Requester();
      requester.PUT(path)
      .then (result => {
         APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.training_id]);
      })
      .catch (error => {
         alert("fetch-error (get): " + error);
      });
   }
}