'use strict'

class ParticipationTrainings {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   render () {
      let path = "/app?training=True&participation=True";
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
      let detail_onoing_button = document.getElementById("detail-ongoing");
      if (detail_onoing_button != null) {
         detail_onoing_button.addEventListener("click", this.handleDetailEvent1.bind(this));
      }
      let detail_finished_button = document.getElementById("detail-finished");
      if (detail_finished_button != null) {
         detail_finished_button.addEventListener("click", this.handleDetailEvent2.bind(this));
      }
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

   handleDetailEvent1(event) {
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
         APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, id_of_selected_entry]);
      }
   }

   handleDetailEvent2(event) {
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
         APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, id_of_selected_entry]);
      }
   }
}