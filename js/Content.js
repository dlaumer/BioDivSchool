/*
--------------
Content.js
--------------
Used to populate the webpage with the specific input elements. Trying to seperate the logic to make the site and the actual "data" for the app

*/

// ssh-add ~/.ssh/ssh_rsa_dlaumer
define([
    "dojo/dom",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",

    "biodivschool/Page",
    "biodivschool/Element"


], function ( 
    dom, domCtr, win, on, Page, Element) {

    return class Content {

        constructor(app) {
            this.app = app;

        }

        // Start the start screen
        init() {
            let page1 = this.app.addPage("Allgemeine Infos");
            page1.addElement("simpleTextInput", "standort", {text:"Was ist der Name des Standorts?", placeholder: "Standort"});
            page1.addElement("simpleTextInput", "organisation", {text:"Was ist der Name der Organisation oder Schule?", placeholder: "Organisation/Schule"});
            page1.addElement("dateTimeInput", "date", {text:"Datum und Uhrzeit"});
            page1.addElement("dropdownInput", "dropdown", {text:"Dropdown", placeholder: "Geschlecht", options: [{key: "male", label: "Male"}, {key: "female", label: "Female"}]});

            

            let page2 = this.app.addPage("Page 2");
            page2.addElement("mapInput", "gebiete", {text: "Zeichne die Gebiete"});

            let page3 = this.app.addPage("Page 3");
            let page4 = this.app.addPage("Page 4");

        }

    };
});