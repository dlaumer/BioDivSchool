/*
--------------
Element.js
--------------
Holds all the input elements for ONE feature in the database, one key-value pair!

*/

define([
    "dojo/dom",
  
    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",

    "biodivschool/ArcGis"

  ], function (dom, domCtr, win, on, ArcGis) {
    return class Element {
      constructor(app, page, id, container) {
        this.app = app;
        this.page = page;
        this.id = id;
        this.name = this.page.name + "_element_" + id.toString();
        this.container = container;
        this.arcgis = new ArcGis();
  
        this.valueSet = false;
        this.value = null;
        this.setValue = null;

      }
  
      init(type, key, args) {
        this.type = type;  
        this.key = key;

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
            case "finalButton":
                this.addFinalButton(args);
                break;
        }

      }
  
      addSimpleTextInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("input", { className: "input inputField", placeholder: args.placeholder }, this.element);

        on(this.input, "input", function (evt) {
          this.clickHandler(evt.target.value)
        }.bind(this));

        this.setValue = function (value) {
          this.input.value = value
        }
      }

      addDateTimeInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("input", {id: "dateTime", type:"date", className: "input dateTimeInput" }, this.element);
        
        on(this.input, "input", function (evt) {
          this.clickHandler(evt.target.value)
        }.bind(this));

        this.setValue = function (value) {
          this.input.value = new Date(value).toISOString().split("T")[0]
        }
      }

      addDropdownInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);        
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("select", {className:"input inputField"}, this.element);

        domCtr.create("option", {value:"",  disabled:true, selected:true, innerHTML: args.placeholder}, this.input);
        for (const i in args.options) {
            domCtr.create("option", {value:args.options[i].key, innerHTML: args.options[i].label}, this.input);
        }

        on(this.input, "change", function (evt) {
          this.clickHandler(evt.target.value)
        }.bind(this));
        
        this.setValue = function (value) {
          this.input.value = value
        }
      }

      addRadioButtonInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element", style: "align-items: start;"}, this.container);        
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("div", {className: "input inputRows"}, this.element);        
        for (const i in args.options) {
          let radioButtonContainer = domCtr.create("div", {className: "radioButtonContainer"}, this.input); 
          domCtr.create("input", {type: "radio", name: this.key, id: args.options[i].key, className: "radioButton"}, radioButtonContainer);  
          domCtr.create("label", {for: args.options[i].key, innerHTML: args.options[i].label }, radioButtonContainer);  
        }
        on(this.input, "change", function (evt) {
          this.clickHandler(evt.target.id)
        }.bind(this));
        
        this.setValue = function (value) {
          document.getElementById(value).checked = true;
        }
      }

      addSliderInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);        
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.sliderContainer = domCtr.create("div", {className: "input"}, this.element);        
        this.sliderContainer2 = domCtr.create("div", {style: "width: 80%"}, this.sliderContainer);
        this.input = domCtr.create("input", {type:"range", className: "slider", min: args.min, max: args.max, value: (args.max - args.min)/2, step: args.step}, this.sliderContainer2);
        this.ticksContainer = domCtr.create("div", {className: "ticksContainer"}, this.sliderContainer2);        
        for (let i = args.min; i <= args.max; i += args.step) {
          domCtr.create("div", {className: "ticks"}, this.ticksContainer);
        }
        this.labelContainer = domCtr.create("div", {className: "ticksContainer", style: "padding: 0 5px;"}, this.sliderContainer2);  
        domCtr.create("div", {className: "labels", innerHTML: args.min}, this.labelContainer);
        domCtr.create("div", {className: "labels", innerHTML: args.max}, this.labelContainer);     

        this.bubble = domCtr.create("div", {className: "bubble"}, this.sliderContainer);   
        this.input.addEventListener("input", () => {
          this.bubble.innerHTML = this.input.value;
        });
        this.bubble.innerHTML = this.input.value;

        on(this.input, "input", function (evt) {
          this.clickHandler(this.input.value)
        }.bind(this));

        this.setValue = function (value) {
          this.input.value = value
          this.bubble.innerHTML = value;
        }
      }


      addMap(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element elementMap"}, this.container); 
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text, style: "width: 100%;"}, this.element);
        this.mapContainer = domCtr.create("div", {className: "mapContainer"}, this.element); 
        this.input = domCtr.create("div", {id: this.name + "_map", className:"map"}, this.mapContainer);
        this.editor = domCtr.create("div", {id: this.name + "_editor", className:"editor"}, this.mapContainer);

        this.map = this.arcgis.addMap(this.input.id, this.editor.id);   

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
        
  
      clickHandler(value) {
        this.valueSet = true;
        this.value = value;
        this.checkValueSet();
        this.app.save.className = "btn1"
      }

      checkValueSet() {
        if (this.valueSet) {
          this.label.style.color = "black";
        }
        else {
          this.label.style.color = "red";
        }
      }

    }
      
  });
  