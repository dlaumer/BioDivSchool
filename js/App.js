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
    constructor(offline, mode, strings, version, callback) {
      that = this;
      that.pointsTotal = 0;
      that.projectAreaId = null;
      that.mode = mode;
      this.offline = offline;
      that.consolidationWidth = null;
      that.strings = strings;
      that.version = version;

      this.arcgis = new ArcGis(that.strings);


      that.showPoints = true;

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

      document.getElementById("btn_login").innerHTML = this.strings.get("loading");
      this.projectId = projectId;
      this.groupId = groupId;

      this.updateAttributes("project", this.projectId)
      this.updateAttributes("group", this.groupId)


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
              that.projectArea = area.totalArea;
              this.arcgis.checkData(that.projectId, that.groupId, (info) => {
                if (info != null) {
                  let data = info.data;
                  //this.saveJSON(data)
                  console.log(data);
                  that.objectId = info.objectId;
                  if (!info.newFeature) {
                    that.loadInputs(data.attributes);
                  }
                }
                this.initUI();
              });
            });

        });
      } else {

          that.content.init();

          var data = JSON.parse(exampleData);
          that.loadInputs(data.attributes);
        
          this.initUI();
        
      }
    }

    initProject(projectId) {

      document.getElementById("btn_login").innerHTML = this.strings.get("loading");
      this.projectId = projectId;

      this.updateAttributes("project", this.projectId)

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
      document.getElementById("btn_login").innerHTML = this.strings.get("loading");
      this.projectId = projectId;
      this.groupId = "all";

      this.updateAttributes("project", this.projectId)

      let that = this;

      if (!this.offline) {
        // Check if this project alreayd exists
        this.arcgis.checkDataProject(that.projectId, (info) => {
          that.projectAreaId = "[" + info.toFixed(0) + "]";
          that.content.init();

          this.arcgis
            .calculateArea(this.projectAreaId, "project")
            .then((area) => {
              this.projectArea = area.totalArea;
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
      domCtr.destroy("splashScreen");
      this.background.style.display = "block";
      /*
      console.log(Array.from(document.getElementsByClassName("esri-editor__feature-list-name")))
      Array.from(document.getElementsByClassName("esri-editor__feature-list-name")).forEach(function(item) {
        item.innerHTML = item.innerHTML.replace("Feature", that.strings.get("feature"))
     });
      for (let i in that.pages) {
        that.pages[i].page.style.display = "none"
      }
      */
      this.pages[0].init(null);
      this.currentPage = 0;
      // TODO Warning if did not work!
      this.userName.innerHTML =
        that.mode == "project"
          ? this.strings.get("project") + ": " + this.projectId
          : this.strings.get("project") + ": " + this.projectId + ", " + this.strings.get("group") + ": " + this.groupId;
      this.save.className = "btn1 btn_disabled";
      document.onkeydown = this.checkKey;

      this.home.style.display = that.mode == "project" ? "none" : "block";
      this.save.style.display = that.mode == "project" ? "none" : "block";
      this.next.style.display = that.mode == "project" && this.projectId == null ? "none" : "block";
      this.back.style.display = that.mode == "project" ? "none" : "block";

    }

    createUI() {
      this.background = domCtr.create(
        "div",
        { class: "background", style: "display: none" },
        win.body()
      );
      this.header = domCtr.create("div", { id: "header", className: "header" }, this.background);
      this.save = domCtr.create(
        "div",
        { id: "save", className: "btn1 btn_disabled", innerHTML: this.strings.get("save") },
        this.header
      );

      this.userName = domCtr.create("div", { id: "userName" }, this.header);
      this.startPage = domCtr.create(
        "div",
        { id: "startPage", className: "btn1", innerHTML: this.strings.get("startPage") },
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
          style: "justify-content: start;",
        },
        this.footer
      );
      this.home = domCtr.create(
        "div",
        {
          id: "btn_home",
          className: "btn2",
          innerHTML: this.strings.get("home"),
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
          innerHTML: this.strings.get("back"),
          style: "visibility:hidden",
        },
        this.footerCenter
      );
      this.next = domCtr.create(
        "div",
        { id: "btn_next", className: "btn1", innerHTML: this.strings.get("next") },
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
          innerHTML: that.mode == "project" | !that.showPoints ? "" : this.strings.get("totalPoints") + ": 0",
        },
        this.footerRight
      );

    }

    saveData(callback) {
      that.save.innerHTML = this.strings.get("saving");
      let elements = that.getAllElements(false);
      that.uploadData(elements).then((value) => {
        that.save.innerHTML = this.strings.get("save");
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
          that.save.innerHTML = this.strings.get("save");
          that.save.className = "btn1 btn_disabled";
        })
      });

      on(
        this.startPage,
        "click",
        function (evt) {
          let urlData = this.getJsonFromUrl();
          this.updateAttributes("mode", "start");
          this.removeAttributes("group");
            window.open(window.location.href, "_self")

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
          if (that.mode == "project") {
            window.open(window.location.href + "?intern=true&mode=start", "_self")

          }
          else {
            this.goToPage(this.currentPage + 1);
          }
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

    addPage(title, version) {
      if (!version || version && version.includes(that.version)) {
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
    }

    addPageNormal(title, container) {
      let page = new Page(this, this.pages.length, container, title);
      this.pages.push(page);
      return page;
    }

    addFinalPage(title) {
      let page = new Page(this, this.pages.length, this.pageContainer, title);
      let element = domCtr.create("div", { id: "finalElement", className: "element final" }, page.page);
      let final = domCtr.create("div", { id: "btn_final", className: "btn1", innerHTML: that.strings.get("results") }, element);

      on(final, "click", function (evt) {
        this.finalize();
      }.bind(this));
      this.pages.push(page);
      this.lastPage = page;

      return page;
    }

    loadInputs(data) {
      let elements = that.getAllElements(false);

      for (let item in data) {

        if (item in elements && data[item] != null) {
          if (elements[item].checkAllowedValues(data[item])) {
            elements[item].setter(data[item], false);
            elements[item].setterUI(data[item]);
          }
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
        that.lastPage.addWarning(that.strings.get("warnFillAll"));
      }
    }

    finalize() {
      that.saveData(() => {
        that.lastPage.addWarning(that.strings.get("warnSaveSuccess"));
        window.open(
          that.offline ? window.location.href.split("/").slice(0, -1).join("/") + "/" + '/indexResultsOffline.html?project=' + that.projectId + '&group=' + that.groupId : window.location.href.split("/").slice(0, -1).join("/") + "/" + '/indexResults.html?project=' + that.projectId + '&group=' + that.groupId   ,
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
    getJsonFromUrl() {
      var query = location.search.substr(1);
      var result = {};
      query.split("&").forEach(function (part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }
    updateAttributes(key, value) {
      // Construct URLSearchParams object instance from current URL querystring.
       var queryParams = new URLSearchParams(window.location.search);
       
       // Set new or modify existing parameter value. 
       queryParams.set(key, value);
       
       // Replace current querystring with the new one.
       history.replaceState(null, null, "?"+queryParams.toString());
           }
 
     removeAttributes(key) {
       // Construct URLSearchParams object instance from current URL querystring.
       var queryParams = new URLSearchParams(window.location.search);
       
       // Set new or modify existing parameter value. 
       queryParams.delete(key);
       
       // Replace current querystring with the new one.
       history.replaceState(null, null, "?"+queryParams.toString());
     }

    saveJSON(data) {
      let bl = new Blob([JSON.stringify(data)], {
         type: "text/html"
      });
      let a = document.createElement("a");
      a.href = URL.createObjectURL(bl);
      a.download = "data.json";
      a.hidden = true;
      document.body.appendChild(a);
      a.innerHTML =
         "someinnerhtml";
      a.click();
   }
  };
});
