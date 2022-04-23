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

      this.groups = [
        { key: "a", label: "Gruppe a" },
        { key: "b", label: "Gruppe b" },
        { key: "c", label: "Gruppe c" },
        { key: "d", label: "Gruppe d" },
        { key: "e", label: "Gruppe e" },
        { key: "f", label: "Gruppe f" },

      ]
    }


    init() {
      if (that.mode == "project") {
        this.makeContentProject()
      }
      else {
        this.makeContent();
      }

      
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



      // Christian: Weitere Elemente hinzufuegen

      /*Regionalität der Pflanzen*/
      let page_regionalitaet = this.app.addPage("Regionalität der Pflanzen");

      //Heimische Wildpflanzen  muss noch als Titel rein     
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

      //Schädliche gebietsfremde Pflanzen = invasive Neophyten   muss noch als Titel rein
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
      
      //Versiegelte Flächen  muss noch als Titel rein
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

      //Rasenflächen   muss noch als Titel rein
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

      //Vielfalt der Flächen   muss noch als Titel rein
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

      //Baumschicht  muss noch als Titel rein
      //14_baeume
      page_strukturelemente.addElement("dropdownInput", "baeume", {
        text: "Gibt es auf der Untersuchungsfläche Bäume?",
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

   

      //Sträucher ohne Hecken  muss noch als Titel rein
      //15_straeucher
      page_strukturelemente.addElement("dropdownInput", "straeucher", {
        text: "Gibt es auf der Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
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

      //Hecken  muss noch als Titel rein
      //16_hecken
      page_strukturelemente.addElement("dropdownInput", "hecken", {
        text: "Gibt es auf der Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
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

      //Vielfalt an einem Ort muss noch als Titel rein
      //17_vielfalt
      page_strukturelemente.addElement("dropdownInput", "vielfalt", {
        text: "Sind Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser zusammen an einem Ort anzutreffen?",
        placeholder: "Auswählen",
        points: "vielfalt_points",
        options: [
          { key: "0", label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser sind nirgends zusammen anzutreffen." },
          { key: "1", label: "Zwei der drei Elemente (1. Bäume, 2. Sträucher und 3. heimische Kräuter, Blumen oder Gräser) kommen zusam-men vor. Alle drei Elemente kommen jedoch nirgends alle zusammen vor." },
          { key: "2", label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser kommen alle zusammen an einer Stelle vor." },
          { key: "4", label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser kommen alle zusammen an mehr als einer Stelle vor." },
        ],
      });

      //Ruderalflächen muss noch als Titel rein
      //18_ruderal
      page_strukturelemente.addElement("dropdownInput", "ruderal", {
        text: "Gibt es auf der Untersuchungsfläche Ruderalflächen mit passenden heimischen Pflanzen?",
        placeholder: "Auswählen",
        points: "ruderal_points",
        options: [
          { key: "0", label: "Keine Ruderalfläche vorhanden." },
          { key: "0", label: "Ruderalfläche vorhanden. Darin kommen aber schädliche gebietsfremden Pflanzen vor.." },
          { key: "1", label: "Ruderalfläche ist insgesamt etwa so gross wie zwei Autoparkplätze." },
          { key: "2", label: "Ruderalfläche ist insgesamt etwa so gross wie vier Autoparkplätze." },
          { key: "3", label: "Ruderalfläche ist insgesamt grösser als vier Autoparkplätze." },
        ],
      });

      //Trockenmauern, Steinhaufen muss noch als Titel rein
      //19_mauern
      page_strukturelemente.addElement("dropdownInput", "mauern", {
        text: "Gibt es auf der Untersuchungsfläche Trockenmauern oder Steinhaufen?",
        placeholder: "Auswählen",
        points: "mauern_points",
        options: [
          { key: "0", label: "Keine Trockenmauern oder Steinhaufen vorhanden." },
          { key: "1", label: "1 Trockenmauer oder Steinhaufen vorhanden." },
          { key: "2", label: "2 Trockenmauern oder Steinhaufen vorhanden." },
          { key: "4", label: "Mehr als 2 Trockenmauern oder Steinhaufen vorhanden." },
        ],
      });

      //Asthaufen, Totholz muss noch als Titel rein
      //20_totholz
      page_strukturelemente.addElement("dropdownInput", "totholz", {
        text: "Gibt es auf der Untersuchungsfläche Asthaufen, abgestorbene Bäume oder Totholz?",
        placeholder: "Auswählen",
        points: "totholz_points",
        options: [
          { key: "0", label: "Keine Asthaufen, abgestorbene Bäume oder Totholz vorhanden." },
          { key: "1", label: "1 Asthaufen, abgestorbener Baum oder Totholzelement vorhanden." },
          { key: "2", label: "2 Asthaufen, abgestorbene Bäume oder Totholzelemente vorhanden." },
          { key: "4", label: "Mehr als 2 Asthaufen, abgestorbene Bäume oder Totholzelemente vorhanden." },
        ],
      });

      //Künstliche Nisthilfen muss noch als Titel rein
      //21_insekten
      page_strukturelemente.addElement("dropdownInput", "insekten", {
        text: "Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für Insekten?",
        placeholder: "Auswählen",
        points: "insekten_points",
        options: [
          { key: "0", label: "Keine künstliche Nisthilfen für Insekten vorhanden." },
          { key: "1", label: "1-3 künstliche Nisthilfen für Insekten vorhanden." },
          { key: "2", label: "Mehr als 3 künstliche Nisthilfen für Insekten vorhanden." },
        ],
      });

      //22_voegel
      page_strukturelemente.addElement("dropdownInput", "voegel", {
        text: "Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für Vögel?",
        placeholder: "Auswählen",
        points: "voegel_points",
        options: [
          { key: "0", label: "Keine künstliche Nisthilfen für Vögel vorhanden." },
          { key: "1", label: "1-3 künstliche Nisthilfen für Vögel vorhanden." },
          { key: "2", label: "Mehr als 3 künstliche Nisthilfen für Vögel vorhanden." },
        ],
      });

      //23_saeuger
      page_strukturelemente.addElement("dropdownInput", "saeuger", {
        text: "Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für kleine Säugetiere?",
        placeholder: "Auswählen",
        points: "saeuger_points",
        options: [
          { key: "0", label: "Keine künstliche Nisthilfen für kleine Säugetiere vorhanden." },
          { key: "1", label: "1-3 künstliche Nisthilfen für kleine Säugetiere vorhanden." },
          { key: "2", label: "Mehr als 3 künstliche Nisthilfen für kleine Säugetiere vorhanden." },
        ],
      });

      //Gewässer und Feuchtflächen muss noch als Titel rein
      //24_feuchtfl
      page_strukturelemente.addElement("dropdownInput", "feuchtfl", {
        text: "Gibt es Feuchtflächen auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "feuchtfl_points",
        options: [
          { key: "0", label: "Keine Feuchtflächen vorhanden." },
          { key: "2", label: "Feuchtflächen insgesamt etwa so gross wie ein Autoparkplatz." },
          { key: "4", label: "Feuchtflächen insgesamt grösser als ein Autoparkplatz." },
        ],
      });

      //25_stehgew
      page_strukturelemente.addElement("dropdownInput", "stehgew", {
        text: "Gibt es stehende Gewässer auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "stehgew_points",
        options: [
          { key: "0", label: "Keine stehenden Gewässer vorhanden." },
          { key: "1", label: "Fläche mit stehenden Gewässern  insgesamt etwa so gross wie 1 Autoparkplatz." },
          { key: "2", label: "Fläche mit stehenden Gewässern  insgesamt etwa so gross wie 2 Autoparkplätze." },
          { key: "4", label: "Fläche mit stehenden Gewässern  insgesamt grösser als 2 Autoparkplätze." },
        ],
      });

      //26_fliessgew
      page_strukturelemente.addElement("dropdownInput", "fliessgew", {
        text: "Gibt es Fliessgewässer auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "fliessgew_points",
        options: [
          { key: "0", label: "Keine Fliessgewässer oder nur Fliessgewässer kürzer als 3 Meter vorhanden." },
          { key: "6", label: "Ein oder mehrere Fliessgewässer von insgesamt mehr als 3 Meter Länge vorhanden." },
        ],
      });

      //Umgebung muss noch als Titel rein
      //27_umgebung
      page_strukturelemente.addElement("dropdownInput", "umgebung", {
        text: "Ist die Untersuchungsfläche umgeben von intensiver Landwirtschaft oder überbautem Gebiet?",
        placeholder: "Auswählen",
        points: "umgebung_points",
        options: [
          { key: "0", label: "Die Untersuchungsfläche ist zu ungefähr drei Viertel oder mehr umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
          { key: "1", label: "Die Untersuchungsfläche ist zu einem Viertel bis zu drei Viertel umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
          { key: "4", label: "Die Untersuchungsfläche ist zu weniger als einem Viertel umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
        ],
      });

      /*Pflege*/
      let page_pflege = this.app.addPage("Pflege");

      //Mähen von Rasen und Wiesen OHNE Sportrasen muss noch als Titel rein
      //28_geraet
      page_pflege.addElement("dropdownInput", "geraet", {
        text: "Markiere, mit welchen Geräten der grössere Teil der Grasfläche (ohne Sportrasen) geschnitten wird.?",
        placeholder: "Auswählen",
        points: "geraet_points",
        options: [
          { key: "0", label: "Rasentraktor, Ride-on Mäher, Rasenmäher, Fadenmäher oder Motorsense." },
          { key: "3", label: "Sense oder Balkenmäher." },
        ],
      });

      //29_maehen // Achtung Mehrfachauswahl!
      page_pflege.addElement("dropdownInput", "maehen", {
        text: "Markiere alle Aussagen, die auf Mähen von Gras zutreffen:",
        placeholder: "Auswählen",
        points: "maehen_points",
        options: [
          { key: "-2", label: "Das Gras wird zwischen April und Oktober im Durchschnitt zweimal oder öfter pro Monat geschnitten." },
          { key: "1", label: "Das Gras wird zwischen April und Oktober im Durchschnitt höchstens einmal pro Monat geschnitten." },
          { key: "1", label: "Es wird jeweils nicht die ganze Grasfläche zum gleichen Zeitpunkt geschnitten. Verschiedene Grasflächen werden zu unterschiedlichen Zeitpunkten geschnitten." },
          { key: "1", label: "Ein Teil der Grasfläche wird jedes Jahr gar nicht geschnitten. Das kann jedes Jahr ein anderer Teil sein." },
        ],
      });

      //"[Falls bei Frage 29 eine oder beide der Optionen “Gras wird zwischen April und Oktober … ge-schnitten» angekreuzt wurde, dann direkt weiter mit Frage 30.
      //Und sollte das Folgende unverhältnismässig aufwendig sein, dann einfach bei Frage 29 eine wei-tere Auswahl anhängen: Es gibt Grasflächen (grösser als zwei Autoparkplätze), die erst nach dem 15. Juni geschnitten werden [1 P.]
      //Sonst bitte Fragen 29a und 29b anzeigen.]"

      //29a_zone
      page_pflege.addElement("dropdownInput", "a_zone", {
        text: "Bestimme, in welcher landwirtschaftlichen Zone sich die Untersuchungsfläche befindet.",
        placeholder: "Auswählen",
        points: "umgebung_points",
        options: [
          { key: "0", label: "Talzone oder Hügelzone." },
          { key: "0", label: "Bergzonen I oder II." },
          { key: "0", label: "Bergzonen III oder IV." },
        ],
        textInfo: {
          linkText: "Karte zur Bestimmung der landwirtschaftlichen Zone",
          text: `Link oder iFrame?<br>
          <iframe src='https://map.geo.admin.ch/embed.html?topic=blw&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=887,947&layers=ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo.swissboundaries3d-kanton-flaeche.fill,ch.blw.landwirtschaftliche-zonengrenzen&layers_opacity=0.15,1,1,0.75&layers_visibility=false,false,false,true&E=2759000.00&N=1222000.00&zoom=1' width='100%' height='250' frameborder='0' style='border:0' allow='geolocation'></iframe>
           <br>tbd`,
      }
      });

      //29b_schnitt
      page_pflege.addElement("dropdownInput", "b_schnitt", {
        text: "Trifft die folgende Aussage zu?",
        placeholder: "Auswählen",
        points: "b_schnitt_points",
        options: [
          { key: "2", label: "Es gibt Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 15. Juni geschnitten werden." },
          { key: "2", label: "Es gibt Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 1. Juli geschnitten werden." },
          { key: "2", label: "Es gibt Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 15. Juli geschnitten werden." },
        ],
        textInfo: {
          linkText: "Karte zur Bestimmung der landwirtschaftlichen Zone",
          text: `Link oder iFrame?<br>
          <iframe src='https://map.geo.admin.ch/embed.html?topic=blw&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=887,947&layers=ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo.swissboundaries3d-kanton-flaeche.fill,ch.blw.landwirtschaftliche-zonengrenzen&layers_opacity=0.15,1,1,0.75&layers_visibility=false,false,false,true&E=2759000.00&N=1222000.00&zoom=1' width='100%' height='250' frameborder='0' style='border:0' allow='geolocation'></iframe>
           <br>tbd`,
      }
      });

      //Schädlingsregulierung muss noch als Titel rein
      //30_pestizide
      page_pflege.addElement("sliderInput", "pestizide", {
        text: "Auf welcher Fläche werden chemische Pestizide  zur Schädlingsbekämpfung eingesetzt?<br>Stelle mit dem Regler ein, wie gross der Anteil dieser Fläche an der gesamten unbebauten Untersuchungsfläche ist:",
        min: 0,
        max: 100,
        step: 0.1,
      });
      //Chemische Pestizide werden kaum eingesetzt. <5%	2
      //5.1-66%	1
      //Chemische Pestizide werden auf der gesamten unbebauten Fläche eingesetzt. >66%	0
      //points: "pestizide_points",

      //31_bekaempfung
      page_pflege.addElement("sliderInput", "bekaempfung", {
        text: "Auf welcher Fläche werden ökologische Mittel zur Schädlingsbekämpfung eingesetzt?<br>Wenn solche ökologischen Mittel zu wenig wirken, dann werden auch chemische Pestizide eingesetzt, die aber Nützlinge schonen.<br>Stelle mit dem Regler ein, wie gross der Anteil dieser Fläche an der gesamten unbebauten Untersuchungsfläche ist:",
        min: 0,
        max: 100,
        step: 0.1,
      });
      //kaum ökologische Schädlingsbekämpfung <5%	3
      //5.1-50%	2
      //50.1-75%	1
      //ökologische Schädlingsbekämpfung auf der gesamten unbebauten Fläche >75%	0
      //points: "bekaempfung_points",

      //Unkrautregulierungg muss noch als Titel rein
      //32_unkraut
      page_pflege.addElement("dropdownInput", "unkraut", {
        text: "Wie werden Unkräuter oder unerwünschte Pflanzen zur Hauptsache bekämpft?",
        placeholder: "Auswählen",
        points: "unkraut_points",
        options: [
          { key: "0", label: "Chemische Mittel, so genannte Herbizide." },
          { key: "1", label: "Abflammen oder mit Hitze erzeugenden Geräten." },
          { key: "2", label: "Heisses Wasser, Dampf und / oder biologische Mittel und / oder mit Fadenmäher." },
          { key: "4", label: "Handarbeit." },
        ],
      });

      //Düngen muss noch als Titel rein
      //33_duengen
      page_pflege.addElement("dropdownInput", "duengen", {
        text: "Wie werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) gedüngt?",
        placeholder: "Auswählen",
        points: "duengen_points",
        options: [
          { key: "0", label: "Die gesamten Flächen mit Rasen oder Wiesen ist kleiner als die Fläche für zwei Autoparkplätze." },
          { key: "0", label: "Grasflächen werden ohne Analyse des Bodens gedüngt." },
          { key: "1", label: "Alle Grasflächen (Rasen und Wiesen) werden erst gedüngt, wenn eine Analyse des Bodens Bedarf anzeigt." },
          { key: "2", label: "Rasen werden erst gedüngt, wenn eine Analyse des Bodens Bedarf anzeigt. Wiesen, deren Gras höher als 10 cm wächst, werden nicht gedüngt." },
          { key: "4", label: "Es wird nicht gedüngt, weder Rasen noch Wiesen." },
        ],
      });

      //Düngemittel muss noch als Titel rein
      //34_mitteln
      page_pflege.addElement("dropdownInput", "mitteln", {
        text: "Mit welchen Mitteln werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) zur Hauptsache gedüngt?",
        placeholder: "Auswählen",
        points: "mitteln_points",
        options: [
          { key: "0", label: "Die gesamten Flächen mit Rasen oder Wiesen ist kleiner als die Fläche für zwei Autopark-plätze." },
          { key: "0", label: "Mineralischer Dünger, Torf." },
          { key: "1", label: "Organischer Dünger wie Jauche, Mist oder Mulch, Bio-Knospenprodukte." },
          { key: "2", label: "Eigener Kompost." },
          { key: "0", label: "Kein Dünger." },
        ],
      });

      //Laub muss noch als Titel rein
      //35_laub
      page_pflege.addElement("dropdownInput", "laub", {
        text: "Was passiert im Herbst mit dem Laub?",
        placeholder: "Auswählen",
        points: "laub_points",
        options: [
          { key: "0", label: "Sämtliches Laub wird eingesammelt und entsorgt." },
          { key: "1", label: "Vereinzelt wird Laub bewusst belassen." },
          { key: "2", label: "Es werden bewusst zahlreiche Laubhaufen erstellt." },
        ],
      });

      //alte Samenstände muss noch als Titel rein
      //36_samen
      page_pflege.addElement("dropdownInput", "samen", {
        text: "Was passiert im Herbst mit alten Samenständen von Gras, Blumen und Sträucher?",
        placeholder: "Auswählen",
        points: "samen_points",
        options: [
          { key: "0", label: "Alle alten Samenstände werden eingesammelt und entsorgt." },
          { key: "1", label: "Vereinzelt werden alte Samenstände bewusst belassen." },
          { key: "2", label: "Die meisten Samenstände werden bewusst belassen." },
        ],
      });

      /*Bauliche Massnahmen*/
       let page_baumassnahmen = this.app.addPage("Bauliche Massnahmen");

      //Begrüniung von Dach oder Fassaden muss noch als Titel rein
      //37_fldacher
      page_baumassnahmen.addElement("dropdownInput", "fldacher", {
        text: "Gibt es auf Flachdächern eine Begrünung?",
        placeholder: "Auswählen",
        points: "fldacher_points",
        options: [
          { key: "0", label: "Keine oder kaum Dachbegrünung." },
          { key: "1", label: "Ungefähr die Hälfte der Flachdächer ist begrünt und enthält auch Sandflächen und Totholz." },
          { key: "2", label: "Mehr als die Hälfte der Flachdächer ist begrünt und enthält auch Sandflächen und Totholz." },
        ],
      });

      //38_fassaden
      page_baumassnahmen.addElement("dropdownInput", "fassaden", {
        text: "Gibt es Fassaden mit einer Begrünung?",
        placeholder: "Auswählen",
        points: "fassaden_points",
        options: [
          { key: "0", label: "Keine oder nur vereinzelt Fassadenbegrünung." },
          { key: "1", label: "Fassaden von einer Fläche von insgesamt mindestens zwei Autoparkplätzen ist begrünt." },
        ],
      });

     
      //Kräuter- oder Gemüsegarten muss noch als Titel rein
      //39_kraeuter
      page_baumassnahmen.addElement("dropdownInput", "kraeuter", {
        text: "Gibt es auf der Untersuchungsfläche einen biologisch bearbeiteten Kräuter- oder Gemüsegarten?",
        placeholder: "Auswählen",
        points: "kraeuter_points",
        options: [
          { key: "0", label: "Nein" },
          { key: "1", label: "Ja" },
        ],
      });

      
      //Fallen für Tiere muss noch als Titel rein
      //40a_glas
      page_baumassnahmen.addElement("dropdownInput", "a_glas", {
        text: "Gibt es an den Gebäuden grosse Glasflächen?",
        placeholder: "Auswählen",
        points: "a_glas_points",
        options: [
          { key: "2", label: "Nein" },
          { key: "0", label: "Ja" },
        ],
      });

      //40b_glasschutz
      page_baumassnahmen.addElement("dropdownInput", "b_glasschutz", {
        text: "Wie werden die Vögel vor diesen Glasscheiben geschützt?",
        placeholder: "Auswählen",
        points: "b_glasschutz_points",
        options: [
          { key: "0", label: "Glasflächen ohne Vogelschutz." },
          { key: "0", label: "Glasflächen mit aufgeklebten Umrissen von Vögeln." },
          { key: "2", label: "Glasflächen mit aufgeklebten Vogelschutzstreifen. (Birdstripes)" },
        ],
      });

      //41a_licht
      page_baumassnahmen.addElement("dropdownInput", "a_licht", {
        text: "Gibt es auf dem Untersuchungsgebiet Lichtquellen, die jeden Tag bis spät in die Nacht leuchten?",
        placeholder: "Auswählen",
        points: "a_licht_points",
        options: [
          { key: "2", label: "Nein" },
          { key: "0", label: "Ja" },
        ],
      });

      //41b_lichtart
      page_baumassnahmen.addElement("dropdownInput", "b_lichtart", {
        text: "Wie leuchten diesen Lichtquellen?",
        placeholder: "Auswählen",
        points: "b_lichtart_points",
        options: [
          { key: "0", label: "Einige Lichtquellen strahlen auch nach oben ab, beispielsweise zur Beleuchtung des Gebäudes." },
          { key: "1", label: "Gelbliche Lichtquellen, die fast nur nach unten strahlen, beispielsweise Wegbeleuchtung." },
        ],
      });

      //42_schaechte
      page_baumassnahmen.addElement("dropdownInput", "schaechte", {
        text: "Gibt es auf dem Untersuchungsgebiet Wasserschächte oder Lichtschächte, in denen Tiere gefangen bleiben?",
        placeholder: "Auswählen",
        points: "schaechte_points",
        options: [
          { key: "2", label: "Nein oder nur sehr wenige." },
          { key: "0", label: "Ja" },
        ],
      });      

      this.app.addFinalPage("Ende");     
    }


    makeContentProject() {
      let page0 = this.app.addPage("Projekt Infos");

      page0.addElement("mapInput", "gebiete", { text: "Zeichne das Projektgebiet ein" });

      this.app.addFinalPage("Ende");

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
