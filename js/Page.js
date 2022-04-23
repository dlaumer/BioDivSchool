/*
--------------
Page.js
--------------
Holds all the objects for one page. Pages are used to split up the input elements into chunks, so that not everything is in one long scrollable page.

*/



define([
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
  "biodivschool/Element",
], function (dom, domCtr, win, on, Element) {
  return class Page {
    constructor(app, id, container, title) {     

      this.app = app;
      this.id = id;
      this.name = "page_" + id.toString();
      this.container = container;

      this.title = title;
      this.elements = [];

      this.createUI();
      this.clickHandler();

    }

    init(prevPage) {
      if (prevPage !== null) {
        prevPage.page.className = "page";
      }
      this.page.className = "page active";

      this.elements[0].reportWindowSize();

    }

    createUI() {
      this.page = domCtr.create(
        "div",
        { id: this.name, className: "page" },
        this.container
      );
      this.titleDiv = domCtr.create(
        "div",
        { class: "pageTitle", innerHTML: this.title },
        this.page
      );
    }

    clickHandler() {}

    addElement(type, key, args) {
      let elem = this.addElementNormal(type, key, args, this.page)
      return elem
    }

    addElementNormal(type, key, args, container) {
      let elem = new Element(this.app, this, this.elements.length, container);
      elem.init(type, key, args);
      this.elements.push(elem);
      return elem;
    }


    addWarning() {
      if (document.getElementById("warning") == null) {
        this.element = domCtr.create(
          "div",
          {
            id: "warning",
            className: "warning",
            innerHTML: "Please fill in all the elements first!",
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
