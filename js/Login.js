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
  "biodivschool/StringsApp",

], function (dom, domCtr, win, on, App, Content, ArcGis, StringsApp) {
  return class Login {
    constructor(mode, callback) {
      this.mode = mode;

      this.urlData = this.getJsonFromUrl();

      this.lang = "de"
      if (Object.keys(this.urlData).includes("lang")) {
        this.lang = this.urlData["lang"]
      }

      this.version = "short"
      if (Object.keys(this.urlData).includes("version")) {
        this.version = this.urlData["version"]
      }

      this.strings = new StringsApp(this.lang);
      this.strings.init().then(() => {
        this.createSplashScreen();
        callback();
      });
    }

    // Start the login screen
    init(offline) {
      // Make new app
      this.offline = offline;
      this.app = new App(this.offline, this.mode, this.strings, this.version, () => {
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


        if (this.mode == "consolidation") {
          if ( Object.keys(this.urlData).indexOf("project")  > -1) {
            that.initConsolidation(this.urlData["project"]);
            this.inputProjectId.value = this.urlData["project"]

          }
          else {
            this.clickHandler();
          }
        }
        else if (this.mode == "project") {
          if ( Object.keys(this.urlData).indexOf("project")  > -1) {
            that.initProject(this.urlData["project"]);
            this.inputProjectId.value = this.urlData["project"]


          }
          else {
            that.initProject(null);
            this.inputProjectId.value = that.strings.get("newProject");
          }
        }
        else {
          
          if (Object.keys(this.urlData).indexOf("group") > -1 && Object.keys(this.urlData).indexOf("project")  > -1) {
            that.init(this.urlData["project"], this.urlData["group"]);
            this.inputProjectId.value = this.urlData["project"]
            this.inputGroupId.value = this.urlData["group"]
            this.inputGroupId.style.display = "block";
          }
          else {
            if (Object.keys(this.urlData).indexOf("project")  > -1) {
              this.inputProjectId.value = this.urlData["project"]
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
        { id: "splashScreen", class: "background" },
        win.body()
      );
      this.container = domCtr.create("div", { id: "welcome" }, this.background);

      let title = this.strings.get("titleCollection");

      switch (this.mode) {
        case "collection":
          title = this.strings.get("titleCollection");
          break;
        case "consolidation":
          title = this.strings.get("titleConsolidation");
          break;
        case "project":
          title = this.strings.get("titleProject");
          break;
        case "results":
          title = this.strings.get("titleResults");
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
        { id: "loading", innerHTML: this.strings.get("loading"), style: "font-size: 2vh" },
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
        { value: "", disabled: true, selected: true, innerHTML: this.strings.get("group") },
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
        { id: "btn_login", className: "btn1 btn_disabled", innerHTML: this.strings.get("login") },
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
    updateAttributes(key, value) {
      let json = this.getJsonFromUrl(this.attributes.split("?")[1]);
      delete json[""]
      json[key] = value;
      this.attributes = "?";
      for (let i in json) {
        this.attributes += i + "=" + json[i] + "&"
      }
      console.log(this.attributes)
  }

    removeFromAttributes(key) {
      let json = this.getJsonFromUrl(this.attributes.split("?")[1]);
      delete json[""]
      delete json[key];
      this.attributes = "?";
      for (let i in json) {
        this.attributes += i + "=" + json[i] + "&"
      }
      console.log(this.attributes)
      }
  };
});
