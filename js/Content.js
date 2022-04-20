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
    - area (optional)
    - ratio (optional)
      - key
      - stops
    - points (optional)

    */

      this.groups = [
        { key: "a", label: "Gruppe a" },
        { key: "b", label: "Gruppe b" },
        { key: "c", label: "Gruppe c" },
        { key: "d", label: "Gruppe d" },
        { key: "e", label: "Gruppe e" },
        { key: "f", label: "Gruppe f" },

      ]

      // Christian: Weitere Elemente hinzufuegen

      /*Regionalität der Pflanzen*/
      let page_regionalitaet = this.app.addPage("Regionalität der Pflanzen");
     
      //08_wild_geomoid
      page_regionalitaet.addElement("mapInput", "wild_geomoid", {
        text: `Auf welcher Fläche wachsen weitgehend nur heimische Wildpflanzen?
            Markiere solche Flächen in der gezeigten Untersuchungsfläche.
            Benutze dazu das Polygon-Werkzeug.`,
        area: "wild_geomarea",
        ratio: {
          key: "wild_geomarearatio",
          stops: {"0": 0.25,"2": 0.5,"4": 0.75,"6": 1}
        },
        points: "wild_points"

      });
      //09_arten
      page_regionalitaet.addElement("dropdownInput", "arten", {
        text: "Wie viele verschiedene Arten von Wildpflanzen wachsen auf der gesamten Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "arten_points",
        options: [
          { key: "0", label: "weniger als 10 verschiedene Arten" },
          { key: "1", label: "11 - 20 Arten" },
          { key: "2", label: "21 - 35 Arten" },
          { key: "4", label: "36 - 50 Arten" },
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

      //10_neophyten
      page_regionalitaet.addElement("dropdownInput", "neophyten", {
        text: "Gibt es im Untersuchungsgebiet schädliche gebietsfremde Pflanzen?",
        placeholder: "Auswählen",
        points: "neophyten_points",
        options: [
          { key: "2", label: "keine" },
          {
            key: "0", label: "eine oder mehrere Arten von schädlichen gebietsfremden Pflanzen",
          },
          {
            key: "-2", label: "mehr als eine Art von schädlichen gebietsfremden Pflanzen",
          },
        ],
      });

      //10a_neophytenmenge
      page_regionalitaet.addElement("dropdownInput", "neophytenmenge", {
        text: "Wie gross ist die Fläche, die insgesamt durch alle schädlichen gebietsfremden Pflanzen bedeckt wird?",
        placeholder: "Auswählen",
        points: "neophytenmenge_points",
        options: [
          { key: "-1", label: "kleiner als ein Parkplatz für ein Auto " },
          { key: "-2", label: "grösser als ein Parkplatz für ein Auto " },
        ],
      });

      //10b_neophyten__geomoid - Liste und Points tbd
      page_regionalitaet.addElement("mapInput", "neophyten__geomoid", {
        text: `Markiere alle Standorte mit schädlichen gebietsfremden Pflanzen.`,
         placeholder: "Auswählen",
         //points: "",
         options: [
          { key: "0", label: "A" },
          { key: "0", label: "B"},
          { key: "-2", label: "C"},
        ],
      });
      
      /*Strukturelemente*/
      
      let page_strukturelemente = this.app.addPage("Strukturelemente");
      
      //11_versieg_geomoid
      page_strukturelemente.addElement("mapInput", "versieg_geomoid", {
        text: `Markiere versiegelte Flächen in der gezeigten Untersuchungsfläche.`,
        area: "versieg_area",
        ratio: {
          key: "versieg_arearatio",
          stops: {"4": 0.33,"2": 0.5,"1": 0.66,"6": 1}
        },
        points: "versieg_points"

      }); 


      //12_rasen_geomoid
      page_strukturelemente.addElement("mapInput", "rasen_geomoid", {
        text: `Markiere Flächen mit Rasen in der gezeigten Untersuchungsfläche.`,
        area: "rasen_area",
        ratio: {
          key: "rasen_area_ratio",
          stops: {"2": 0.25,"1": 0.5,"0": 1}
        },
        points: "rasen_points"

      }); 

      //13a_wild_geomoid
      page_strukturelemente.addElement("mapInput", "wild_geomoid", {
        text: `Markiere Flächen mit Gemüsebeeten und/oder Beeten mit Wildblumen in der gezeigten Untersuchungsfläche.`,
        area: "wild_area",
      }); 
      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "wild_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "wild_points",
        options: [
          { key: "0", label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "4", label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "7", label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "8", label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });



      //13b_trocken_geomoid
      page_strukturelemente.addElement("mapInput", "trocken_geomoid", {
        text: `Markiere Flächen mit Trockenstandorten wie Kies, Sand, Ruderalflächen in der gezeigten Untersuchungsfläche.`,
        area: "trocken_area",
      }); 
      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "trocken_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "trocken_points",
        options: [
          { key: "0", label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "4", label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "7", label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "8", label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });  
  
 

      //13c_gras_geomoid
      page_strukturelemente.addElement("mapInput", "c_gras_geomoid", {
        text: `Markiere in der gezeigten Untersuchungsfläche Flächen mit Wiesen dessen Gras mindestens einmal im Jahr höher als 10 cm ist.`,
        area: "c_gras_area",
      }); 
      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "c_gras_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "c_gras_points",
        options: [
          { key: "0", label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "4", label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "7", label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "8", label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });

      //13d_hecken_geomoid
      page_strukturelemente.addElement("mapInput", "d_hecken_geomoid", {
        text: `Markiere in der gezeigten Untersuchungsfläche Flächen mit Sträuchern und/oder Hecken mit weitgehend heimischen Pflanzen.`,
        area: "d_hecken_area",
      }); 
      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "d_hecken_arearatio", {
        text: "",
        placeholder: "Auswählen",
        points: "d_hecken_points",
        options: [
          { key: "0", label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "4", label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "7", label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "8", label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });

      //13e_baeume_geomoid
      page_strukturelemente.addElement("mapInput", "e_baeume_geomoid", {
        text: `Markiere in der gezeigten Untersuchungsfläche Flächen mit Bäumen, Baumgruppen oder Wald mit weitgehend heimischen Pflanzen.`,
        area: "e_baeume_area",
      }); 
      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "e_baeume_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "e_baeume_points",
        options: [
          { key: "0", label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "4", label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "7", label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "8", label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });
      
      
             
      //13f_wasser_geomoid
      page_strukturelemente.addElement("mapInput", "f_wasser_geomoid", {
        text: `Markiere Wasserflächen in der gezeigten Untersuchungsfläche.`,
        area: "f_wasser_area",
      }); 
      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "f_wasser_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "f_wasser_points",
        options: [
          { key: "0", label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "4", label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "7", label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "8", label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });


      //14_baeume
      page_strukturelemente.addElement("dropdownInput", "baeume", {
        text: "Gibt es auf dem Untersuchungsfläche Bäume?",
        placeholder: "Auswählen",
        points: "baeume_points",
        options: [
          { key: "0", label: "Keine Bäume vorhanden, die höher als 4 - 5 Meter sind." },
          { key: "1", label: "Keine Bäume vorhanden, die höher als 4 - 5 Meter sind." },
          { key: "2", label: "Nur 1 Baum vorhanden oder alle Bäume etwa gleich hoch." },
          { key: "3", label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und mit insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden, aber ohne mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },
          { key: "4", label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und mit insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden und mit mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },
          { key: "2", label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und ohne insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden und ohne mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },
          { key: "3", label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und ohne insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden, aber mit mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },          
        ],
      });


      //15_straeucher
      page_strukturelemente.addElement("dropdownInput", "straeucher", {
        text: "Gibt es auf dem Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
        placeholder: "Auswählen",
        points: "straeucher_points",
        options: [
          { key: "0", label: "Keine Sträucher oder nur vereinzelte Sträucher vorhanden." },
          { key: "0", label: "Überwiegend nicht-heimische Sträucher vorhanden. " },
          { key: "1", label: "1-3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." },
          { key: "3", label: "1-3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch. Insgesamt mehr als 5 verschiedene heimische Straucharten." },
          { key: "3", label: "Mehr als 3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." },
          { key: "5", label: "Mehr als 3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch. Insgesamt mehr als 5 verschiedene heimische Straucharten." },
        ],
      });

      //16_hecken
      page_strukturelemente.addElement("dropdownInput", "hecken", {
        text: "Gibt es auf dem Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
        placeholder: "Auswählen",
        points: "hecken_points",
        options: [
          { key: "0", label: "Keine Hecke vorhanden." },
          { key: "0", label: "Hecken vorhanden. Die Hecken bestehen aber überwiegend aus nicht-heimische Sträuchern." },
          { key: "1", label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch." },
          { key: "1", label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "2", label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "2", label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "3", label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind  insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "3", label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch." },
          { key: "3", label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "4", label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "4", label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "5", label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind  insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
        ],
      });

      //17_vielfalt
            //17_vielfalt_points

      //18_ruderal
            //18_ruderal_points

      //19_mauern
            //19_mauern_points

      //20_totholz
            //20_totholz_points

      //21_insekten
            //21_insekten_points

      //22_voegel
            //22_voegel_points

      //23_saeuger
            //23_saeuger_points

      //24_feuchtfl
            //24_feuchtfl_points

      //25_stehgew
          //25_stehgew_points

      //26_fliessgew
          //26_fliessgew_points

      //27_umgebung
          //27_umgebung_points


      /*Pflege*/
      //28_geraet
          //28_geraet_points

      //29_maehen
          //29_maehen_points

      //29a_zone

      //29b_schnitt
          //29b_schnitt_points

      //30_pestizide
          //30_pestizide_points

      //31_bekaempfung
          //31_bekaempfung_points

      //32_unkraut
          //32_unkraut_points

      //33_duengen
          //33_duengen_points

      //34_mitteln
          //34_mitteln_points

      //35_laub
          //35_laub_points

      //36_samen
          //36_samen_points

      /*Bauliche Massnahmen*/

      //37_fldacher
          //37_fldacher_points

      //38_fassaden
          //38_fassaden_points

      //39_kraeuter
          //39_kraeuter_points

      //40a_glas
          //40a_glas_points

      //40b_glasschutz
          //40b_glasschutz_points

      //41a_licht
          //41a_licht_points

      //41b_lichtart
          //41b_lichtart_points

      //42_schaechte
          //42_schaechte_points


      //test10b_neophyten__geomoid

      

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
