/*
--------------
Page.js
--------------
The app's main structure is based on pages and elements, an app can have several pages and a page can have several elements. One element corresponds to one entry in the database! (One input per element)
*/



define([
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
  "biodivschool/Element",
], function (dom, domCtr, win, on, Element) {
  return class Page {
    constructor(id, container, title) {     
      this.id = id;
      this.name = "page_" + id.toString();
      this.container = container;

      this.title = title;
      this.element  = null;
      this.content = [];

      this.hidden = false;
      this.createUI();
      this.clickHandler();

    }

    init(prevPage) {
      if (prevPage !== null) {
        prevPage.page.className = "page";
        //this.page.style.display = app.mode == "consolidation" ? "none" : "block"

      }
      this.page.className = "page active";
      //this.page.style.display = "block"

      if (this.element != null && app.mode != "consolidation") {
        this.element.reportWindowSize();
      }

    }

    createUI() {
      this.page = domCtr.create(
        "div",
        { id: this.name, className: "page" },
        this.container
      );
      //this.page.style.display = app.mode == "consolidation" ? "none" : "block"
      this.titleDiv = domCtr.create(
        "div",
        { class: "pageTitle", innerHTML: this.title },
        this.page
      );
    }

    clickHandler() {}



    addWarning(text) {
      if (document.getElementById("warning") == null) {
        this.element = domCtr.create(
          "div",
          {
            id: "warning",
            className: "warning",
            innerHTML: text,
          },
          this.page
        );
      }
    }

    removeWarning() {
      domCtr.destroy("warning");
    }

  };

    
});
