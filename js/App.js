/*
--------------
App.js
--------------
Main code base for sub-applications like collection, consolidation, results and projects! Depending on the `mode` property the codepath is slightly different. But since all sub-applications are so similar it makes sense to share most of the code.
*/
let app = null;

define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",
  "biodivschool/Chapter",

  "biodivschool/ArcGis",
  "biodivschool/Start",
  "biodivschool/Page",
  "biodivschool/Settings"

], function (dom, domCtr, win, on, Chapter, ArcGis, Start, Page, Settings) {
  return class App {
    constructor(offline, mode, strings, version, callback) {
      app = this;
      app.pointsTotal = 0;
      app.projectAreaId = null;
      app.buildingsArea = null;
      app.mode = mode;
      app.offline = offline;
      app.consolidationWidth = null;
      app.strings = strings;
      app.version = version;
      app.results = {};
      app.chapters = [];
      app.pages = [];
      app.chapterNo = 0;
      app.mapLoadedPromises = [];
      app.currentChapter = null;

      if (this.mode == "results") {
        app.showPoints = true;
      }
      else {
        app.showPoints = false;
      }

      if (this.mode == "collection" || this.mode == "consolidation" || this.mode == "project") {
        app.editMode = true
      }
      else {
        app.editMode = false
      }

      app.arcgis = new ArcGis(app.editMode, app.strings, () => {
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
      });
    }

    // Init function for collection and results
    init(projectId, groupId) {

      this.projectId = projectId;
      this.updateAttributes("project", this.projectId)

      if (app.mode != "project") {
        this.groupId = groupId;

        if (app.mode == "collection" || app.mode == "results") {
          this.updateAttributes("group", this.groupId)
        }
      }


      if (!this.offline) {

        // Only used this to change some data on AGO
        //this.arcgis.switchTextToKey();

        // Check if this project alreayd exists
        this.arcgis.checkDataProject(app.projectId, (info) => {
          app.projectAreaId = "[" + info.getObjectId().toFixed(0) + "]";
          app.buildingsAreaId = info.attributes["gebaeude_geomoid"];
          app.projectName = info.attributes["name"];
          app.schoolName = info.attributes["school"];
          app.buildings = info.attributes["gebaeude_geomoid"];
          app.content.init();
          this.addFinalPage()

          this.arcgis
            .calculateArea(this.projectAreaId, "project")
            .then((area) => {
              this.arcgis.calculateArea(this.buildingsAreaId)
                .then((areaBuildings) => {
                  app.buildingsArea = areaBuildings.totalArea;
                  app.projectArea = area.totalArea;

                  if (app.mode == "collection" || app.mode == "results") {
                    this.arcgis.checkData(app.projectId, app.groupId, (info) => {
                      if (info != null) {
                        let data = info.data;
                        //this.saveJSON(data)
                        app.objectId = info.objectId;
                        if (!info.newFeature) {
                          app.loadInputs(data.attributes);
                        }
                      }
                      if (app.mode == "collection") {
                        let versionData = {
                          "version": this.version
                        }
                        app.arcgis
                          .updateFeature(app.objectId, versionData)
                          .then((value) => {
                            if (groupId == "all") {
                              app.arcgis
                                .updateFeature(app.projectId, versionData, true)
                                .then((value) => {
                                  this.initUI();
                                })
                                .catch((reason) => {
                                  alert(reason)
                                })
                            }
                            else {
                              this.initUI();
                            }
                          })
                          .catch((reason) => {
                            alert(reason)
                          })
                      }
                      else {
                        this.initUI()
                      }
                    });
                  }
                });
            });
          if (app.mode == "consolidation") {
            this.arcgis.checkDataGroups(app.projectId, (data) => {
              let dataGroups = app.parseGroups(data);
              let occurences = app.countOccurence(dataGroups);
              app.loadInputsGroup(dataGroups, occurences.count);
              this.arcgis.checkData(app.projectId, app.groupId, (info) => {
                let data = info.data;
                app.objectId = info.objectId;
                if (!info.newFeature) {
                  app.loadInputs(data.attributes);
                }
                let versionData = {
                  "version": this.version
                }
                app.arcgis
                  .updateFeature(app.objectId, versionData)
                  .then((value) => {
                    app.arcgis
                      .updateFeature(app.projectId, versionData, true)
                      .then((value) => {
                        this.initUI();
                      })
                      .catch((reason) => {
                        alert(reason)
                      })
                  })
                  .catch((reason) => {
                    alert(reason)
                  })

              });
            });
          }

        });
      } else {

        app.content.init();

        if (app.mode == "collection" || app.mode == "results") {
          var data = JSON.parse(exampleData);
          app.loadInputs(data.attributes);
        }

        this.initUI();

      }
    }

    // init function for project
    initProject(projectId) {

      this.projectId = projectId;
      this.updateAttributes("project", this.projectId)
      this.removeAttributes("page")

      // Add a new element in the database
      if (!this.offline) {
        this.arcgis.checkData(app.projectId, null, (info) => {
          if (info != null) {
            let data = info.data;
            app.projectName = data.attributes["name"];
            app.schoolName = data.attributes["school"];
            app.buildings = data.attributes["gebaeude_geomoid"]
            app.objectId = data.getObjectId();

            app.projectAreaId = "[" + app.objectId.toFixed(0) + "]";
            app.content.editProject();
            if (!info.newFeature) {
              app.loadInputs(data.attributes);
            }
            // Add the url for the collection
            var queryParams = new URLSearchParams(window.location.search);
            queryParams.set("mode", "collection");
            queryParams.delete("admin");
            let url = window.location.href.split("?")[0];
            domCtr.create("div", { className: "labelText", innerHTML: app.strings.get("link") + ": <a href=" + url + " target=_blank>" + url + "</a>", style: "width: 100%; margin-bottom: 10px;" }, document.getElementById("textInfo_" + app.strings.get("P06.title.1")));
            domCtr.create("div", { id: "qrcode" }, document.getElementById("textInfo_" + app.strings.get("P06.title.1")));

            new QRCode(document.getElementById("qrcode"), url);
            this.delete.classList.remove("btn_disabled")
          }
          else {
            app.content.makeNewProject();
          }
          this.initUI();
        });
      } else {
        app.content.makeNewProject();
        this.initUI();
      }
    }

    // init function for consolidation
    initConsolidation(projectId) {
      this.projectId = projectId;
      this.updateAttributes("project", this.projectId)

      this.groupId = "all";


      if (!this.offline) {
        // Check if this project alreayd exists
        this.arcgis.checkDataProject(app.projectId, (info) => {
          app.projectAreaId = "[" + info.getObjectId().toFixed(0) + "]";
          app.projectName = info.attributes["name"];
          app.schoolName = info.attributes["school"];
          app.content.init();
          this.addFinalPage()

          this.arcgis
            .calculateArea(this.projectAreaId, "project")
            .then((area) => {
              this.arcgis.calculateArea(this.buildingsAreaId)
                .then((areaBuildings) => {
                  app.buildingsArea = areaBuildings.totalArea;
                  app.projectArea = area.totalArea;
                });
            });
          this.arcgis.checkDataGroups(app.projectId, (data) => {
            let dataGroups = app.parseGroups(data);
            let occurences = app.countOccurence(dataGroups);
            app.loadInputsGroup(dataGroups, occurences.count);
            this.arcgis.checkData(app.projectId, app.groupId, (info) => {
              let data = info.data;
              app.objectId = info.objectId;
              if (!info.newFeature) {
                app.loadInputs(data.attributes);
              }


              this.initUI();
            });
          });
        });
      } else {
        app.content.init();
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
        item.innerHTML = item.innerHTML.replace("Feature", app.strings.get("feature"))
     });
      for (let i in app.chapters) {
        app.chapters[i].page.style.display = "none"
      }
      */
      this.pages[0].init(null);
      this.currentPage = 0;

      if (app.mode == "project" && (this.pages[0].element.value == "" || this.pages[0].element.value == null)) {
        this.next.style.visibility = "hidden";
      }

      let urlData = this.getJsonFromUrl();

      if (Object.keys(urlData).includes("page")) {
        this.goToPage(parseInt(urlData["page"]))
      }
      else {
        this.goToPage(0)
      }
      // TODO Warning if did not work!
      if (app.projectId != "null") {
        this.infoBoxInfo.innerHTML =
          app.mode == "project"
            ? app.schoolName
            : app.schoolName + ", " + this.strings.get("group") + ": " + this.strings.get(this.groupId) + ", " + this.strings.get("versionLabel") + ": " + this.strings.get(this.version);
      }
      this.save.className = "btn1 btn_disabled";
      document.onkeydown = this.checkKey;

      this.save.style.display = app.mode == "project" || app.mode == "results" ? "none" : "block";

      if (app.mode == "results") {
        app.makeTitlePage();
      }
    }

    createUI() {
      this.background = domCtr.create(
        "div",
        { class: "background", style: "display: none" },
        win.body()
      );

      this.header = domCtr.create("div", { id: "header" }, this.background);

      this.headerLeft = domCtr.create("div", { id: "headerLeft", className: "header1" }, this.header);
      
      this.startButton = domCtr.create(
        "div",
        {
          id: "btn_project_new",
          className: "btn1",
        },
        this.headerLeft
      );

      domCtr.create(
        "img",
        {
          className: "btn_icon",
          src: "./img/Icons/Arrow_black.svg",
        },
        this.startButton
      );
      domCtr.create(
        "div",
        {
          className: "btn_label",
          innerHTML: this.strings.get("startButton"),
        },
        this.startButton
      );

      this.save = domCtr.create(
        "div",
        { id: "save", className: "saveInfo", innerHTML: this.strings.get("saved") },
        this.headerLeft
      );

      if (app.mode == "results") {
        this.print = domCtr.create(
          "div",
          { id: "print", className: "btn1 btn_disabled", innerHTML: this.strings.get("printWait") },
          this.headerLeft
        );
        setTimeout(() => {
          Promise.all(app.mapLoadedPromises).then(() => {
            this.print.innerHTML = this.strings.get("print")
            this.print.className = "btn1"
          })
        }, 1000);
        this.save.style.display = "none !important";
      }

      if (app.mode == "project") {
        this.delete = domCtr.create(
          "div",
          { id: "delete", className: "btn1 btn_disabled", innerHTML: this.strings.get("delete") },
          this.headerLeft
        );
      }



      this.infoBox = domCtr.create("div", { id: "infoBox" }, this.headerLeft);
      this.infoBoxTitle = domCtr.create("div", { id: "infoBoxTitle", innerHTML: this.strings.get(this.mode) }, this.infoBox);
      this.infoBoxInfo = domCtr.create("div", { id: "infoBoxInfo" }, this.infoBox);



      this.headerCenter = domCtr.create("div", { id: "headerCenter", className: "header2" }, this.header);

      this.chapterLinks = domCtr.create("div", { id: "chapterLinks", className: "chapterLinks" }, this.headerCenter);

      this.headerRight = domCtr.create("div", { id: "headerRight", className: "header3" }, this.header);

      let settings = new Settings(this.strings, this.mode, this.version);
      settings.addSettings(this.headerRight)

      this.pageContainer = domCtr.create(
        "div",
        { id: "pageContainer" },
        this.background
      );


      this.footer = domCtr.create("div", { id: "footer", className: "footer" }, this.background);


      this.navigationBar = domCtr.create("div", { id: "navigationBar", className: "navigationBar" }, this.footer);

      
      this.back = domCtr.create(
        "div",
        {
          id: "btn_back",
          className: "btn1 secondaryButton",
          style: "visibility:hidden;",

        },
        this.navigationBar
      );
      domCtr.create(
        "img",
        {
          className: "btn_icon",
          src: "./img/Icons/Arrow_black.svg",
        },
        this.back
      );
      domCtr.create(
        "div",
        {
          className: "btn_label",
          innerHTML: this.strings.get("back"),
        },
        this.back
      );
     

      this.pointsTotalDiv = domCtr.create(
        "div",
        {
          id: "pointsTotalInfo",
          className: "pointsInfo",
          innerHTML: app.mode == "project" | !app.showPoints ? "" : this.strings.get("totalPoints") + ": 0",
        },
        this.navigationBar
      );


      
      this.next = domCtr.create(
        "div",
        {
          id: "btn_next",
          className: "btn1 primaryButton",
        },
        this.navigationBar
      );

      domCtr.create(
        "div",
        {
          className: "btn_label",
          innerHTML: this.strings.get("next"),
        },
        this.next
      );
      domCtr.create(
        "img",
        {
          className: "btn_icon btn_icon_active",
          src: "./img/Icons/Arrow_black.svg",
          style: "transform:scale(-1,1)"
        },
        this.next
      );

      this.footerBar = domCtr.create("div", { id: "footerBar", className: "footerBar", style: "display:none" }, this.footer);
      this.logo1 = domCtr.create("img", { src: "img/Logos/aplus.png", className: "logos" }, this.footerBar);
      this.logo2 = domCtr.create("img", { src: "img/Logos/phsg.jpg", className: "logos" }, this.footerBar);
      this.logo3 = domCtr.create("img", { src: "img/Logos/somaha.jpg", className: "logos" }, this.footerBar);


    }

    saveData(callback) {
      app.save.innerHTML = this.strings.get("saving");
      let elements = app.getAllElements(false);
      app.uploadData(elements).then((value) => {
        app.save.innerHTML = this.strings.get("saved");
        callback()
      });
      /*
        .catch((reason) => {
          app.save.innerHTML = "Save";
          alert("Saving not successful");
          console.log(reason);
        });
        */
    }

    moveChapterLinks(location) {

      if (location == "header") {
        domCtr.place(this.chapterLinks, this.headerCenter, "first")
      }
      else if (location == "bottom") {
        domCtr.place(this.chapterLinks, this.footer, "last")

      }

    }

    clickHandler() {

      if (app.mode == "results") {

        on(this.print, "click", () => {
          window.print();
        });
      }

      if (app.mode == "project") {

        on(this.delete, "click", () => {
          if (confirm(app.strings.get("deleteConfirm"))) {
            app.arcgis.deleteProject(app.projectAreaId).then(() => {
              this.updateAttributes("mode", "start");
              this.removeAttributes("group");
              window.open(window.location.href, "_self")
            });
          }


        });
      }


      on(
        this.startButton,
        "click",
        function (evt) {
          this.updateAttributes("mode", "start");
          this.removeAttributes("group");
          this.removeAttributes("page");
          window.open(window.location.href, "_self")

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
      if (this.pages[this.currentPage].element) {
        this.pages[this.currentPage].element.linkButton.classList.remove("subHeaderLinkCurrent")

      }

      if (this.pages[pageNumber].hidden) {
        if (this.currentPage - pageNumber > 0) {
          this.goToPage(pageNumber - 1)

        }
        else {
          this.goToPage(pageNumber + 1)

        }
      }
      else {
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
        if (app.mode == "project" && (this.pages[pageNumber].element.value == "" || this.pages[pageNumber].element.value == null)) {
          this.next.style.visibility = "hidden";
        }
        this.updateAttributes("page", pageNumber);
      }

      if (this.pages[this.currentPage].element) {

        this.pages[this.currentPage].element.linkButton.classList.add("subHeaderLinkCurrent")

      }
      // Update the selected Chapter;
      if (app.currentChapter != null) {
        app.currentChapter.pageOverview.classList.remove("radioButtonContainerSelected");
        app.currentChapter.subHeader.style.display = "none"

      }
      let chapter = this.determineChapter(pageNumber);
      chapter.pageOverview.classList.add("radioButtonContainerSelected")
      app.currentChapter = chapter;
      chapter.subHeader.style.display = "flex"

    }

    determineChapter(pageNumber) {
      let chapter = app.chapters[0];

      for (let i = 0; i < app.chapters.length; i++) {
        chapter = app.chapters[i];
        if (i == app.chapters.length - 1) {
          break;
        }
        else {
          let nextChapter = app.chapters[i + 1];
          if (pageNumber >= chapter.firstPageNr && pageNumber < nextChapter.firstPageNr) {
            break;
          }
        }


      }
      return chapter;

    }

    addZeroPage(title) {
      if (app.mode == "results") {
        let chapter = new Chapter(this.chapters.length, title + " - " + app.strings.get(app.mode));

        chapter.pages[0].titleDiv.id = "startTitle";
        this.chapters.push(chapter);
        this.loginPage = chapter;

        chapter.pageOverviewContainer = domCtr.create(
          "div",
          { class: "chapterLinkContainer" },
          this.chapterLinks
        );
        chapter.pageOverview = domCtr.create(
          "div",
          { class: "chapterLink", innerHTML: "0" },
          chapter.pageOverviewContainer
        );
        chapter.pageOverviewLabel = domCtr.create(
          "div",
          { class: "chapterLinkLabel", innerHTML: app.strings.get("results") },
          chapter.pageOverviewContainer
        );
        chapter.pageOverview.addEventListener("click", () => {
          this.goToPage(0);
        });

        if (app.mode == "results") {
          domCtr.create("div",
            { class: "pageTitle title", id: "pointsTitle", innerHTML: app.strings.get("points") },
            chapter.chapter
          );
        }

        chapter.subHeader = domCtr.create("div", { id: "subHeader", className: "subHeader" });
        domCtr.place(chapter.subHeader, this.header, "after")
        return chapter;
      }

    }

    addChapter(title, args = {}) {
      title = app.strings.get(title);
      if (!args.version || args.version && args.version.includes(app.version)) {

        let chapter = new Chapter(this.chapters.length, title)

        if (args.pointsInfo) {
          chapter.pointsInfo = args.pointsInfo;
        }
        chapter.pageOverviewContainer = domCtr.create(
          "div",
          { class: "chapterLinkContainer" },
          this.chapterLinks
        );
        chapter.pageOverview = domCtr.create(
          "div",
          { class: "chapterLink", innerHTML: app.mode == "results" ? (this.chapters.length).toString() : (this.chapters.length + 1).toString() },
          chapter.pageOverviewContainer
        );
        chapter.pageOverviewLabel = domCtr.create(
          "div",
          { class: "chapterLinkLabel", innerHTML: chapter.title },
          chapter.pageOverviewContainer
        );
        chapter.pageOverview.addEventListener("click", () => {
          this.goToPage(chapter.firstPageNr);
        });

        chapter.subHeader = domCtr.create("div", { id: "subHeader", className: "subHeader" });
        domCtr.place(chapter.subHeader, this.header, "after")


        // Add to chapter of content
        if (this.loginPage != null) {
          let chapterNr = this.chapters.length - 1;

          chapter.pageOverviewResults = domCtr.create(
            "div",
            { class: "pageOverview" },
            this.loginPage.pages[0].page
          );

          domCtr.create(
            "div",
            { class: "contentLink", innerHTML: (app.chapterNo + 1) + ". " + title },
            chapter.pageOverviewResults
          );
          chapter.pageOverviewResults.addEventListener("click", () => {
            this.goToPage(chapter.firstPageNr);
          });

        }
        this.chapters.push(chapter);
        app.chapterNo = app.chapterNo + 1;
        return chapter;
      }
    }
    addFinalPage() {
      let title = app.strings.get("finalPage");

      let page = new Page("page_" + app.pages.length.toString(), app.pageContainer, title);
      app.pages.push(page);

      let element = domCtr.create("div", { id: "finalElement", className: "element final" }, page.page);


      this.loadingIcon = domCtr.create(
        "lord-icon",
        {
          id: "loadingIcon",
          src: "https://cdn.lordicon.com/dlmpudxq.json",
          colors: "primary:#a2c367,secondary:#ffc738,tertiary:#b26836",
          trigger: "loop",
          style: "width:100px;height:100px"
        },
        element
      );

      let text = domCtr.create("div", { innerHTML: this.strings.get("finalMessage") }, element);

      this.footerBar = domCtr.create("div", { id: "footerBar", className: "footerBar footerBarStart" }, page.page);
      this.logo1 = domCtr.create("img", { src: "img/Logos/aplus.png", className: "logos" }, this.footerBar);
      this.logo2 = domCtr.create("img", { src: "img/Logos/phsg.jpg", className: "logos" }, this.footerBar);
      this.logo3 = domCtr.create("img", { src: "img/Logos/somaha.jpg", className: "logos" }, this.footerBar);
      this.logo4 = domCtr.create("img", { src: "img/Logos/hamasil.png", className: "logos" }, this.footerBar);




      return page;


    }

    loadInputs(data) {
      let elements = app.getAllElements(false);
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
      if (app.mode == "results") {
        Promise.all(setterPromises).then(() => {
          app.parseResults();
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

      for (let i in app.chapters) {
        let chapter = app.chapters[i];

        if (i == 0 || chapter == app.lastChapter) { continue }; // The first and last pages have no elements
        let points = 0;
        let maxPoints = 0;
        let minPoints = 0;
        for (let j in chapter.pages) {
          let element = chapter.pages[j].element;
          // 1. if it's a map element, get the ids
          if (element.type == "mapInput") {
            let layerData = { name: element.key, value: element.value, color: element.color, name_display: element.name_display };
            if (!Object.keys(app.results).includes("mapLayers")) {
              app.results.mapLayers = []
            }
            app.results.mapLayers.push(layerData);
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
          chapter.pageOverviewResults
        );

        domCtr.create("div",
          { style: "width:" + (100 / (maxPoints - minPoints) * (points - minPoints)).toFixed(0) + "%" },
          pointBar
        );

        let label = domCtr.create("div",
          { class: "labelPoints", innerHTML: points + " " + app.strings.get("points") },
          pointBar
        );



        let bubble = domCtr.create("div",
          { class: "bubbleResults" },

          label
        );

        let colorBar = domCtr.create(
          "div",
          { class: "pointsBar colorBar" },
          chapter.pageOverviewResults
        );
        let red = domCtr.create(
          "div",
          { class: "red", style: "width:" + (100 / (maxPoints - minPoints) * (chapter.pointsInfo[app.version][0] - minPoints)).toFixed(0) + "%" },
          colorBar
        );
        let orange = domCtr.create(
          "div",
          { class: "orange", style: "width:" + (100 / (maxPoints - minPoints) * (chapter.pointsInfo[app.version][1] - chapter.pointsInfo[app.version][0])).toFixed(0) + "%" },
          colorBar
        );
        let green = domCtr.create(
          "div",
          { class: "green", style: "width:" + (100 / (maxPoints - minPoints) * (maxPoints - chapter.pointsInfo[app.version][1])).toFixed(0) + "%" },
          colorBar
        );

        let pointsLabels = domCtr.create(
          "div",
          { class: "pointsBar pointsLabels" },
          chapter.pageOverviewResults
        );
        domCtr.create("div",
          { id: "green", class: "labelElement", innerHTML: minPoints },
          pointsLabels
        );
        domCtr.create("div",
          { id: "green", class: "labelElement", innerHTML: chapter.pointsInfo[app.version][0], style: "width:" + (100 / (maxPoints - minPoints) * (chapter.pointsInfo[app.version][0] - minPoints)).toFixed(0) + "%" },
          pointsLabels
        );
        domCtr.create(
          "div",
          { id: "orange", class: "labelElement", innerHTML: chapter.pointsInfo[app.version][1], style: "width:" + (100 / (maxPoints - minPoints) * (chapter.pointsInfo[app.version][1] - chapter.pointsInfo[app.version][0])).toFixed(0) + "%" },
          pointsLabels
        );
        domCtr.create(
          "div",
          { id: "green", class: "labelElement", innerHTML: maxPoints, style: "width:" + (100 / (maxPoints - minPoints) * (maxPoints - chapter.pointsInfo[app.version][1])).toFixed(0) + "%" },
          pointsLabels
        );

        if (points <= chapter.pointsInfo[app.version][0]) {
          label.style.color = "rgba(255,0,0,1)";
          bubble.style.backgroundColor = "rgba(255,0,0,1)";
          //bubble.style.border  = "2px solid rgba(255,0,0,1)";

        }
        else if (points >= chapter.pointsInfo[app.version][0] && points <= chapter.pointsInfo[app.version][1]) {
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
      /*
      domCtr.create("div",
          { class: "pageTitle title", id: "title_areas",innerHTML: app.strings.get("areas") },
          this.loginPage.chapter
        );
*
      let map = domCtr.create("div", { className: "mapOverviewResults" }, this.loginPage.chapter);
      this.loginPage.mapResults = domCtr.create("div", { className: "mapOverviewResultsMap" }, map);
      this.screenshotDiv = domCtr.create("img", { className: "screenshot" }, map);
      this.loginPage.legendResults = domCtr.create("div", { className: "mapOverviewResultsLegend" }, map);
      app.arcgis.addMapResults(this.loginPage.mapResults, this.loginPage.legendResults, app.results.mapLayers, this.screenshotDiv)
    */
    }


    loadInputsGroup(data, count) {
      let elements = app.getAllElements(false);

      for (let item in data) {
        if (Object.keys(elements).indexOf(item) > -1 && data[item] != null) {
          elements[item].setterGroups(data[item], count[item]);
        }
      }
    }

    countOccurence(data) {
      let elements = app.getAllElements(false);

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
      let elements = app.getAllElements(true);
      if (Object.values(elements).every((elem) => elem.value != null)) {
        app.lastChapter.removeWarning();
        app.uploadData(elements);
      } else {
        app.lastChapter.addWarning(app.strings.get("warnFillAll"));
      }
    }

    finalize() {
      app.saveData(() => {
        app.lastChapter.addWarning(app.strings.get("warnSaveSuccess"));
        this.updateAttributes("mode", "results");
        this.updateAttributes("group", app.groupId);

        window.open(window.location.href, "_self");
      })
    }

    getAllElements(checkIfSet) {
      let data = {};
      for (let chapterIndex in app.chapters) {
        let chapter = app.chapters[chapterIndex];
        if (chapter != app.lastChapter) {
          if (app.mode == "results" && chapterIndex == "0") {
            continue;
          }
          for (let pageIndex in chapter.pages) {
            let elem = chapter.pages[pageIndex].element;
            if (elem) {
              if (checkIfSet) {
                elem.checkValueSet();
              }
              data[elem.key] = elem;
            }

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
        app.arcgis
          .updateFeature(this.objectId, data)
          .then((value) => {
            resolve(value);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    }

    replaceWithText(elem) {
      let elems = elem.querySelectorAll('.textual');
      if (elems.length > 0) {
        for (let i = 0; i < elems.length; i++) {
          elems[i].innerHTML = app.strings.get(elems[i].textContent)
          //elems[i].innerHTML = elems[i].textContent
        }
      }

    }
    checkKey(e) {
      e = e || window.event;

      if (e.keyCode == "38") {
        // up arrow
      } else if (e.keyCode == "40") {
        // down arrow
      } else if (e.keyCode == "37") {
        app.goToPage(app.currentPage - 1);
        e.preventDefault();

      } else if (e.keyCode == "39") {
        app.goToPage(app.currentPage + 1);
        e.preventDefault();

      }
    }


    makeTitlePage() {
      this.titlePage = domCtr.create("div", { id: "titlePage" });
      domCtr.place(this.titlePage, this.header, "before");
      domCtr.create(
        "lord-icon",
        {
          id: "loadingIcon",
          src: "https://cdn.lordicon.com/dlmpudxq.json",
          colors: "primary:#a2c367,secondary:#ffc738,tertiary:#b26836",
          style: "width:100px;height:100px"
        },
        this.titlePage
      );

      domCtr.create("div", { id: "title", innerHTML: app.strings.get("titlePdf") }, this.titlePage);
      domCtr.create("div", { id: "school", className: "titleInfo", innerHTML: app.strings.get("school") + ": " + app.schoolName }, this.titlePage);
      domCtr.create("div", { id: "location", className: "titleInfo", innerHTML: app.strings.get("location") + ": " + app.projectName }, this.titlePage);

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
