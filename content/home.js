'use strict'

class Home {
    constructor(element, template) {
        this.element = element;
        this.template = template;
    }

    render() {
        // Daten anfordern
        let path = "/app";
        let requester = new APPUTIL.Requester();
        requester.GET(path)
        .then (result => {
            console.log(result)
            this.do_render(JSON.parse(result));
        })
        .catch (error => {
           alert("fetch-error (get): " + error);
        });
    }

    do_render(data) {
        let markup = APPUTIL.template_manager.execute(this.template, data);
        let element = document.getElementById(this.element);
        if (element != null) {
           element.innerHTML = markup;
        }
    }
}