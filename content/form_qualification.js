'use strict'

class FormQualification {
    constructor(element, template) {
        this.element = element;
        this.template = template;
    }

    render(data) {
        this.id_training = data[0];
        this.index_qualification = data [1];
        let path = "/app?form=True&id=" + this.id_training;
        if (this.index_qualification != null) {
            path = path + "&index_qualification=" + this.index_qualification;
        }
        let requester = new APPUTIL.Requester();
        requester.GET(path)
        .then (result => {
            this.do_render(JSON.parse(result));
            this.configHandleEvent();
        })
        .catch (error => {
           alert("fetch-error (get) in der form_qualification.js: " + error);
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
        let cancel_button = document.getElementById("cancel-button");
        cancel_button.addEventListener("click", this.handleCancelEvent.bind(this));
        let form_element = document.getElementById("form");
        form_element.addEventListener("submit", event => {
            event.preventDefault();
            let formData = new FormData(form_element);
            for (let key of formData.keys()) {
            }
            if (formData.get("id_param") == "") {
                this.saveNewData(formData);
            } else {
                this.saveOldData(formData);
            }
        });
    }

    handleCancelEvent(event) {
        APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.id_training]);
        event.preventDefault();
    }

    saveNewData(formData) {
        let path = "/app/";
        let requester = new APPUTIL.Requester();
        requester.POST(path, formData)
        .then (result => {
           APPUTIL.event_service.publish("app.cmd", ["edit_training", this.id_training]);
        })
        .catch (error => {
           alert("fetch-error (get) in saveNewData: " + error);
        });
    }

    saveOldData(formData) {
        let path = "/app/";
        let requester = new APPUTIL.Requester();
        requester.PUT(path, formData)
        .then (result => {
           APPUTIL.event_service.publish("app.cmd", ["edit_training", this.id_training]);
        })
        .catch (error => {
           alert("fetch-error (get) in saveOldData: " + error);
        });
    }

}