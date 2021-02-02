'use strict'

class FormTraining {
    constructor(element, template) {
        this.element = element;
        this.template = template;
    }

    render(id_training = null) {
        this.training_id = id_training;
        let path = "/app?training=True&form=True"
        if (id_training != null) {
            path = path + "&id=" + this.training_id;
        }
        let requester = new APPUTIL.Requester();
        requester.GET(path)
        .then (result => {
            this.do_render(JSON.parse(result));
            this.configHandleEvent();
        })
        .catch (error => {
           alert("fetch-error (get) in der form_training.js in render(): " + error);
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
        let entries = document.getElementsByClassName("entry");
        for (let entry of entries) {
            entry.addEventListener("click", this.handleSelectEvent);
        }
        let edit_button = document.getElementById("edit-qualification");
        if (edit_button != null) {
            edit_button.addEventListener("click", this.handleEditEvent.bind(this));
        }
        let add_button = document.getElementById("add-qualification");
        if (add_button != null) {
            add_button.addEventListener("click", this.handleAddEvent.bind(this));
        }
        let delete_buttons = document.getElementsByClassName("delete-button");
        for (let delete_button of delete_buttons) {
            delete_button.addEventListener("click", this.handleDeleteEvent.bind(this))
        }
        let cancel_button = document.getElementById("cancel-button");
        cancel_button.addEventListener("click", this.handleCancelEvent);
        let form_element = document.getElementById("form");
        form_element.addEventListener("submit", event => {
            event.preventDefault();
            let formData = new FormData(form_element);
            // Prüfen, ob bis-Datum nach von-Datum liegt:
            let von = formData.get("von");
            let bis = formData.get("bis");
            let maxTeiln = parseInt(formData.get("maxTeiln"));
            let minTeiln = parseInt(formData.get("minTeiln"));
            if (von >= bis) {
                alert("Bitte das End-Datum nach das Beginn-Datum legen.");
            } else if (minTeiln > maxTeiln) {
                alert("Die maximale Teilnehmeranzahl darf nicht kleiner als die minimale Teilnehmeranzahl sein.");
            } else {
                if (formData.get("id_param") == "") {
                    this.saveNewData(formData);
                } else {
                    this.saveOldData(formData);
                }
            }
        });
    }

    handleSelectEvent(event) {
        let allClasses = this.classList;
        let index_of_entry = "index-0";
        for (let singleClass of allClasses) {
            if (singleClass.startsWith("index")) {
                index_of_entry = singleClass;
                break;
            }
        }
        let all_entries = document.getElementsByClassName("entry");
        for (let one_entry of all_entries) {
            if (one_entry.classList.contains("selected")) {
                one_entry.classList.remove("selected");
            }
        }
        let all_cells_of_selected_index = document.getElementsByClassName(index_of_entry);
        for (let single_cell of all_cells_of_selected_index) {
            single_cell.classList.add("selected");
        }
    }

    handleEditEvent(event) {
        let selected_entry = document.getElementsByClassName("selected");
        if (selected_entry.length == 0) {
            alert("Bitte zuerst einen Eintrag auswählen!");
        } else {
            let all_classes_of_selected_entry = selected_entry[0].classList;
            let index_of_selected_entry = "index-0";
            for (let singleClass of all_classes_of_selected_entry) {
                if (singleClass.startsWith("index-")) {
                    index_of_selected_entry = singleClass.substr(6);
                    break;
                }
            }
            APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, [this.training_id, index_of_selected_entry]]);
        }
    }

    handleAddEvent(event) {
        APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, [this.training_id, null]]);
    }

    handleCancelEvent(event) {
        APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, null]);
    }

    handleDeleteEvent(event) {
        let selected_entry = document.getElementsByClassName("selected");
        if (selected_entry.length == 0) {
            alert("Bitte zuerst einen Eintrag auswählen!");
        } else {
            let delete_decision = confirm("Wollen Sie diesen Eintrag wirklich löschen?");
            if (delete_decision) {
                let all_classes_of_selected_entry = selected_entry[0].classList;
                let index_of_selected_entry = "index-0";
                for (let singleClass of all_classes_of_selected_entry) {
                    if (singleClass.startsWith("index-")) {
                        index_of_selected_entry = singleClass.substr(6);
                        break;
                    }
                }
                let path = "/app?id_training=" + this.training_id + "&index_qualification=" + index_of_selected_entry;
                let requester = new APPUTIL.Requester();
                requester.DELETE(path)
                .then (result => {
                    APPUTIL.event_service.publish("app.cmd", [event.target.dataset.href, this.training_id]);
                })
                .catch (error => {
                    alert("fetch-error (get): " + error);
                });
            }
        }
    }

    saveNewData(formData) {
        let path = "/app/";
        let requester = new APPUTIL.Requester();
        requester.POST(path, formData)
        .then (result => {
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
           APPUTIL.event_service.publish("app.cmd", ["list_trainings", null]);
        })
        .catch (error => {
           alert("fetch-error (get): " + error);
        });
    }
}