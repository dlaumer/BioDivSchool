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
  "biodivschool/Start"


], function (dom, domCtr, win, on, Page, ArcGis, Start) {
  return class App {
    constructor(callback) {
      

      this.arcgis = new ArcGis()
      this.arcgis.init(() => {
        this.createUI();
        this.clickHandler();
        this.pages = [];
        callback();
      });

      that = this;
    }

    init(gruppenId) {
      
      document.getElementById("btn_start").innerHTML = "Loading...";
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
          this.userName.innerHTML = "Gruppen ID: " + this.gruppenId;
          this.save.className = "btn1 btn_disabled";
      })
    }

    createUI() {
      this.background = domCtr.create(
        "div",
        { class: "background", style: "display: none" },
        win.body()
      );
      this.header =  domCtr.create("div", { id: "header" }, this.background);
      this.save = domCtr.create("div", { id: "save", className: "btn1 btn_disabled", innerHTML: "Save" }, this.header);

      this.userName = domCtr.create("div", { id: "userName"}, this.header);
      this.logout = domCtr.create("div", { id: "logout", className: "btn1", innerHTML: "Logout" }, this.header);

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
          this.save.innerHTML = "Saving..."
          let elements = that.getAllElements();
          that.uploadData(elements).then((value) => {
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
      return new Promise((resolve, reject) => {

        that.arcgis.updateFeature(this.objectId, data).then((value) => {
          resolve(value)
        })
        .catch((reason) => {
          reject(reason)
        })
        
    })

       
    }
  };
});
