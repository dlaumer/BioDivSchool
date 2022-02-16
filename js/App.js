/*
--------------
App.js
--------------
Holds the main functionality for the webpage. The main buttons and all the different pages.
*/

define([
    "dojo/dom",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",
    "biodivschool/Page"

], function (
    dom, domCtr, win, on, Page ) {

    return class App {

        constructor() {
            this.createUI();
            this.clickHandler();
            this.pages = [];
        }

        init() {
            // destroy welcome page when app is started
            domCtr.destroy("start");
            this.background.style.display = "block";
            this.pages[0].init(null);
            this.currentPage = 0;
        }


        createUI() {
            this.background = domCtr.create("div", { class: "background", style: "display: none"}, win.body());
            this.pageContainer = domCtr.create("div", { id: "pageContainer" }, this.background);
            this.footer =  domCtr.create("div", { id: "footer" }, this.background);
            this.back = domCtr.create("div", { id: "btn_back", className: "btn2", innerHTML: "Back", style:"visibility:hidden"}, this.footer);
            this.next = domCtr.create("div", { id: "btn_next", className: "btn1", innerHTML: "Next" }, this.footer);

        }


        clickHandler() {

            on(this.back, "click", function (evt) {
                this.pages[this.currentPage - 1].init(this.pages[this.currentPage]);
                this.currentPage = this.currentPage - 1;
                this.next.style.visibility = "visible"
                
                if (this.currentPage - 1 < 0) {
                    this.back.style.visibility = "hidden";
                }

            }.bind(this));

            on(this.next, "click", function (evt) {
                this.pages[this.currentPage + 1].init(this.pages[this.currentPage]);
                this.currentPage = this.currentPage + 1;
                this.back.style.visibility = "visible"

                if (this.currentPage + 1 == this.pages.length) {
                    this.next.style.visibility = "hidden";
                }

            }.bind(this));
        }

        
        addPage(title) {
            let page = new Page(this.pages.length, this.pageContainer, title)
            this.pages.push(page);

            return page;
        }
    }
});