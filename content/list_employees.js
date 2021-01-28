'use strict'

class ListEmployeesView {

   constructor (element, template) {
      this.element = element;
      this.template = template;
      this.configHandleEvent();
   }

   render () {
      // Daten anfordern
      let path = "/app/None/False/True";
      let requester = new APPUTIL.Requester();
      requester.GET(path)
      .then (result => {
         console.log(result);
         this.do_render(JSON.parse(result));
         this.configHandleEvent();
      })
      .catch (error => {
         alert("fetch-error (get): ");
      });
   }

   do_render (data = null) {
      console.log("in der do_render Anfang");
      let markup = APPUTIL.template_manager.execute(this.template, data);
      console.log("in der do_render 2. Zeile");
      let element = document.getElementById(this.element);
      console.log("in der do_render 3. Zeile");
      if (element != null) {
         console.log("in der do_render im if-Block");
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
         if (!button.classList.contains("delete-button")) {
            button.addEventListener("click", this.handleClickEvent);
         } else {
            button.addEventListener("click", this.handleDeleteEvent.bind(this));
         }
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

   handleClickEvent (event) {
      console.log("handleClickEvent wird ausgeführt...");
/*    let elx = document.querySelector(".clSelected");
      if (elx == null) {
         alert("Bitte zuerst einen Eintrag auswählen!");
      } else {
         APPUTIL.event_service.publish("app.cmd", ["detail", elx.id] );
      }
      event.preventDefault();*/
   }

   handleDeleteEvent(event) {
      let selected_entry = document.getElementsByClassName("selected");
      if (selected_entry.length == 0) {
         alert("Bitte zuerst einen Eintrag auswählen!");
      } else {
         let delete_decision = confirm("Wollen Sie diesen Eintrag wirklich löschen?");
         if (delete_decision) {
            let all_classes_of_selected_entry = selected_entry[0].classList;
            let id_of_selected_entry = "id-0";
            for (let singleClass of all_classes_of_selected_entry) {
               if (singleClass.startsWith("id")) {
                  id_of_selected_entry = singleClass.substr(3);
                  break;
               }
            }
            let path = "/app/" + id_of_selected_entry;
            let requester = new APPUTIL.Requester();
            requester.DELETE(path)
            .then (result => {
               console.log(JSON.parse(result));
               this.do_render(JSON.parse(result));
               this.configHandleEvent();
            })
            .catch (error => {
               alert("fetch-error (get): " + error);
            });
         }
      }
   }
}