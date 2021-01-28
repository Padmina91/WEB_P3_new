'use strict'

class ParticipationTrainingsView {
    constructor(element, template) {
        this.element = element;
        this.template = template;
        this.configHandleEvent();
    }

    render () {
        this.do_render();
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