/*
--------------
Start.js
--------------
Landing page before where you see the different projects

*/
let start = null;
// ssh-add ~/.ssh/ssh_rsa_dlaumer
define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",

  "biodivschool/Content",
  "biodivschool/ArcGis",
  "biodivschool/StringsApp",
], function (dom, domCtr, win, on, Content, ArcGis, StringsApp) {
  return class Start {
    constructor(callback) {
      start = this;
      this.attributes = "?";
      let urlData = this.getJsonFromUrl();

      this.intern = "false";
      if (Object.keys(urlData).includes("intern")) {
        this.intern = urlData["intern"];
      }

      this.lang = "de"
      if (Object.keys(urlData).includes("lang")) {
        this.lang = urlData["lang"]
      }
      this.updateAttributes("lang", this.lang);

      this.version = "long"
      if (Object.keys(urlData).includes("version")) {
        this.version = urlData["version"]
      }
      this.updateAttributes("version", this.version);

      this.strings = new StringsApp(this.lang);
      this.strings.init().then(() => {
        this.createSplashScreen();
        callback();
      });
    }

    // Start the start screen
    init(offline) {
      this.offline = offline;
      this.createUI();
      this.arcgis = new ArcGis(this.strings);
      if (!this.offline) {
        this.arcgis.initProject(() => {
          this.projectSelected = null;
          this.addProjectMap();
          this.clickHandler();
        });
      }
    }

    createSplashScreen() {
      let backgroundTemp = domCtr.create(
        "div",
        { id: "splashScreen", class: "background" },
        win.body()
      );
      this.container = domCtr.create("div", { id: "welcome" }, backgroundTemp);

      domCtr.create(
        "div",
        {
          innerHTML: "BioDivSchool",
          style: "font-size: min(5vmax, 30px)",
        },
        this.container
      );
      this.loading = domCtr.create(
        "div",
        { id: "loading", innerHTML: this.strings.get("loading"), style: "font-size: 2vh" },
        this.container
      );
    }

    // Create the GUI of the start screen
    createUI() {
      domCtr.destroy("splashScreen");

      this.background = domCtr.create(
        "div",
        { class: "background" },
        win.body()
      );

      this.header = domCtr.create(
        "div",
        { className: "header" },
        this.background
      );


      this.settings = domCtr.create(
        "div",
        { className: "settings", style: "display:none"}, 
        this.background
      );

      domCtr.create(
        "div",
        {
          innerHTML: this.strings.get("title"),
          style: "font-size: min(5vmax, 30px)",
        },
        this.header
      );

      this.userName = domCtr.create("div", { id: "userNameEsri" }, this.header);

      
      this.settingsButton = domCtr.create(
        "div",
        { id: "settings", className: "btn1", innerHTML: this.strings.get("settings") },
        this.header
      );

      let elemVersion = domCtr.create("div", {  className: "element"}, this.settings);
      this.label = domCtr.create("div", { className: "labelText", innerHTML: this.strings.get("versionLabel")}, elemVersion);
      this.versionSelect = domCtr.create("select", {className:"input inputField"}, elemVersion);

      domCtr.create("option", {value:"short", selected: this.version == "short"? true:false, innerHTML: this.strings.get("short")}, this.versionSelect);
      domCtr.create("option", {value:"long", selected: this.version == "long"? true:false, innerHTML: this.strings.get("long")}, this.versionSelect);
      
      
      let elemLang = domCtr.create("div", { className: "element"}, this.settings);
      this.label = domCtr.create("div", { className: "labelText", innerHTML: this.strings.get("langLabel")}, elemLang);
      this.langSelect = domCtr.create("select", {className:"input inputField"}, elemLang);

      for (const i in this.strings.languages) {
        if ( this.strings.languages[i] == this.lang) {
          domCtr.create("option", {value: this.strings.languages[i], selected:true, innerHTML: this.strings.get(this.strings.languages[i])}, this.langSelect);

        }
        else {
          domCtr.create("option", {value: this.strings.languages[i], innerHTML: this.strings.get(this.strings.languages[i])}, this.langSelect);

        }
    }

      this.login = domCtr.create(
        "div",
        { id: "login", className: "btn1", innerHTML: this.strings.get("loginEsri") },
        this.header
      );

      this.mapOverview = domCtr.create(
        "div",
        { id: "mapOverview", className: "mapOverview" },
        this.background
      );

      this.mapOverviewProject = domCtr.create(
        "div",
        { id: "mapOverviewProjects", className: "mapOverviewProjects" },
        this.mapOverview
      );
      this.mapOverviewMap = domCtr.create(
        "div",
        { id: "mapOverviewMap", className: "mapOverviewMap" },
        this.mapOverview
      );


      this.footer = domCtr.create(
        "div",
        {  className: "footerStart", style: "position:relative"},
        this.background
      );

      this.footerLeft = domCtr.create(
        "div",
        { className: "footerLeft", style: this.intern == "true"? "visibility: visible;":"visibility: hidden;" },  
        this.footer
      );


      this.footerRight = domCtr.create(
        "div",
        { className: "footerRight"},
        this.footer
      );

      
      

      this.projectChosenDiv = domCtr.create(
        "div",
        { className: "footerRightElement", innerHTML: this.strings.get("noProjectChosen")},
        this.footerRight
      );

      this.buttons = domCtr.create(
        "div",
        { className: "footerRightElement", style: "display: none"},
        this.footerRight
      );



      this.btn_project_new = domCtr.create(
        "div",
        {
          id: "btn_project_new",
          className: "btn1",
          innerHTML: this.strings.get("newProject"),
          style: "min-width: 10vw;",
        },
        this.footerLeft
      );


      this.btn_project = domCtr.create(
        "div",
        {
          id: "btn_project",
          className: "btn1",
          innerHTML: this.strings.get("editProject"),
          style: this.intern == "true"? "min-width: 10vw;display: block;":"min-width: 10vw;display: none;",
        },
        this.buttons
      );


      this.btn_collection = domCtr.create(
        "div",
        {
          id: "btn_collection",
          className: "btn1",
          innerHTML: this.strings.get("collection"),
          style: "min-width: 10vw;",
        },
        this.buttons
      );
      this.btn_consolidation = domCtr.create(
        "div",
        {
          id: "btn_consolidation",
          className: "btn1",
          innerHTML: this.strings.get("consolidation"),
          style: "min-width: 10vw;",
        },
        this.buttons
      );
      this.btn_results = domCtr.create(
        "div",
        {
          id: "btn_results",
          className: "btn1",
          innerHTML: this.strings.get("results"),
          style: "min-width: 10vw;",
        },
        this.buttons
      );
    }

    addProjectMap() {
      this.viewOverview = this.arcgis.addMapOverview("mapOverviewMap");
      this.arcgis.readFeatures("project").then((results) => {
        console.log(results);
        for (let i in results) {
          let item = domCtr.create(
            "div",
            { className: "projects" },
            this.mapOverviewProject
          );
          domCtr.create(
            "div",
            {
              className: "projectElem",
              innerHTML: results[i].attributes.projectid,
              style: "width:40%",
            },
            item
          );
          domCtr.create(
            "div",
            {
              className: "projectElem",
              innerHTML: results[i].attributes.name,
              style: "width:25%",
            },
            item
          );
          domCtr.create(
            "div",
            {
              className: "projectElem",
              innerHTML: results[i].attributes.school,
              style: "width:25%",
            },
            item
          );
          item.addEventListener("click", () => {
            this.viewOverview.goTo(results[i].geometry);
            this.selectProject(
              results[i].attributes.projectid,
              results[i].attributes.name
            );
            if (this.projectSelected !== null) {
              this.projectSelected.className = "projects";
            }
            this.projectSelected = item;
            item.className = "projects projects_active";
          });
        }
      });
    }

    selectProject(projectId, name) {
      this.projectChosenDiv.innerHTML =
      this.strings.get("chosenProject") + ": " + projectId + ", " + name;
      this.buttons.style.display = "flex";
      this.updateAttributes("project", projectId);
    }

    unSelectProject() {
      start.projectChosenDiv.innerHTML = start.strings.get("noProjectChosen");
      start.buttons.style.display = "none";
      start.removeFromAttributes("project");
      start.projectSelected.className = "projects";
      start.projectSelected = null;
      start.viewOverview.goTo({
        center: [8.222167506135465, 46.82443911582187],
        zoom: 8,
      });
    }

    // Handle all the interactions
    clickHandler() {
      let start = this;

      on(
        this.login,
        "click",
        function (evt) {
          start.arcgis.handleSignInOut();
        }
      );

      on(
        this.settingsButton,
        "click",
        function (evt) {
          start.settings.style.display = start.settings.style.display=="none"? "block" : "none"
        }
      );


      on(
        this.versionSelect,
        "change",
        function (evt) {
          start.updateAttributes("version", evt.target.options[evt.target.selectedIndex].value)
        }
      );

      on(
        this.langSelect,
        "change",
        function (evt) {
          start.updateAttributes("lang", evt.target.options[evt.target.selectedIndex].value);
          window.open(window.location.href.split("?")[0]+start.attributes, "_self")
        }
      );
      
      on(
        this.btn_collection,
        "click",
        function (evt) {
          window.open(
            this.offline
              ? window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexCollectionOffline.html"
              : window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexCollection.html" +
                  this.attributes,
                  "_self"
            //"_blank" // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

      on(this.mapOverviewProject, "click", function (e) {
        if (e.target === this) {
         start.unSelectProject()
        }
      });

      on(
        this.btn_consolidation,
        "click",
        function (evt) {
          window.open(
            this.offline
              ? window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexConsolidationOffline.html"
              : window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexConsolidation.html" +
                  this.attributes,
                  "_self"
            //"_blank" // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

      on(
        this.btn_results,
        "click",
        function (evt) {
          window.open(
            this.offline
              ? window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexResultsOffline.html"
              : window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexResults.html" +
                  this.attributes,
                  "_self"
            //"_blank" // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

      on(
        this.btn_project,
        "click",
        function (evt) {
          window.open(
            this.offline
              ? window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexProjectOffline.html"
              : window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexProject.html" +
                  this.attributes,
                  "_self"
            //"_blank" // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

      on(
        this.btn_project_new,
        "click",
        function (evt) {
          window.open(
            this.offline
              ? window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexProjectOffline.html"
              : window.location.href.split("/").slice(0, -1).join("/") +
                  "/indexProject.html",
                  "_self"
            //"_blank" // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );
    }

    

        // Read the current url!
  getJsonFromUrl(query) {
    if (!query) {
      query = location.search.substr(1);
    }
    var result = {};
    query.split("&").forEach(function (part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
  updateAttributes(key, value) {
    let json = this.getJsonFromUrl(this.attributes.split("?")[1]);
    delete json[""]
    json[key] = value;
    this.attributes = "?";
    for (let i in json) {
      this.attributes += i + "=" + json[i] + "&"
    }
    }

  removeFromAttributes(key) {
    let json = this.getJsonFromUrl(this.attributes.split("?")[1]);
    delete json[""]
    delete json[key];
    this.attributes = "?";
    for (let i in json) {
      this.attributes += i + "=" + json[i] + "&"
    }
    }
  };
});
