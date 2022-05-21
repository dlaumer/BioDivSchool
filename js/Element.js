/*
--------------
Element.js
--------------
Holds all the input elements for ONE feature in the database, one key-value pair!

*/

let style = document.createElement('style')
      style.innerHTML =`
      .input {
        width: 100% !important;
      }
    
      .labelText {
        width: 100% !important;
      }
    
      .mapContainer {
        flex-direction: column !important;
        height: 400px !important;
      }
    
      .map  {
        width: 100% !important;
        height: 70% !important;
      }
    
      .editor {
        width: 100% !important;
        height: 40% !important;
      }`;

define([
    "dojo/dom",
  
    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",


  ], function (dom, domCtr, win, on) {
    return class Element {
      constructor(app, page, id, container) {
        this.app = app;
        this.page = page;
        this.id = id;
        this.name = this.page.name + "_element_" + id.toString();
        this.container = container;
  
        this.valueSet = false;
        this.value = null;
        this.setterUI = null;
        this.hasPoints = false;
        this.points = null;

        this.groupDivs = null;

        this.rules = null;

        this.elementWidth = 0;
        window.onresize = this.reportWindowSize

      }
  
      init(type, key, args) {
        this.type = type;  
        this.key = key;

        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);

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
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("input", { className: "input inputField", placeholder: args.placeholder }, this.element);

        on(this.input, "input", function (evt) {
          if (evt.target.value == "") {
            this.setter(null)
          }
          else {
            this.setter(evt.target.value)
          }
        }.bind(this));

        this.setterUI = function (value) {
          this.input.value = value
        }
      }

      addDateTimeInput(args) {
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("input", {id: "dateTime", type:"date", className: "input dateTimeInput" }, this.element);
        
        on(this.input, "input", function (evt) {
          this.setter(evt.target.value)
        }.bind(this));

        this.setterUI = function (value) {
          this.input.value = new Date(value).toISOString().split("T")[0]
        }
      }

      // ToDo: Mehrfachauswahl!
      addDropdownInput(args) {
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("select", {className:"input inputField"}, this.element);

        domCtr.create("option", {value:"", selected:true, innerHTML: args.placeholder}, this.input);
        for (const i in args.options) {
            domCtr.create("option", {value:args.options[i].key, innerHTML: args.options[i].label}, this.input);
        }

        if (args.points != null) {
          this.hasPoints = true;
          this.keyPoints = args.points;
          this.pointsInfo = domCtr.create("div", {id: this.name + "_pointsInfo", className: "pointsInfo"}, this.label);

          this.pointsDict = {}
          for (const i in args.options) {
            this.pointsDict[args.options[i].label] = {"points": args.options[i].points, "key": args.options[i].key};
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
          this.input.value = this.pointsDict[value].key
        }
      }

      addRadioButtonInput(args) {
        this.element.style =  "align-items: start;"
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("div", {className: "input inputRows"}, this.element);        
        for (const i in args.options) {
          let radioButtonContainer = domCtr.create("div", {className: "radioButtonContainer"}, this.input); 
          domCtr.create("input", {type: "radio", name: this.key, id: args.options[i].key, className: "radioButton"}, radioButtonContainer);  
          domCtr.create("label", {for: args.options[i].key, innerHTML: args.options[i].label }, radioButtonContainer);  
        }

        if (args.points != null) {
          this.hasPoints = true;
          this.keyPoints = args.points;
          this.pointsInfo = domCtr.create("div", {id: this.name + "_pointsInfo", className: "pointsInfo"}, this.label);

        }
        this.pointsDict = {}
        for (const i in args.options) {
          this.pointsDict[args.options[i].label] = {"points": args.options[i].points, "key": args.options[i].key};
        }

        on(this.input, "change", function (evt) {
          this.setter(evt.target.labels[0].innerHTML)
          
        }.bind(this));
        
        this.setterUI = function (value) {
          document.getElementById( this.pointsDict[value].key).checked = true;
        }
      }


      // ToDo: Points!
      addSliderInput(args) {
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.sliderContainer = domCtr.create("div", {className: "input"}, this.element);        
        this.sliderContainer2 = domCtr.create("div", {style: "width: 80%"}, this.sliderContainer);
        this.input = domCtr.create("input", {type:"range", className: "slider", min: args.min, max: args.max, value: (args.max - args.min)/2, step: args.step}, this.sliderContainer2);
        this.ticksContainer = domCtr.create("div", {className: "ticksContainer"}, this.sliderContainer2);  
        
        // if there are more than 100 steps, don't show all of the ticks because they all overlap.
        let stepTicks = args.step;
        if ((args.max - args.min) / args.step > 100) {
          stepTicks = (args.max - args.min) / 100;
        }
        for (let i = args.min; i <= args.max; i += stepTicks) {
          domCtr.create("div", {className: "ticks"}, this.ticksContainer);
        }
        this.labelContainer = domCtr.create("div", {className: "ticksContainer", style: "padding: 0 5px;"}, this.sliderContainer2);  
        domCtr.create("div", {className: "labels", innerHTML: args.min}, this.labelContainer);
        domCtr.create("div", {className: "labels", innerHTML: args.max}, this.labelContainer);     

        this.bubble = domCtr.create("div", {className: "bubble"}, this.sliderContainer);   
        this.input.addEventListener("input", () => {
          this.bubble.innerHTML = this.input.value.toString() + "%";
        });
        this.bubble.innerHTML = this.input.value.toString() + "%";


        if (args.points != null) {
          this.hasPoints = true;
          this.keyPoints = args.points;
          this.pointsInfo = domCtr.create("div", {id: this.name + "_pointsInfo", className: "pointsInfo"}, this.label);
          this.stops = args.stops;

        }


        on(this.input, "input", function (evt) {
          this.setter(this.input.value)
        }.bind(this));

        this.setterUI = function (value) {
          this.input.value = value
          this.bubble.innerHTML = value;
        }
      }


      addMap(args) {
        this.element.className =  "element"
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text, style: "width: 100%;"}, this.element);
        this.mapContainer = domCtr.create("div", {className: "mapContainer"}, this.element); 
        this.input = domCtr.create("div", {id: this.name + "_map", className:"map"}, this.mapContainer);
        this.editorContainer = domCtr.create("div", {className: "editor"}, this.mapContainer); 
        this.editor = domCtr.create("div", {id: this.name + "_editor"}, this.editorContainer);
 
        if (!that.offline) {
          let info = that.arcgis.addMap(this.input.id, this.editor.id,this);  
          this.geometry = info.geometry;
          this.projectAreaClass = info.projectArea; 
        }

        if (args.points != null) {
          this.keyArea = args.area;
          this.area = 0;

          this.keyRatio = args.ratio.key;
          this.ratioStops = args.ratio.stops;

          this.hasPoints = true;
          this.keyPoints = args.points;
          this.pointsInfo = domCtr.create("div", {id: this.name + "_pointsInfo", className: "pointsInfo"}, this.label);

          
        }

        this.setterUI = function (value) {
          
        }
      }

      calculateRatioAndPoints(previousPoints) {

        that.arcgis.calculateArea(this.value, "geometry").then((area) => {
          this.area = area;
          let numRatio = 0;
            if (this.area == 0) {
              this.ratio =  "0-" + (this.ratioStops[0]*100).toFixed(0) + "%"
              this.points = parseInt(Object.keys(this.ratioStops)[0]);
            }
            else {
              numRatio = this.area/this.app.projectArea;
              if (numRatio > 1) {
                alert("Das Gebiet darf nicht grösser sein als das Projektgebiet!");
              }
              for (let i in this.ratioStops) {
                if (numRatio < this.ratioStops[i].value) {
                    this.ratio = (i-1 >= 0? this.ratioStops[i-1].value*100: 0).toFixed(0) + "-" + (this.ratioStops[i].value*100).toFixed(0) + "%"
                    this.points = this.ratioStops[i].points;
                    break;
                }
              }
            }
            this.pointsInfo.innerHTML = "(Punkte: " + this.points + ", Totale Fläche: " + this.area.toFixed(0) + " m2, Ratio  " + (numRatio*100).toFixed(2) + "%, Ratio Bereich= " + this.ratio + ")";
          
            that.pointsTotal = that.pointsTotal - parseInt(previousPoints) + parseInt(this.points);
            that.pointsTotalDiv.innerHTML = "Punkte total: " + that.pointsTotal.toFixed(0);
        })
        .catch((error) => {
          alert("Flächenberechnung nicht erfolgreich")
          console.log(error)
        });
        
      }


      addTextInfo(args) { 

        //this.label.innerHTML = this.label.innerHTML + "<br><br> <a onclick=expand()>sdsdd</a>" + args.linkText;
        this.link = domCtr.create("div", { className: "labelText linkText", innerHTML: args.linkText}, this.element);
        this.textInfo = domCtr.create("div", { className: "expandable", innerHTML: args.text, }, this.element);

        on(this.link, "click", function (evt) {
          this.textInfo.style.display = this.textInfo.style.display=="" ? "flex" : "";
        }.bind(this));
      }
      
      addTitle(args) {

        this.link = domCtr.create("div", { className: "elementTitle", innerHTML: args}, this.element);
      }

     

      addFinalButton(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element final"}, this.container);  
        this.label = domCtr.create("div", { className: "labelText labelFinal", innerHTML: args.text}, this.element);      
        this.final = domCtr.create("div", { id: "btn_final", className: "btn1", innerHTML: "Final" }, this.element);

        on(this.final, "click", function (evt) {
          console.log(args.func)
          args.func();
        }.bind(this));
      }
        
  
      setter(value) {

        let previousPoints = 0;
          if (this.points != null) {
            previousPoints = this.points;
          }
  
        if (value == null) {
          this.valueSet = false;
          this.value = value;
          
          if (this.hasPoints) {
            this.points = null;
            this.pointsInfo.innerHTML = "";
          that.pointsTotal = that.pointsTotal - parseInt(previousPoints);
          that.pointsTotalDiv.innerHTML = "Punkte total: " + that.pointsTotal.toFixed(0);
          }
          
        }
        else {
          this.valueSet = true;
          this.value = value;
          
          if (this.type == "mapInput") {
            this.geometry.definitionExpression = "objectid in (" + value.substring(1,value.length-1) + ")";
          }
  
          if (this.hasPoints) {
            if (this.type == "mapInput") {
              this.calculateRatioAndPoints(previousPoints);
            }
            else {
              if (this.type == "sliderInput") {
                for (let i in this.stops) {
                  if (parseFloat(this.value) < this.stops[i].value) {
                    this.points = this.stops[i].points;
                    break;
                  }
                }
              }
              else {
                this.points = this.pointsDict[this.value].points;
              }
              this.pointsInfo.innerHTML = this.points==1? "(" + this.points + " Punkt)":"(" + this.points + " Punkte)"

              that.pointsTotal = that.pointsTotal - parseInt(previousPoints) + parseInt(this.points);
              that.pointsTotalDiv.innerHTML = "Punkte total: " + that.pointsTotal.toFixed(0);
            }
            
          }

          if (this.rules != null) {
            for (let i in this.rules) {
              for (let j in this.rules[i].elements) {
                this.rules[i].elements[j].element.style.display = "none";
              }
              for (let k in this.rules[i].values) {
                if (this.rules[i].values[k] == this.value) {
                  for (let j in this.rules[i].elements) {
                    this.rules[i].elements[j].element.style.display = "block";
                }
                }
            }
             
          }
        }
        }
        this.app.save.className = "btn1"

      }

      setterGroups(values, count){

        
          for (let i in values) {
            if (this.groupDivs[i] && values[i] != null) {
              if (this.type == "mapInput") {
                let geometryTemp = that.arcgis.addMap(this.groupDivs[i], null, null);   
                geometryTemp.geometry.definitionExpression = "objectid in (" + values[i].substring(1,values[i].length-1) + ")";
              }
              else {

                domCtr.create("div", { className: "groupResult", innerHTML: values[i]},  this.groupDivs[i])
              }

               
                  
              

            }
          }

          if (that.consolidationWidth == null) {
            that.consolidationWidth = document.getElementById('consolidation_' + this.key).clientWidth;
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
              width: that.consolidationWidth,
              hovermode:"x"
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


      reportWindowSize() {
        if (document.getElementsByClassName("element").length > 0) {
          this.elementWidth = document.getElementsByClassName("element")[0].clientWidth;
  
          console.log(this.elementWidth);
    
          if (this.elementWidth != 0) {
            if (this.elementWidth < 600 ) {
            
              document.head.appendChild(style);
              
            } else {
              if (document.head.contains(style)){
                document.head.removeChild(style);
  
              }
            }
          }
        }
   
        
  
      }

    }
      
  });
  