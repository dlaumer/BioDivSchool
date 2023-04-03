/*
--------------
Chapter.js
--------------
The app's main structure is based on chapters, pages and elements, an app can have several chapers and a chapter can have several elements. Normally threre is one element per page, but sometimes there is additional information which adds to the page. One element corresponds to one entry in the database! (One input per element)
*/



define([
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
  "biodivschool/Page",

  "biodivschool/Element",
], function (dom, domCtr, win, on, Page, Element) {
  return class Chapter {
    constructor(id, title) {
      this.id = id;
      this.name = "chapter_" + id.toString();

      this.title = title;
      this.pages = [];


      let page = new Page("page_" + app.pages.length.toString(), app.pageContainer, this.title);
      this.firstPageNr = app.pages.length ;

      this.pages.push(page);
      app.pages.push(page);
      page.elementContainer = page.page;
      this.prepareConsolidationPage(page);

    }


    addElement(type, key, args, container) {

      // Check if there is already an text info which was just added before. 
      let page = this.preparePage();

      // Consolidation


        let elem = new Element(page, this.pages.length, page.elementContainer);
        elem.init(type, key, args);
        page.content.push({ "type": "element", content: elem });
        page.element = elem;

        if (app.mode == "consolidation") {

        elem.groupDivs = page.groupDivs;

        if (type != "mapInput") {
          let diagram = domCtr.create(
            "div",
            { id: "diagram", className: "btn1", innerHTML: app.strings.get("diagram") },
            page.consolidationArea
          );

          on(
            diagram,
            "click",
            function (evt) {
              if (evt.target.innerHTML == app.strings.get("diagram")) {
                page.consolidation.style.display = "none";
                page.consolidationDiagramm.style.display = "flex";
                evt.target.innerHTML = app.strings.get("values");
              }
              else {
                page.consolidation.style.display = "flex";
                page.consolidationDiagramm.style.display = "none";
                evt.target.innerHTML = app.strings.get("diagram");
              }
            }
          );
        }

      }




      return elem;
    }

    addTextInfo(args) {
      // Check if there is already an text info which was just added before. 
      let page = this.preparePage()


      args.title = args.title ? app.strings.get(args.title) : null;
      args.text = args.text ? app.strings.get(args.text) : null;

      if (args.textInfo) {
        args.textInfo.text = args.textInfo.text ? app.strings.get(args.textInfo.text) : null;
        args.textInfo.linkText = args.textInfo.linkText ? app.strings.get(args.textInfo.linkText) : null;
      }

      let textInfo = domCtr.create("div", { id: "textInfo_" + args.title, className: args.title ? "element titleContainer" : "element" }, page.elementContainer);
      if (args.title) {
        domCtr.create("div", { className: "elementTitle", innerHTML: args.title }, textInfo);

      }
      if (args.text) {
        domCtr.create("div", { className: "labelText", innerHTML: args.text, style: "width: 100%" }, textInfo);
      }

      if (args.textInfo) {
        //this.label.innerHTML = this.label.innerHTML + "<br><br> <a onclick=expand()>sdsdd</a>" + args.linkText;
        let link = domCtr.create("div", { className: "labelText linkText", innerHTML: args.textInfo.linkText }, textInfo);
        let expandable = domCtr.create("div", { className: "expandable", innerHTML: args.textInfo.text, }, textInfo);

        on(link, "click", function (evt) {
          expandable.style.display = expandable.style.display == "" ? "flex" : "";
        }.bind(this));
      }

      if (Object.keys(args).includes("version") && !args.version.includes(app.version)) {
        textInfo.style.display = "none"
      }

      app.replaceWithText(textInfo);
      this.pages[this.pages.length - 1].content.push({ content: textInfo, type: "textInfo" });
      return { element: textInfo, type: "textInfo" };
    }

    preparePage() {
      let page = this.pages[this.pages.length - 1];
      if (page.content.length > 0 && page.content[page.content.length - 1].type != "textInfo") {

        page = new Page("page_" + app.pages.length.toString(), app.pageContainer, this.title);
        this.pages.push(page);
        app.pages.push(page);
        page.elementContainer = page.page;

        this.prepareConsolidationPage(page);

      }
      return page;
      
    }

    prepareConsolidationPage(page) {
      if (app.mode == "consolidation") {
        page.consolidationContainer = domCtr.create("div", { className: "consolidationContainer" }, page.page);

        page.consolidationArea = domCtr.create("div", { className: "consolidationArea" }, page.consolidationContainer);
        page.elementContainer = domCtr.create("div", { className: "elementContainer" }, page.consolidationContainer);

        page.consolidation = domCtr.create("div", { className: "consolidation" }, page.consolidationArea);
        domCtr.place(page.titleDiv, page.consolidation, "before");

        page.consolidationDiagramm = domCtr.create("div", { className: "consolidation", id: "consolidation_" + page.name, style: "display:none" }, page.consolidationArea);

        page.groupDivs = {}
        for (let i in app.content.groups) {
          let groupDivContainer = domCtr.create("div", { className: "groupDivContainer" }, page.consolidation);
          domCtr.create("div", { className: "groupDivTitle", innerHTML: app.strings.get(app.content.groups[i].label) }, groupDivContainer);
          page.groupDivs[app.content.groups[i].key] = domCtr.create("div", { className: "resultContainer", }, groupDivContainer);
        }


      }
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
