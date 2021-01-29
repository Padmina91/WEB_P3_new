'use strict'

class FormTraining {
    constructor(element, template) {
        this.element = element;
        this.template = template;
    }

    render(id = null) {
        // Daten anfordern
        let path = "/app?training=True&form=True"
        if (id != null) {
            path = path + "&id=" + id;
        }
        let requester = new APPUTIL.Requester();
        requester.GET(path)
        .then (result => {
           console.log(result);
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
           this.configHandleEvent();
        }
     }

    configHandleEvent() {
        console.log("configHandleEvent läuft...");
        let cancel_button = document.getElementById("cancel-button");
        cancel_button.addEventListener("click", this.handleCancelEvent);
        let form_element = document.getElementById("form");
        form_element.addEventListener("submit", event => {
            console.log("Submit...");
            event.preventDefault();
            let formData = new FormData(form_element);
            for (let key of formData.keys()) {
                console.log(key);
                console.log(formData.get(key));
            }
            if (formData.get("id_param") == "") {
                this.saveNewData(formData);
            } else {
                this.saveOldData(formData);
            }
        });
    }

    handleCancelEvent(event) {
        APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, null]);
        event.preventDefault();
    }

    saveNewData(formData) {
        let path = "/app/";
        let requester = new APPUTIL.Requester();
        requester.POST(path, formData)
        .then (result => {
           console.log(result);
           APPUTIL.event_service.publish("app.cmd", ["list_trainings", null]);
        })
        .catch (error => {
           alert("fetch-error (get): " + error);
        });
    }

    saveOldData(formData) {
        let path = "/app/";
        let requester = new APPUTIL.Requester();
        requester.PUT(path, formData)
        .then (result => {
           console.log(result);
           APPUTIL.event_service.publish("app.cmd", ["list_trainings", null]);
        })
        .catch (error => {
           alert("fetch-error (get): " + error);
        });
    }
}