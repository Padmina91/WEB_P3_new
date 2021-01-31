'use strict'

class ParticipationTrainingOngoing {

   constructor (element, template) {
      this.element = element;
      this.template = template;
   }

   render (id) {
      this.training_id = id
      // Daten anfordern
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
      console.log("configHandleEvent läuft...");
   }
}