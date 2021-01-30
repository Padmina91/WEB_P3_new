'use strict'

class EvaluationTrainings {
   constructor(element, template) {
      this.element = element;
      this.template = template;
   }

   render () {
      // Daten anfordern
      let path = "/app?evaluation=True&training=True"
      let requester = new APPUTIL.Requester();
      requester.GET(path)
      .then (result => {
         this.do_render(JSON.parse(result));
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
}