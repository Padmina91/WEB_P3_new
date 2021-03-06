'use strict'

class ShowTraining {
    constructor(element, template) {
        this.element = element;
        this.template = template;
    }

    render(id) {
        let path = "/app?training=True&id=" + id;
        let requester = new APPUTIL.Requester();
        requester.GET(path)
        .then (result => {
           this.do_render(JSON.parse(result));
        })
        .catch (error => {
           alert("fetch-error (get): ");
        });
    }

    do_render (data = null) {
        let markup = APPUTIL.template_manager.execute(this.template, data);
        let element = document.getElementById(this.element);
        if (element != null) {
           element.innerHTML = markup;
           this.configHandleEvent();
        }
     }

    configHandleEvent() {
        let buttons = document.getElementsByClassName("pseudo-button");
        for (let button of buttons) {
            button.addEventListener("click", this.handleReturnEvent)
        }
    }

    handleReturnEvent(event) {
        APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, null]);
    }
}