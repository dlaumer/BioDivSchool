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
  "biodivschool/Consolidation",

  "biodivschool/ArcGis",
  "biodivschool/Start",
], function (dom, domCtr, win, on, Page, Consolidation, ArcGis, Start) {
  return class App {
    constructor(offline, mode, callback) {
      that = this;
      that.pointsTotal = 0;
      that.projectAreaId = null;
      that.mode = mode;
      this.offline = offline;
      this.arcgis = new ArcGis();
      that.consolidationWidth = null;

      if (!this.offline) {
        this.arcgis.init(() => {
          this.arcgis.initGeo(() => {
            this.arcgis.initProject(() => {
              this.createUI();
              this.clickHandler();
              this.pages = [];
              callback();
            });
          });
        });
      } else {
        this.createUI();
        this.clickHandler();
        this.pages = [];
        callback();
      }
    }

    init(projectId, groupId) {

      document.getElementById("btn_login").innerHTML = "Loading...";
      this.projectId = projectId;
      this.groupId = groupId;

      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?project=' + this.projectId + "&group=" + this.groupId;
      window.history.pushState({ path: newurl }, '', newurl);

      // Add a new element in the database
      let that = this;

      if (!this.offline) {
        // Check if this project alreayd exists
        this.arcgis.checkDataProject(that.projectId, (info) => {
          that.projectAreaId = "[" + info.toFixed(0) + "]";
          that.content.init();

          this.arcgis
            .calculateArea(this.projectAreaId, "project")
            .then((area) => {
              that.projectArea = area;
            });
          this.arcgis.checkData(that.projectId, that.groupId, (info) => {
            if (info != null) {
              let data = info.data;
              that.objectId = info.objectId;
              if (!info.newFeature) {
                that.loadInputs(data.attributes);
              }
            }
            this.initUI();
          });
        });
      } else {
        that.content.init();
        this.initUI();
      }
    }

    initProject(projectId) {

      document.getElementById("btn_login").innerHTML = "Loading...";
      this.projectId = projectId;
      
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?project=' + this.projectId;
      window.history.pushState({ path: newurl }, '', newurl);

      // Add a new element in the database
      let that = this;
      if (!this.offline) {
        this.arcgis.checkData(that.projectId, null, (info) => {
          if (info != null) {
            let data = info.data;
            that.objectId = info.objectId;
            that.projectAreaId = "[" + that.objectId.toFixed(0) + "]";
            that.content.init();
            if (!info.newFeature) {
              that.loadInputs(data.attributes);
            }
          }
          else {
            that.content.init();
          }
          this.initUI();
        });
      } else {
        that.content.init();
        this.initUI();
      }
    }

    initConsolidation(projectId) {
      document.getElementById("btn_login").innerHTML = "Loading...";
      this.projectId = projectId;
      this.groupId = "all";

      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?project=' + this.projectId;
      window.history.pushState({ path: newurl }, '', newurl);
      
      let that = this;

      if (!this.offline) {
        // Check if this project alreayd exists
        this.arcgis.checkDataProject(that.projectId, (info) => {
          that.projectAreaId = "[" + info.toFixed(0) + "]";
          that.content.init();

          this.arcgis
            .calculateArea(this.projectAreaId, "project")
            .then((area) => {
              this.projectArea = area;
            });
          this.arcgis.checkDataGroups(that.projectId, (data) => {
            let dataGroups = that.parseGroups(data);
            let occurences = that.countOccurence(dataGroups);
            that.loadInputsGroup(dataGroups, occurences.count);
            this.arcgis.checkData(that.projectId, that.groupId, (info) => {
              let data = info.data;
              that.objectId = info.objectId;
              if (!info.newFeature) {
                 that.loadInputs(data.attributes);
              } else {
                that.loadInputs(occurences.dataAll);
                that.saveData();
              }

              this.initUI();
            });
          });
        });
      } else {
        that.content.init();
        this.initUI();
      }
    }

    initUI() {
      // destroy welcome page when app is started
      domCtr.destroy("login");
      this.background.style.display = "block";
      this.pages[0].init(null);
      this.currentPage = 0;
      // TODO Warning if did not work!
      this.userName.innerHTML =
        that.mode == "project"
          ? "Projekt: " + this.projectId
          : "Projekt: " + this.projectId + ", Gruppe: " + this.groupId;
      this.save.className = "btn1 btn_disabled";
      document.onkeydown = this.checkKey;
    }

    createUI() {
      this.background = domCtr.create(
        "div",
        { class: "background", style: "display: none" },
        win.body()
      );
      this.header = domCtr.create("div", { id: "header" , className: "header"}, this.background);
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
      this.footer = domCtr.create("div", { id: "footer", className: "footer" }, this.background);
      this.footerLeft = domCtr.create(
        "div",
        {
          className: "footerElements",
          style: "justify-content: login;",
        },
        this.footer
      );
      this.home = domCtr.create(
        "div",
        {
          id: "btn_home",
          className: "btn2",
          innerHTML: "Home",
          style: "min-width: 10vw;",
        },
        this.footerLeft
      );
      this.footerCenter = domCtr.create(
        "div",
        { className: "footerElements" },
        this.footer
      );
      this.back = domCtr.create(
        "div",
        {
          id: "btn_back",
          className: "btn2",
          innerHTML: "Back",
          style: "visibility:hidden",
        },
        this.footerCenter
      );
      this.next = domCtr.create(
        "div",
        { id: "btn_next", className: "btn1", innerHTML: "Next" },
        this.footerCenter
      );
      this.footerRight = domCtr.create(
        "div",
        { className: "footerElements" },
        this.footer
      );
      this.pointsTotalDiv = domCtr.create(
        "div",
        {
          id: "pointsTotalInfo",
          className: "pointsInfo",
          innerHTML: that.mode == "project" ? "" : "Punkte total: 0",
        },
        this.footerRight
      );
    }

    saveData(callback) {
      that.save.innerHTML = "Saving...";
      let elements = that.getAllElements(false);
      that.uploadData(elements).then((value) => {
        that.save.innerHTML = "Save";
        that.save.className = "btn1 btn_disabled";
        callback()
      });
      /*
        .catch((reason) => {
          that.save.innerHTML = "Save";
          that.save.className = "btn1";
          alert("Saving not successful");
          console.log(reason);
        });
        */
    }

    clickHandler() {
      on(this.save, "click", () => {
        that.saveData(() => {
          that.save.innerHTML = "Save";
          that.save.className = "btn1 btn_disabled";
        })
      });

      on(
        this.logout,
        "click",
        function (evt) {
          document.location.reload(true);
        }.bind(this)
      );

      on(
        this.home,
        "click",
        function (evt) {
          this.goToPage(0);
        }.bind(this)
      );

      on(
        this.back,
        "click",
        function (evt) {
          this.goToPage(this.currentPage - 1);
        }.bind(this)
      );

      on(
        this.next,
        "click",
        function (evt) {
          this.goToPage(this.currentPage + 1);
        }.bind(this)
      );
    }

    goToPage(pageNumber) {
      this.pages[pageNumber].init(this.pages[this.currentPage]);
      this.currentPage = pageNumber;

      if (this.currentPage + 1 == this.pages.length) {
        this.next.style.visibility = "hidden";
      } else {
        this.next.style.visibility = "visible";
      }

      if (this.currentPage - 1 < 0) {
        this.back.style.visibility = "hidden";
      } else {
        this.back.style.visibility = "visible";
      }
    }

    addStartPage(title) {
      let page = new Page(this, this.pages.length, this.pageContainer, title);

      this.pages.push(page);
      this.loginPage = page;
      return page;
    }

    addPage(title) {
      let page;
      if (that.mode == "consolidation") {
        page = new Consolidation(
          this,
          this.pages.length,
          this.pageContainer,
          title
        );
      } else {
        page = this.addPageNormal(title, this.pageContainer);
      }

      // Add to page of content
      if (this.loginPage != null) {
        let pageNr = this.pages.length - 1;

        let elem = domCtr.create(
          "div",
          { class: "contentLink", innerHTML: pageNr + ". " + title },
          this.loginPage.page
        );
        elem.addEventListener("click", () => {
          this.goToPage(that.mode == "consolidation" ? pageNr + 1 : pageNr);
        });
      }
      return page;
    }

    addPageNormal(title, container) {
      let page = new Page(this, this.pages.length, container, title);
      this.pages.push(page);
      return page;
    }

    addFinalPage(title) {
      let page = new Page(this, this.pages.length, this.pageContainer, title);
      page.addElement("finalButton", "final", {
        text: "Hast du alle Fragen deines Auftrages beantwortet?",
        func: this.finalize,
      });
      this.pages.push(page);
      this.lastPage = page;

      return page;
    }

    loadInputs(data) {
      let elements = that.getAllElements(false);

      for (let item in data) {
        if (item in elements && data[item] != null) {
          elements[item].setter(data[item]);
          elements[item].setterUI(data[item]);
        }
      }
    }

    parseGroups(data) {
      console.log("Anzahl Gruppen: " + data.length.toFixed(0));

      let newData = {};
      for (let item in data[0].attributes) {
        newData[item] = {};
        for (let group = 0; group < data.length; group++) {
          newData[item][data[group].attributes["gruppe"]] =
            data[group].attributes[item];
        }
      }
      return newData;
    }

    loadInputsGroup(data, count) {
      let elements = that.getAllElements(false);

      for (let item in data) {
        if (Object.keys(elements).indexOf(item) > -1 && data[item] != null) {
          elements[item].setterGroups(data[item], count[item]);
        }
      }
    }

    countOccurence(data) {
      let elements = that.getAllElements(false);

      let dataAll = {};
      let count = {};

      for (let i in data) {
        if (Object.keys(elements).indexOf(i) > -1 && data[i] != null) {
          count[i] = {};
          let max = data[i][Object.keys(data[i])[0]];
          let avg = 0;
          for (let j in data[i]) {
            if (data[i][j] != null) {
              if (Object.keys(count[i]).includes(data[i][j])) {
                count[i][data[i][j]] += 1;
              } else {
                count[i][data[i][j]] = 1;
              }
              if (count[i][data[i][j]] > count[i][max]) {
                max = data[i][j];
              }
              if (+[data[i][j]] != NaN) {
                avg += +[data[i][j]];
              }
            }
          }
        
          if (elements[i].type == "sliderInput") {
            dataAll[i] = (avg / Object.keys(data[i]).length).toFixed(2);
          }
          else {
            dataAll[i] = max;
          }
          
        }
      }
      return { count: count, dataAll: dataAll };
    }

    checkInputs() {
      let elements = that.getAllElements(true);
      if (Object.values(elements).every((elem) => elem.value != null)) {
        that.lastPage.removeWarning();
        that.uploadData(elements);
      } else {
        that.lastPage.addWarning("Please fill in all the elements first!");
      }
    }

    finalize() {
      that.saveData(() => {
        that.lastPage.addWarning("The data was saved successfully!");
        window.open(
          that.offline? window.location.href.split("/").slice(0, -1).join("/")+ "/" + '/indexResultsOffline.html?project=' + that.projectId + '&group=' + that.groupId: window.location.href.split("/").slice(0, -1).join("/") + "/" + '/indexResults.html?project=' + that.projectId + '&group=' + that.groupId   ,  
        );
      })
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
      let data = {};
      for (let elem in elements) {
        data = { ...data, ...elements[elem].getter() };
      }
      return data;
    }

    uploadData(elements) {
      let data = this.parseElements(elements);

      return new Promise((resolve, reject) => {
        that.arcgis
          .updateFeature(this.objectId, data)
          .then((value) => {
            resolve(value);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    }

    checkKey(e) {
      e = e || window.event;

      if (e.keyCode == "38") {
        // up arrow
      } else if (e.keyCode == "40") {
        // down arrow
      } else if (e.keyCode == "37") {
        that.goToPage(that.currentPage - 1);
      } else if (e.keyCode == "39") {
        that.goToPage(that.currentPage + 1);
      }
    }
  };
});
