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
  "biodivschool/Element"
], function (dom, domCtr, win, on, Element) {
  return class Consolidation {
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
    }

    createUI() {


    }

    clickHandler() {

    }

    addElement(type, key, args) {

      let page = that.addPageNormal(this.title, this.container);

      let consolidationContainer = domCtr.create("div", { className: "consolidationContainer"}, page.page);

      

      let consolidation = domCtr.create("div", { className: "consolidation"}, consolidationContainer);   

      this.groupDivs = {}
      for (let i in that.content.groups) {
        this.groupDivs[that.content.groups[i].key] = domCtr.create("div", { className: "groupDiv", innerHTML: that.content.groups[i].label}, consolidation);
        this.addElementGroup()
      }

      let elem = page.addElementNormal(type, key, args, consolidationContainer);
      
      elem.element.style.width = "40%";
      elem.groupDivs = this.groupDivs;
      return elem;
    }

    addWarning() {
      if (document.getElementById("warning") == null) {
        this.element = domCtr.create("div", { id: "warning", className: "warning", innerHTML: "Please fill in all the elements first!"}, this.page);  
      }
     
    }

    removeWarning() {
      domCtr.destroy("warning");
    }

  };
});
