define([
  "esri/core/Accessor",
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
], function (Accessor, dom, domCtr, win, on) {
  return class Page {
    constructor(id, container, title) {
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
    }

    createUI() {

        this.page = domCtr.create("div", { id: this.name, className: "page" }, this.container);
        this.titleDiv = domCtr.create("div", { class: "pageTitle", innerHTML: this.title}, this.page);

    }

    clickHandler() {

    }

    addElement() {}
  };
});
