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
           // Make new app 
            this.app = new App();

        }

        // Start the start screen
        init() {
            this.createUI();
            this.clickHandler();
            this.content = new Content(this.app);
            this.content.init();
        }

        // Create the GUI of the start screen
        createUI() {

            var background = domCtr.create("div", { id: "start", class: "background" }, win.body());
            var container = domCtr.create("div", { id: "welcome" }, background);
           
            // Some info about the project
            domCtr.create("div", { id: "description1", innerHTML: "BioDivSchool Web App", style: "font-size: 4vh"}, container);

            this.input = domCtr.create("input", { className: "input inputField", placeholder: "Gruppen ID" }, container);

            this.start = domCtr.create("div", { id: "btn_start", className: "btn1", innerHTML: "Start", disabled:true}, container);
        }

        // Handle all the interactions
        clickHandler() {

        on(this.input, "input", function (evt) {
            this.start.disabled = false;
        }.bind(this));

            
        on(this.start, "click", function (evt) {

            this.app.init(this.input.value);
        }.bind(this));

        }

    };
});