'use strict'

class ParticipationEmployees {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   render () {
      let path = "/app?employee=True";
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
      let entries = document.getElementsByClassName("entry");
      for (let entry of entries) {
         entry.addEventListener("click", this.handleSelectEvent);
      }
      let buttons = document.getElementsByClassName("pseudo-button");
      for (let button of buttons) {
         button.addEventListener("click", this.handleDetailEvent);
      }
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

   handleDetailEvent(event) {
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
         APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, id_of_selected_entry]);
      }
   }
}