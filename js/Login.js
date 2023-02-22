/*
--------------
Login.js
--------------
Used as a starter screen to the following main app, used by the user to select project and group etc

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
      Promise.all(this.strings.init("app")).then(() => {
        console.log(this.strings.data)
        this.createSplashScreen();
        callback();
      });
    }

    // Start the login screen
    init(offline) {
      // Make new app
      this.offline = offline;
      new App(this.offline, this.mode, this.strings, this.version, () => {
        this.content = new Content();
        app.content = this.content;

        this.createUI();

        if (this.offline) {
          if (this.mode == "consolidation") {
            app.init("1", "all");
          }
          else if (this.mode == "project") {
            app.initProject("1");
          }
          else {
            app.init("1", "a");
          }
        }


        if (this.mode == "consolidation") {
          if ( Object.keys(this.urlData).indexOf("project")  > -1) {
            app.init(this.urlData["project"], "all");
            this.inputProjectId.value = this.urlData["project"]

          }
          else {
            this.clickHandler();
          }
        }
        else if (this.mode == "project") {
          if ( Object.keys(this.urlData).indexOf("project")  > -1) {
            app.initProject(this.urlData["project"]);
            this.inputProjectId.value = this.urlData["project"]


          }
          else {
            app.initProject(null);
            this.inputProjectId.value = app.strings.get("newProject");
          }
        }
        else {
          
          if (Object.keys(this.urlData).indexOf("group") > -1 && Object.keys(this.urlData).indexOf("project")  > -1) {
            app.init(this.urlData["project"], this.urlData["group"]);
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


      this.loadingIcon = domCtr.create(
        "lord-icon",
        {
          id: "loadingIcon",
          src: "https://cdn.lordicon.com/adiugfir.json",
          trigger: "loop",
          colors: "primary:#121331,secondary:#a2c367",
          style: "width:100px;height:100px"
        },
        this.container
      );

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
      domCtr.destroy("loadingIcon")
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
          { value: options[i].key, innerHTML: app.strings.get(options[i].label) },
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
          this.updateAttributes("project", this.inputProjectId.value)

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
          this.updateAttributes("group", this.inputGroupId.value)
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
            app.init(this.inputProjectId.value, "all");
          }
          else if (this.mode == "project") {
            app.initProject(this.inputProjectId.value);
          }
          else {
            app.init(this.inputProjectId.value, this.inputGroupId.value);
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
      // Construct URLSearchParams object instance from current URL querystring.
       var queryParams = new URLSearchParams(window.location.search);
       
       // Set new or modify existing parameter value. 
       queryParams.set(key, value);
       
       // Replace current querystring with the new one.
       history.replaceState(null, null, "?"+queryParams.toString());
           }
 
     removeFromAttributes(key) {
       // Construct URLSearchParams object instance from current URL querystring.
       var queryParams = new URLSearchParams(window.location.search);
       
       // Set new or modify existing parameter value. 
       queryParams.delete(key);
       
       // Replace current querystring with the new one.
       history.replaceState(null, null, "?"+queryParams.toString());
     }
  };
});
