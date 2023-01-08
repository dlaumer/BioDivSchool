/*
--------------
Start.js
--------------
Start page for all the sub-applications. Shows all the different projects and provides links to the subsequent applications. 

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

      this.settings = domCtr.create(
        "div",
        { className: "settings", style: "display:none" },
        this.background
      );

      domCtr.create(
        "div",
        {
          id: "appTitle",
          innerHTML: this.strings.get("title"),
          style: "font-size: min(5vmax, 30px)",
        },
        this.header1
      );

      this.userName = domCtr.create(
        "div",
        { id: "userNameEsri" },
        this.header1
      );

      this.btn_project_new = domCtr.create(
        "div",
        {
          id: "btn_project_new",
          className: "btn1",
          innerHTML: this.strings.get("newProject"),
          style:
            this.admin == "true"
              ? "min-width: 10vw;display: block;"
              : "min-width: 10vw;display: none;",
        },
        this.header1
      );

      this.settingsButton = domCtr.create(
        "div",
        {
          id: "settings",
          className: "btn1",
          innerHTML: this.strings.get("settings"),
        },
        this.header2
      );

      this.login = domCtr.create(
        "div",
        {
          id: "login",
          className: "btn1",
          innerHTML: this.strings.get("loginEsri"),
        },
        this.header2
      );

      let elemVersion = domCtr.create(
        "div",
        { className: "element" },
        this.settings
      );
      this.label = domCtr.create(
        "div",
        { className: "labelText", innerHTML: this.strings.get("versionLabel") },
        elemVersion
      );
      this.versionSelect = domCtr.create(
        "select",
        { className: "input inputField" },
        elemVersion
      );

      domCtr.create(
        "option",
        {
          value: "short",
          selected: this.version == "short" ? true : false,
          innerHTML: this.strings.get("short"),
        },
        this.versionSelect
      );
      domCtr.create(
        "option",
        {
          value: "long",
          selected: this.version == "long" ? true : false,
          innerHTML: this.strings.get("long"),
        },
        this.versionSelect
      );

      let elemLang = domCtr.create(
        "div",
        { className: "element" },
        this.settings
      );
      this.label = domCtr.create(
        "div",
        { className: "labelText", innerHTML: this.strings.get("langLabel") },
        elemLang
      );
      this.langSelect = domCtr.create(
        "select",
        { className: "input inputField" },
        elemLang
      );

      for (const i in this.strings.languages) {
        if (this.strings.languages[i] == this.lang) {
          domCtr.create(
            "option",
            {
              value: this.strings.languages[i],
              selected: true,
              innerHTML: this.strings.get(this.strings.languages[i]),
            },
            this.langSelect
          );
        } else {
          domCtr.create(
            "option",
            {
              value: this.strings.languages[i],
              innerHTML: this.strings.get(this.strings.languages[i]),
            },
            this.langSelect
          );
        }
      }

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


      //this.dragElement(this.mapOverviewProject);


      this.mapOverviewMap = domCtr.create(
        "div",
        { id: "mapOverviewMap", className: "mapOverviewMap" },
        this.mapOverview
      );

      this.buttons = domCtr.create(
        "div",
        { className: "footerRightElement", style: "display: none" },
        document.body
      );

      this.btn_project = domCtr.create(
        "div",
        {
          id: "btn_project",
          innerHTML:
            "<img src= https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/pencil-square-16.svg>",
        },
        document.body
      );

      this.btn_collection = domCtr.create(
        "div",
        {
          id: "btn_collection",
          className: "btn2",
          innerHTML: this.strings.get("collection"),
          style: "min-width: 10vw;",
        },
        this.buttons
      );
      this.btn_consolidation = domCtr.create(
        "div",
        {
          id: "btn_consolidation",
          className: "btn2",
          innerHTML: this.strings.get("consolidation"),
          style:
            this.admin == "true"
              ? "min-width: 10vw;display: block;"
              : "min-width: 10vw;display: none;",
        },
        this.buttons
      );
      this.btn_results = domCtr.create(
        "div",
        {
          id: "btn_results",
          className: "btn2",
          innerHTML: this.strings.get("results"),
          style: "min-width: 10vw;",
        },
        this.buttons
      );
    }

    addProjectMap() {
      [start.viewOverview, start.projectAreaPoint] =
        this.arcgis.addMapOverview("mapOverviewMap");
      this.arcgis.readFeatures("project").then((results) => {
        start.mapOverviewProject.innerHTML = "";

        if (start.userNameEsri != null) {
          start.myProjectsTitle = domCtr.create(
            "div",
            {
              className: "projectsTitle",
              innerHTML: start.strings.get("myProjects"),
            },
            start.mapOverviewProject
          );

          start.myProjectsContainer = domCtr.create(
            "div",
            {
              className: "projectsContainer",
            },
            start.mapOverviewProject
          );
          // Read all the own projects
          for (let i in results) {
            if (results[i].attributes.owner == start.userNameEsri) {
              let container = addProject(i, this.myProjectsContainer);
              this.projects[results[i].attributes.projectid] = {container:container, projectid: results[i].attributes.projectid, location: results[i].attributes.name, school: results[i].attributes.school, date: results[i].attributes.CreationDate, author: results[i].attributes.owner};
            }
          }
        }

        domCtr.create(
          "div",
          {
            className: "projectsTitle",
            innerHTML: start.strings.get("projects"),
          },
          start.mapOverviewProject
        );

        // Add the search button and filter
        start.searchAndFilter = domCtr.create(
          "div",
          {
            className: "searchAndFilter",
          },
          start.mapOverviewProject
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

        if (start.userNameEsri != null) {
          domCtr.place(start.searchAndFilter, start.myProjectsTitle, "after");
        }

        let filterContainer = domCtr.create(
          "div",
          {
            className: "filterContainer", 
          },
          start.searchAndFilter
        );

        let btn_filter = domCtr.create(
          "div",
          {
            className: "filter btn2", 
            innerHTML: start.strings.get("sort")
          },
          filterContainer
        );

        
        let filterPanel = domCtr.create(
          "div",
          {
            className: "filterPanel", 
          },
          filterContainer
        );

        let filterLocation = domCtr.create(
          "div",
          {
            className: "filterElement filterElementActive", 
            innerHTML: start.strings.get("location")
          },
          filterPanel
        );

        let filterSchool = domCtr.create(
          "div",
          {
            className: "filterElement", 
            innerHTML: start.strings.get("school")
          },
          filterPanel
        );

        let filterDate = domCtr.create(
          "div",
          {
            className: "filterElement", 
            innerHTML: start.strings.get("date")
          },
          filterPanel
        );

        let filterAuthor = domCtr.create(
          "div",
          {
            className: "filterElement", 
            innerHTML: start.strings.get("author")
          },
          filterPanel
        );
 

        on(btn_filter, "click", function (evt) {
          filterPanel.classList.toggle("filterPanelActive");
          btn_filter.classList.toggle("btn_active");
        }.bind(this));


        on(filterLocation, "click", function (evt) {
          filterSchool.classList.remove("filterElementActive");
          filterDate.classList.remove("filterElementActive");
          filterAuthor.classList.remove("filterElementActive");
          if (!filterLocation.classList.contains("filterElementActive")) {
            filterLocation.classList.toggle("filterElementActive");
            sortProjects("location");
          }

        }.bind(this));

        on(filterSchool, "click", function (evt) {
          filterLocation.classList.remove("filterElementActive");
          filterDate.classList.remove("filterElementActive");
          filterAuthor.classList.remove("filterElementActive");
          if (!filterSchool.classList.contains("filterElementActive")) {
            filterSchool.classList.toggle("filterElementActive");
            sortProjects("school");
          }
        }.bind(this));

        on(filterDate, "click", function (evt) {
          filterSchool.classList.remove("filterElementActive");
          filterLocation.classList.remove("filterElementActive");
          filterAuthor.classList.remove("filterElementActive");
          if (!filterDate.classList.contains("filterElementActive")) {
            filterDate.classList.toggle("filterElementActive");
            sortProjects("date");
          }
        }.bind(this));

        on(filterAuthor, "click", function (evt) {
          filterSchool.classList.remove("filterElementActive");
          filterDate.classList.remove("filterElementActive");
          filterLocation.classList.remove("filterElementActive");
          if (!filterAuthor.classList.contains("filterElementActive")) {
            filterAuthor.classList.toggle("filterElementActive");
            sortProjects("author");
          }
        }.bind(this));

        start.allProjectsContainer = domCtr.create(
          "div",
          {
            className: "projectsContainer",
          },
          start.mapOverviewProject
        );
        // Read all the other projects
        for (let i in results) {
          if (results[i].attributes.owner != start.userNameEsri) {
            let container = addProject(i, start.allProjectsContainer);
            this.projects[results[i].attributes.projectid] = {container:container, projectid: results[i].attributes.projectid, location: results[i].attributes.name, school: results[i].attributes.school, date: results[i].attributes.CreationDate, author: results[i].attributes.owner};
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
          
          console.log(tempProjects)
          tempProjects.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0));
          console.log(tempProjects)
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
              id: results[i].attributes.projectid + "_" + results[i].attributes.name + "_" + results[i].attributes.school,
              className: "projectContainer",
            },
            cont
          );

          let item = domCtr.create(
            "div",
            {
              id: "project_" + results[i].attributes.projectid,
              className: "projects",
            },
            container
          );

          let infoContainer = domCtr.create(
            "div",
            {
              id: "infoContainer_" + results[i].attributes.projectid,
              className: "infoContainer",
            },
            item
          );

          // City
          let city = domCtr.create(
            "div",
            {
              className: "projectElem",
              style: "width:25%",
            },
            infoContainer
          );
          domCtr.create(
            "div",
            {
              className: "projectElemLabel",
              innerHTML: start.strings.get("location"),
            },
            city
          );
          domCtr.create(
            "div",
            {
              className: "projectElemValue",
              innerHTML: results[i].attributes.name,
              title: results[i].attributes.name,
            },
            city
          );

          // School
          let school = domCtr.create(
            "div",
            {
              className: "projectElem",
              style: "width:25%;border-right: 1px solid var(--gray);",
            },
            infoContainer
          );
          domCtr.create(
            "div",
            {
              className: "projectElemLabel",
              innerHTML: start.strings.get("school"),
            },
            school
          );
          domCtr.create(
            "div",
            {
              className: "projectElemValue",
              innerHTML: results[i].attributes.school,
              title: results[i].attributes.school,
            },
            school
          );

          // Add. info labels
          let additionalInfoLabels = domCtr.create(
            "div",
            {
              className: "projectElemCreation",
              style: "width:20%",
            },
            infoContainer
          );

          domCtr.create(
            "div",
            {
              innerHTML: start.strings.get("date"),
              className: "projectElemLabel",
            },
            additionalInfoLabels
          );
          domCtr.create(
            "div",
            {
              innerHTML: start.strings.get("author"),
              className: "projectElemLabel",
            },
            additionalInfoLabels
          );

          // Add. Info
          let additionalInfo = domCtr.create(
            "div",
            {
              className: "projectElemCreation",
              style: "width:20%",
            },
            infoContainer
          );

          let creationDate = new Date(results[i].attributes.CreationDate);
          domCtr.create(
            "div",
            {
              innerHTML: creationDate.toISOString().slice(0, 10),
              className: "projectElemLabel",
              style: "font-weight: bold",
            },
            additionalInfo
          );
          domCtr.create(
            "div",
            {
              innerHTML: results[i].attributes.owner,
              className: "projectElemLabel",
              style: "font-weight: bold",
            },
            additionalInfo
          );
          infoContainer.addEventListener("click", () => {
            if (start.projectSelected == item) {
              start.unSelectProject();
            } else {
              //start.viewOverview.goTo(results[i].geometry);
              let query = start.projectAreaPoint.createQuery();
              query.where =
                "projectid in ('" + results[i].attributes.projectid + "')";
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
                results[i].attributes.projectid,
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
      if (start.projectSelected !== null) {
        start.projectSelected.className = "projects";
      }
      start.projectSelected = item;
      item.className = "projects projects_active";

      start.buttons.style.display = "flex";
      this.updateAttributes("project", projectId);

      if (
        item.offsetTop - this.mapOverviewProject.offsetTop >
        this.mapOverviewProject.offsetHeight
      ) {
        this.mapOverviewProject.scrollTop =
          item.offsetTop - this.mapOverviewProject.offsetTop;
      }

      domCtr.place(this.buttons, infoContainer, "after");
      domCtr.place(this.btn_project, infoContainer, "last");

      if (start.userNameEsri != null && start.userNameEsri == owner) {
        //if (start.userNameEsri == null || (start.userNameEsri != null && start.userNameEsri == owner)) {
        this.buttons.style.display = "flex";
        this.btn_collection.style.display = "block";
        this.btn_consolidation.style.display =
          this.admin == "true" ? "block" : "none";
        this.btn_project.style.display =
          this.admin == "true" ? "block" : "none";
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
        start.buttons.style.display = "none";
        start.removeFromAttributes("project");
        start.projectSelected.className = "projects";
        start.projectSelected = null;
        start.viewOverview.popup.close();
      }
    }

    // Handle all the interactions
    clickHandler() {
      let start = this;

      on(this.login, "click", function (evt) {
        start.arcgis.handleSignInOut();
      });

      on(this.settingsButton, "click", function (evt) {
        start.settings.style.display =
          start.settings.style.display == "none" ? "block" : "none";
      });

      on(this.versionSelect, "change", function (evt) {
        start.updateAttributes(
          "version",
          evt.target.options[evt.target.selectedIndex].value
        );
      });

      on(this.langSelect, "change", function (evt) {
        start.updateAttributes(
          "lang",
          evt.target.options[evt.target.selectedIndex].value
        );
        window.open(
          window.location.href.split("?")[0] + start.attributes,
          "_self"
        );
      });

      on(
        this.btn_collection,
        "click",
        function (evt) {
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
          this.removeFromAttributes("project");

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
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown =
          dragMouseDown;
        document.getElementById(elmnt.id + "header").ontouchstart =
          dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.addEventListener('touchstart', dragMouseDown);
        //elmnt.onmousedown = dragMouseDown;

      }

      function dragMouseDown(e) {
        //console.log("dragMouseDown")
        //e = e || window.event;
        //e.preventDefault();
        // get the mouse cursor position at startup:
        pos4 = e.touches[0].clientY;
        elmnt.addEventListener('touchend',closeDragElement)
        //document.onmouseup = closeDragElement;

        // call a function whenever the cursor moves:
        elmnt.addEventListener('touchmove',elementDrag)
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
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      }

      function closeDragElement() {
        //console.log("closeDragElement")

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
