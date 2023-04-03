/*
--------------
Start.js
--------------
Start page for all the sub-applications. Shows all the different projects and provides links to the subsequent applications. 
Test
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
      start.userNameEsri;
      let urlData = this.getJsonFromUrl();

      //group labels
      this.groups = [
        { key: "a", label: "groupA" },
        { key: "b", label: "groupB" },
        { key: "c", label: "groupC" },
        { key: "d", label: "groupD" },
        { key: "e", label: "groupE" },
        { key: "f", label: "groupF" },

      ]

      this.admin = "false";
      if (Object.keys(urlData).includes("admin")) {
        this.admin = urlData["admin"];
      }

      this.lang = "de";
      if (Object.keys(urlData).includes("lang")) {
        this.lang = urlData["lang"];
      }
      this.updateAttributes("lang", this.lang);

      this.version = "long";
      if (Object.keys(urlData).includes("version")) {
        this.version = urlData["version"];
      }
      this.updateAttributes("version", this.version);

      this.strings = new StringsApp(this.lang);
      Promise.all(this.strings.init("start")).then(() => {
        this.createSplashScreen();
        callback();
      });
      this.projects = {};
    }

    // Start the start screen
    init(offline) {
      this.offline = offline;
      this.createUI();
      this.arcgis = new ArcGis(false, this.strings, () => {
        if (!this.offline) {
          this.arcgis.initProject(() => {
            this.projectSelected = null;
            this.addProjectMap();
            this.clickHandler();
          });
        }
      });
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
        {
          id: "loading",
          innerHTML: this.strings.get("loading"),
          style: "font-size: 2vh",
        },
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

      this.header1 = domCtr.create(
        "div",
        { className: "header1" },
        this.header
      );

      this.header2 = domCtr.create(
        "div",
        { className: "header2" },
        this.header
      );

      domCtr.create(
        "lord-icon",
        {
          id: "icon",
          src: "https://cdn.lordicon.com/dlmpudxq.json",
          colors:"primary:#a2c367,secondary:#ffc738,tertiary:#b26836",

          trigger: "hover",
          style: "width:70px;height:70px"
        },
        this.header1
      );

      domCtr.create(
        "div",
        {
          id: "appTitle",
          innerHTML: this.strings.get("title"),
          style: "font-size: min(5vmax, 30px);padding: 0 10px;",
        },
        this.header1
      );

      this.btn_project_new = domCtr.create(
        "div",
        {
          id: "btn_project_new",
          className: "btn1",
          style:
            this.admin == "true"
              ? "min-width: 30%;display: flex;"
              : "min-width: 30%;display: none;",
        },
        this.header1
      );

      domCtr.create(
        "img",
        {
          className: "btn_icon",
          src: "./img/Icons/Plus_black.svg",
        },
        this.btn_project_new
      );
      domCtr.create(
        "div",
        {
          className: "btn_label",
          innerHTML: this.strings.get("newProject"),
        },
        this.btn_project_new
      );


      // Setting button
      let settingsBtnContainer = domCtr.create(
        "div",
        {
          className: "btn3_container",
          style: "height: 60%;margin: 0 5px;"
        },
        start.header2
      );

      this.btn_settings = domCtr.create(
        "div",
        {
          id: "btn_settings",
          className: "btn3 btn1",
        },
        settingsBtnContainer
      );

      domCtr.create(
        "img",
        {
          className: "btn_icon",
          src: "./img/Icons/Settings_black.svg",
        },
        this.btn_settings
      );
      domCtr.create(
        "div",
        {
          className: "btn_label",
          innerHTML: this.strings.get("settings"),
        },
        this.btn_settings
      );

      start.settingsPanel = domCtr.create(
        "div",
        {
          className: "btn3Panel",
        },
        settingsBtnContainer
      );

      domCtr.create(
        "div",
        { className: "nonselectableElement", innerHTML: this.strings.get("versionLabel") },
        this.settingsPanel
      );

      let versionsContainer = domCtr.create(
        "div",
        {
          className: "panelElementContainer"
        },
        this.settingsPanel
      );

      let shortElement = domCtr.create(
        "div",
        {
          className: "selectableElement",
          innerHTML: this.strings.get("short"),
        },
        versionsContainer
      );
      let longElement = domCtr.create(
        "div",
        {
          className: "selectableElement selectableElementActive",
          innerHTML: this.strings.get("long"),
        },
        versionsContainer
      );

      on(shortElement, "click", function (evt) {
        if (!shortElement.classList.contains("selectableElementActive")) {
          longElement.classList.toggle("selectableElementActive")
          shortElement.classList.toggle("selectableElementActive")
          start.updateAttributes("version", "short");
        }

      });

      on(longElement, "click", function (evt) {
        if (!longElement.classList.contains("selectableElementActive")) {
          longElement.classList.toggle("selectableElementActive")
          shortElement.classList.toggle("selectableElementActive")
          start.updateAttributes("version", "long");
        }
      });

      domCtr.create(
        "div",
        { className: "nonselectableElement", innerHTML: this.strings.get("langLabel") },
        this.settingsPanel
      );

      let langContainer = domCtr.create(
        "div",
        {
          className: "panelElementContainer"
        },
        this.settingsPanel
      );

      let langElement = {};
      for (const i in start.strings.languages) {
        langElement[start.strings.languages[i]] = domCtr.create(
          "div",
          {
            className: "selectableElement",
            innerHTML: start.strings.languages[i],
          },
          langContainer
        );

        if (start.strings.languages[i] == this.lang) {
          langElement[start.strings.languages[i]].classList.toggle("selectableElementActive")
        }

      }

      for (const i in start.strings.languages) {


        on(langElement[start.strings.languages[i]], "click", function (evt) {
          for (const j in start.strings.languages) {
            langElement[start.strings.languages[j]].classList.remove("selectableElementActive")
          }
          langElement[start.strings.languages[i]].classList.toggle("selectableElementActive")

          start.updateAttributes(
            "lang",
            start.strings.languages[i]
          );
          window.open(window.location.href, "_self");
        })
      }


      // Login/User button!

      let loginBtnContainer = domCtr.create(
        "div",
        {
          className: "btn3_container",
          style: "height: 60%;margin: 0 5px;"
        },
        start.header2
      );

      this.btn_login = domCtr.create(
        "div",
        {
          id: "btn_login",
          className: "btn3 btn1",
        },
        loginBtnContainer
      );


      domCtr.create(
        "img",
        {
          className: "btn_icon",
          src: "./img/Icons/Logout_black.svg",
        },
        this.btn_login
      );
      domCtr.create(
        "div",
        {
          id: "userName",
          className: "btn_label",
          innerHTML: this.strings.get("loginEsri"),
        },
        this.btn_login
      );


      start.loginPanel = domCtr.create(
        "div",
        {
          className: "btn3Panel",
        },
        loginBtnContainer
      );

      start.login = domCtr.create(
        "div",
        { id: "login", className: "selectableElement", innerHTML: this.strings.get("loginEsri") },
        start.loginPanel
      );

      start.globeWebsite = domCtr.create(
        "div",
        { className: "selectableElement", innerHTML: "GLOBE Swiss" },
        start.loginPanel
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
        { id: "footer", className: "footer footerStart" , style:"display:none" },
        this.background
      );

      this.footerBar = domCtr.create("div", { id: "footerBar", className: "footerBar footerBarStart", style:"display:none" }, this.footer);
      this.logo1 = domCtr.create("img", {src:"img/Logos/aplus.png", className:"logos"}, this.footerBar);
      this.logo2 = domCtr.create("img", {src:"img/Logos/phsg.jpg", className:"logos"}, this.footerBar);
      this.logo3 = domCtr.create("img", {src:"img/Logos/somaha.jpg", className:"logos"}, this.footerBar);

      this.buttons = domCtr.create(
        "div",
        { className: "navigationBarRightElement", style: "display: none" },
        document.body
      );

      this.btn_project = domCtr.create(
        "div",
        {
          id: "btn_project",
          className: "btn_zoom_project",
        },
        document.body
      );

      domCtr.create(
        "div",
        {
          className: "icon",
          style: "filter: invert(100%)",
          innerHTML:
            "<img src= ./img/Icons/Edit_black.svg>",
        },
        this.btn_project
      );
      domCtr.create(
        "div",
        {
          style: "color:white",
          className: "iconLabel projectElemLabel",
          innerHTML: start.strings.get("edit")
        },
        this.btn_project
      );

      this.btn_collection = domCtr.create(
        "select",
        {
          id: "btn_collection",
          className: "btn2",
          innerHTML: this.strings.get("collection"),
          style: "min-width: 30%;background-color:white !important",
        },
        this.buttons
      );

      domCtr.create(
        "option",
        { value: "", disabled: true, selected: true, innerHTML: this.strings.get("collection") },
        this.btn_collection
      );
      let options = this.groups;
      for (const i in options) {
        domCtr.create(
          "option",
          { value: options[i].key, innerHTML: start.strings.get(options[i].label) },
          this.btn_collection
        );
      }
      this.btn_consolidation = domCtr.create(
        "div",
        {
          id: "btn_consolidation",
          className: "btn2",
          innerHTML: this.strings.get("consolidation"),
          style:
            this.admin == "true"
              ? "min-width: 30%;display: block;"
              : "min-width: 30%;display: none;",
        },
        this.buttons
      );
      this.btn_results = domCtr.create(
        "div",
        {
          id: "btn_results",
          className: "btn2",
          innerHTML: this.strings.get("results"),
          style: "min-width: 30%; display:block",
        },
        this.buttons
      );
    }

    addProjectMap() {
      [start.viewOverview, start.projectAreaPoint] =
        this.arcgis.addMapOverview("mapOverviewMap");
      this.arcgis.readFeatures("project").then((results) => {
        start.mapOverviewProject.innerHTML = "";

        // Top part with search and filter elements
        start.draggable = domCtr.create(
          "div",
          {
            id: "draggable",
            className: "draggable",
          },
          start.mapOverviewProject
        );



        this.dragElement(this.draggable);

        start.draggableLine = domCtr.create(
          "div",
          {
            className: "draggableLine",
            style: "display:none"
          },
          start.draggable
        );



        // Add the search button and filter
        start.searchAndFilter = domCtr.create(
          "div",
          {
            className: "searchAndFilter",
          },
          start.draggable
        );

        // Top part with search and filter elements
        start.scrollable = domCtr.create(
          "div",
          {
            className: "scrollable",
          },
          start.mapOverviewProject
        );


        if (start.userNameEsri != null) {
          start.myProjectsTitle = domCtr.create(
            "div",
            {
              className: "projectsTitle",
              innerHTML: start.strings.get("myProjects"),
            },
            start.scrollable
          );

          start.myProjectsContainer = domCtr.create(
            "div",
            {
              className: "projectsContainer",
            },
            start.scrollable
          );
          // Read all the own projects
          for (let i in results) {
            if (results[i].attributes.owner == start.userNameEsri) {
              let container = addProject(i, this.myProjectsContainer);
              this.projects[results[i].attributes.OBJECTID] = { container: container, projectid: results[i].attributes.OBJECTID, location: results[i].attributes.name, school: results[i].attributes.school, date: results[i].attributes.CreationDate, author: results[i].attributes.owner };
            }
          }
        }



        domCtr.create(
          "div",
          {
            className: "projectsTitle",
            innerHTML: start.strings.get("projects"),
          },
          start.scrollable
        );


        let search = domCtr.create(
          "input",
          {
            className: "search",
            placeholder: start.strings.get("search"),
          },
          start.searchAndFilter
        );

        on(search, "input", function (evt) {
          console.log(evt.target.value)
          filterProjects(evt.target.value)
        }.bind(this));

        let filterContainer = domCtr.create(
          "div",
          {
            className: "btn3_container",
          },
          start.searchAndFilter
        );

        start.btn_filter = domCtr.create(
          "div",
          {
            id: "btn_filter",
            className: "btn3 btn2",
          },
          filterContainer
        );

        domCtr.create(
          "img",
          {
            className: "btn_icon",
            src: "./img/Icons/Sort_black.svg",
          },
          start.btn_filter
        );
        domCtr.create(
          "div",
          {
            className: "btn_label",
            innerHTML: start.strings.get("sort")
          },
          start.btn_filter
        );


        start.filterPanel = domCtr.create(
          "div",
          {
            className: "btn3Panel",
          },
          filterContainer
        );

        let filterLocation = domCtr.create(
          "div",
          {
            className: "selectableElement selectableElementActive",
            innerHTML: start.strings.get("location")
          },
          start.filterPanel
        );

        let filterSchool = domCtr.create(
          "div",
          {
            className: "selectableElement",
            innerHTML: start.strings.get("school")
          },
          start.filterPanel
        );

        let filterDate = domCtr.create(
          "div",
          {
            className: "selectableElement",
            innerHTML: start.strings.get("date")
          },
          start.filterPanel
        );

        let filterAuthor = domCtr.create(
          "div",
          {
            className: "selectableElement",
            innerHTML: start.strings.get("author")
          },
          start.filterPanel
        );


        on(start.draggableLine, "click", function (evt) {
          if (start.mapOverviewProject.offsetTop > 0.50 * window.innerHeight) {
            start.mapOverviewProject.style.top = 0.15 * window.innerHeight + "px";
          }
          else {
            start.mapOverviewProject.style.top = 0.87 * window.innerHeight + "px";
          }

        }.bind(this));

        on(start.btn_filter, "click", function (evt) {
          start.filterPanel.classList.toggle("btn3PanelActive");
          start.btn_filter.classList.toggle("btn_active");
          start.btn_filter.querySelector('.btn_icon').classList.toggle("btn_icon_active");
          start.btn_filter.querySelector('.btn_label').classList.toggle("btn_label_active");


        }.bind(this));


        on(filterLocation, "click", function (evt) {
          filterSchool.classList.remove("selectableElementActive");
          filterDate.classList.remove("selectableElementActive");
          filterAuthor.classList.remove("selectableElementActive");
          if (!filterLocation.classList.contains("selectableElementActive")) {
            filterLocation.classList.toggle("selectableElementActive");
            sortProjects("location");
          }

        }.bind(this));

        on(filterSchool, "click", function (evt) {
          filterLocation.classList.remove("selectableElementActive");
          filterDate.classList.remove("selectableElementActive");
          filterAuthor.classList.remove("selectableElementActive");
          if (!filterSchool.classList.contains("selectableElementActive")) {
            filterSchool.classList.toggle("selectableElementActive");
            sortProjects("school");
          }
        }.bind(this));

        on(filterDate, "click", function (evt) {
          filterSchool.classList.remove("selectableElementActive");
          filterLocation.classList.remove("selectableElementActive");
          filterAuthor.classList.remove("selectableElementActive");
          if (!filterDate.classList.contains("selectableElementActive")) {
            filterDate.classList.toggle("selectableElementActive");
            sortProjects("date");
          }
        }.bind(this));

        on(filterAuthor, "click", function (evt) {
          filterSchool.classList.remove("selectableElementActive");
          filterDate.classList.remove("selectableElementActive");
          filterLocation.classList.remove("selectableElementActive");
          if (!filterAuthor.classList.contains("selectableElementActive")) {
            filterAuthor.classList.toggle("selectableElementActive");
            sortProjects("author");
          }
        }.bind(this));

        start.allProjectsContainer = domCtr.create(
          "div",
          {
            className: "projectsContainer",
          },
          start.scrollable
        );
        // Read all the other projects
        for (let i in results) {
          if (results[i].attributes.owner != start.userNameEsri) {
            let container = addProject(i, start.allProjectsContainer);
            this.projects[results[i].attributes.OBJECTID] = { container: container, projectid: results[i].attributes.OBJECTID, location: results[i].attributes.name, school: results[i].attributes.school, date: results[i].attributes.CreationDate, author: results[i].attributes.owner };
          }
        }

        sortProjects("location")

        function filterProjects(filter) {
          for (let i in start.projects) {
            let project = start.projects[i].container;
            if (project.id.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
              project.style.display = "flex"
            }
            else {
              project.style.display = "none"
            }
          }

        }

        function sortProjects(sortBy) {
          let tempProjects = Object.values(start.projects);

          tempProjects.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0));
          let order = 0;
          for (let j in tempProjects) {
            tempProjects[j].container.style.order = order;
            order++;
          }
        }

        function addProject(i, cont) {
          let container = domCtr.create(
            "div",
            {
              id: results[i].attributes.OBJECTID + "_" + results[i].attributes.name + "_" + results[i].attributes.school,
              className: "projectContainer",
            },
            cont
          );

          let item = domCtr.create(
            "div",
            {
              id: "project_" + results[i].attributes.OBJECTID,
              className: "projects",
            },
            container
          );

          let infoButtonContainer = domCtr.create(
            "div",
            {
              className: "infoButtonContainer borderElement",
            },
            item
          );

          let infoContainer = domCtr.create(
            "div",
            {
              id: "infoContainer_" + results[i].attributes.OBJECTID,
              className: "infoContainer",
            },
            infoButtonContainer
          );

          // City
          let citySchoolWrapper = domCtr.create(
            "div",
            {
              className: "citySchoolWrapper borderElement",
            },
            infoContainer
          );

          // City
          let labelsContainer = domCtr.create(
            "div",
            {
              className: "projectElem1",
              style: "width:50%",
            },
            citySchoolWrapper
          );
          domCtr.create(
            "div",
            {
              className: "projectElemLabel",
              innerHTML: start.strings.get("location"),
            },
            labelsContainer
          );
          domCtr.create(
            "div",
            {
              className: "projectElemLabel",
              innerHTML: start.strings.get("school"),
            },
            labelsContainer
          );


          // School
          let citySchoolContainer = domCtr.create(
            "div",
            {
              className: "projectElem1",
              style: "width:50%;",
            },
            citySchoolWrapper
          );

          domCtr.create(
            "div",
            {
              className: "projectElemValue",
              innerHTML: results[i].attributes.name,
              title: results[i].attributes.name,
            },
            citySchoolContainer
          );
          domCtr.create(
            "div",
            {
              className: "projectElemValue",
              innerHTML: results[i].attributes.school,
              title: results[i].attributes.school,
            },
            citySchoolContainer
          );

          // Add. info labels
          let additionalInfoLabels = domCtr.create(
            "div",
            {
              className: "projectElem2",
              style: "width:15%",
            },
            infoContainer
          );

          domCtr.create(
            "div",
            {
              innerHTML:
                "<img src= ./img/Icons/Date_black.svg>",
              className: "projectElemLabelMobile icon2",
            },
            additionalInfoLabels
          );

          domCtr.create(
            "div",
            {
              innerHTML: start.strings.get("date"),
              className: "projectElemLabel projectElemLabelDesktop",
            },
            additionalInfoLabels
          );

          domCtr.create(
            "div",
            {
              innerHTML:
                "<img src= ./img/Icons/Author_black.svg>",
              className: "projectElemLabelMobile icon2",
            },
            additionalInfoLabels
          );

          domCtr.create(
            "div",
            {
              innerHTML: start.strings.get("author"),
              className: "projectElemLabel projectElemLabelDesktop",
            },
            additionalInfoLabels
          );

          // Add. Info
          let additionalInfo = domCtr.create(
            "div",
            {
              className: "projectElem2",
              style: "width:25%",
            },
            infoContainer
          );

          let creationDate = new Date(results[i].attributes.CreationDate);
          domCtr.create(
            "div",
            {
              innerHTML: creationDate.toISOString().slice(0, 10),
              className: "projectElemLabel",
              style: "font-weight: bold;width:100% !important",
            },
            additionalInfo
          );
          domCtr.create(
            "div",
            {
              innerHTML: results[i].attributes.owner,
              className: "projectElemLabel",
              style: "font-weight: bold;width:100% !important",
            },
            additionalInfo
          );

          let btnsContainer = domCtr.create(
            "div",
            {
              id: "btnsContainer_" + results[i].attributes.OBJECTID,
              className: "btnsContainer",
            },
            item
          );

          let btn_zoom = domCtr.create(
            "div",
            {
              className: "btn_zoom_project",
            },
            btnsContainer
          );

          domCtr.create(
            "div",
            {
              className: "icon",
              innerHTML:
                "<img src= ./img/Icons/Zoom_black.svg>",
            },
            btn_zoom
          );
          domCtr.create(
            "div",
            {
              className: "iconLabel projectElemLabel",
              innerHTML: start.strings.get("zoom")
            },
            btn_zoom
          );

          on(btn_zoom, "click", (e) => {

            start.viewOverview.goTo(results[i].geometry);


            console.log("zoom");
            e.stopPropagation();
          })


          infoContainer.addEventListener("click", () => {
            if (start.projectSelected == item) {
              start.unSelectProject();
            } else {
              //start.viewOverview.goTo(results[i].geometry);
              let query = start.projectAreaPoint.createQuery();
              query.where =
                "objectid in ('" + results[i].attributes.OBJECTID + "')";
              start.projectAreaPoint.queryFeatures(query).then((results2) => {
                start.viewOverview.goTo({
                  center: [8.722167506135465, 47.32443911582187],
                  zoom: 9,
                });

                start.viewOverview.popup.open({
                  features: [results2.features[0]], // array of graphics or a single graphic in an array
                  location: results2.features[0].geometry.centroid,
                });
              });

              start.selectProject(
                results[i].attributes.OBJECTID,
                results[i].attributes.name,
                results[i].attributes.school,
                results[i].attributes.owner
              );
            }
          });
          return container
        }
      });
    }

    selectProject(projectId, name, school, owner) {
      let infoContainer = document.getElementById("infoContainer_" + projectId);
      let item = document.getElementById("project_" + projectId);
      let btnsContainer = document.getElementById("btnsContainer_" + projectId);

      if (start.projectSelected) {
        start.projectSelected.querySelector('.iconLabel').classList.toggle("iconLabelActive");
        start.projectSelected.querySelector('.icon').classList.toggle("iconActive");
        for (let i = 0; i < start.projectSelected.querySelectorAll('.borderElement').length; i++) {
          start.projectSelected.querySelectorAll('.borderElement')[i].classList.toggle("borderElementActive");
        }
        for (let i = 0; i < start.projectSelected.querySelectorAll('.icon2').length; i++) {
          start.projectSelected.querySelectorAll('.icon2')[i].classList.toggle("iconActive");
        }
      }

      item.querySelector('.iconLabel').classList.toggle("iconLabelActive");
      item.querySelector('.icon').classList.toggle("iconActive");
      for (let i = 0; i < item.querySelectorAll('.borderElement').length; i++) {
        item.querySelectorAll('.borderElement')[i].classList.toggle("borderElementActive");
      }
      for (let i = 0; i < item.querySelectorAll('.icon2').length; i++) {
        item.querySelectorAll('.icon2')[i].classList.toggle("iconActive");
      }

      if (window.matchMedia('only screen and (max-width: 600px)').matches) {
        start.mapOverviewProject.style.top = 0.15 * window.innerHeight + "px";
      }
      if (start.projectSelected !== null) {
        start.projectSelected.className = "projects";
      }
      start.projectSelected = item;
      item.className = "projects projects_active";

      start.buttons.style.display = "flex";
      this.updateAttributes("project", projectId);

      if (
        item.offsetTop - this.scrollable.offsetTop >
        this.scrollable.offsetHeight
      ) {
        this.scrollable.scrollTop =
          item.offsetTop - this.scrollable.offsetTop;
      }

      domCtr.place(this.buttons, infoContainer, "after");
      domCtr.place(this.btn_project, btnsContainer, "last");

      if (start.userNameEsri != null && start.userNameEsri == owner) {
        //if (start.userNameEsri == null || (start.userNameEsri != null && start.userNameEsri == owner)) {
        this.buttons.style.display = "flex";
        this.btn_collection.style.display = "block";
        this.btn_consolidation.style.display =
          this.admin == "true" ? "block" : "none";
        this.btn_project.style.display =
          this.admin == "true" ? "flex" : "none";
      } else {
        this.btn_collection.style.display = "none";
        this.btn_consolidation.style.display = "none";
        this.btn_project.style.display = "none";

        //this.buttons.style.display = "flex";
        //this.btn_collection.style.display = "block";
        //this.btn_consolidation.style.display = "block";
        //start.removeFromAttributes("project");
      }
    }

    unSelectProject() {
      if (start.projectSelected != null) {
        start.projectSelected.querySelector('.iconLabel').classList.toggle("iconLabelActive");
        start.projectSelected.querySelector('.icon').classList.toggle("iconActive");
        for (let i = 0; i < start.projectSelected.querySelectorAll('.borderElement').length; i++) {
          start.projectSelected.querySelectorAll('.borderElement')[i].classList.toggle("borderElementActive");
        }
        for (let i = 0; i < start.projectSelected.querySelectorAll('.icon2').length; i++) {
          start.projectSelected.querySelectorAll('.icon2')[i].classList.toggle("iconActive");
        }
        start.buttons.style.display = "none";
        start.removeFromAttributes("project");
        start.projectSelected.className = "projects";
        start.projectSelected = null;
        start.viewOverview.popup.close();

        start.btn_project.style.display = "none"

      }
    }

    // Handle all the interactions
    clickHandler() {
      let start = this;

      on(this.btn_login, "click", function (evt) {
        start.loginPanel.classList.toggle("btn3PanelActive");
        start.btn_login.classList.toggle("btn_active");
        start.btn_login.querySelector('.btn_icon').classList.toggle("btn_icon_active");
        start.btn_login.querySelector('.btn_label').classList.toggle("btn_label_active");


      });
      on(start.login, "click", function (evt) {
        start.arcgis.handleSignInOut();
      });

      on(start.globeWebsite, "click", function (evt) {
        window.open("https://www.globe-swiss.ch/de/Angebote/BioDivSchool/", "_blank");
      });



      on(this.btn_settings, "click", function (evt) {
        start.settingsPanel.classList.toggle("btn3PanelActive");
        start.btn_settings.classList.toggle("btn_active");
        start.btn_settings.querySelector('.btn_icon').classList.toggle("btn_icon_active");
        start.btn_settings.querySelector('.btn_label').classList.toggle("btn_label_active");
      });

      // Close sort and settings window whenever a click happens outside of those elements
      on(window, "click", function (evt) {
        if (evt.srcElement.id != "btn_settings" && start.settingsPanel.classList.contains("btn3PanelActive")) {
          start.settingsPanel.classList.toggle("btn3PanelActive");
          start.btn_settings.classList.toggle("btn_active");
          start.btn_settings.querySelector('.btn_icon').classList.toggle("btn_icon_active");
          start.btn_settings.querySelector('.btn_label').classList.toggle("btn_label_active");

        };

        if (evt.srcElement.id != "btn_login" && start.loginPanel.classList.contains("btn3PanelActive")) {
          start.loginPanel.classList.toggle("btn3PanelActive");
          start.btn_login.classList.toggle("btn_active");
          start.btn_login.querySelector('.btn_icon').classList.toggle("btn_icon_active");
          start.btn_login.querySelector('.btn_label').classList.toggle("btn_label_active");


        };

        if (evt.srcElement.id != "btn_filter" && start.filterPanel.classList.contains("btn3PanelActive")) {
          start.filterPanel.classList.toggle("btn3PanelActive");
          start.btn_filter.classList.toggle("btn_active");
          start.btn_filter.querySelector('.btn_icon').classList.toggle("btn_icon_active");
          start.btn_filter.querySelector('.btn_label').classList.toggle("btn_label_active");
        };
      }.bind(this));

      on(
        this.btn_collection,
        "change",
        function (evt) {
          this.updateAttributes("group", this.btn_collection.value)
          this.updateAttributes("mode", "collection");
          window.open(window.location.href, "_self");
        }.bind(this)
      );

      on(this.mapOverviewProject, "click", function (e) {
        if (e.target === this) {
          start.unSelectProject();
        }
      });

      on(
        this.btn_consolidation,
        "click",
        function (evt) {
          this.updateAttributes("mode", "consolidation");
          window.open(window.location.href, "_self");
        }.bind(this)
      );

      on(
        this.btn_results,
        "click",
        function (evt) {
          this.updateAttributes("mode", "results");
          this.updateAttributes("group", "all");

          window.open(window.location.href, "_self");
        }.bind(this)
      );

      on(
        this.btn_project,
        "click",
        function (evt) {
          this.updateAttributes("mode", "project");
          window.open(window.location.href, "_self");
        }.bind(this)
      );

      on(
        this.btn_project_new,
        "click",
        function (evt) {
          this.updateAttributes("mode", "project");
          this.updateAttributes("project", "null");
          window.open(window.location.href, "_self");
        }.bind(this)
      );
    }

    //Make the DIV element draggagle:

    dragElement(elmnt) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.addEventListener('touchstart', dragMouseDown);
      //elmnt.onmousedown = dragMouseDown;


      function dragMouseDown(e) {
        //console.log("dragMouseDown")
        //e = e || window.event;
        //e.preventDefault();
        // get the mouse cursor position at startup:
        pos4 = e.touches[0].clientY;
        elmnt.addEventListener('touchend', closeDragElement)
        //document.onmouseup = closeDragElement;

        // call a function whenever the cursor moves:
        elmnt.addEventListener('touchmove', elementDrag)
        //document.onmousemove  = elementDrag;

      }

      function elementDrag(e) {
        //console.log("elementDrag")
        //console.log(elmnt)

        //e = e || window.event;
        //e.preventDefault();
        // calculate the new cursor position:
        pos2 = pos4 - e.touches[0].clientY;
        pos4 = e.touches[0].clientY;
        // set the element's new position:
        let newTop = start.mapOverviewProject.offsetTop - pos2;
        if (newTop > 0.15 * window.innerHeight && newTop < 0.87 * window.innerHeight) {
          start.mapOverviewProject.style.top = start.mapOverviewProject.offsetTop - pos2 + "px";

        }
      }

      function closeDragElement() {
        //console.log("closeDragElement")

        
        if (pos2 > 0) {
          start.mapOverviewProject.style.top = 0.15 * window.innerHeight + "px";
        }
        else {
          start.mapOverviewProject.style.top = 0.87 * window.innerHeight + "px";
        }

        /* stop moving when mouse button is released:*/
        document.addEventListener('touchend', null);
        //document.onmouseup = null;

        document.addEventListener('touchmove', null);
        //document.onmousemove  = null;

      }
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
      // Construct URLSearchParams object instance from current URL querystring.
      var queryParams = new URLSearchParams(window.location.search);

      // Set new or modify existing parameter value.
      queryParams.set(key, value);

      // Replace current querystring with the new one.
      history.replaceState(null, null, "?" + queryParams.toString());
    }

    removeFromAttributes(key) {
      // Construct URLSearchParams object instance from current URL querystring.
      var queryParams = new URLSearchParams(window.location.search);

      // Set new or modify existing parameter value.
      queryParams.delete(key);

      // Replace current querystring with the new one.
      history.replaceState(null, null, "?" + queryParams.toString());
    }
  };
});
