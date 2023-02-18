/*
--------------
Consolidation.js
--------------
A special version of page.js. It is used as a wrapper for the page during the consolidation mode since there is a page for every page then.
*/

define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
  "biodivschool/Element"
], function (dom, domCtr, win, on, Element) {
  return class Consolidation {
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
        prevPage.page.className = "page2";
      }
      this.page.className = "page2 active2";
    }

    createUI() {


    }

    clickHandler() {

    }

    addElement(type, key, args) {

      let page = app.addPageNormal(this.title, this.container);

      let consolidationContainer = domCtr.create("div", { className: "consolidationContainer"}, page.page);

      

      let consolidationArea = domCtr.create("div", { className: "consolidationArea"}, consolidationContainer);   
      let consolidation = domCtr.create("div", { className: "consolidation"}, consolidationArea);   

      let consolidationDiagramm = domCtr.create("div", { className: "consolidation", id: "consolidation_" + key, style: "display:none"}, consolidationArea);   
     
      this.groupDivs = {}
      for (let i in app.content.groups) {
        let groupDivContainer = domCtr.create("div", { className: "groupDivContainer"}, consolidation);
        domCtr.create("div", { className: "groupDivTitle", innerHTML: app.strings.get(app.content.groups[i].label)}, groupDivContainer);
        this.groupDivs[app.content.groups[i].key] = domCtr.create("div", { className: "resultContainer", }, groupDivContainer);

        
      }

      let elem = page.addElementNormal(type, key, args, consolidationContainer);
      
      elem.element.style.width = "40%";
      elem.groupDivs = this.groupDivs;

      if (type != "mapInput") {
      let diagram = domCtr.create(
        "div",
        { id: "diagram", className: "btn1", innerHTML: app.strings.get("diagram")},
        consolidationArea
      );

      on(
        diagram,
        "click",
        function (evt) {
          if (evt.target.innerHTML == app.strings.get("diagram")) {
            consolidation.style.display = "none";
            consolidationDiagramm.style.display = "flex";
            evt.target.innerHTML = app.strings.get("values");
          }
          else {
            consolidation.style.display = "flex";
            consolidationDiagramm.style.display = "none";
            evt.target.innerHTML = app.strings.get("diagram");
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
        this.element = domCtr.create("div", { id: "warning", className: "warning", innerHTML: app.strings.get("warnFillAll")}, this.page);  
      }
     
    }

    removeWarning() {
      domCtr.destroy("warning");
    }

  };
});
