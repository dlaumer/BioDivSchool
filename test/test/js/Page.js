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
      this.elements = [];

      this.createUI();
      this.clickHandler();

    }

    init(prevPage) {
      if (prevPage !== null) {
        prevPage.page.className = "page";
        this.page.style.display = app.mode == "consolidation" ? "none" : "block"

      }
      this.page.className = "page active";
      this.page.style.display = "block"

      if (this.elements.length > 0) {
        this.elements[0].reportWindowSize();
      }

    }

    createUI() {
      this.page = domCtr.create(
        "div",
        { id: this.name, className: "page" },
        this.container
      );
      this.page.style.display = app.mode == "consolidation" ? "none" : "block"
      this.titleDiv = domCtr.create(
        "div",
        { class: "pageTitle", innerHTML: this.title },
        this.page
      );
    }

    clickHandler() {}

    addElement(type, key, args) {
        
    let elem = this.addElementNormal(type, key, args, this.page)

    if (Object.keys(args).includes("version") && !args.version.includes(app.version)) {
      elem.element.style.display = "none"
    }
    return elem

    
      
      
    }

    addElementNormal(type, key, args, container) {
      let elem = new Element(this, this.elements.length, container);
      elem.init(type, key, args);
      this.elements.push(elem);
      return elem;
    }

    addTextInfo(args) {


        let textInfo = domCtr.create("div", { id: "textInfo_" + args.title, className: args.title? "element titleContainer":"element"}, this.page);
        if (args.title) {
          domCtr.create("div", { className: "elementTitle", innerHTML: args.title}, textInfo);

        }
        if (args.text) {
          domCtr.create("div", { className: "labelText", innerHTML: args.text, style: "width: 100%"}, textInfo);
        }

        if (args.textInfo) {
          //this.label.innerHTML = this.label.innerHTML + "<br><br> <a onclick=expand()>sdsdd</a>" + args.linkText;
          let link = domCtr.create("div", { className: "labelText linkText", innerHTML: args.textInfo.linkText}, textInfo);
          let expandable = domCtr.create("div", { className: "expandable", innerHTML: args.textInfo.text, },textInfo);

          on(link, "click", function (evt) {
            expandable.style.display = expandable.style.display=="" ? "flex" : "";
          }.bind(this));
        }

        if (Object.keys(args).includes("version") && !args.version.includes(app.version)) {
          textInfo.style.display = "none"
        }

        return {element:textInfo, type: "textInfo"};
    }

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
