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
      constructor(page, id, container) {
        this.page = page;
        this.id = id;
        this.name = this.page.name + "_element_" + id.toString();
        this.container = container;
        this.arcgis = new ArcGis
  
        this.valueSet = false;

        this.clickHandler();
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
            case "sliderInput":
                this.addSliderInput(args);
                break;
            case "mapInput":
                this.addMap(args);
                break;
        }

      }
  
      addSimpleTextInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("input", { className: "input inputField", placeholder: args.placeholder }, this.element);

      }

      addDateTimeInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("input", {id: "dateTime", type:"datetime-local", className: "input dateTimeInput" }, this.element);

      }

      addDropdownInput(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element"}, this.container);        
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text}, this.element);
        this.input = domCtr.create("select", {className:"input inputField"}, this.element);

        domCtr.create("option", {value:"",  disabled:true, selected:true, innerHTML: args.placeholder}, this.input);
        for (const i in args.options) {
            domCtr.create("option", {value:args.options[i].value, innerHTML: args.options[i].label}, this.input);
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
      }


      addMap(args) {
        this.element = domCtr.create("div", { id: this.name, className: "element", style: "height: 85%;"}, this.container); 
        this.label = domCtr.create("div", { className: "labelText", innerHTML: args.text, style: "height: 10%;"}, this.element);
        this.input = domCtr.create("div", {id: this.name + "_map", className:"map"}, this.element);
        this.map = this.arcgis.addMap(this.input.id);   


      }
        
  
      clickHandler() {
  
      }
    }
      
  });
  