// ssh-add ~/.ssh/ssh_rsa_dlaumer
define([
    "esri/core/Accessor",
    "dojo/dom",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",

    "biodivschool/App"


], function (
    Accessor, 
    dom, domCtr, win, on, App) {

    return class Start {

        constructor() {
           // Make new app 
            this.app = new App();

        }

        // Start the start screen
        init() {
            this.createUI();
            this.clickHandler();
            this.createApp();

        }

        // Create the GUI of the start screen
        createUI() {

            var background = domCtr.create("div", { id: "start", class: "background" }, win.body());
            var container = domCtr.create("div", { id: "welcome" }, background);
           
            // Some info about the project
            domCtr.create("div", { id: "description1", innerHTML: "BioDivSchool Web App", style: "font-size: 30pt"}, container);

            this.start = domCtr.create("div", { id: "btn_start", className: "btn1", innerHTML: "Start" }, container);
        }

        // Handle all the interactions
        clickHandler() {

        on(this.start, "click", function (evt) {
            this.app.init();
        }.bind(this));

        }

        createApp() {
            this.app.addPage("Page 1");
            this.app.addPage("Page 2");
            this.app.addPage("Page 3");
            this.app.addPage("Page 4");

        }

    };
});