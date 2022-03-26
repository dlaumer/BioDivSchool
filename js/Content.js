/*
--------------
Content.js
--------------
Used to populate the webpage with the specific input elements. Trying to seperate the logic to make the site and the actual "data" for the app

*/

// ssh-add ~/.ssh/ssh_rsa_dlaumer
define([
  "dojo/dom",

  "dojo/dom-construct",
  "dojo/_base/window",
  "dojo/on",

  "biodivschool/Page",
  "biodivschool/Element",
], function (dom, domCtr, win, on, Page, Element) {
  return class Content {
    constructor(app) {
      this.app = app;
    }


    init() {
        this.makeContent();
    }

    // Start the start screen
    makeContent() {
      /*
            ==========
            Elements
            ==========

            simpleTextInput
            ---------------
            - text
            - placeholder
            - textInfo (optional)
                - linkText
                - text


            dateTimeInput
            --------------
            - text
            - textInfo (optional)
                - linkText
                - text

            dropdownInput
            --------------
            - text
            - placeholder
            - points (optional)
            - options
                - key (points as string!)
                - label
            - textInfo (optional)
                - linkText
                - text
            

            radioButtonInput
            ------------------
            - text
            - points (optional)
            - options
                - key (points as string!)
                - label
            - textInfo (optional)
                - linkText
                - text


            sliderInput
            -----------
            - text
            - min
            - max
            - step
            - textInfo (optional)
                - linkText
                - text

            mapInput
            --------
            - text
            - textInfo (optional)
                - linkText
                - text

            */

      // Christian: Weitere Elemente hinzufuegen
      let page_projekt = this.app.addPage("Projekt");
      page_projekt.addElement("simpleTextInput", "name", {
        text: "Name des Standorts: ",
        placeholder: "Standort",
      });
      page_projekt.addElement("simpleTextInput", "school", {
        text: "Name der Organisation oder Schule: ",
        placeholder: "Schule",
      });
      page_projekt.addElement("dateTimeInput", "CreationDate", {
        text: "Datum",
      });

      let page_regionalitaet = this.app.addPage("Regionalität der Pflanzen");
     
      page_regionalitaet.addElement("mapInput", "a8_wild_geomoid", {
        text: `Auf welcher Fläche wachsen weitgehend nur heimische Wildpflanzen?
            Markiere solche Flächen in der gezeigten Untersuchungsfläche.
            Benutze dazu das Polygon-Werkzeug.`,
        area: "a8_wild_geomarea",
        ratio: {
          key: "a8_wild_geomarearatio",
          stops: {"0": 0.25,"2": 0.5,"4": 0.75,"6": 1}
        },
        points: "a8_wild_points"

      });
      page_regionalitaet.addElement("dropdownInput", "a9_arten", {
        text: "Wie viele verschiedene Arten von Wildpflanzen wachsen auf der gesamten Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "a9_arten_points",
        options: [
          { key: "0", label: "weniger als 10 verschiedene Arten" },
          { key: "1", label: "11 – 20 Arten" },
          { key: "2", label: "21 – 35 Arten" },
          { key: "4", label: "36 – 50 Arten" },
          { key: "4", label: "mehr als 50 verschiedene Arten" },
        ],
        textInfo: {
            linkText: "Hinweise zur Bestimmung von Pflanzen",
            text: `Benutze zur Bestimmung von Pflanzen ein Bestimmungsbuch mit farbigen Bildern.
                Oder fotografiere die Pflanze. Bestimme dann deine Pflanze mit <a target = "_blank", href = "https://identify.plantnet.org/de">identify.plantnet.org</a>
                oder verwende eine der folgenden beiden Apps:<br>
                <a target = "_blank" href = "https://floraincognita.com">Flora Incognita</a><br>
                <a target="_blank", href="https://plantnet.org/">PlantNet</a>`,
        }
      });

      page_regionalitaet.addElement("dropdownInput", "a10_neophyten", {
        text: "Gibt es im Untersuchungsgebiet schädliche gebietsfremde Pflanzen?",
        placeholder: "Auswählen",
        points: "a10_neophyten_points",
        options: [
          { key: "2", label: "keine" },
          {
            key: "0",
            label:
              "eine oder mehrere Arten von schädlichen gebietsfremden Pflanzen",
          },
          {
            key: "-2",
            label: "mehr als eine Art von schädlichen gebietsfremden Pflanzen",
          },
        ],
      });
      page_regionalitaet.addElement("dropdownInput", "a10a_neophytenmenge", {
        text: "Wie gross ist die Fläche, die insgesamt durch alle schädlichen gebietsfremden Pflanzen bedeckt wird?",
        placeholder: "Auswählen",
        points: "s10a_neophytenmenge_points",
        options: [
          { key: "-1", label: "kleiner als ein Parkplatz für ein Auto " },
          { key: "-2", label: "grösser als ein Parkplatz für ein Auto " },
        ],
      });
      page_regionalitaet.addElement("mapInput", "a10b_neophyten__geomoid", {
        text: `Markiere alle Standorte mit schädlichen gebietsfremden Pflanzen.`,
        
      });

      let page4 = this.app.addFinalPage("Ende");
    }

    makeContent2() {
      let page0 = this.app.addPage("Allgemeine Infos");
      page0.addElement("simpleTextInput", "standort", {
        text: "Was ist der Name des Standorts?",
        placeholder: "Standort",
      });
      page0.addElement("simpleTextInput", "organisation", {
        text: "Was ist der Name der Organisation oder Schule?",
        placeholder: "Organisation/Schule",
      });
      page0.addElement("dateTimeInput", "datum", { text: "Datum und Uhrzeit" });
      page0.addElement("dropdownInput", "dropdownTest", {
        text: "Dropdown",
        placeholder: "Test",
        points: "dropdownTestPoints",
        options: [
          { key: "1", label: "Test 1" },
          { key: "2", label: "Test 2" },
        ],
        textInfo: {
            linkText: "Click here to know more",
            text: "Now you know more!",
          }
      });
      page0.addElement("radioButtonInput", "radioButtonTest", {
        text: "Radio Buttons",
        points: "radioButtonTestPoints",
        options: [
          { key: "1", label: "Test 1" },
          { key: "2", label: "Test 2" },
          { key: "3", label: "Test 3" },
          { key: "4", label: "Test 4" },
        ],
      });

      let page1 = this.app.addPage("Slider Test");

      page1.addElement("sliderInput", "slider1", {
        text: "How much of this?",
        min: 0,
        max: 1,
        step: 0.1,
      });
      page1.addElement("sliderInput", "slider2", {
        text: "How much of that?",
        min: 0,
        max: 10,
        step: 0.5,
      });
      page1.addElement("sliderInput", "slider3", {
        text: "How much of those?",
        min: 0,
        max: 100,
        step: 2,
      });

      let page2 = this.app.addPage("Page 2");
      page2.addElement("mapInput", "gebiete", { text: "Zeichne die Gebiete" });

      let page3 = this.app.addPage("Page 3");
      let page4 = this.app.addFinalPage("Ende");
    }
  };
});
