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

      

      let consolidationArea = domCtr.create("div", { className: "consolidationArea"}, consolidationContainer);   
      let consolidation = domCtr.create("div", { className: "consolidation"}, consolidationArea);   

      let consolidationDiagramm = domCtr.create("div", { className: "consolidation", id: "consolidation_" + key, style: "display:none"}, consolidationArea);   
     
      this.groupDivs = {}
      for (let i in that.content.groups) {
        let groupDivContainer = domCtr.create("div", { className: "groupDivContainer"}, consolidation);
        domCtr.create("div", { className: "groupDivTitle", innerHTML: that.content.groups[i].label}, groupDivContainer);
        this.groupDivs[that.content.groups[i].key] = domCtr.create("div", { className: "resultContainer", }, groupDivContainer);

        
      }

      let elem = page.addElementNormal(type, key, args, consolidationContainer);
      
      elem.element.style.width = "40%";
      elem.groupDivs = this.groupDivs;

      if (type != "mapInput") {
      let diagram = domCtr.create(
        "div",
        { id: "diagram", className: "btn1", innerHTML: "Diagram"},
        consolidationArea
      );

      on(
        diagram,
        "click",
        function (evt) {
          if (evt.target.innerHTML == "Diagram") {
            consolidation.style.display = "none";
            consolidationDiagramm.style.display = "flex";
            evt.target.innerHTML = "Werte";
          }
          else {
            consolidation.style.display = "flex";
            consolidationDiagramm.style.display = "none";
            evt.target.innerHTML = "Diagram";
          }
        }
      );
      }

      return elem;
    }

    addTextInfo() {
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
