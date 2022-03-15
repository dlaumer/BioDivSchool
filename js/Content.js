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
            
            let page0 = this.app.addPage("Allgemeine Infos")
            page0.addElement("simpleTextInput", "standort", {text:"Was ist der Name des Standorts?", placeholder: "Standort"});
            page0.addElement("simpleTextInput", "organisation", {text:"Was ist der Name der Organisation oder Schule?", placeholder: "Organisation/Schule"});
            page0.addElement("dateTimeInput", "datum", {text:"Datum und Uhrzeit"});
            page0.addElement("dropdownInput", "dropdownTest", {text:"Dropdown", placeholder: "Test", options: [{key: "test1", label: "Test 1"}, {key: "test2", label: "Test 2"}]});
            page0.addElement("radioButtonInput", "radioButtonTest", {text:"Radio Buttons", options: [{key: "test1", label: "Test 1"}, {key: "test2", label: "Test 2"}, {key: "test3", label: "Test 3"}, {key: "test4", label: "Test 4"}]});

            let page1 = this.app.addPage("Slider Test");

            page1.addElement("sliderInput", "slider1", {text: "How much of this?",min: 0, max: 1, step: 0.1}); 
            page1.addElement("sliderInput", "slider2", {text: "How much of that?",  min: 0, max: 10, step: 0.5}); 
            page1.addElement("sliderInput", "slider3", {text: "How much of those?", min: 0, max: 100, step: 2}); 


            let page2 = this.app.addPage("Page 2");
            //page2.addElement("mapInput", "gebiete", {text: "Zeichne die Gebiete"});

            let page3 = this.app.addPage("Page 3");
            let page4 = this.app.addFinalPage("Ende");

        }

        
    };
});