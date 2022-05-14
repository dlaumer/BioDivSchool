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
], function (dom, domCtr, win, on, App, Content, ArcGis) {
  return class Start {
    constructor(mode) {
      this.mode = mode;

      this.createSplashScreen();
    }

    // Start the start screen
    init(offline) {
      // Make new app
      this.offline = offline;
      this.app = new App(this.offline, this.mode, () => {
        this.content = new Content(that);
        that.content = this.content;

        this.createUI();
        this.clickHandler();
       
      });
    }

    createSplashScreen() {
      this.background = domCtr.create(
        "div",
        { id: "start", class: "background" },
        win.body()
      );
      this.container = domCtr.create("div", { id: "welcome" }, this.background);
     

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
      domCtr.destroy("welcome");
      
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
      
      that.arcgis.addMapOverview("mapOverview");
      this.footerTop = domCtr.create("div", { id: "fotterTop", className: "footer", style: "position:relative"}, this.background);
      this.footerBottom = domCtr.create("div", {id: "fotterTop",  className: "footer"}, this.background);

      this.footerTopLeft = domCtr.create("div", { className: "footerLeft", innerHTML: "Bestehendes Projekt:"}, this.footerTop);
      this.footerTopRight = domCtr.create("div", { className: "footerRight", innerHTML: "Neues Projekt:"}, this.footerTop);

      this.footerBottomLeft = domCtr.create("div", { className: "footerLeft"}, this.footerBottom);
      this.footerBottomRight = domCtr.create("div", { className: "footerRight", style: "width: 50%"}, this.footerBottom);

      this.btn_collection = domCtr.create(
        "div",
        { id: "btn_collection", className: "btn1", innerHTML: "Erfassung" , style: "min-width: 10vw;"},
        this.footerBottomLeft
      );
      this.btn_consolidation = domCtr.create(
        "div",
        { id: "btn_consolidation", className: "btn1", innerHTML: "Konsolidierung" , style: "min-width: 10vw;" },
        this.footerBottomLeft
      );
      this.btn_consolidation = domCtr.create(
        "div",
        { id: "btn_consolidation", className: "btn1", innerHTML: "Resultate" , style: "min-width: 10vw;" },
        this.footerBottomLeft
      );


      this.footerRight = domCtr.create("div", { className: "footerElements", style: "width: 50%"}, this.footerBottomRight);



      this.btn_project = domCtr.create(
        "div",
        { id: "btn_project", className: "btn1", innerHTML: "Neues Projekt" },
        this.footerRight
      );
    }

    // Handle all the interactions
    clickHandler() {

      on(
        this.btn_collection,
        "click",
        function (evt) {
          window.open(
            window. location. href + '/indexCollection.html',
            '_blank' // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

      on(
        this.btn_consolidation,
        "click",
        function (evt) {
          window.open(
            window. location. href + '/indexConsolidation.html',
            '_blank' // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );

        on(
          this.btn_collection,
          "click",
          function (evt) {
            window.open(
              window. location. href + '/indexProject.html',
            '_blank' // <- This is what makes it open in a new window.
          );
        }.bind(this)
      );
    }
  };
});
