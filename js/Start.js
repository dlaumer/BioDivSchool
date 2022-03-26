/*
--------------
Start.js
--------------
Simple landing page before starting the main app.

*/

// ssh-add ~/.ssh/ssh_rsa_dlaumer
define([
    "dojo/dom",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",

    "biodivschool/App",
    "biodivschool/Content",
    "biodivschool/ArcGis"


], function ( 
    dom, domCtr, win, on, App, Content, ArcGis) {

    return class Start {

        constructor() {
            this.createSplashScreen();

        }

        // Start the start screen
        init(offline) {
            // Make new app 
            this.offline = offline;
            this.app = new App(this.offline, () => {
                this.createUI();
                this.clickHandler();
                this.content = new Content(that);
                this.content.init();
                if (this.offline) {
                    that.init("1", "a");
                }
            });
        }


        createSplashScreen() {

            this.background = domCtr.create("div", { id: "start", class: "background" }, win.body());
            this.container = domCtr.create("div", { id: "welcome" }, this.background);
           
            // Some info about the project
            domCtr.create("div", { id: "description1", innerHTML: "BioDivSchool Web App", style: "font-size: 4vh"}, this.container);
            this.loading = domCtr.create("div", { id: "loading", innerHTML: "Loading...", style: "font-size: 2vh"}, this.container);

        }

        // Create the GUI of the start screen
        createUI() {
            domCtr.destroy("loading");
            this.inputProjectId = domCtr.create("input", { className: "input inputField", placeholder: "Projekt ID" }, this.container);
            this.inputGroupId = domCtr.create("select", {className:"input inputField", style: "display: none"}, this.container);

            domCtr.create("option", {value:"",  disabled:true, selected:true, innerHTML: "Gruppe"}, this.inputGroupId);
            let options = [
                { key: "a", label: "Gruppe a" },
                { key: "b", label: "Gruppe b" },
                { key: "c", label: "Gruppe c" },
                { key: "d", label: "Gruppe d" },
                { key: "e", label: "Gruppe e" },
              ];
            for (const i in options) {
                domCtr.create("option", {value:options[i].key, innerHTML: options[i].label}, this.inputGroupId);
            }
            this.start = domCtr.create("div", { id: "btn_start", className: "btn1 btn_disabled", innerHTML: "Start"}, this.container);
        }

        // Handle all the interactions
        clickHandler() {

        on(this.inputProjectId, "input", function (evt) {
            this.inputGroupId.style.display = "block";
        }.bind(this));

        on(this.inputGroupId, "change", function (evt) {
            if (this.inputProjectId.value != "") {
                this.start.className = "btn1";
            } 
            else {
                this.start.className = "btn1 btn_disabled";
            }
        }.bind(this));
            
        on(this.start, "click", function (evt) {

            this.app.init(this.inputProjectId.value, this.inputGroupId.value);
        }.bind(this));

        }

    };
});