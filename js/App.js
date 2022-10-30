/*
--------------
App.js
--------------
Main code base for sub-applications like collection, consolidation, results and projects! Depending on the `mode` property the codepath is slightly different. But since all sub-applications are so similar it makes sense to share most of the code.
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
      that.offline = offline;
      that.consolidationWidth = null;
      that.strings = strings;
      that.version = version;
      that.results = {};
      that.pages = [];
      that.pageNo = 0;
      that.mapLoadedPromises = [];

      that.arcgis = new ArcGis(that.strings);

      if (this.mode == "results") {
        that.showPoints = true;
      }
      else {
        that.showPoints = false;
      }

      if (!this.offline) {
        this.arcgis.init(() => {
          this.arcgis.initGeo(() => {
            this.arcgis.initProject(() => {
              this.createUI();
              this.clickHandler();
              
              callback();
            });
          });
        });
      } else {
        this.createUI();
        this.clickHandler();
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
          that.projectAreaId = "[" + info.getObjectId().toFixed(0) + "]";
          that.projectName = info.attributes["name"];
          that.schoolName = info.attributes["school"];
          that.content.init();

        
          this.arcgis
            .calculateArea(this.projectAreaId, "project")
            .then((area) => {
              that.projectArea = area.totalArea;
              this.arcgis.checkData(that.projectId, that.groupId, (info) => {
                if (info != null) {
                  let data = info.data;
                  //this.saveJSON(data)
                  that.objectId = info.objectId;
                  if (!info.newFeature) {
                    that.loadInputs(data.attributes);
                  }
                }
                this.initUI();
                if (that.mode == "results") {
                  /*
                  Promise.allSettled(that.mapLoadedPromises).then(() => {
                    console.log("All Maps loaded!")
                    that.print.classList.remove("btn_disabled");
                  })
                  */
                }
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
            that.projectName = data.attributes["name"];
            that.schoolName = data.attributes["school"];
            that.objectId = data.getObjectId();
            that.projectAreaId = "[" + that.objectId.toFixed(0) + "]";
            that.content.editProject();
            if (!info.newFeature) {
              that.loadInputs(data.attributes);
            }
            // Add the url for the collection
            var queryParams = new URLSearchParams(window.location.search);
            queryParams.set("mode", "collection");
            queryParams.delete("intern");
            let url = window.location.href.split("?")[0] + "?" + queryParams.toString();
            domCtr.create("div", { className: "labelText", innerHTML: that.strings.get("link") + ": <a href="+url+" target=_blank>"+url+"</a>", style: "width: 100%; margin-bottom: 10px;"}, document.getElementById("textInfo_Erfassung"));
            domCtr.create("div", { id: "qrcode"}, document.getElementById("textInfo_Erfassung"));

            new QRCode(document.getElementById("qrcode"), url);

          }
          else {
            that.content.makeNewProject();
          }
          this.initUI();
        });
      } else {
        that.content.makeNewProject();
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
          that.projectAreaId = "[" + info.getObjectId().toFixed(0) + "]";

          that.projectName = info.attributes["name"];
          that.schoolName = info.attributes["school"];

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
      if (that.projectId != "null") {
        this.infoBox.innerHTML =
        that.mode == "project"
          ? that.projectName + ", " + that.schoolName + " <small>(" + that.projectId + ")</small>"
          : that.projectName + ", " + that.schoolName + " <small>(" + that.projectId + ")</small>, " + this.strings.get("group") + ": " + this.groupId;
      }
      this.save.className = "btn1 btn_disabled";
      document.onkeydown = this.checkKey;

      this.home.style.display = that.mode == "project" ? "none" : "block";
      this.save.style.display = that.mode == "project" || that.mode == "results" ? "none" : "block";
      this.next.style.display = that.mode == "project" && this.projectId == null ? "none" : "block";
      this.back.style.display = that.mode == "project" ? "none" : "block";

      if (that.mode == "results") {
        that.makeTitlePage();
      }
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
        { id: "save", className: "saveInfo", innerHTML: this.strings.get("saved") },
        this.header
        );

      if (that.mode == "results") {
        this.print = domCtr.create(
          "div",
          { id: "print", className: "btn1 btn_disabled", innerHTML: this.strings.get("printWait") },
          this.header
          );
          setTimeout(() => {
            Promise.all(that.mapLoadedPromises).then(() => {
              this.print.innerHTML = this.strings.get("print")
              this.print.className = "btn1"
            })
          }, 1000);
          this.save.style.display = "none !important";
      }
        
      
       
      this.infoBox = domCtr.create("div", { id: "userName" }, this.header);
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
        that.save.innerHTML = this.strings.get("saved");
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

      if (that.mode == "results") {

        on(this.print, "click", () => {
         window.print();
        });
      }
            

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
      let page = new Page(this, this.pages.length, this.pageContainer, title + " - " + that.strings.get(that.mode));

      page.titleDiv.id = "startTitle";
      this.pages.push(page);
      this.loginPage = page;

      if (that.mode == "results") {
       domCtr.create("div",
          { class: "pageTitle title", id: "pointsTitle", innerHTML: that.strings.get("points") },
          page.page
        );
      }

      return page;
    }

    addPage(title, args = {}) {

      if (!args.version || args.version && args.version.includes(that.version)) {
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
        if (args.pointsInfo) {
          page.pointsInfo = args.pointsInfo;
        }

        // Add to page of content
        if (this.loginPage != null) {
          let pageNr = this.pages.length - 1;

          page.pageOverview = domCtr.create(
            "div",
            { class: "pageOverview" },
            this.loginPage.page
          );

          domCtr.create(
            "div",
            { class: "contentLink", innerHTML: (that.pageNo + 1) + ". " + title },
            page.pageOverview
          );
          page.pageOverview.addEventListener("click", () => {
            this.goToPage(that.mode == "consolidation" ? pageNr + 1 : pageNr);
          });

        }
        that.pageNo = that.pageNo + 1;
        return page;
      }
    }

    addPageNormal(title, container) {
      let page = new Page(this, this.pages.length, container, title);
      this.pages.push(page);
      return page;
    }

    addFinalPage(title) {
      if (that.mode != "results") {
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
     
    }

    loadInputs(data) {
      let elements = that.getAllElements(false);
      let setterPromises = [];
      for (let item in data) {

        if (item in elements && data[item] != null) { 
          if (elements[item].checkAllowedValues(data[item])) {
            setterPromises.push(elements[item].setter(data[item], false).then(() => {
              elements[item].setterUI(data[item]);

            }));
          }
        }
      }
      if (that.mode == "results") {
        Promise.all(setterPromises).then(() => {
          that.parseResults();
        })
      }

    }

    parseGroups(data) {
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

    parseResults() {
      
      for (let i in that.pages) {
        let page = that.pages[i];

        if (i == 0 || page == that.lastPage) { continue }; // The first and last pages have no elements
        let points = 0;
        let maxPoints = 0;
        let minPoints = 0;
        for (let j in page.elements) {
          let element = page.elements[j];
          // 1. if it's a map element, get the ids
          if (element.type == "mapInput") {
            let layerData = { name: element.key, value: element.value, color: element.color, name_display: element.name_display };
            if (!Object.keys(that.results).includes("mapLayers")) {
              that.results.mapLayers = []
            }
            that.results.mapLayers.push(layerData);
          }

          // 2. Read the points, and also the min and max points of this element
          if (element.hasPoints) {
            points += element.points;
            maxPoints += element.maxPoints;
            minPoints += element.minPoints;
          }

        }
      
        let pointBar = domCtr.create(
          "div",
          { class: "pointsBar pointsNumber" },
          page.pageOverview
        );

        domCtr.create("div",
          { style: "width:" + (100 / (maxPoints - minPoints) * (points - minPoints)).toFixed(0) + "%" },
          pointBar
        );

        let label = domCtr.create("div",
          { class: "labelPoints", innerHTML: points + " " + that.strings.get("points") },
          pointBar
        );



        let bubble = domCtr.create("div",
          { class: "bubbleResults" },

          label
        );

        let colorBar = domCtr.create(
          "div",
          { class: "pointsBar colorBar" },
          page.pageOverview
        );
        let red = domCtr.create(
          "div",
          { class: "red", style: "width:" + (100 / (maxPoints - minPoints) * (page.pointsInfo[0] - minPoints)).toFixed(0) + "%" },
          colorBar
        );
        let orange = domCtr.create(
          "div",
          { class: "orange", style: "width:" + (100 / (maxPoints - minPoints) * (page.pointsInfo[1] - page.pointsInfo[0])).toFixed(0) + "%" },
          colorBar
        );
        let green = domCtr.create(
          "div",
          { class: "green", style: "width:" + (100 / (maxPoints - minPoints) * (maxPoints - page.pointsInfo[1])).toFixed(0) + "%" },
          colorBar
        );

        let pointsLabels = domCtr.create(
          "div",
          { class: "pointsBar pointsLabels" },
          page.pageOverview
        );
        domCtr.create("div",
          { id: "green", class: "labelElement", innerHTML: minPoints },
          pointsLabels
        );
        domCtr.create("div",
          { id: "green", class: "labelElement", innerHTML: page.pointsInfo[0], style: "width:" + (100 / (maxPoints - minPoints) * (page.pointsInfo[0] - minPoints)).toFixed(0) + "%" },
          pointsLabels
        );
        domCtr.create(
          "div",
          { id: "orange", class: "labelElement", innerHTML: page.pointsInfo[1], style: "width:" + (100 / (maxPoints - minPoints) * (page.pointsInfo[1] - page.pointsInfo[0])).toFixed(0) + "%" },
          pointsLabels
        );
        domCtr.create(
          "div",
          { id: "green", class: "labelElement", innerHTML: maxPoints, style: "width:" + (100 / (maxPoints - minPoints) * (maxPoints - page.pointsInfo[1])).toFixed(0) + "%" },
          pointsLabels
        );

        if (points <= page.pointsInfo[0]) {
          label.style.color = "rgba(255,0,0,1)";
          bubble.style.backgroundColor = "rgba(255,0,0,1)";
          //bubble.style.border  = "2px solid rgba(255,0,0,1)";

        }
        else if (points >= page.pointsInfo[0] && points <= page.pointsInfo[1]) {
          label.style.color = "rgba(255, 192,0,1)";
          bubble.style.backgroundColor = "rgba(255, 192,0,1)";
          //bubble.style.border  = "2px solid rgba(255, 192,0,1)";


        }
        else {
          label.style.color = "rgba(0, 176, 80,1)";
          bubble.style.backgroundColor = "rgba(0, 176, 80,1)";
          //bubble.style.border = "2px solid rgba(0, 176, 80,1)";


        }

      }
      domCtr.create("div",
          { class: "pageTitle title", innerHTML: that.strings.get("areas") },
          this.loginPage.page
        );

      let map = domCtr.create("div", { className: "mapOverviewResults" }, this.loginPage.page);
      this.loginPage.mapResults = domCtr.create("div", { className: "mapOverviewResultsMap" }, map);
      this.screenshotDiv = domCtr.create("img", { className: "screenshot" }, map);
      this.loginPage.legendResults = domCtr.create("div", { className: "mapOverviewResultsLegend" }, map);
      that.arcgis.addMapResults(this.loginPage.mapResults, this.loginPage.legendResults, that.results.mapLayers, this.screenshotDiv)
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
        this.updateAttributes("mode", "results");
          this.updateAttributes("group", that.groupId);

          window.open(window.location.href, "_self");
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


    makeTitlePage() {
      this.titlePage = domCtr.create("div", { id: "titlePage"});
      domCtr.place(this.titlePage, this.header, "before");
      domCtr.create("div", { id: "title", innerHTML: that.strings.get("titlePdf") }, this.titlePage);
      domCtr.create("div", { id: "school", className: "titleInfo", innerHTML:  that.strings.get("school") + ": " + that.schoolName}, this.titlePage);
      domCtr.create("div", { id: "location", className: "titleInfo", innerHTML: that.strings.get("location") + ": " + that.projectName }, this.titlePage);

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
      history.replaceState(null, null, "?" + queryParams.toString());
    }

    removeAttributes(key) {
      // Construct URLSearchParams object instance from current URL querystring.
      var queryParams = new URLSearchParams(window.location.search);

      // Set new or modify existing parameter value. 
      queryParams.delete(key);

      // Replace current querystring with the new one.
      history.replaceState(null, null, "?" + queryParams.toString());
    }

    saveJSON(data) {
      let bl = new Blob([JSON.stringify(data)], {
        type: "text/html"
      });
      let a = document.createElement("a");
      a.href = URL.createObjectURL(bl);
      a.download = "data2.json";
      a.hidden = true;
      document.body.appendChild(a);
      a.innerHTML =
        "someinnerhtml";
      a.click();
    }
  };
});
