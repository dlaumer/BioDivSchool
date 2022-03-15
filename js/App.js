/*
--------------
App.js
--------------
Holds the main functionality for the webpage. The main buttons and all the different pages.
*/
let that = null;

define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
  "biodivschool/Page",
  "biodivschool/ArcGis"

], function (dom, domCtr, win, on, Page, ArcGis) {
  return class App {
    constructor() {
      this.createUI();
      this.clickHandler();
      this.pages = [];

      this.arcgis = new ArcGis()
      this.arcgis.init();

      that = this;
    }

    init(gruppenId) {
      
      this.gruppenId = gruppenId;

      // Add a new element in the database
      let that = this;
      this.arcgis.addFeature(that.gruppenId, (info) => {
          let data = info.data;
          console.log(data);
          that.objectId = info.objectId;
          if (!info.newFeature) {
              that.loadInputs(data.attributes);
          }          

          // destroy welcome page when app is started
          domCtr.destroy("start");
          this.background.style.display = "block";
          this.pages[0].init(null);
          this.currentPage = 0;
          // TODO Warning if did not work!
      })
    }

    createUI() {
      this.background = domCtr.create(
        "div",
        { class: "background", style: "display: none" },
        win.body()
      );
      this.pageContainer = domCtr.create(
        "div",
        { id: "pageContainer" },
        this.background
      );
      this.footer = domCtr.create("div", { id: "footer" }, this.background);
      this.back = domCtr.create(
        "div",
        {
          id: "btn_back",
          className: "btn2",
          innerHTML: "Back",
          style: "visibility:hidden",
        },
        this.footer
      );
      this.next = domCtr.create(
        "div",
        { id: "btn_next", className: "btn1", innerHTML: "Next" },
        this.footer
      );
    }

    clickHandler() {
      on(
        this.back,
        "click",
        function (evt) {
          this.pages[this.currentPage - 1].init(this.pages[this.currentPage]);
          this.currentPage = this.currentPage - 1;
          this.next.style.visibility = "visible";

          if (this.currentPage - 1 < 0) {
            this.back.style.visibility = "hidden";
          }

        }.bind(this)
      );

      on(
        this.next,
        "click",
        function (evt) {
          this.pages[this.currentPage + 1].init(this.pages[this.currentPage]);
          this.currentPage = this.currentPage + 1;
          this.back.style.visibility = "visible";

          if (this.currentPage + 1 == this.pages.length) {
            this.next.style.visibility = "hidden";
          }
        }.bind(this)
      );
    }

    addPage(title) {
      let page = new Page(this.pages.length, this.pageContainer, title);
      this.pages.push(page);

      return page;
    }

    addFinalPage(title, func) {
      let page = new Page(this.pages.length, this.pageContainer, title);
      page.addElement("finalButton", "final", {
        text: "Did you fill in all the elements?",
        func: this.checkInputs,
      });
      this.pages.push(page);
      this.lastPage = page;

      return page;
    }

    loadInputs(data) {
      let elements = that.getAllElements();

      for (let item in data) {
        if (item in elements) {
          elements[item].clickHandler(data[item]);
          elements[item].setValue(data[item]);
        }
      }
    }

    checkInputs() {
      
      let elements = that.getAllElements();
      if (Object.values(elements).every(elem => elem.value != null)) {
        that.lastPage.removeWarning();
        that.uploadData(elements)
      }
      else {
        that.lastPage.addWarning();
      }
    }


    getAllElements() {
      let data = {}
      for (let pageIndex in that.pages) {
        let page = that.pages[pageIndex];
        if (page != that.lastPage) {
          for (let elemIndex in page.elements) {
            let elem = page.elements[elemIndex];
            
            elem.checkValueSet();
            data[elem.key] = elem;
          }
        }
      }
      console.log(data);
      return data;
    }

    uploadData(data) {
        that.arcgis.updateFeature(this.objectId, data, (event) => {
            console.log(event);
        })
    }
  };
});
