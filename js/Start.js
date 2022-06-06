/*
--------------
Start.js
--------------
Landing page before where you see the different projects

*/

// ssh-add ~/.ssh/ssh_rsa_dlaumer
define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",

  "biodivschool/App",
  "biodivschool/Content",
  "biodivschool/ArcGis",
  "biodivschool/strings/stringsApp",
], function (dom, domCtr, win, on, App, Content, ArcGis, stringsApp) {
  return class Start {
    constructor(mode) {
      this.mode = mode;

      this.createSplashScreen();
     
      let stringsapp = new stringsApp("de")
      stringsapp.init().then(() => {
        console.log(stringsapp.get("loading"))
      });
      
    }

    // Start the start screen
    init(offline) {
      // Make new app
      this.offline = offline;
      this.app = new App(this.offline, this.mode, () => {
        this.content = new Content(that);
        that.content = this.content;

        this.attributes = ""
        this.projectSelected = null;
        this.createUI();
        this.clickHandler();
       
      });
    }

    createSplashScreen() {
      let backgroundTemp = domCtr.create(
        "div",
        { id: "splashScreen", class: "background" },
        win.body()
      );
      this.container = domCtr.create("div", { id: "welcome" }, backgroundTemp);
     

      // Some info about the project
      domCtr.create(
        "div",
        {
          id: "description1",
          innerHTML: "BioDivSchool",
          style: "font-size: 4vh",
        },
        this.container
      );
      this.loading = domCtr.create(
        "div",
        { id: "loading", innerHTML: "Loading...", style: "font-size: 2vh" },
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
      
      this.header = domCtr.create("div", { className: "header" }, this.background);

      domCtr.create(
        "div",
        {
          id: "description1",
          innerHTML: "BioDivSchool",
          style: "font-size: 4vh",
        },
        this.header
      );

      this.mapOverview = domCtr.create("div", {id: "mapOverview", className: "mapOverview"}, this.background);
      
      this.mapOverviewProject = domCtr.create("div", {id: "mapOverviewProjects", className: "mapOverviewProjects"}, this.mapOverview);
      this.mapOverviewMap = domCtr.create("div", {id: "mapOverviewMap", className: "mapOverviewMap"}, this.mapOverview);

      if (!that.offline) {
        this.viewOverview = that.arcgis.addMapOverview("mapOverviewMap");
        that.arcgis.readFeatures("project").then((results) => {
          console.log(results)
          for (let i in results) {
            let item = domCtr.create("div", {className: "projects"}, this.mapOverviewProject);
            domCtr.create("div", {className: "projectElem",innerHTML: results[i].attributes.projectid, style: "width:15%"}, item);
            domCtr.create("div", {className: "projectElem", innerHTML: results[i].attributes.name, style: "width:30%"}, item);
            domCtr.create("div", {className: "projectElem", innerHTML: results[i].attributes.school, style: "width:45%"}, item);
            item.addEventListener("click", () => {
              this.viewOverview.goTo(results[i].geometry);
              this.selectProject(results[i].attributes.projectid, results[i].attributes.name)
              if (this.projectSelected !== null) {
                this.projectSelected.className = "projects";
              }
              this.projectSelected = item;
              item.className = "projects projects_active";

            })
          }
        })
      }
      

      this.footerTop = domCtr.create("div", { id: "footerTop", className: "footer", style: "position:relative"}, this.background);
      this.footerBottom = domCtr.create("div", {id: "footerBottom",  className: "footer", style: "position:relative"}, this.background);

      this.footerTopLeft = domCtr.create("div", { className: "footerLeft", innerHTML: "Neues Projekt:"}, this.footerTop);
      this.footerTopRight = domCtr.create("div", { className: "footerRight"}, this.footerTop);

      this.footerBottomLeft = domCtr.create("div", { className: "footerLeft"}, this.footerBottom);
      this.footerBottomRight = domCtr.create("div", { className: "footerRight", style: "display: none"}, this.footerBottom);
      

      this.btn_collection = domCtr.create(
        "div",
        { id: "btn_collection", className: "btn1", innerHTML: "Erfassung" , style: "min-width: 10vw;"},
        this.footerBottomRight
      );
      this.btn_consolidation = domCtr.create(
        "div",
        { id: "btn_consolidation", className: "btn1", innerHTML: "Konsolidierung" , style: "min-width: 10vw;" },
        this.footerBottomRight
      );
      this.btn_results = domCtr.create(
        "div",
        { id: "btn_results", className: "btn1", innerHTML: "Resultate" , style: "min-width: 10vw;" },
        this.footerBottomRight
      );


      this.footerRight = domCtr.create("div", { className: "footerElements", style: "width: 50%"}, this.footerBottomLeft);



      this.btn_project = domCtr.create(
        "div",
        { id: "btn_project", className: "btn1", innerHTML: "Neues Projekt" },
        this.footerRight
      );
    }

    selectProject(projectId, name) {
      this.footerTopRight.innerHTML = "Ausgewähltes Projekt: " + projectId + ", " + name;
      this.footerBottomRight.style.display = "flex";
      this.attributes = "?project=" + projectId;
    }

    // Handle all the interactions
    clickHandler() {
      let this2 = this;
      on(
        this.btn_collection,
        "click",
        function (evt) {
          window.open(
            that.offline? window.location.href.split("/").slice(0, -1).join("/") + '/indexCollectionOffline.html': window.location.href.split("/").slice(0, -1).join("/") + '/indexCollection.html' + this.attributes,
            '_blank' // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

      on(this.mapOverviewProject,
        'click', function(e) {
        if (e.target === this) {
          this2.footerTopRight.innerHTML = "";
          this2.footerBottomRight.style.display = "none";
          this2.attributes = "";
          this2.projectSelected.className = "projects";
          this2.projectSelected = null;
          this2.viewOverview.goTo({
            center: [8.222167506135465, 46.82443911582187],
            zoom: 8
          })
        }
      });

      on(
        this.btn_consolidation,
        "click",
        function (evt) {
          window.open(
            that.offline? window.location.href.split("/").slice(0, -1).join("/") + '/indexConsolidationOffline.html': window.location.href.split("/").slice(0, -1).join("/") + '/indexConsolidation.html' + this.attributes,
            '_blank' // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

        on(
          this.btn_results,
          "click",
          function (evt) {
            window.open(
            that.offline? window.location.href.split("/").slice(0, -1).join("/") + '/indexResultsOffline.html' : window.location.href.split("/").slice(0, -1).join("/") + '/indexResults.html' + this.attributes,
              '_blank' // <- This is what makes it open in a new window.
            );
        }.bind(this)
      );

      on(
        this.btn_project,
        "click",
        function (evt) {
          window.open(
            that.offline?  window.location.href.split("/").slice(0, -1).join("/") + '/indexProjectOffline.html': window.location.href.split("/").slice(0, -1).join("/") + '/indexProject.html' + this.attributes,
            '_blank' // <- This is what makes it open in a new window.
          );
      }.bind(this)
    );
    }

    
  };
});
