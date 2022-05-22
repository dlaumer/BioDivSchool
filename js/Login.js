/*
--------------
Login.js
--------------
Simple login page before starting the main app.

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
  return class Login {
    constructor(mode) {
      this.mode = mode;

      this.createSplashScreen();
    }

    // Start the login screen
    init(offline) {
      // Make new app
      this.offline = offline;
      this.app = new App(this.offline, this.mode, () => {
        this.content = new Content(that);
        that.content = this.content;

        this.createUI();

        if (this.offline) {
          if (this.mode == "consolidation") {
            that.initConsolidation("1");
          }
          else if (this.mode == "project") {
            that.initProject("1");
          }
          else {
            that.init("1", "a");
          }
        }

        let urlData = this.getJsonFromUrl();

        if (this.mode == "consolidation") {
          if ( Object.keys(urlData).indexOf("project")  > -1) {
            that.initConsolidation(urlData["project"]);
          }
        }
        else if (this.mode == "project") {
          if ( Object.keys(urlData).indexOf("project")  > -1) {
            that.initProject(urlData["project"]);
          }
        }
        else {
          
          if (Object.keys(urlData).indexOf("group") > -1 && Object.keys(urlData).indexOf("project")  > -1) {
            that.init(urlData["project"], urlData["group"]);
          }
          else {
            if (Object.keys(urlData).indexOf("project")  > -1) {
              this.inputProjectId.value = urlData["project"]
              this.inputGroupId.style.display = "block";
            }
            this.clickHandler();
          }
        }


      });
    }

    createSplashScreen() {
      this.background = domCtr.create(
        "div",
        { id: "login", class: "background" },
        win.body()
      );
      this.container = domCtr.create("div", { id: "welcome" }, this.background);

      let title = "BioDivSchool Web App";

      switch (this.mode) {
        case "consolidation":
          title = "BioDivSchool Consolidation";
          break;
        case "project":
          title = "BioDivSchool Project";
          break;
      }

      // Some info about the project
      domCtr.create(
        "div",
        {
          id: "description1",
          innerHTML: title,
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

    // Create the GUI of the login screen
    createUI() {
      domCtr.destroy("loading");
      this.inputProjectId = domCtr.create(
        "input",
        { className: "input inputField", placeholder: "Projekt ID" },
        this.container
      );
      this.inputGroupId = domCtr.create(
        "select",
        { className: "input inputField", style: "display: none" },
        this.container
      );

      domCtr.create(
        "option",
        { value: "", disabled: true, selected: true, innerHTML: "Gruppe" },
        this.inputGroupId
      );
      let options = this.content.groups;
      for (const i in options) {
        domCtr.create(
          "option",
          { value: options[i].key, innerHTML: options[i].label },
          this.inputGroupId
        );
      }
      this.login = domCtr.create(
        "div",
        { id: "btn_login", className: "btn1 btn_disabled", innerHTML: "Login" },
        this.container
      );
    }

    // Handle all the interactions
    clickHandler() {
      on(
        this.inputProjectId,
        "input",
        function (evt) {
          if (this.inputProjectId.value == "") {
            this.login.className = "btn1 btn_disabled";
          } else {
            if (this.mode == "consolidation" || this.mode == "project" ) {
              this.login.className = "btn1";
            } else {
              this.inputGroupId.style.display = "block";
            }
          }
        }.bind(this)
      );

      on(
        this.inputGroupId,
        "change",
        function (evt) {
          if (this.inputProjectId.value != "") {
            this.login.className = "btn1";
          } else {
            this.login.className = "btn1 btn_disabled";
          }
        }.bind(this)
      );

      on(
        this.login,
        "click",
        function (evt) {
          if (this.mode == "consolidation") {
            this.app.initConsolidation(this.inputProjectId.value);
          }
          else if (this.mode == "project") {
            this.app.initProject(this.inputProjectId.value);
          }
          else {
            this.app.init(this.inputProjectId.value, this.inputGroupId.value);
          }
        }.bind(this)
      );
    }

    // Read the current url!
  getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function (part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
  };
});
