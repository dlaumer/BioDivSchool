/*
--------------
Element.js
--------------
 One element is responsible to the input collection for one (!) entry in the database, one key-value pair. There are many different types of input:
    - simpleTextInput
    - dateInput
    - dropdownInput
    - radioButtonInput
    - sliderInput
    - mapInput
    - textInfo (special case without connected database entry, just info)

*/

let style = document.createElement('style')
style.innerHTML = `

        .labelContainer {
          width: 100% !important;
        }
        .input {
          width: 100% !important;
        }
      
        .labelText {
          width: 100% !important;
        }
      
        .mapContainer {
          flex-direction: column !important;
          height: 600px !important;
        }
      
        .map  {
          width: 100% !important;
          height: 70% !important;
        }
      
        .editor {
          width: 100% !important;
          height: 60% !important;
        }`;

define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",


], function (dom, domCtr, win, on) {
  return class Element {
    constructor(page, id, container) {
      this.page = page;
      this.id = id;
      this.name = this.page.name + "_element_" + id.toString();
      this.container = container;

      this.valueSet = false;
      this.value = null;
      this.setterUI = null;
      this.hasPoints = false;
      this.points = 0;
      this.measure = null;
      this.allowedValues = null; // Meaning all the values are allowed
      this.resultDiv = null;
      this.groupDivs = null;
      this.measureNone = "";

      this.rules = null;

      this.elementWidth = 0;
      if (app.mode == "consolidation") {
        document.head.appendChild(style);
      }
      else {
        window.onresize = this.reportWindowSize

      }

    }

    init(type, key, args) {
      this.type = type;
      this.key = key;

      this.element = domCtr.create("div", { id: this.name, className: "element inputElement" }, this.container);
      if (app.mode == "results") {
        //this.element.style.display = "none"
      }
      if (args.measure) {
        this.measureNone = args.measure;
      }
      this.labelContainer = domCtr.create("div", { className: "labelContainer" }, this.element);

      if (args.title) {
        this.addTitle(args.title);
      }

      switch (this.type) {
        case "simpleTextInput":
          this.addSimpleTextInput(args);
          break;
        case "dateTimeInput":
          this.addDateTimeInput(args);
          break;
        case "dropdownInput":
          this.addDropdownInput(args);
          break;
        case "radioButtonInput":
          this.addRadioButtonInput(args);
          break;
        case "sliderInput":
          this.addSliderInput(args);
          break;
        case "mapInput":
          this.addMap(args);
          break;
        case "textInfo":
          this.addTextInfo(args);
          break;
        case "finalButton":
          this.addFinalButton(args);
          break;
      }

      if (args.textInfo) {
        this.addTextInfo(args.textInfo);
      }

     
    }

    addSimpleTextInput(args) {
      this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text }, this.labelContainer);
      if (app.mode != "results") {
        this.input = domCtr.create("input", { className: "input inputField", placeholder: args.placeholder }, this.element);

        on(this.input, "change", function (evt) {
          if (evt.target.value == "") {
            this.setter(null)
          }
          else {
            this.setter(evt.target.value)
          }
        }.bind(this));
      }
      else {
        this.input = domCtr.create("div", { className: " input", innerHTML: "" }, this.element);
        this.resultDiv = domCtr.create("div", { className: "result", innerHTML: "<b>" + app.strings.get("result") + ":</b><br> n/a"}, this.input);
        this.measureDiv = domCtr.create("div", { className: "measure", innerHTML: app.strings.get(this.measureNone)}, this.input)
      }

      this.setterUI = function (value) {
        if (app.mode == "results") {
          this.setterUINonEdit(this.input, value)
        }
        else {
          this.input.value = value
        }

      }
    }

    addDateTimeInput(args) {
      this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text }, this.labelContainer);
      if (app.mode != "results") {
        this.input = domCtr.create("input", { id: "dateTime", type: "date", className: "input dateTimeInput" }, this.element);

        on(this.input, "input", function (evt) {
          this.setter(evt.target.value)
        }.bind(this));
      }
      else {
        this.input = domCtr.create("div", { className: "groupResult input", innerHTML: "" }, this.element);
        this.resultDiv = domCtr.create("div", { className: "result", innerHTML: "<b>" + app.strings.get("result") + ":</b><br> n/a"}, this.input);
        this.measureDiv = domCtr.create("div", { className: "measure", innerHTML: app.strings.get(this.measureNone)}, this.input)
      }


      this.setterUI = function (value) {
        if (app.mode == "results") {
          this.setterUINonEdit(this.input, value)
        }
        else {
          this.input.value = new Date(value).toISOString().split("T")[0]
        }
      }
    }

    // ToDo: Mehrfachauswahl!
    addDropdownInput(args) {
      this.allowedValues = []
      this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text }, this.labelContainer);
      if (app.mode != "results") {
        this.input = domCtr.create("select", { className: "input inputField" }, this.element);

        domCtr.create("option", { value: "", selected: true, innerHTML: args.placeholder }, this.input);
        for (const i in args.options) {
          domCtr.create("option", { value: args.options[i].key, innerHTML: args.options[i].label }, this.input);
        }
      }
      else {
        this.input = domCtr.create("div", { className: "groupResult input", innerHTML: "" }, this.element)
        this.resultDiv = domCtr.create("div", { className: "result", innerHTML: "<b>" + app.strings.get("result") + ":</b><br> n/a"}, this.input);
        this.measureDiv = domCtr.create("div", { className: "measure", innerHTML: app.strings.get(this.measureNone)}, this.input)
      }

      for (const i in args.options) {
        this.allowedValues.push(args.options[i].label); // ToDo: Change to key!
      }

      if (args.points != null) {
        this.hasPoints = true;
        this.keyPoints = args.points;
        this.pointsInfo = domCtr.create("div", { id: this.name + "_pointsInfo", className: "pointsInfo" }, this.label);

        this.minPoints =Math.min(...args.options.map(item => item.points))
        this.maxPoints = Math.max(...args.options.map(item => item.points));

      }
      for (const i in args.options) {
        this.pointsDict[args.options[i].label] = { "points": args.options[i].points, "key": args.options[i].key };
        this.data[args.options[i].key] = { "points": args.options[i].points, "label": args.options[i].label };

        if (args.options[i].points) {
          this.pointsDict[args.options[i].label]["points"] = args.options[i].points;
          this.data[args.options[i].key]["points"] = args.options[i].points;
        }
        if (args.options[i].measure) {
          this.pointsDict[args.options[i].label]["measure"] = args.options[i].measure;
          this.data[args.options[i].key]["measure"] = args.options[i].measure;
        }
      }



      on(this.input, "change", function (evt) {
        if (evt.target.selectedIndex == 0) {
          this.setter(null);

        }
        else {
          this.setter(evt.target.options[evt.target.selectedIndex].innerHTML);

        }

      }.bind(this));

      this.setterUI = function (value) {
        if (app.mode == "results") {
          this.setterUINonEdit(this.input, value)
        }
        else {
          this.input.value = this.pointsDict[value].key
        }
      }
    }

    addRadioButtonInput(args) {
      this.allowedValues = []
      this.element.style.alignItems = "start;"
      this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text }, this.labelContainer);
      if (app.mode != "results") {
        this.input = domCtr.create("div", { className: "input inputRows" }, this.element);
        for (const i in args.options) {
          let radioButtonContainer = domCtr.create("div", { className: "radioButtonContainer" }, this.input);
          domCtr.create("input", { type: "radio", name: this.key, id: this.key + "___" + args.options[i].key, className: "radioButton" }, radioButtonContainer);
          domCtr.create("label", { for: args.options[i].key, innerHTML: args.options[i].label }, radioButtonContainer);
        }
      }
      else {
        this.input = domCtr.create("div", { className: "groupResult input", innerHTML: "" }, this.element);
        this.resultDiv = domCtr.create("div", { className: "result", innerHTML: "<b>" + app.strings.get("result") + ":</b><br> n/a"}, this.input);
        this.measureDiv = domCtr.create("div", { className: "measure", innerHTML: app.strings.get(this.measureNone)}, this.input)

      }
      for (const i in args.options) {
        this.allowedValues.push(args.options[i].label); // ToDo: Change to key!
      }

      if (args.points != null) {
        this.hasPoints = true;
        this.keyPoints = args.points;
        this.pointsInfo = domCtr.create("div", { id: this.name + "_pointsInfo", className: "pointsInfo" }, this.label);
       
        this.minPoints =Math.min(...args.options.map(item => item.points))
        this.maxPoints = Math.max(...args.options.map(item => item.points));
      } 
      this.pointsDict = {}
      this.data = {}
      for (const i in args.options) {
        this.pointsDict[args.options[i].label] = { "points": args.options[i].points, "key": args.options[i].key };
        this.data[args.options[i].key] = { "points": args.options[i].points, "label": args.options[i].label };

        if (args.options[i].points) {
          this.pointsDict[args.options[i].label]["points"] = args.options[i].points;
          this.data[args.options[i].key]["points"] = args.options[i].points;
        }
        if (args.options[i].measure) {
          this.pointsDict[args.options[i].label]["measure"] = args.options[i].measure;
          this.data[args.options[i].key]["measure"] = args.options[i].measure;
        }
      }

    

      on(this.input, "change", function (evt) {
        this.setter(this.data[evt.target.id.split("___")[1]].label)

      }.bind(this));

      this.setterUI = function (value) {
        if (app.mode == "results") {
          this.setterUINonEdit(this.input, value)
        }
        else {
          if (value == null || value == "") {
            if (this.element.querySelector('input[name="' + this.key + '"]:checked') != null) {
              this.element.querySelector('input[name="' + this.key + '"]:checked').checked = false
            }
          }
          else {
            document.getElementById(this.key + "___" + this.pointsDict[value].key).checked = true;
          }
        }
      }
    }


    // ToDo: Points!
    addSliderInput(args) {
      this.min = args.min;
      this.max = args.max;
      this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text }, this.labelContainer);
      if (app.mode != "results") {
        this.sliderContainer = domCtr.create("div", { className: "input" }, this.element);
        this.sliderContainer2 = domCtr.create("div", { style: "width: 80%" }, this.sliderContainer);
        this.input = domCtr.create("input", { type: "range", className: "slider", min: args.min, max: args.max, value: (args.max - args.min) / 2, step: args.step }, this.sliderContainer2);
        this.ticksContainer = domCtr.create("div", { className: "ticksContainer" }, this.sliderContainer2);

        // if there are more than 100 steps, don't show all of the ticks because they all overlap.
        let stepTicks = args.step;
        if ((args.max - args.min) / args.step > 100) {
          stepTicks = (args.max - args.min) / 100;
        }
        for (let i = args.min; i <= args.max; i += stepTicks) {
          domCtr.create("div", { className: "ticks" }, this.ticksContainer);
        }
        this.labelsContainer = domCtr.create("div", { className: "ticksContainer", style: "padding: 0 5px;" }, this.sliderContainer2);
        domCtr.create("div", { className: "labels", innerHTML: args.min }, this.labelsContainer);
        domCtr.create("div", { className: "labels", innerHTML: args.max }, this.labelsContainer);

        this.bubble = domCtr.create("div", { className: "bubble" }, this.sliderContainer);
        this.input.addEventListener("input", () => {
          this.bubble.innerHTML = this.input.value.toString() + "%";
        });
        this.bubble.innerHTML = this.input.value.toString() + "%";
      }
      else {
        this.input = domCtr.create("div", { className: "groupResult input", innerHTML: "" }, this.element)
        this.resultDiv = domCtr.create("div", { className: "result", innerHTML: "<b>" + app.strings.get("result") + ":</b><br> n/a"}, this.input);
        this.measureDiv = domCtr.create("div", { className: "measure", innerHTML: app.strings.get(this.measureNone)}, this.input)
      }

      if (args.points != null) {
        this.hasPoints = true;
        this.keyPoints = args.points;
        this.pointsInfo = domCtr.create("div", { id: this.name + "_pointsInfo", className: "pointsInfo" }, this.label);
        this.stops = args.stops;

        this.minPoints =Math.min(...this.stops.map(item => item.points))
        this.maxPoints = Math.max(...this.stops.map(item => item.points));
      }


      on(this.input, "input", function (evt) {
        this.setter(this.input.value, false)
      }.bind(this));

      
      on(this.input, "change", function (evt) {
        this.setter(this.input.value)
      }.bind(this));
      

      this.setterUI = function (value) {
        if (app.mode == "results") {
          this.setterUINonEdit(this.input, value + "%")
        }
        else {
          this.input.value = value
          this.bubble.innerHTML = value;
        }

      }
    }


    addMap(args) {

      this.color = args.color;
      this.name_display = args.name_display;
      //this.element.className = "element";
      this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text, style: "width: 100%;" }, this.labelContainer);
      this.mapContainer = domCtr.create("div", { className: "mapContainer" }, this.element);
      this.input = domCtr.create("div", { id: this.name + "_map", className: "map" }, this.mapContainer);
      this.screenshot = domCtr.create("img", {className: "screenshot"}, this.mapContainer);

      this.editorContainer = domCtr.create("div", { id: this.name + "_editor", className: "editor" }, this.mapContainer);
      this.editor = domCtr.create("div", { id: this.name + "_editor" }, this.editorContainer);
      
      this.linkInstructions = domCtr.create("div", { id: "linkInstructions", className: "labelText linkText", innerHTML: app.strings.get("instructions") }, this.editorContainer);
      this.instructions = domCtr.create("div", { className: "expandable" }, this.element);

      this.instructionsText = domCtr.create("div", {innerHTML: app.content.instructions, }, this.instructions);
     this.instructionsClose =  domCtr.create("div", {className: "btn1", innerHTML: app.strings.get("close"), }, this.instructions);

     if (app.mode == "results") {
      //this.input.style = "width:100%";
      this.editorContainer.innerHTML = "";
      this.input.style = "width:50vw;";
      this.mapContainer.style = "justify-content: space-between;";
      this.editorContainer.style = "width:40%;";
      this.linkInstructions.display = "none";
      this.resultDiv = domCtr.create("div", { className: "result", innerHTML: "<b>" + app.strings.get("result") + ":</b><br> n/a"}, this.editorContainer);
      this.measureDiv = domCtr.create("div", { className: "measure" }, this.editorContainer)
    }

     on(this.instructionsClose, "click", function (evt) {
      this.instructions.style.display = "";
    }.bind(this));
      on(this.linkInstructions, "click", function (evt) {
        this.instructions.style.display = this.instructions.style.display == "" ? "flex" : "";
        this.instructions.scrollIntoView({behavior: "smooth", block: 'start'});
      }.bind(this));
      if (!app.offline) {
        app.arcgis.addMap(this.input.id, this.editor.id, this, (info) => {
          this.geometry = info.geometry;
          this.editorEsri = info.editor;
          this.projectAreaClass = info.projectArea;
          this.prototype = info.prototype;
          //app.mapLoadedPromises.push(info.mapLoaded);
          
        });
      }

      if (args.points != null) {
        this.keyArea = args.area;
        this.area = 0;

        this.keyRatio = args.ratio.key;
        if (args.ratio.stops) {
          this.ratioStops = args.ratio.stops;

          this.minPoints =Math.min(...args.ratio.stops.map(item => item.points))
          this.maxPoints = Math.max(...args.ratio.stops.map(item => item.points));

        }
        else {
          this.ratioOptions = args.ratio.options;

          this.minPoints =Math.min(...args.ratio.options.map(item => item.points))
          this.maxPoints = Math.max(...args.ratio.options.map(item => item.points));
        }

        this.hasPoints = true;
        this.keyPoints = args.points;
        this.pointsInfo = domCtr.create("div", { id: this.name + "_pointsInfo", className: "pointsInfo" }, this.label);


      }

      this.setterUI = function (value) {
        if (app.mode == "results") {
          this.setterUINonEdit(this.input, value)
        }
      }
    }

    calculateRatioAndPoints(previousPoints, callback) {
      if (!app.offline) {
      app.arcgis.calculateArea(this.value, "geometry").then((info) => {
        this.area = info.totalArea;
        this.areas = info.areas;

        if (this.ratioStops) {
          let numRatio = 0;
          if (this.area == 0) {
            this.ratio = "0-" + (this.ratioStops[0] * 100).toFixed(0) + "%"
            this.points = parseInt(Object.keys(this.ratioStops)[0]);
            this.measure = this.measureNone ? this.measureNone : null;
          }
          else {
            numRatio = this.area / app.projectArea;
            if (numRatio > 1) {
              alert(app.strings.get("alertAreSize"));
            }
            for (let i in this.ratioStops) {
              if (numRatio < this.ratioStops[i].value) {
                this.ratio = (i - 1 >= 0 ? this.ratioStops[i - 1].value * 100 : 0).toFixed(0) + "-" + (this.ratioStops[i].value * 100).toFixed(0) + "%"
                this.points = this.ratioStops[i].points;
                this.measure =this.ratioStops[i].measure ? this.ratioStops[i].measure : null;

                break;
              }
            }
          }
          this.pointsInfo.innerHTML = app.showPoints ? "(" + app.strings.get("points") + ": " + this.points + ")": "";
          if (app.mode == "results") {
            this.resultDiv = domCtr.create("div", { className: "result" }, this.editorContainer);
            this.resultDiv.innerHTML =  "<b>" + app.strings.get("result") + ":</b><br>" + app.strings.get("areaTotal") + ": " + this.area.toFixed(0) + " m2, " + app.strings.get("ratio") + ": " + (numRatio * 100).toFixed(2) + "%, " + app.strings.get("ratioBin") + ": " + this.ratio;
          }
        }
        else if (this.ratioOptions) {

          let numAreas = JSON.parse(this.value).length;
          let maxArea = Math.max(...Object.values(this.areas));

          if (numAreas < 3) {

            this.ratio = this.ratioOptions[0].label;
            this.points = this.ratioOptions[0].points
            this.measure =this.ratioOptions[0].measure ? this.ratioOptions[6].measure : null;

          } else if (numAreas < 5 && app.projectArea / 2 < maxArea) {

            this.ratio = this.ratioOptions[1].label;
            this.points = this.ratioOptions[1].points
            this.measure =this.ratioOptions[1].measure ? this.ratioOptions[6].measure : null;

          } else if (numAreas < 5 && app.projectArea / 2 >= maxArea) {

            this.ratio = this.ratioOptions[2].label;
            this.points = this.ratioOptions[2].points
            this.measure =this.ratioOptions[2].measure ? this.ratioOptions[6].measure : null;

          }

          else if (numAreas < 6 && 0.4 * app.projectArea < maxArea) {

            this.ratio = this.ratioOptions[3].label;
            this.points = this.ratioOptions[3].points
            this.measure =this.ratioOptions[3].measure ? this.ratioOptions[6].measure : null;

          }

          else if (numAreas < 6 && 0.4 * app.projectArea >= maxArea) {

            this.ratio = this.ratioOptions[4].label;
            this.points = this.ratioOptions[4].points
            this.measure =this.ratioOptions[4].measure ? this.ratioOptions[6].measure : null;

          }

          else if (numAreas < 7 && 0.3 * app.projectArea < maxArea) {

            this.ratio = this.ratioOptions[5].label;
            this.points = this.ratioOptions[5].points
            this.measure =this.ratioOptions[5].measure ? this.ratioOptions[6].measure : null;

          }

          else if (numAreas < 7 && 0.3 * app.projectArea >= maxArea) {

            this.ratio = this.ratioOptions[6].label;
            this.points = this.ratioOptions[6].points
            this.measure =this.ratioOptions[6].measure ? this.ratioOptions[6].measure : null;

          }
          else {
            this.ratio = this.ratioOptions[6].label;
            this.points = this.ratioOptions[6].points
            this.measure =this.ratioOptions[6].measure ? this.ratioOptions[6].measure : null;

          }
          this.pointsInfo.innerHTML = app.showPoints ? "(" + app.strings.get("points") + ": " + this.points + ")": "";
          if (app.mode == "results") {
            this.resultDiv = domCtr.create("div", { className: "result" }, this.editorContainer);
            this.resultDiv.innerHTML =  "<b>" + app.strings.get("result") + ":</b><br>" + app.strings.get("areaTotal") + ": " + this.area.toFixed(0) + " m2, " + app.strings.get("ratioBin") + ": " + this.ratio ;
          }
        }


        app.pointsTotal = app.pointsTotal - parseInt(previousPoints) + parseInt(this.points);
        app.pointsTotalDiv.innerHTML = app.showPoints ? app.strings.get("totalPoints") + ": " + app.pointsTotal.toFixed(0) : "";
        callback();

      })
        .catch((error) => {
          //alert(app.strings.get("alertArea"))
          console.log(error)
        });
      }
    }


    addTextInfo(args) {

      //this.label.innerHTML = this.label.innerHTML + "<br><br> <a onclick=expand()>sdsdd</a>" + args.linkText;
      this.link = domCtr.create("div", { className: "labelText linkText", innerHTML: args.linkText }, this.labelContainer);
      this.textInfo = domCtr.create("div", { className: "expandable", innerHTML: args.text, }, this.labelContainer);

      on(this.link, "click", function (evt) {
        this.textInfo.style.display = this.textInfo.style.display == "" ? "flex" : "";
      }.bind(this));
    }

    addTitle(args) {

      this.link = domCtr.create("div", { className: "elementTitle", innerHTML: args }, this.element);
    }



    addFinalButton(args) {
      this.element = domCtr.create("div", { id: this.name, className: "element final" }, this.container);
      this.label = domCtr.create("div", { className: "labelText labelFinal", innerHTML: args.text }, this.element);
      this.final = domCtr.create("div", { id: "btn_final", className: "btn1", innerHTML: app.strings.get("results") }, this.element);

      on(this.final, "click", function (evt) {
        args.func();
      }.bind(this));


    }

    setterUINonEdit(container, value) {

      if (this.type == "mapInput") {
        if (app.mode == "consolidation") {
          app.arcgis.addMap(container, null, this, (info)=> {
            info.geometry.definitionExpression = "objectid in (" + value.substring(1, value.length - 1) + ")";
  
          });
        }
      }
      else {
       
        if (this.resultDiv == null) {
          this.resultDiv = domCtr.create("div", { className: "result", innerHTML: value}, container);
        }
        else {
          this.resultDiv.innerHTML = "<b>" + app.strings.get("result") + ":</b><br>" + value;
        }

      }
      

      if (app.mode == "results") {

        if (this.measure != null) {
          this.measureDiv.innerHTML = app.strings.get(this.measure);
        }
        
        // Hardcoded special measure rules...
        // TODO: Change to key!!!
        if (this.key == "grasduengen" && value == "Nein") {
          let elements = app.getAllElements();
          let elem33 = elements["duengen"];
          elem33.measureDiv.innerHTML = app.strings.get(this.measure);
        }
        if (this.key == "mitteln") {
          let elements = app.getAllElements();
          let elem33gras = elements["grasduengen"];
          let elem33 = elements["duengen"];
          elem33.measureDiv.innerHTML = app.strings.get(this.measure);
          elem33gras.measureDiv.innerHTML = app.strings.get(this.measure);
        }
        if (this.key == "b_unkraut") {
          let elements = app.getAllElements();
          let elem32a = elements["a_unkraut"];
          elem32a.measureDiv.innerHTML = app.strings.get(this.measure);
        }
      }
    }

    

    setter(value, saveData = true) {
      return new Promise((resolve, reject) => {

        if (app.mode == "results" && value != null && value != "") {

          this.element.style.display = "flex"
        }

        let previousPoints = 0;
        if (this.points != null) {
          previousPoints = this.points;
        }

        if (value == null || value == "") {
          this.valueSet = false;
          this.value = value;

          if (this.hasPoints) {
            this.points = null;
            this.pointsInfo.innerHTML = "";
            app.pointsTotal = app.pointsTotal - parseInt(previousPoints);
            app.pointsTotalDiv.innerHTML = app.showPoints ? app.strings.get("totalPoints") + ": " + app.pointsTotal.toFixed(0) : "";
          }
          resolve();
        }
        else {
          this.valueSet = true;
          this.value = value;


          if (this.rules != null) {
            for (let i in this.rules) {
              for (let j in this.rules[i].elements) {
                this.hideWithRules(this.rules[i].elements[j]);
              }
              for (let k in this.rules[i].values) {
                if ((this.rules[i].values[k] == this.value) || (this.rules[i].values.length == 1 && this.rules[i].values[k] == null && this.value != "")) {
                  for (let j in this.rules[i].elements) {
                    this.rules[i].elements[j].element.style.display = "flex";
                    this.rules[i].elements[j].element.style.visibility = "visible";
                    
                  }
                }
                else {
                  for (let j in this.rules[i].elements) {
                    if (this.rules[i].elements[j].type != "textInfo") {
                      this.rules[i].elements[j].setter("");
                      this.rules[i].elements[j].setterUI("");
                    }
                  }
                }

              }
            }
          }

          if (this.type == "mapInput") {
            this.geometry.definitionExpression = "objectid in (" + value.substring(1, value.length - 1) + ")";

          }

          if (this.hasPoints) {
            if (this.type == "mapInput") {
              this.calculateRatioAndPoints(previousPoints, resolve);
            }
            else {
              if (this.type == "sliderInput") {
                for (let i in this.stops) {
                  if (parseFloat(this.value) < this.stops[i].value) {
                    this.points = this.stops[i].points;
                    this.measure =this.stops[i].measure ? this.stops[i].measure : null;

                    break;
                  }
                }
              }
              else {
                this.points = this.pointsDict[this.value].points;
                this.measure = this.pointsDict[this.value].measure ? this.pointsDict[this.value].measure : null;

              }

              if (app.showPoints) {
                this.pointsInfo.innerHTML = this.points == 1 ? "(" + this.points + " " + app.strings.get("point") + ")" : "(" + this.points + " " + app.strings.get("points") + ")";
              }



              app.pointsTotal = app.pointsTotal - parseInt(previousPoints) + parseInt(this.points);
              app.pointsTotalDiv.innerHTML = app.showPoints ? app.strings.get("totalPoints") + ": " + app.pointsTotal.toFixed(0) : "";
              resolve();
            }

          }
          else {
            resolve();
          }
        }
      }).then(() => {

        if (saveData && app.mode != "project" && !app.offline) {
          app.save.innerHTML = app.strings.get("saving")
          app.save.className = "btn1"
          let data = this.getter();
          new Promise((resolve, reject) => {
            app.arcgis
              .updateFeature(app.objectId, data)
              .then((value) => {
                resolve(value);
              })
              .catch((reason) => {
                reject(reason);
              }).then(() => {
                app.save.innerHTML = app.strings.get("saved")
                app.save.className = "btn1 btn_disabled"
              });

          });
        }
        else if (app.mode == "project" && (this.key == "school" || this.key == "projectid" || this.key == "name" )) {
          //app.arcgis.handleSignInOut();
          this.map.prototype.attributes[this.key] = this.value;
          this.map.prototype.attributes["owner"] = app.userNameEsri;
        }
      })

    }

    setterGroups(values, count) {


      for (let i in values) {
        if (this.groupDivs[i] && values[i] != null) {
          this.setterUINonEdit(this.groupDivs[i], values[i])


        }
      }

      if (app.consolidationWidth == null) {
        app.consolidationWidth = document.getElementById('consolidation_' + this.key).clientWidth;
      }

      if (this.type != "mapInput") {
        var trace = {
          //histfunc: "count",
          //width: document.getElementById('consolidation_' + this.key).clientWidth,
          x: Object.keys(count),
          y: Object.values(count),
          type: 'bar',
          hovertemplate: null
        };

        var layout = {
          yaxis: {
            title: 'Anzahl',
          },
          width: app.consolidationWidth,
          hovermode: "x"
        };
        var data = [trace];
        Plotly.newPlot('consolidation_' + this.key, data, layout);
      }

    }



    getter() {
      let output = {}
      output[this.key] = this.value;
      if (this.hasPoints) {
        if (this.type == "mapInput") {
          output[this.keyPoints] = parseInt(this.points);
          output[this.keyRatio] = this.ratio;
          output[this.keyArea] = this.area;
        }
        else {
          output[this.keyPoints] = parseInt(this.points);
        }
      }
      return output;

    }

    checkValueSet() {
      if (this.valueSet) {
        this.label.style.color = "black";
      }
      else {
        this.label.style.color = "red";
      }
    }

    hide() {
      if (app.mode != "consolidation") {
        this.element.style.display = "none";
      }
    }

    hideWithRules(element) {
      element.hide();
      if (element.rules != null) {
        for (let i in element.rules) {
          for (let j in element.rules[i].elements) {
            element.hideWithRules(element.rules[i].elements[j])
          }
        }
      }
    }

    checkAllowedValues(value) {

      if (this.type == "radioButtonInput" || this.type == "dropdownInput") {
        if (this.allowedValues.includes(value)) {
          return true;
        }
        else {
          return false;
        }
      }

      else if (this.type == "sliderInput") {
        if (value > this.min && value < this.max) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true
      }
    }



    reportWindowSize() {
      if (document.getElementsByClassName("element").length > 0) {
        let i = 0;
        //while (!document.getElementsByClassName("element")[i] || !document.getElementsByClassName("element")[i].hasOwnProperty('clientWidth') || document.getElementsByClassName("element")[i].hasOwnProperty('clientWidth') && document.getElementsByClassName("element")[i].clientWidth == 0) {
        let notFound = true;
        while (notFound && i<50) {
          try {
            notFound = document.getElementsByClassName("element")[i].clientWidth == 0
          }
          catch {

          }
          i++;
        }
        this.elementWidth = document.getElementsByClassName("element")[i].clientWidth;

        if (this.elementWidth != 0) {
          if (this.elementWidth < 600) {

            document.head.appendChild(style);

          } else {
            if (document.head.contains(style)) {
              document.head.removeChild(style);

            }
          }
        }
      }



    }

  }

});
