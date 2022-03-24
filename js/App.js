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
  "biodivschool/ArcGis",
  "biodivschool/Start",
], function (dom, domCtr, win, on, Page, ArcGis, Start) {
  return class App {
    constructor(offline, callback) {
      that = this;

      this.offline = offline;
      if (!this.offline) {
        this.arcgis = new ArcGis();
        this.arcgis.init(() => {
          this.createUI();
          this.clickHandler();
          this.pages = [];
          callback();
        });
      } else {
        this.createUI();
        this.clickHandler();
        this.pages = [];
        callback();
      }
    }

    init(gruppenId) {
      document.getElementById("btn_start").innerHTML = "Loading...";
      this.gruppenId = gruppenId;

      // Add a new element in the database
      let that = this;
      if (!this.offline) {
        this.arcgis.addFeature(that.gruppenId, (info) => {
          let data = info.data;
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
          this.userName.innerHTML = "Gruppen ID: " + this.gruppenId;
          this.save.className = "btn1 btn_disabled";
        });
      } else {
        // destroy welcome page when app is started
        domCtr.destroy("start");
        this.background.style.display = "block";
        this.pages[0].init(null);
        this.currentPage = 0;
        // TODO Warning if did not work!
        this.userName.innerHTML = "Gruppen ID: " + this.gruppenId;
        this.save.className = "btn1 btn_disabled";
      }
    }

    createUI() {
      this.background = domCtr.create(
        "div",
        { class: "background", style: "display: none" },
        win.body()
      );
      this.header = domCtr.create("div", { id: "header" }, this.background);
      this.save = domCtr.create(
        "div",
        { id: "save", className: "btn1 btn_disabled", innerHTML: "Save" },
        this.header
      );

      this.userName = domCtr.create("div", { id: "userName" }, this.header);
      this.logout = domCtr.create(
        "div",
        { id: "logout", className: "btn1", innerHTML: "Logout" },
        this.header
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
        this.save,
        "click",
        function (evt) {
          this.save.innerHTML = "Saving...";
          let elements = that.getAllElements(false);
          that
            .uploadData(elements)
            .then((value) => {
              this.save.innerHTML = "Save";
              this.save.className = "btn1 btn_disabled";
            })
            .catch((reason) => {
              this.save.innerHTML = "Save";
              this.save.className = "btn1";
              alert("Saving not successful");
              console.log(reason);
            });
        }.bind(this)
      );

      on(
        this.logout,
        "click",
        function (evt) {
          document.location.reload(true);
        }.bind(this)
      );

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
      let page = new Page(this, this.pages.length, this.pageContainer, title);
      this.pages.push(page);

      return page;
    }

    addFinalPage(title, func) {
      let page = new Page(this, this.pages.length, this.pageContainer, title);
      page.addElement("finalButton", "final", {
        text: "Did you fill in all the elements?",
        func: this.checkInputs,
      });
      this.pages.push(page);
      this.lastPage = page;

      return page;
    }

    loadInputs(data) {
      let elements = that.getAllElements(false);

      for (let item in data) {
        if (item in elements && data[item] != null) {
          elements[item].clickHandler(data[item]);
          elements[item].setValue(data[item]);
        }
      }
    }

    checkInputs() {
      let elements = that.getAllElements(true);
      if (Object.values(elements).every((elem) => elem.value != null)) {
        that.lastPage.removeWarning();
        that.uploadData(elements);
      } else {
        that.lastPage.addWarning();
      }
    }

    getAllElements(checkIfSet) {
      let data = {};
      for (let pageIndex in that.pages) {
        let page = that.pages[pageIndex];
        if (page != that.lastPage) {
          for (let elemIndex in page.elements) {
            let elem = page.elements[elemIndex];
            if (checkIfSet) {
              elem.checkValueSet();
            }
            data[elem.key] = elem;
          }
        }
      }
      return data;
    }

    parseElements(elements) {
      let data = {}
      for (let elem in elements) {
        data = {...data, ...elements[elem].readValue()};
      }
      return data;

    }

    uploadData(elements) {
      let data = this.parseElements(elements);

      return new Promise((resolve, reject) => {
        that.arcgis
          .updateFeature(this.objectId, parsedData)
          .then((value) => {
            resolve(value);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    }
  };
});
