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

      let page = new Page("page_" + this.pages.length.toString(),app.pageContainer, this.title);
      this.pages.push(page);
      app.pages.push(page);
    }


    addElement(type, key, args, container) {
      
      // Check if there is already an text info which was just added before. 
      if (this.pages[this.pages.length - 1].content.length > 0 && this.pages[this.pages.length - 1].content[this.pages[this.pages.length - 1].content.length-1].type != "textInfo") {
        let page = new Page("page_" + this.pages.length.toString(),app.pageContainer, this.title);
        this.pages.push(page);
        app.pages.push(page);
  
      }

    // Consolidation
      
    let elem = new Element(this.pages[this.pages.length-1], this.pages.length, this.pages[this.pages.length-1].page);
      elem.init(type, key, args);
      this.pages[this.pages.length-1].content.push({"type":"element",content: elem});
      this.pages[this.pages.length-1].element = elem;

      return elem;
    }

    addTextInfo(args) {

      // Check if there is already an text info which was just added before. 
      if (this.pages[this.pages.length - 1].content.length > 0 && this.pages[this.pages.length - 1].content[this.pages[this.pages.length - 1].content.length-1].type != "textInfo") {

      let page = new Page("page_" + this.pages.length.toString(),app.pageContainer, this.title);
      this.pages.push(page);
      app.pages.push(page);
      }

      args.title =args.title? app.strings.get(args.title):null;
      args.text =args.text? app.strings.get(args.text):null;

      if (args.textInfo) {
        args.textInfo.text =args.textInfo.text? app.strings.get(args.textInfo.text):null;
        args.textInfo.linkText =args.textInfo.linkText? app.strings.get(args.textInfo.linkText):null;
      }
      

      let textInfo = domCtr.create("div", { id: "textInfo_" + args.title, className: args.title? "element titleContainer":"element"}, this.pages[this.pages.length-1].page);
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

        app.replaceWithText(textInfo);
        this.pages[this.pages.length-1].content.push({content:textInfo, type: "textInfo"});
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
