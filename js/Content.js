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

      this.instructions = `
      Hinzufügen: <br>
      1.	Zu Vollbild wechseln  <br>
      2.	Mit Einfach-Klicks Eckpunkte der Fläche einzeichnen.<br>
      3.	Den letzten Punkt mit Doppelklick setzen.<br>
      4.	Zum Abschliessen auf Schaltfläche «Hinzufügen» klicken.<br> <br>

      Bearbeiten <br>
      1.	Fläche einmal anklicken. <br>
      2.	Sobald Fläche aktiviert ist, Fläche noch einmal anklicken. <br>
      3.	Eckpunkte wie gewünscht verschieben. <br>
      4.	Zum Abschliessen die Schaltfläche «Aktualisieren» anklicken. <br>


      `
    }


    init() {
        this.makeContent();
    }


    // Start the login screen
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
    - version


    dateTimeInput
    --------------
    - text
    - textInfo (optional)
        - linkText
        - text
    - version

    radioButtonInput
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
    - version
    

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
    - version


    sliderInput
    -----------
    - text
    - min
    - max
    - step
    - points
    - stops
    - textInfo (optional)
        - linkText
        - text
    - version


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
    - version

    */



      

      this.app.addStartPage("BioDivSchool");
      /*Regionalität der Pflanzen*/
      let page_regionalitaet = this.app.addPage("Regionalität der Pflanzen", {
        pointsInfo: [0,10] });

      page_regionalitaet.addTextInfo({
        title: "Heimische Wildpflanzen (08, 09)",
        textInfo: {
          linkText: "Zusatzinfos",
          text: `Alle Arten einer Region bilden zusammen ein Nahrungsnetz.<br>        
          Heimische Pflanzen sind die Grundlage von Nahrungsnetzen. Deshalb sollte es möglichst viele Flächen mit heimischen Wildpflanzen geben.
          <img src="img/Fotos_Hilfestellungen/H01_1.png" alt="H01_1" width="100%">
          `,
        }, 
        version: ["long"]
      })

      //08_wild_geomoid
      page_regionalitaet.addElement("mapInput", "wild_geomoid", {
        text: `08: Auf welcher Fläche wachsen weitgehend nur heimische Wildpflanzen?
            Markiere solche Flächen in der gezeigten Untersuchungsfläche.
            Benutze dazu das Polygon-Werkzeug.`,
        area: "wild_geomarea",
        ratio: {
          key: "wild_geomarearatio",
          stops: [{points: 0, value: 0.25, measure: "dummyId"},{points:2, value:0.5},{points: 4, value:0.75},{points: 6, value:1}]
        },
        color: [74, 186, 27],
        points: "wild_points",
        textInfo: {
          linkText: "Zusatzinfos",
          text: `<div class="textInfoElements"><img src="img/Fotos_Hilfestellungen/H08_1_heimische_Blumenstraeucher.jpg" alt="H08_1" width="100%">
          Zu heimischen Wildpflanzen gehören Blumen, Sträucher und Bäume, die natürlich hier wachsen.
          </div>
          <div class="textInfoElements">
          Nicht dazu gehören:
          <img src="img/Fotos_Hilfestellungen/H08_2_Sportrasen.jpg" alt="H08_2" width="100%">
          Sportrasen und Wiesen mit Gras, das immer kürzer ist als 10 cm. Solche Flächen werden nicht zu Flächen mit heimischen Wildpflanzen gezählt.
          </div>
          `,
        },
        version: ["long"]
      });  


      //09_arten
      page_regionalitaet.addElement("radioButtonInput", "arten", {
        text: "09: Wie viele verschiedene Arten von Wildpflanzen wachsen auf der gesamten Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "arten_points",
        options: [
          { key: "0", points: 0, label: "weniger als 10 verschiedene Arten", measure: "dummyId" },
          { key: "1", points: 1, label: "11 – 20 Arten" },
          { key: "2", points: 2, label: "21 – 35 Arten" },
          { key: "3", points: 4, label: "36 – 50 Arten" },
          { key: "4", points: 4, label: "mehr als 50 verschiedene Arten" },
        ],
        textInfo: {
            linkText: "Hinweise zur Bestimmung von Pflanzen",
            text: `Benutze zur Bestimmung von Pflanzen ein Bestimmungsbuch mit farbigen Bildern.
                Oder fotografiere die Pflanze. Bestimme dann deine Pflanze mit <a target = "_blank", href = "https://identify.plantnet.org/de">identify.plantnet.org</a>
                oder verwende eine der folgenden beiden Apps:<br>
                <ul>
                  <li><a target = "_blank" href = "https://floraincognita.com">Flora Incognita</a></li>
                  <li><a target="_blank", href="https://plantnet.org/">PlantNet</a></li>
                </ul>`,
        }
      });

      page_regionalitaet.addTextInfo({
        title: "Schädliche gebietsfremde Pflanzen (invasive Neophyten)  (10, 10a, 10b)",
      })

  
      //10_neophyten
      let elem10 = page_regionalitaet.addElement("radioButtonInput", "neophyten", {
        text: "10: Gibt es im Untersuchungsgebiet schädliche gebietsfremde Pflanzen?",
        placeholder: "Auswählen",
        points: "neophyten_points",
        options: [
          { key: "0", points: 2, label: "keine" },
          {
            key: "1", points: 0, label: "eine Art von schädlichen gebietsfremden Pflanzen",
          },
          {
            key: "2", points: -2, label: "mehr als eine Art von schädlichen gebietsfremden Pflanzen",
          },
        ],
        textInfo: {
            linkText: "Zusatzinfos",
            text: `Gebietsfremde Pflanzen sind Pflanzen, die natürlicher Weise nicht hier wachsen. Sie werden Neophyten genannt. Die meisten Neophyten sind harmlos. Es gibt aber Neophyten, die Probleme bereiten. Solche Neophyten sind schädlich.
            Die wichtigsten schädlichen Neophyten findest du unter:<br>
            <ul>
              <li><a target = "_blank" href = "https://www.neophyt.ch">neophyt.ch</a></li>
              <li><a target = "_blank" href = "http://www.neophyten-schweiz.ch/index.php?l=D&p=1&t=5">neophyten-schweiz.ch</a></li>
            </ul>`,
        }
      });


      //10a_neophytenmenge
      let elem10a = page_regionalitaet.addElement("radioButtonInput", "neophytenmenge", {
        text: "10a: Wie gross ist die Fläche, die insgesamt durch alle schädlichen gebietsfremden Pflanzen bedeckt wird?",
        placeholder: "Auswählen",
        points: "neophytenmenge_points",
        options: [
          { key: "0", points: -1, label: "kleiner als ein Parkplatz für ein Auto " },
          { key: "1", points: -2, label: "grösser als ein Parkplatz für ein Auto " },
        ],
      });

      //10b_neophyten__geomoid - Liste und Points tbd
      let elem10b = page_regionalitaet.addElement("mapInput", "neophyten__geomoid", {
        text: `10b: Markiere alle Standorte mit schädlichen gebietsfremden Pflanzen.`,
        placeholder: "Auswählen",
         //points: "",
         options: [
          { key: "0", label: "A" },
          { key: "0", label: "B"},
          { key: "-2", label: "C"},
        ],
        color: [147, 145, 98],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem10a.element.style.display = "none";
      elem10b.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem10.rules = [{
        values: [
          "eine Art von schädlichen gebietsfremden Pflanzen",
          "mehr als eine Art von schädlichen gebietsfremden Pflanzen" ], 
        elements: [elem10a, elem10b]
      }]

      
      /*Strukturelemente*/      
      let page_strukturelemente = this.app.addPage("Strukturelemente", {
      pointsInfo: [10, 32]});

      page_strukturelemente.addTextInfo({        
        textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Strukturelemente sind einzelne Teile eines Lebensraums wie beispielsweise:
          </div>
          <div class="textInfoElements">
          <br>
          </div>
          <div class="textInfoElements">
          Bäume
          <img src="img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          </div>
          <div class="textInfoElements">
          Sträucher
          <img src="img/Fotos_Hilfestellungen/H11a_2_Straeucher.jpg" alt="H11a_2" width="100%">
          </div>
          <div class="textInfoElements">
          Blumenwiesen
          <img src="img/Fotos_Hilfestellungen/H11a_3_Blumenwiese.jpg" alt="H11a_3" width="100%">
          </div>
          <div class="textInfoElements">
          Kiesflächen
          <img src="img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">
          </div>
          <div class="textInfoElements">     
          Tümpel
          <img src="img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>        
          Verschiedene Strukturelemente bieten verschiedenen Lebewesen Lebensraum und Nahrung. Je mehr verschiedene Strukturelemente, desto mehr verschiedene Arten gibt es auf einer Fläche."
          `
        }, 
        version: ["long"]
      })

      page_strukturelemente.addTextInfo({
        title: "Versiegelte Flächen (11)",
        text: `Auf einer versiegelten Fläche wachsen keine Pflanzen. Der Boden einer versiegelten Fläche ist ziemlich wasserdicht und luftdicht zugedeckt.
        Auf versiegelten Flächen kann deshalb Regenwasser nicht mehr in den Boden versickern.<br>
        `,

        textInfo: {
          linkText: "Beispiele von versiegelten Flächen",
        text:
        `
        <div class= textInfoElements>
          Überall, wo Gebäude stehen:
          Asphalt, Teer
          <img src="img/Fotos_Hilfestellungen/H11_1_Asphalt.jpg" alt="H11_1" width="100%">
          </div>
          <div class= textInfoElements>
          Sportbelag
          <img src="img/Fotos_Hilfestellungen/H11_2_Sportbelag.jpg" alt="H11_2 width="100%">
          </div>
          `
        }
      })
      

      //11_versieg_geomoid
      page_strukturelemente.addElement("mapInput", "versieg_geomoid", {
        text: `11: Markiere versiegelte Flächen in der gezeigten Untersuchungsfläche.`,
        area: "versieg_area",
        ratio: {
          key: "versieg_arearatio",
          stops: [{points:4, value: 0.33},{points:2, value: 0.5},{points:1, value: 0.66},{points:6, value:1}]
        },
        color: [64, 9, 105],
        points: "versieg_points",
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          -
          `,
        }

      }); 

      page_strukturelemente.addTextInfo({
        title: "Rasenflächen  (12)",
      })

      //12_rasen_geomoid
      page_strukturelemente.addElement("mapInput", "rasen_geomoid", {      
        text: `12: Markiere Flächen mit Rasen in der gezeigten Untersuchungsfläche.`,
        area: "rasen_area",
        ratio: {
          key: "rasen_area_ratio",
          stops: [{points:2, value:0.25},{points:1, value: 0.5},{points:0, value:1}]
        },
        color: [46, 37, 72],
        points: "rasen_points",
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H08_2_Sportrasen.jpg" alt="H08_2" width="100%">
          Sportrasen und Wiesen mit Gras, das immer kürzer ist als 10 cm. Solche Rasenflächen sind sehr arm an verschiedenen Lebewesen."
          </div>
           `,
        }

      }); 


      page_strukturelemente.addTextInfo({
        title: "Vielfalt der Flächen (13a, 13b, 13c, 13d, 13e, 13f)",
        text: "Verschiedene Flächen bieten verschiedenen Lebewesen Lebensraum und Nahrung. Je mehr verschiedenartige Flächen, desto mehr verschiedene Arten gibt es."
      })
      //13a_wild_geomoid
      page_strukturelemente.addElement("mapInput", "a_wild_geomoid", {    
        text: `13a: Markiere Flächen mit Gemüsebeeten und/oder Beeten mit Wildblumen in der gezeigten Untersuchungsfläche.`,
        area: "wild_area",
        points: "a_wild_points",
        ratio: {
          key: "wild_arearatio",
          options: [
            { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
            { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
            { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
            { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
            { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
            { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
            { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
          ]
        },
        color: [129, 0, 157],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Gemüsebeet
          <img src="img/Fotos_Hilfestellungen/H13a_1_Gemuesebeet.jpg" alt="H13a_1" width="100%">
          </div>
          
          <div class="textInfoElements">
          Beet mit Wildblumen 
          <img src="img/Fotos_Hilfestellungen/H13a_2_Gartenbeet.jpg" alt="H13a_2" width="100%">
          
          </div>        
         `,
        }
      }); 


      //13b_trocken_geomoid
      page_strukturelemente.addElement("mapInput", "b_trocken_geomoid", {
        text: `13b: Markiere Flächen mit Trockenstandorten wie Kies, Sand, Ruderalflächen in der gezeigten Untersuchungsfläche.`,
        area: "trocken_area",
        points: "trocken_points",
        ratio: {
          key: "trocken_arearatio",
          options: [
            { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
            { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
            { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
            { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
            { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
            { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
            { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
          ]
        },
        color: [213, 226, 218],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          
          <div class="textInfoElements">
          Beispiele von Trockenstandorten:
          Kiesflächen, die nicht als Parkplatz genutzt werden
          <img src="img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">  
          </div>
          
          <div class="textInfoElements">
          Sandflächen ohne Sprunggrube für Sport
          <img src="img/Fotos_Hilfestellungen/H13b_2_Sandflaeche.jpg" alt="H13b_2" width="100%">
          </div>
          
          <div class="textInfoElements">
          Flächen mit Geröll
          <img src="img/Fotos_Hilfestellungen/H13b_3_Geroell.jpg" alt="H13b_3" width="100%">
          </div>
          
         `,
        }
      }); 
      
      //13c_gras_geomoid
      page_strukturelemente.addElement("mapInput", "c_gras_geomoid", {
        text: `13c: Markiere in der gezeigten Untersuchungsfläche Flächen mit Wiesen dessen Gras mindestens einmal im Jahr höher als 10 cm ist.`,
        area: "c_gras_area",
        points: "c_gras_points",
        ratio: {
          key: "c_gras_arearatio",
          options: [
            { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
            { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
            { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
            { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
            { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
            { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
            { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
          ]
        },
        color: [2, 199, 116],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Blumenwiese
          <img src="img/Fotos_Hilfestellungen/H11a_3_Blumenwiese.jpg" alt="H11a_3" width="100%">
          </div>
          `,
        }
      }); 


      //13d_hecken_geomoid
      page_strukturelemente.addElement("mapInput", "d_hecken_geomoid", {
        text: `13d: Markiere in der gezeigten Untersuchungsfläche Flächen mit Sträuchern und/oder Hecken mit weitgehend heimischen Pflanzen.`,
        area: "d_hecken_area",
        points: "d_hecken_points",
        ratio: {
          key: "d_hecken_arearatio",
          options: [
            { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
            { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
            { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
            { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
            { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
            { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
            { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
          ]
        },
        color: [87, 72, 242],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Gruppe von heimischen Sträuchern
          <img src="img/Fotos_Hilfestellungen/H13d_1_GruppevonStraeuchern.jpg" alt="H13d_1" width="100%">
          </div>
          <div class="textInfoElements">
          Hecke mit heimischen Sträuchern
          <img src="img/Fotos_Hilfestellungen/H13d_2_Hecke.jpg" alt="H13d_2" width="100%">
          </div>
          `,
        }
      }); 


      //13e_baeume_geomoid
      page_strukturelemente.addElement("mapInput", "e_baeume_geomoid", {
        text: `13e: Markiere in der gezeigten Untersuchungsfläche Flächen mit Bäumen, Baumgruppen oder Wald mit weitgehend heimischen Pflanzen.`,
        area: "e_baeume_area",
        points: "e_baeume_points",
        ratio: {
          key: "e_baeume_arearatio",
          options: [
            { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
            { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
            { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
            { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
            { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
            { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
            { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
          ]
        },
        color: [195, 17, 64],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Heimische Bäume in deutlich unterschiedlichen Höhen
          <img src="img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          </div>
          `,
        }
      }); 

      
             
      //13f_wasser_geomoid
      page_strukturelemente.addElement("mapInput", "f_wasser_geomoid", {
        text: `13f: Markiere Wasserflächen in der gezeigten Untersuchungsfläche.`,
        area: "f_wasser_area",
        points: "f_wasser_points",
        ratio: {
          key: "f_wasser_arearatio",
          options: [
            { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
            { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
            { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
            { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
            { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
            { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
            { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
          ]
        },
        color: [185, 184, 106],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Tümpel
          <img src="img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>
          <div class="textInfoElements">
          Kleines Bächlein
          <img src="img/Fotos_Hilfestellungen/H13f_2_kleinesBaechlein.jpg" alt="H13f_2" width="100%">
          </div>
          `,
          }
      });

   
      page_strukturelemente.addTextInfo({
        title: "Baumschicht (14)", 
      })
    
      //14_baeume
      let elem14 = page_strukturelemente.addElement("radioButtonInput", "baeume", {      
        text: "14: Gibt es auf der Untersuchungsfläche Bäume?",
        placeholder: "Auswählen",
        points: "baeume_points",
        measure: "A14.0",
        options: [
          { key: "0", points: 0, label: "Keine Bäume vorhanden, die höher als 4 - 5 Meter sind." , measure: "A14.1"},
          { key: "1", points: 1, label: "Nur 1 Baum vorhanden oder alle Bäume etwa gleich hoch." , measure: "A14.2"},
          { key: "2", points: 2, label: "Bäume in zwei deutlich unterschiedlichen Höhen vorhanden." , measure: "A14.3"},
          { key: "3", points: 3, label: "Bäume in drei deutlich unterschiedlichen Höhen vorhanden." , measure: "A14.4"},
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Es zählen nur Bäume, die höher sind als drei erwachsene Menschen, die einander auf den Schultern stehen:
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H14_1_Baum.jpg" alt="H14_1" width="100%">
          </div>
          <div class="textInfoElements">
          Hoher Baum
          Hohe Bäume bieten Nahrung und Unterschlupf für eine Vielzahl von Lebewesen.
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          heimische Bäume in deutlich unterschiedlichen Höhen
          </div>
          `,
          }       
      });

      //[Falls bei 14 eine der beiden Optionen mit mehr als einem Baum angekreuzt wird, dann Fragen 14a und 14b einblenden:] gelöst durch mehrere Schnittmengen

      //14a_baeume
      let elem14a = page_strukturelemente.addElement("radioButtonInput", "14a_baeume", {
        text: "14a: Sind insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden?",
        placeholder: "Auswählen",
        points: "a_baeume_points",
        options: [
          { key: "0", points: 1, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

       //14b_baeume
       let elem14b = page_strukturelemente.addElement("radioButtonInput", "14b_baeume", {
        text: "14b: Haben mindestens zwei der Bäume einen Umfang von mehr als 2 Metern?",
        placeholder: "Auswählen",
        points: "b_baeume_points",
        options: [
          { key: "0", points: 2, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem14a.element.style.display = "none";
      elem14b.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem14.rules = [{
        values: [
          "Bäume in deutlich unterschiedlichen Höhen vorhanden.",
          "Bäume in drei deutlich unterschiedlichen Höhen vorhanden." ], 
        elements: [elem14a, elem14b]
      }]


      page_strukturelemente.addTextInfo({
        title: "Sträucher ohne Hecken (15)", 
      })
      
      //15_straeucher
      let elem15 = page_strukturelemente.addElement("radioButtonInput", "straeucher", {
        text: "15: Gibt es auf der Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
        placeholder: "Auswählen",
        points: "straeucher_points",
        options: [
          { key: "0", points: 0, label: "Keine Sträucher oder nur vereinzelte Sträucher vorhanden." },
          { key: "1", points: 0, label: "Überwiegend nicht-heimische Sträucher vorhanden. " },
          { key: "2", points: 1, label: "1-3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." },
          { key: "3", points: 3, label: "Mehr als 3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Vögel bauen ihre Nester gerne in Gruppierungen von heimischen Sträuchern. Auch kleine Säugetiere wie Mäuse, Schläfer oder Wiesel finden in Strauchgruppen Versteck und Nahrung.
          Gruppe von heimischen Sträuchern
          <img src="img/Fotos_Hilfestellungen/H13d_1_GruppevonStraeuchern.jpg" alt="H13d_1" width="100%">
          
          </div>
          `,
          }
      });

      //[Falls bei 15 eine der beiden Optionen mit Gruppen von Sträuchern angekreuzt wird, dann Fragen 15a einblenden:]

       //15a_straeucher
       let elem15a = page_strukturelemente.addElement("radioButtonInput", "15a_straeucher", {
        text: "15a: Insgesamt mehr als 5 verschiedene heimische Straucharten.",
        placeholder: "Auswählen",
        points: "15a_straeucher_points",
        options: [
          { key: "0", points: 2, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem15a.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem15.rules = [{
        values: [
          "1-3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch.",
          "Mehr als 3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." ], 
        elements: [elem15a]
      }]


     
      page_strukturelemente.addTextInfo({
        title: "Hecken (16)", 
      })       

      //16_hecken
      let elem16 = page_strukturelemente.addElement("radioButtonInput", "hecken", {
        text: "16: Gibt es auf der Untersuchungsfläche Hecken?",
        placeholder: "Auswählen",
        points: "hecken_points",
        options: [
          { key: "0", points: 0, label: "Keine Hecke vorhanden." },
          { key: "1", points: 0, label: "Hecken vorhanden. Die Hecken bestehen aber überwiegend aus nicht-heimische Sträuchern." },
          { key: "2", points: 1, label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch." },
            { key: "7", points: 3, label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch." },
       ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Hecke mit heimischen Sträuchern bieten Tieren nicht nur ein Versteck, sondern auch Nahrung: Necktar und Pollen für Insekten, Früchte für Vögel und kleine Säugetiere.
          Im Unterschied dazu bieten Hecken aus gebietsfremden Pflanzen kaum Nahrung.
          <img src="img/Fotos_Hilfestellungen/H13d_2_Hecke.jpg" alt="H13d_2" width="100%">
          </div>
          <div class="textInfoElements">
          Hecke aus Kirschlorbeer, ein schädlicher gebietsfremder Strauch
          <img src="img/Fotos_Hilfestellungen/H16_1_Kirschlorbeer.jpg" alt="H16_1" width="100%">          
          </div>
          `,
          }
      });

      //[Falls bei 16 eine der beiden Optionen mit Hecken mit heimischen Sträuchern angekreuzt wird, dann Fragen 16a und 16b einblenden:]
      //16a_hecken
      let elem16a = page_strukturelemente.addElement("radioButtonInput", "16a_hecken", {
        text: "16a: In der Hecke sind insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden.",
        placeholder: "Auswählen",
        points: "16a_hecken_points",
        options: [
          { key: "0", points: 2, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

      //16b_hecken
      let elem16b = page_strukturelemente.addElement("radioButtonInput", "16b_hecken", {
        text: "16a: Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang.",
        placeholder: "Auswählen",
        points: "16b_hecken_points",
        options: [
          { key: "0", points: 1, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem16a.element.style.display = "none";
      elem16b.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem16.rules = [{
        values: [
          "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch.",
          "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch."
        ], 
        elements: [elem16a, elem16b]
      }]


      page_strukturelemente.addTextInfo({
        title: "Vielfalt an einem Ort (17)", 
      })  

      //17_vielfalt
      page_strukturelemente.addElement("radioButtonInput", "vielfalt", {
        text: "17: Sind Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser zusammen an einem Ort anzutreffen?",
        placeholder: "Auswählen",
        points: "vielfalt_points",
        options: [
          { key: "0", points: 0, label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser sind nirgends zusammen anzutreffen." },
          { key: "1", points: 1, label: "Zwei der drei Elemente (1. Bäume, 2. Sträucher und 3. heimische Kräuter, Blumen oder Gräser) kommen zusammen vor. Alle drei Elemente kommen jedoch nirgends alle zusammen vor." },
          { key: "2", points: 2, label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser kommen alle zusammen an einer Stelle vor." },
          { key: "3", points: 4, label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser kommen alle zusammen an mehr als einer Stelle vor." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Kommen unterschiedliche Elemente wie Bäume, Sträucher sowie Kräuter, Gräser und Blumen alle an der gleichen Stelle vor, so finden auch mehr Lebewesen
          einen Lebensraum mit Nahrung und Versteck. Deshalb ist es wichtig, dass Bäume, Sträucher und Kräuter an manchen Stellen zusammen vorkommen:
          Kräuter, Gräser und Blumen unter Bäumen
          <img src="img/Fotos_Hilfestellungen/H17_1_KrautschichtBaumschicht.jpg" alt="H17_1" width="100%">
          </div>
          <div class="textInfoElements">
          Krautsaum unter Sträuchern
          <img src="img/Fotos_Hilfestellungen/H17_2_KrautschichtStrauchschicht.jpg" alt="H17_2" width="100%">
          </div>
          <div class="textInfoElements">
          Sträucher zusammen mit Bäumen
          <img src="img/Fotos_Hilfestellungen/H17_3_StrauchschichtBaumschicht.jpg" alt="H17_3" width="100%"> 
          </div>
          <div class="textInfoElements">
          alle drei Elemente (Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser) an derselben Stelle
          <img src="img/Fotos_Hilfestellungen/H17_4_alle3Schichten.jpg" alt="H17_4" width="100%"> 
          </div>
          `,
          }
      });

    
      page_strukturelemente.addTextInfo({
        title: "Ruderalflächen (18)", 
      }) 

      //18_ruderal
      page_strukturelemente.addElement("radioButtonInput", "ruderal", {
        text: "18: Gibt es auf der Untersuchungsfläche Ruderalflächen mit passenden heimischen Pflanzen?",
        placeholder: "Auswählen",
        points: "ruderal_points",
        options: [
          { key: "0", points: 0, label: "Keine Ruderalfläche vorhanden." },
          { key: "1", points: 0, label: "Ruderalfläche vorhanden. Darin kommen aber schädliche gebietsfremden Pflanzen vor.." },
          { key: "2", points: 1, label: "Ruderalfläche ist insgesamt etwa so gross wie zwei Autoparkplätze." },
          { key: "3", points: 2, label: "Ruderalfläche ist insgesamt etwa so gross wie vier Autoparkplätze." },
          { key: "4", points: 3, label: "Ruderalfläche ist insgesamt grösser als vier Autoparkplätze." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Ruderalflächen sind offene Bodenflächen auf denen keine Pflanzen angepflanzt wurden.
          Beispiele von Ruderalflächen:
          </div>
          <div class="textInfoElements">
          Flächen mit Geröll
          <img src="img/Fotos_Hilfestellungen/H13b_3_Geroell.jpg" alt="H13b_3" width="100%">
          </div>
          <div class="textInfoElements"> 
          Kiesflächen, die nicht als Parkplatz genutzt werden
          <img src="img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">      
          </div>        
          <div class="textInfoElements">
          Sandflächen ohne Sprunggrube für Sport          
          <img src="img/Fotos_Hilfestellungen/H13b_2_Sandflaeche.jpg" alt="H13b_2" width="100%">
          Ruderalflächen bieten ein Zuhause für ganz spezielle Pflanzen und Tiere.
          </div>
          `,
          } 
      });

       
      page_strukturelemente.addTextInfo({
        title: "Trockenmauern, Steinhaufen (19)", 
      }) 

      //19_mauern
      page_strukturelemente.addElement("radioButtonInput", "mauern", {
        text: "19: Gibt es auf der Untersuchungsfläche Trockenmauern oder Steinhaufen?",
        placeholder: "Auswählen",
        points: "mauern_points",
        options: [
          { key: "0", points: 0, label: "Keine Trockenmauern oder Steinhaufen vorhanden." },
          { key: "1", points: 1, label: "1 Trockenmauer oder Steinhaufen vorhanden." },
          { key: "2", points: 2, label: "2 Trockenmauern oder Steinhaufen vorhanden." },
          { key: "3", points: 4, label: "Mehr als 2 Trockenmauern oder Steinhaufen vorhanden." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Trockenmauern und Steinhaufen bieten ein sicheres Versteck für Frösche, Kröten, Eidechsen und Schlangen aber auch für Wiesel, Schläfer und Mausarten. Viele dieser Tiere überwitntern auch in Trockenmauern oder Steinhaufen.
          </div>
          Steinhaufen
          <img src="img/Fotos_Hilfestellungen/H19_1_Steinhaufen.jpg" alt="H19_1" width="100%">
          <div class="textInfoElements">
          Trockenmauer
          <img src="img/Fotos_Hilfestellungen/H19_2_Trockenmauer.jpg" alt="H19_2" width="100%">
          </div>
          `,
          } 
      });

     
      page_strukturelemente.addTextInfo({
        title: "Asthaufen, Totholz (20)", 
      }) 

      //20_totholz
      page_strukturelemente.addElement("radioButtonInput", "totholz", {
        text: "20: Gibt es auf der Untersuchungsfläche Asthaufen, abgestorbene Bäume oder Totholz?",
        placeholder: "Auswählen",
        points: "totholz_points",
        options: [
          { key: "0", points: 0, label: "Keine Asthaufen, abgestorbene Bäume oder Totholz vorhanden." },
          { key: "1", points: 1, label: "1 Asthaufen, abgestorbener Baum oder Totholzelement vorhanden." },
          { key: "2", points: 2, label: "2 Asthaufen, abgestorbene Bäume oder Totholzelemente vorhanden." },
          { key: "3", points: 4, label: "Mehr als 2 Asthaufen, abgestorbene Bäume oder Totholzelemente vorhanden." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">          
          Asthaufen         
          <img src="img/Fotos_Hilfestellungen/H20_1_Asthaufen.jpg" alt="H20_1" width="100%">
          Asthaufen bieten ein Versteck für Igel, Mäuse aber auch für Blindschleichen sowie Kröten, Frösche und Molche.
          <br>
          <div class="textInfoElements">          
          Totholz
          <img src="img/Fotos_Hilfestellungen/H20_2_Totholz.jpg" alt="H20_2" width="100%">
          Totholz und abgestorbene Bäume sind der Lebensraum für zahlreiche Insekten, Pilze und Moose.                    
          </div>
          `,
          }
      });

      page_strukturelemente.addTextInfo({
        title: "Künstliche Nisthilfen (21, 22, 23)", 
      }) 

      //21_insekten
      page_strukturelemente.addElement("radioButtonInput", "insekten", {
        text: "21: Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für Insekten?",
        placeholder: "Auswählen",
        points: "insekten_points",
        options: [
          { key: "0", points: 0, label: "Keine künstliche Nisthilfen für Insekten vorhanden." },
          { key: "1", points: 1, label: "1-3 künstliche Nisthilfen für Insekten vorhanden." },
          { key: "2", points: 2, label: "Mehr als 3 künstliche Nisthilfen für Insekten vorhanden." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Insekten spielen eine ganz wichtige Rolle in Nahrungsnetzen:<br>
          Insekten sind wichtig für die Bestäubung von vielen Pflanzen. Insekten sind auch Nahrung für viele Tiere.
          </div>
          <div class="textInfoElements">
          Insektenhotel
          <img src="img/Fotos_Hilfestellungen/H21_1_Insektenhotel.jpg" alt="H21_1" width="100%">         
          </div>
          <div class="textInfoElements">
          Lebensturm
          <img src="img/Fotos_Hilfestellungen/H21_2_Lebensturm.jpg" alt="H21_2" width="100%">          
          </div>
          `,
          }
      });
  
      //22_voegel
      page_strukturelemente.addElement("radioButtonInput", "voegel", {
        text: "22: Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für Vögel?",
        placeholder: "Auswählen",
        points: "voegel_points",
        options: [
          { key: "0", points: 0, label: "Keine künstliche Nisthilfen für Vögel vorhanden." },
          { key: "1", points: 1, label: "1-3 künstliche Nisthilfen für Vögel vorhanden." },
          { key: "2", points: 2, label: "Mehr als 3 künstliche Nisthilfen für Vögel vorhanden." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Viele Vögel finden keine guten Möglichkeiten, um ihr Nest zu bauen. Nistkästen können hier Abhilfe schaffen:
          </div>
          <div class="textInfoElements">
          Nistkasten für Höhlenbrüter
          <img src="img/Fotos_Hilfestellungen/H22_1_NistkastenHoehlenbrueter.jpg" alt="H22_1" width="100%">         
          </div>
          <div class="textInfoElements">
          Nisthilfe für Mehlschwalben
          <img src="img/Fotos_Hilfestellungen/H22_2_NisthilfeSchwalben.jpg" alt="H22_2" width="100%">          
          </div>
          `,
          }
      });

      //23_saeuger
      page_strukturelemente.addElement("radioButtonInput", "saeuger", {
        text: "23: Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für kleine Säugetiere?",
        placeholder: "Auswählen",
        points: "saeuger_points",
        options: [
          { key: "0", points: 0, label: "Keine künstliche Nisthilfen für kleine Säugetiere vorhanden." },
          { key: "1", points: 1, label: "1-3 künstliche Nisthilfen für kleine Säugetiere vorhanden." },
          { key: "2", points: 2, label: "Mehr als 3 künstliche Nisthilfen für kleine Säugetiere vorhanden." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Kleine Säugetiere wie Igel, Fledermäuse, Siebenschläfer und Mausarten brauchen Verstecke. Auch brauchen diese Tiere Plätze, wo sie ihre Jungen zur Welt bringen können.
          </div>
          <div class="textInfoElements">
          Fledermauskasten
          <img src="img/Fotos_Hilfestellungen/H23_1_Fledermauskasten.jpg" alt="H08_2" width="100%">          
          </div>
          <div class="textInfoElements">
          Schlafplatz für Igel
          <img src="img/Fotos_Hilfestellungen/H23_2_SchlafplatzIgel.jpg" alt="H23_2" width="100%">          
          </div>
          <div class="textInfoElements">
          Versteck für Siebenschläfer
          <img src="img/Fotos_Hilfestellungen/H23_3_VersteckSiebenschlaefer.jpg" alt="H23_3" width="100%">          
          </div>
          `,
          }
      });
     
  
      page_strukturelemente.addTextInfo({
        title: "Gewässer und Feuchtflächen (24, 25, 26)", 
      }) 

      //24_feuchtfl
      page_strukturelemente.addElement("radioButtonInput", "feuchtfl", {
        text: "24: Gibt es Feuchtflächen auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "feuchtfl_points",
        options: [
          { key: "0",points: 0, label: "Keine Feuchtflächen vorhanden." },
          { key: "1",points: 2, label: "Feuchtflächen insgesamt etwa so gross wie ein Autoparkplatz." },
          { key: "2",points: 4, label: "Feuchtflächen insgesamt grösser als ein Autoparkplatz." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Feuchte Flächen bieten spezialisierten Tieren und Pflanzen ein Zuhause:
          </div>
          <div class="textInfoElements">
          Sumpfstreifen
          <img src="img/Fotos_Hilfestellungen/H24_1_Sumpfstreifen.jpg" alt="H24_1" width="100%">
          </div>
          <div class="textInfoElements">
          Moorwiese
          <img src="img/Fotos_Hilfestellungen/H24_2_Moorwiese.jpg" alt="H24_2" width="100%">
          </div>
          `,
          }
      });

      //25_stehgew
      page_strukturelemente.addElement("radioButtonInput", "stehgew", {
        text: "25: Gibt es stehende Gewässer auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "stehgew_points",
        options: [
          { key: "0", points: 0, label: "Keine stehenden Gewässer vorhanden." },
          { key: "1", points: 1, label: "Fläche mit stehenden Gewässern  insgesamt etwa so gross wie 1 Autoparkplatz." },
          { key: "2", points: 2, label: "Fläche mit stehenden Gewässern  insgesamt etwa so gross wie 2 Autoparkplätze." },
          { key: "4", points: 4, label: "Fläche mit stehenden Gewässern  insgesamt grösser als 2 Autoparkplätze." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Zahlreiche Lebewesen sind auf das Leben in Wasser spezialisiert.
          Bestimmte Insekten und Amphibien brauchen beispielsweise zur Fortpflanzung stehende Gewässer.
          </div>
          <div class="textInfoElements">
          Tümpel
          <img src="img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>
          `,
          }
      });

      //26_fliessgew
      page_strukturelemente.addElement("radioButtonInput", "fliessgew", {
        text: "26: Gibt es Fliessgewässer auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "fliessgew_points",
        options: [
          { key: "0" ,points: 0, label: "Keine Fliessgewässer oder nur Fliessgewässer kürzer als 3 Meter vorhanden." },
          { key: "1" ,points: 6, label: "Ein oder mehrere Fliessgewässer von insgesamt mehr als 3 Meter Länge vorhanden." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Zahlreiche fliegende Insekten verbringen einen Teil ihrer Entwicklung in fliessenden Gewässer.
          </div>
          <div class="textInfoElements">
          kleines Bächlein
          <img src="img/Fotos_Hilfestellungen/H13f_2_kleinesBaechlein.jpg" alt="H13f_2" width="100%">       
          </div>
          `,
          }
      });

     
      page_strukturelemente.addTextInfo({
        title: "Umgebung (27)", 
      }) 

      //27_umgebung
      page_strukturelemente.addElement("radioButtonInput", "umgebung", {
        text: "27: Ist die Untersuchungsfläche umgeben von intensiver Landwirtschaft oder überbautem Gebiet?",
        placeholder: "Auswählen",
        points: "umgebung_points",
        options: [
          { key: "0",points: 0, label: "Die Untersuchungsfläche ist zu ungefähr drei Viertel oder mehr umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
          { key: "1",points: 1, label: "Die Untersuchungsfläche ist zu einem Viertel bis zu drei Viertel umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
          { key: "2",points: 4, label: "Die Untersuchungsfläche ist zu weniger als einem Viertel umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
        ],
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Chemische Mittel der intensiven Landwirtschaft töten nicht nur so genannte Schädlinge, sondern auch sehr viele andere Lebewesen. Düngemittel sorgen zudem dafür, dass nur einige wenige Pflanzen sehr stark wachsen. Alle diese Mittel gelangen über die Luft und das Wasser auch in die Umgebung.
          Zahlreiche Lebewesen können in überbauten Gebieten nicht überleben.
          </div>
          `,
          }
      });

      /*Pflege*/
      let page_pflege = this.app.addPage("Pflege", {
      pointsInfo: [2,11]});

  
      page_pflege.addTextInfo({
        title: "Mähen von Rasen und Wiesen OHNE Sportrasen (28, 29)", 
      }) 

      //28_geraet
      page_pflege.addElement("sliderInput", "28_geraet", {
        text: "28: Mit welchen Geräten werden Grasflächen (ohne Sportrasen) geschnitten? Stelle mit dem Regler ein, auf welchem Anteil der Grasflächen mit mit Sense oder Balkenmäher  gemäht wird:",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{points: 0, value:20, measure: "dummyId"},{points:1, value:50},{points:2, value:80},{points:3, value:100}], 
        points: "28_geraet_points",
      });
      //0 P.	< 20 %, 1 P.	21 – 50 %, 2 P.	51 % - 80 %, 3 P.	> 80% 

      page_pflege.addTextInfo({
        textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Rasentraktor, Ride-on Mäher
          <img src="img/Fotos_Hilfestellungen/H28_1_Rasentraktor.jpg" alt="H28_1" width="100%">
          </div>
          <div class="textInfoElements">
          Rasenmäher
          <img src="img/Fotos_Hilfestellungen/H28_2_Rasenmaeher.jpg" alt="H28_2" width="100%">
          </div>
          <div class="textInfoElements">
          Fadenmäher, Motorsense
          <img src="img/Fotos_Hilfestellungen/H28_3_Fadenmaeher.jpg" alt="H28_3" width="100%">
          </div>
          <div class="textInfoElements">
          Sense
          <img src="img/Fotos_Hilfestellungen/H28_4_Sense.jpg" alt="H28_4" width="100%">
          </div>
          <div class="textInfoElements">
          Balkenmäher
          <img src="img/Fotos_Hilfestellungen/H28_5_Balkenmaeher.jpg" alt="H28_5" width="100%">          
          </div>
          `
        }
      }) 

      //Info
      page_pflege.addTextInfo({
        text: `
        <div class="textInfoElements">
        Je weniger das Gras gemäht wird, desto besser können sich Pflanzen durch Samen fortpflanzen. Häufiges Mähen stört oder tötet zahlreiche Kleintiere wie Insekten und kleine Säugetiere.
        </div>
        `
      }) 

      //29a_maehen
      let elem29a = page_pflege.addElement("radioButtonInput", "a_maehen", {
        text: "29a: Es wird jeweils nicht die ganze Grasfläche zum gleichen Zeitpunkt geschnitten. Verschiedene Grasflächen werden zu unterschiedlichen Zeitpunkten geschnitten.",
        placeholder: "Auswählen",
        points: "a_maehen_points",
        options: [
          { key: "0", points: 1, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

       //29b_maehen
       page_pflege.addElement("radioButtonInput", "b_maehen", {
        text: "29b: Wie oft wird ein grosser Teil des Grases zwischen April und Oktober im Durchschnitt pro Monat geschnitten?",
        placeholder: "Auswählen",
        points: "b_maehen_points",
        options: [
          { key: "0", points: 1, label: "einmal oder weniger" },
          { key: "1", points: -2, label: "zweimal oder öfter" },
        ],
      });

       //29c_maehen
       page_pflege.addElement("radioButtonInput", "c_maehen", {
        text: "29c: Ein Teil der Grasfläche wird jedes Jahr gar nicht geschnitten. Das kann jedes Jahr ein anderer Teil sein. ",
        placeholder: "Auswählen",
        points: "c_maehen_points",
        options: [
          { key: "0", points: 1, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });
    

      //29d_zone
      let elem29d = page_pflege.addElement("radioButtonInput", "d_zone", {
        text: "29d: Bestimme, in welcher landwirtschaftlichen Zone sich die Untersuchungsfläche befindet.",
        placeholder: "Auswählen",
        options: [
          { key: "0", points: 0, label: "Talzone oder Hügelzone." },
          { key: "1", points: 0, label: "Bergzonen I oder II." },
          { key: "2", points: 0, label: "Bergzonen III oder IV." },
        ],
        textInfo: {
          linkText: "Karte zur Bestimmung der landwirtschaftlichen Zone",
          text: `Legende<br>
          <div class="textInfoElements">
          <img src="https://api.geo.admin.ch/static/images/legends/ch.blw.landwirtschaftliche-zonengrenzen_de.png" alt="legend" width="100%">
          </div>
          <div class="textInfoElements">
          <iframe src='https://map.geo.admin.ch/embed.html?topic=blw&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=887,947&layers=ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo.swissboundaries3d-kanton-flaeche.fill,ch.blw.landwirtschaftliche-zonengrenzen&layers_opacity=0.15,1,1,0.75&layers_visibility=false,false,false,true&E=2759000.00&N=1222000.00&zoom=1' width='100%' height='250' frameborder='0' style='border:0' allow='geolocation'></iframe>
          </div>
          `,
        }
      });

      //[Je nach gewählter Zone wird in 29e nur die entsprechende Frage zum Anklicken angezeigt:]

      //29etal
      let elem29etal = page_pflege.addElement("radioButtonInput", "b_schnitt", {
        text: "29e: [Tal- und Hügelzone] Gibt es Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 15. Juni geschnitten werden?",
        placeholder: "Auswählen",
        points: "e_schnitt_points",
        options: [
          { key: "0", points: 2, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

       //29eberg1
       let elem29eberg1 = page_pflege.addElement("radioButtonInput", "e_berg1_schnitt", {
        text: "29e: [Bergzonen I und II] Gibt es Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 1. Juli geschnitten werden?",
        placeholder: "Auswählen",
        points: "e_schnitt_points",
        options: [
          { key: "0", points: 2, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

       //29eberg2
       let elem29eberg2 = page_pflege.addElement("radioButtonInput", "e_berg2_schnitt", {
        text: "29e: [Bergzonen III und IV] Gibt es Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 15. Juli geschnitten werden?",
        placeholder: "Auswählen",
        points: "e_schnitt_points",
        options: [
          { key: "0", points: 2, label: "Ja" },
          { key: "1", points: 0, label: "Nein" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem29etal.element.style.display = "none";
      elem29eberg1.element.style.display = "none";
      elem29eberg2.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem29a.rules = [{
        values: [
          "Ja",
          ], 
        elements: [elem29d]
      }]
    
      elem29d.rules = [{
        values: [
          "Talzone oder Hügelzone.",
          ], 
        elements: [elem29etal]
      },
      {
        values: [
          "Bergzonen I oder II.",
          ], 
        elements: [elem29eberg1]
      },
      {
        values: [
          "Bergzonen III oder IV.",
          ], 
        elements: [elem29eberg2]
      }]

      page_pflege.addTextInfo({
        title: "Schädlingsregulierung (30, 31)", 
      }) 
      
      //30_pestizide
      page_pflege.addElement("sliderInput", "pestizide", {
        text: "30: Auf welcher Fläche werden chemische Pestizide  zur Schädlingsbekämpfung eingesetzt?<br>Stelle mit dem Regler ein, wie gross der Anteil dieser Fläche an der gesamten unbebauten Untersuchungsfläche ist:",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{points: 2, value: 5},{points:1, value:66},{points:0, value:100}],
        points: "pestizide_points",
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Chemische Pestizide sind Mittel, die oft nicht nur so genannte Schädlinge töten, sondern oft auch zahlreiche harmlose oder sogar nützliche Lebewesen. Oft bleiben Pestizide lange im Boden. Auch gelangen Pestizide mit Regenwasser in Gewässer.
          `,
          }
      });
      //Chemische Pestizide werden kaum eingesetzt. <5%	2
      //5.1-66%	1
      //Chemische Pestizide werden auf der gesamten unbebauten Fläche eingesetzt. >66%	0
      //points: "pestizide_points",

      //31_bekaempfung
      page_pflege.addElement("sliderInput", "bekaempfung", {
        text: "31: Auf welcher Fläche werden ökologische Mittel zur Schädlingsbekämpfung eingesetzt?<br>Wenn solche ökologischen Mittel zu wenig wirken, dann werden auch chemische Pestizide eingesetzt, die aber Nützlinge schonen.<br>Stelle mit dem Regler ein, wie gross der Anteil dieser Fläche an der gesamten unbebauten Untersuchungsfläche ist:",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{points:2,value:5},{points:1, value:75},{points:0,value:100}],
        points: "bekaempfung_points",
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Ökologische Mittel bestehen aus Stoffen, die ähnlich so auch in der Natur vorkommen. Andere ökologische Mittel bekämpfen Schädlinge durch natürliche Gegenspieler. Beispielsweise gibt es Schlupfwespen, die gefrässige Raupen abtöten.
          `,
          }
      });
     
      //32_unkraut
      page_pflege.addTextInfo({
        title: "Unkrautregulierung (32)",       
      }) 

      //32a_unkraut
      let elem32a = page_pflege.addElement("radioButtonInput", "32a_unkraut", {
        text: "32a: Werden Unkräuter oder unerwünschte Pflanzen überhaupt regelmässig bekämpft?",
        placeholder: "Auswählen",
        options: [
          { key: "0", points: 0, label: "Ja" },
          { key: "1", points: 4, label: "Nein" },
        ],
        points: "32a_unkraut_points",
        textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Unerwünschte Pflanzen lassen sich ganz unterschiedlich bekämpfen:
          Chemische Herbizide schaden oft auch erwünschten Pflanzen. Solche Herbizide bleiben manchmal lange im Boden. Auch gelangen Herbizide mit Regenwasser in Gewässer.
          Abflammen und Hitze erzeugende Geräte schaden oft auch Lebewesen in den oberen Bodenschichten.
          </div>
          <div class="textInfoElements">
          Abflammen
          <img src="img/Fotos_Hilfestellungen/H32_1_Abflammen.jpg" alt="H32_1" width="100%">
          </div>
          <div class="textInfoElements">
          Hitze erzeugende Geräte
          <img src="img/Fotos_Hilfestellungen/H32_2_HitzeGeraete.jpg" alt="H32_2" width="100%">
          </div>
          `
        },
      });

       //32b_unkraut
       let elem32b = page_pflege.addElement("radioButtonInput", "32b_unkraut", {
        text: "32b: Wie werden Unkräuter oder unerwünschte Pflanzen zur Hauptsache bekämpft?",
        placeholder: "Auswählen",
        options: [
          { key: "0", points: 0, label: "Mehr als 75 % der gesamten Unkrautbekämpfung erfolgt mit chemischen Mitteln, so genannten Herbiziden." },
          { key: "1", points: 1, label: "25 - 75 % der gesamten Unkrautbekämpfung erfolgt mit chemischen Mitteln, so genannten Herbiziden." },
          { key: "2", points: 4, label: "Weniger als 25 % der gesamten Unkrautbekämpfung erfolgt mit chemischen Mitteln, so genannten Herbiziden." },
        ],
        points: "32b_unkraut_points",
      });
      
      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem32b.element.style.display = "none";
      
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem32a.rules = [{
        values: [
          "Ja",
          ], 
        elements: [elem32b]
      }]     
     

    
      page_pflege.addTextInfo({
        title: "Düngen (33, 34)",          
      }) 

      //33_duengen
      let elem33 = page_pflege.addElement("radioButtonInput", "duengen", {
        text: "33: Ist die gesamte Grasfläche (Wiesen, Rasen inklusive Sportrasen) grösser als die Fläche für zwei Autoparkplätze?",
        placeholder: "Auswählen",    
        options: [
          { key: "0",points: 0, label: "Ja" },
          { key: "1",points: 0, label: "Nein" },      
        ],          
      });

      //Falls Ja, dann Items 33_grasduengen und 34er, Falls Nein, dann weiter mit Item 35 (Laub) 


      //33_grasduengen
      let elem33gras = page_pflege.addElement("radioButtonInput", "grasduengen", {
        text: "33gras: Werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) gedüngt?",
        placeholder: "Auswählen",    
        options: [
          { key: "0",points: 0, label: "Ja" },
          { key: "1",points: 4, label: "Nein" },      
        ],
        textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          In Böden mit wenig Nährstoffen ist die Artenvielfalt erstaunlicher Weise viel höher als in nährstoffreichen Böden. Düngemittel sind nichts Anderes als Nährstoffe für Pflanzen. Deshalb fördern Düngemittel oft das Wachstum von nur einigen wenigen Pflanzenarten.
          </div>
          `
        },       
      });

      //Falls Ja, dann Items und 33a_duengen und 34, Falls Nein, dann weiter mit Item 35 (Laub)

      
      //33a_duengen
      let elem33a = page_pflege.addElement("radioButtonInput", "a_duengen", {
        text: "33a: Wie werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) gedüngt?",
        placeholder: "Auswählen",    
        options: [
          { key: "0",points: 0, label: "Mehr als die Hälfte des Bodens wird ohne Analyse des Bodens gedüngt." },
          { key: "1",points: 2, label: "Weniger als die Hälfte des Bodens wird ohne Analyse des Bodens gedüngt." },      
        ],
        points: "33a_duengen_points",     
      });    
  


      //34_mitteln
      let elem34 = page_pflege.addElement("radioButtonInput", "mitteln", {
        text: "34: Mit welchen Mitteln werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) gedüngt?",
        placeholder: "Auswählen",    
        options: [
          { key: "0",points: 0, label: "Mehr als ein Drittel der Düngemittel sind mineralischer Dünger oder Torf." },
          { key: "1",points: 1, label: "Mehr als die Hälfte der Düngemittel sind organischer Dünger wie Jauche, Mist oder Mulch oder Bio-Knospenprodukte." },  
          { key: "2",points: 2, label: "Mehr als die Hälfte der Düngemittel ist eigener Kompost." },      
        ],
        points: "34_mitteln_points",
        textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Mineralische Düngemittel helfen zwar den Pflanzen, vernachlässigen aber Bodenlebewesen. Auch kann Mineraldünger zu einem chemischen Ungleichgewicht von Nährstoffen im Boden führen. Überschüssiger Mineraldünger wird zudem mit dem Regenwasser in Gewässer geschwemmt. In Gewässer kann Mineraldünger zu übermässigem Algenwachstum führen.
          `,
          }
      });

    

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem33gras.element.style.display = "none";
      elem33a.element.style.display = "none";    

      elem34.element.style.display = "none";

      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem33.rules = [{
        values: [
          "Ja",
          ], 
        elements: [elem33gras, elem34]
      }] 
      elem33gras.rules = [{
        values: [
          "Ja",
          ], 
        elements: [elem33a, elem34]
      }] 

      page_pflege.addTextInfo({
        title: "Laub (35)", 
      }) 
      
      //35_laub
      page_pflege.addElement("radioButtonInput", "laub", {
        text: "35: Was passiert im Herbst mit dem Laub?",
        placeholder: "Auswählen",
        points: "laub_points",
        options: [
          { key: "0", points: 0, label: "Sämtliches Laub wird eingesammelt und entsorgt." },
          { key: "1", points: 1, label: "Vereinzelt wird Laub bewusst belassen." },
          { key: "2", points: 2, label: "Es werden bewusst zahlreiche Laubhaufen erstellt." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Laub ist Nahrung für zahlreiche kleine Krabbeltiere aber auch für Pflanzen. Laub spielt deshalb eine wichtige Rolle im Kreislauf der Natur.
          Laubhaufen bieten zudem vielen Tieren Lebensraum, Versteck und Schutz vor Kälte. Tiere wie Igel, Blindschleichen, Frösche, kleine Mausarten usw. überwintern gerne in Laubhaufen.
          </div>
          <div class="textInfoElements">
          Laubhaufen
          <img src="img/Fotos_Hilfestellungen/H35_1 Laubhaufen.jpg" alt="H35_1" width="100%">
          </div>
          `,
          }
        
      });

 
      page_pflege.addTextInfo({
        title: "Alte Samenstände (36)", 
      }) 

      //36_samen
      page_pflege.addElement("radioButtonInput", "samen", {
        text: "36: Was passiert im Herbst mit alten Samenständen von Gras, Blumen und Sträucher?",
        placeholder: "Auswählen",
        points: "samen_points",
        options: [
          { key: "0", points: 0, label: "Alle alten Samenstände werden eingesammelt und entsorgt." },
          { key: "1", points: 1, label: "Vereinzelt werden alte Samenstände bewusst belassen." },
          { key: "2", points: 2, label: "Die meisten Samenstände werden bewusst belassen." },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Alte Samenstände können Vögel als Nahrung dienen. Weiter nutzen viele nützlichen Insekten alte Pflanzenstengel zum Überwintern. Viele Insekten legen auch ihre Eier in alte Pflanzenstengel ab.
          </div>
          <div class="textInfoElements">
          alte Samenstände
          <img src="img/Fotos_Hilfestellungen/H36_1 alte Samenstaende.jpg" alt="H36_1" width="100%">          
          </div>
          `,
          }
      });

      /*Bauliche Massnahmen*/
       let page_baumassnahmen = this.app.addPage("Bauliche Massnahmen", {
       pointsInfo: [2,4]});

      page_baumassnahmen.addTextInfo({
        title: "Begrünung von Dach oder Fassaden (37, 38)", 
      }) 

      //37_fldacher
      page_baumassnahmen.addElement("radioButtonInput", "fldacher", {
        text: "37: Gibt es auf Flachdächern eine Begrünung?",
        placeholder: "Auswählen",
        points: "fldacher_points",
        options: [
          { key: "0", points: 0, label: "Keine oder kaum Dachbegrünung." },
          { key: "1", points: 0, label: "Ungefähr die Hälfte der Flachdächer ist begrünt, enthält aber keine Sandflächen oder Totholz." },
          { key: "2", points: 1, label: "Ungefähr die Hälfte der Flachdächer ist begrünt und enthält auch Sandflächen und Totholz." },
          { key: "3", points: 1, label: "Mehr als die Hälfte der Flachdächer ist begrünt, enthält aber keine Sandflächen oder Totholz." },
          { key: "4", points: 2, label: "Mehr als die Hälfte der Flachdächer ist begrünt und enthält auch Sandflächen oder Totholz." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Flachdächer können ebenfalls eine Vieflat kleiner Lebensräume bieten: Niedrige Kräuter und Blumen können dort wachsen. Zahlreiche Krabbeltiere können in Kies- und Sandflächen oder kleinen Haufen von Totholz leben.
          </div>
          <div class="textInfoElements">
          Begrüntes Flachdach mit Totholz
          <img src="img/Fotos_Hilfestellungen/H37_1_Flachdach.jpg" alt="H37_1" width="100%">          
          </div>
          `,
          }
      });

    
      //38_fassaden
      page_baumassnahmen.addElement("radioButtonInput", "fassaden", {
        text: "38: Gibt es Fassaden mit einer Begrünung?",
        placeholder: "Auswählen",
        points: "fassaden_points",
        options: [
          { key: "0", points: 0, label: "Keine oder nur vereinzelt Fassadenbegrünung." },
          { key: "1", points: 1, label: "Fassaden von einer Fläche von insgesamt mindestens zwei Autoparkplätzen ist begrünt." },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Begrünte Fassaden bieten Lebensraum für Krabbeltiere und Vögel. Begrünte Fassaden schützen auch vor Kälte und Hitze.
          `,
          }
      });

      page_baumassnahmen.addTextInfo({
        title: "Kräuter- oder Gemüsegarten (39)", 
      }) 
     
      //39_kraeuter
      page_baumassnahmen.addElement("radioButtonInput", "kraeuter", {
        title: "",
        text: "Gibt es auf der Untersuchungsfläche einen biologisch bearbeiteten Kräuter- oder Gemüsegarten?",
        placeholder: "Auswählen",
        points: "kraeuter_points",
        options: [
          { key: "0",points: 0, label: "Nein" },
          { key: "1",points: 1, label: "Ja" },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Ein Kräuter- oder Gemüsegarten sorgt nur dann für mehr Artenvielfalt, wenn er biologisch bearbeitet wird. Bei Einsatz von chemischen Pestiziden, Herbiziden und Mineraldünger schadet dies der Artenvielfalt hingegen.
          `,
          }
      });

      page_baumassnahmen.addTextInfo({
        title: "Fallen für Tiere (40a, 40b, 41a, 41b, 42)", 
      }) 
      
      //40a_glas
      let elem40a = page_baumassnahmen.addElement("radioButtonInput", "a_glas", {
        title: "",
        text: "40a: Gibt es an den Gebäuden grosse Glasflächen?",
        placeholder: "Auswählen",
        points: "a_glas_points",
        options: [
          { key: "0",points: 2, label: "Nein" },
          { key: "1",points: 0, label: "Ja" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Grosse Glasflächen können tödlich für Vögel sein. 
          Aufgeklebte Umrisse von Vögel schützen leider nur wenig.
          <img src="img/Fotos_Hilfestellungen/H40_1_Greifvogel_Umrisse.jpg" alt="H40_1" width="100%">
          unwirksame Greifvogel-Umrisse<br>
          </div>
          <div class="textInfoElements">
          Wirksamer hingegen sind Streifenmuster:
          <img src="img/Fotos_Hilfestellungen/H40_2_Vogelschutzstreifen.jpg" alt="H40_2" width="100%">
          Glasfläche mit aufgeklebten Vogelschutzstreifen
          </div>
           `,
          }
      });

      //Item 40b sollte nur eingeblendet werden, wenn zuvor Item 40a mit Ja beantwortet wurde.

      //40b_glasschutz
      let elem40b = page_baumassnahmen.addElement("radioButtonInput", "b_glasschutz", {
        text: "40b: Wie werden die Vögel vor diesen Glasscheiben geschützt?",
        placeholder: "Auswählen",
        points: "b_glasschutz_points",
        options: [
          { key: "0",points: 0, label: "Glasflächen ohne Vogelschutz." },
          { key: "1",points: 0, label: "Glasflächen mit aufgeklebten Umrissen von Vögeln." },
          { key: "2",points: 2, label: "Glasflächen mit aufgeklebten Vogelschutzstreifen. (Birdstripes)" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem40b.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem40a.rules = [{
        values: ["Ja"], 
        elements: [elem40b]
      }]

   
      //41a_licht
      let elem41a = page_baumassnahmen.addElement("radioButtonInput", "a_licht", {
        text: "41a: Gibt es auf dem Untersuchungsgebiet Lichtquellen, die jeden Tag bis spät in die Nacht leuchten?",
        placeholder: "Auswählen",
        points: "a_licht_points",
        options: [
          { key: "0",points: 2, label: "Nein" },
          { key: "1",points: 0, label: "Ja" },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Zahlreiche Lebewesen sind aktiv in der Nacht. Viele von diesen Lebewesen kreisen um künstliche Lichtquellen und sterben schliesslich. Lichtquellen sollten deshalb nicht nach oben abstrahlen:
          <img src="img/Fotos_Hilfestellungen/H41_1.png" alt="H41_1" width="100%">
          Schädliche Ausrichtung von Lichtquellen
          </div> 
          <div class="textInfoElements">                   
          Auch ist gelbliches bis warm-weisses Licht von LED-Lampen weniger schädlich, als bläuliches Licht.
          <img src="img/Fotos_Hilfestellungen/H41_2.png" alt="H41_2" width="100%">
          Schädlichkeit verschiedener Lichtquellen
          </div>
           `,
          }
      });

      //Item 41b sollte nur eingeblendet werden, wenn zuvor Item 41a mit Ja beantwortet wurde.

      //41b_lichtart
      let elem41b = page_baumassnahmen.addElement("radioButtonInput", "b_lichtart", {
        text: "41b: Wie leuchten diesen Lichtquellen?",
        placeholder: "Auswählen",
        points: "b_lichtart_points",
        options: [
          { key: "0",points: 0, label: "Einige Lichtquellen strahlen auch nach oben ab, beispielsweise zur Beleuchtung des Gebäudes." },
          { key: "1",points: 1, label: "Gelbliche Lichtquellen, die fast nur nach unten strahlen, beispielsweise Wegbeleuchtung." },
        ],
      });

       // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
       elem41b.element.style.display = "none";
       // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
       elem41a.rules = [{
         values: ["Ja"], 
         elements: [elem41b]
       }]

       

      //42_schaechte
      page_baumassnahmen.addElement("radioButtonInput", "schaechte", {
        text: "42: Gibt es auf dem Untersuchungsgebiet Wasserschächte oder Lichtschächte, in denen Tiere gefangen bleiben?",
        placeholder: "Auswählen",
        points: "schaechte_points",
        options: [
          { key: "0", points: 2, label: "Nein oder nur sehr wenige." },
          { key: "1", points: 0, label: "Ja" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Wasserschächte und Lichtschächte können Fallen für Amphibien und andere Kleintiere sein. Denn diese Tiere kommen kaum selbständig wieder aus solchen Schächten heraus.
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H42_1_AbdeckungenGitter.jpg" alt="H42_1" width="100%">
          Abdeckungen mit feinmaschigem Gitter verhindern, dass Kleintiere in Lichtschächte fallen.
         
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H42_2_Ausstiegshilfen.jpg" alt="H42_2" width="100%">
          Ausstiegshilfen ermöglichen runtergefallenen Tieren, sich wieder aus dem Schacht zu befreien.
          </div>
           `,
          }
      });      

      this.app.addFinalPage("Ende");     
    }


    makeNewProject() {
      let page0 = this.app.addPage("Projekt Infos");

      let projektid = page0.addElement("simpleTextInput", "projectid", {
        text: "Projekt ID",
        placeholder: " PLZ_Nachname der Lehrperson",
      });

      let name = page0.addElement("simpleTextInput", "name", {
        text: "Ort",
        placeholder: "",
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      name.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      projektid.rules = [{
        values: [null], 
        elements: [name]
      }]
      

      let school = page0.addElement("simpleTextInput", "school", {
        text: "Schule",
        placeholder: "",
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      school.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      name.rules = [{
        values: [null], 
        elements: [school]
      }]

      let map = page0.addElement("mapInput", "gebiete", { 
        color: [255,0, 0],
        text: `Zeichne die Untersuchungsfläche ein:<br> <br> 

        1. Finde deinen Standort mit dem entsprechendem Button in der Karte. Unter Umständen muss dazu in der Systemeinstellung der Ortungsdienst für den verwendeten Browser aktiviert werden. <br>
        2. Klicke auf "Feature hinzufügen" um in den Zeichnungs-Modus zu wechseln. <br>
        3. Wechsle zur Karte im Vollbildmodus. <br>
        4. Untersuchungsfläche einzeichnen. Beim letzten eingezeichneten Punkt Doppelklick, um Fläche abzuschliessen. <br>
        5. Esc-Taste drücken, um zur Normalansicht zurückzukehren. <br>
        6. Klicke auf "Hinzufügen" um eingezeichnete Fläche hinzuzufügen. <br>

        ` 
      });
      projektid.map = map;
      name.map = map;
      school.map = map;

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      map.element.style.visibility = "hidden";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      school.rules = [{
        values: [null], 
        elements: [map]
      }]

      this.app.addFinalPage("Ende");

    }

    
    editProject() {
      let page0 = this.app.addPage("Projekt Infos");

     
      page0.addElement("mapInput", "gebiete", { 
        color: [255,0, 0],
        text: `Zeichne die Untersuchungsfläche ein:<br> <br> 

        1. Finde deinen Standort mit dem entsprechendem Button in der Karte. Unter Umständen muss dazu in der Systemeinstellung der Ortungsdienst für den verwendeten Browser aktiviert werden. <br>
        2. Klicke auf "Feature hinzufügen" um in den Zeichnungs-Modus zu wechseln. <br>
        3. Wechsle zur Karte im Vollbildmodus. <br>
        4. Untersuchungsfläche einzeichnen. Beim letzten eingezeichneten Punkt Doppelklick, um Fläche abzuschliessen. <br>
        5. Esc-Taste drücken, um zur Normalansicht zurückzukehren. <br>
        6. Fülle danach die ID, Ort und Name der Schule ein. Die ID sollte folgendem Format entsprechen: PLZ_Nachname der Lehrperson <br>
        7. Klicke auf "Hinzufügen" um eingezeichnete Fläche hinzuzufügen. <br>

        ` 
      });

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
      page0.addElement("radioButtonInput", "dropdownTest", {
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
