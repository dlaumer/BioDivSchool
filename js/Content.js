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
    - points
    - stops
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

      this.app.addStartPage("BioDivSchool");
      /*Regionalität der Pflanzen*/
      let page_regionalitaet = this.app.addPage("Regionalität der Pflanzen");


      page_regionalitaet.addTextInfo({
        title: "Heimische Wildpflanzen (08, 09)",
        text: `Alle Arten einer Region bilden zusammen ein Nahrungsnetz.
        [Bild H01_1]
        Heimische Pflanzen sind die Grundlage von Nahrungsnetzen. Deshalb sollte es möglichst viele Flächen mit heimischen Wildpflanzen geben.
        `
      })

      //08_wild_geomoid
      page_regionalitaet.addElement("mapInput", "wild_geomoid", {
        text: `08: Auf welcher Fläche wachsen weitgehend nur heimische Wildpflanzen?
            Markiere solche Flächen in der gezeigten Untersuchungsfläche.
            Benutze dazu das Polygon-Werkzeug.`,
        area: "wild_geomarea",
        ratio: {
          key: "wild_geomarearatio",
          stops: [{points: "0", value: 0.25},{points:"2", value:0.5},{points: "4", value:0.75},{points: "6", value:1}]
        },
        points: "wild_points",
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
        textInfo: {
          linkText: "Zusatzinfos",
          text: `<div class="textInfoElements"><img src="../img/Fotos_Hilfestellungen/H08_1_heimische_Blumenstraeucher.jpg" alt="H08_1" width="100%">
          Zu heimischen Wildpflanzen gehören Blumen, Sträucher und Bäume, die natürlich hier wachsen.
          </div>
          <div class="textInfoElements">
          Nicht dazu gehören:
          <img src="../img/Fotos_Hilfestellungen/H08_2_Sportrasen.jpg" alt="H08_2" width="100%">
          Sportrasen und Wiesen mit Gras, das immer kürzer ist als 10 cm. Solche Flächen werden nicht zu Flächen mit heimischen Wildpflanzen gezählt.
          </div>
          `,
        }
      });  


      //09_arten
      page_regionalitaet.addElement("dropdownInput", "arten", {
        text: "09: Wie viele verschiedene Arten von Wildpflanzen wachsen auf der gesamten Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "arten_points",
        options: [
          { key: "0", points: 0, label: "weniger als 10 verschiedene Arten" },
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

  
      //10_neophyten
      page_regionalitaet.addElement("dropdownInput", "neophyten", {
        title: "Schädliche gebietsfremde Pflanzen (invasive Neophyten)  (10, 10a, 10b)",
        text: "10: Gibt es im Untersuchungsgebiet schädliche gebietsfremde Pflanzen?",
        placeholder: "Auswählen",
        points: "neophyten_points",
        options: [
          { key: "0", points: 2, label: "keine" },
          {
            key: "1", points: 0, label: "eine oder mehrere Arten von schädlichen gebietsfremden Pflanzen",
          },
          {
            key: "2", points: -2, label: "mehr als eine Art von schädlichen gebietsfremden Pflanzen",
          },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
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
      page_regionalitaet.addElement("dropdownInput", "neophytenmenge", {
        text: "10a: Wie gross ist die Fläche, die insgesamt durch alle schädlichen gebietsfremden Pflanzen bedeckt wird?",
        placeholder: "Auswählen",
        points: "neophytenmenge_points",
        options: [
          { key: "0", points: -1, label: "kleiner als ein Parkplatz für ein Auto " },
          { key: "1", points: -2, label: "grösser als ein Parkplatz für ein Auto " },
        ],
      });

      //10b_neophyten__geomoid - Liste und Points tbd
      page_regionalitaet.addElement("mapInput", "neophyten__geomoid", {
        text: `10b: Markiere alle Standorte mit schädlichen gebietsfremden Pflanzen.`,
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
          <img src="../img/Fotos_Hilfestellungen/H11_1_Asphalt.jpg" alt="H11_1" width="100%">
          </div>
          <div class= textInfoElements>
          Sportbelag
          <img src="../img/Fotos_Hilfestellungen/H11_2_Sportbelag.jpg" alt="H11_2 width="100%">
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
          stops: [{points:"4", value: 0.33},{points:"2", value: 0.5},{points:"1", value: 0.66},{points:"6", value:1}]
        },
        points: "versieg_points",
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Strukturelemente sind einzelne Teile eines Lebensraums wie beispielsweise:
          Bäume
          <img src="../img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          </div>
          <div class="textInfoElements">
          Sträucher
          <img src="../img/Fotos_Hilfestellungen/H11a_2_Straeucher.jpg" alt="H11a_2" width="100%">
          </div>
          <div class="textInfoElements">
          Blumenwiesen
          <img src="../img/Fotos_Hilfestellungen/H11a_3_Blumenwiese.jpg" alt="H11a_3" width="100%">
          </div>
          <div class="textInfoElements">
          Kiesflächen
          <img src="../img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">
          </div>
          <div class="textInfoElements">     
          Tümpel
          <img src="../img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>
          
          
          Verschiedene Strukturelemente bieten verschiedenen Lebewesen Lebensraum und Nahrung. Je mehr verschiedene Strukturelemente, desto mehr verschiedene Arten gibt es auf einer Fläche."
          `,
        }

      }); 

       //TEXTINFO
      /*
      Titel: Rasenflächen  (12)   
      */

      //12_rasen_geomoid
      page_strukturelemente.addElement("mapInput", "rasen_geomoid", {      
        text: `12: Markiere Flächen mit Rasen in der gezeigten Untersuchungsfläche.`,
        area: "rasen_area",
        ratio: {
          key: "rasen_area_ratio",
          stops: [{points:"2", value:0.25},{points:"1", value: 0.5},{points:"0", value:1}]
        },
        points: "rasen_points",
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `<div class="textInfoElements"><img src="../img/Fotos_Hilfestellungen/H08_2_Sportrasen.jpg" alt="H08_2" width="100%">
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
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Gemüsebeet
          <img src="../img/Fotos_Hilfestellungen/H13a_1_Gemuesebeet.jpg" alt="H13a_1" width="100%">
          </div>
          
          <div class="textInfoElements">
          Beet mit Wildblumen 
          <img src="../img/Fotos_Hilfestellungen/H13a_2_Gartenbeet.jpg" alt="H13a_2" width="100%">
          
          </div>        
         `,
        }
      }); 

      
      page_strukturelemente.addElement("dropdownInput", "wild_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "wild_points",
        options: [
          { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });

      //13b_trocken_geomoid
      page_strukturelemente.addElement("mapInput", "b_trocken_geomoid", {
        text: `13b: Markiere Flächen mit Trockenstandorten wie Kies, Sand, Ruderalflächen in der gezeigten Untersuchungsfläche.`,
        area: "trocken_area",
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          
          <div class="textInfoElements">
          Beispiele von Trockenstandorten:
          Kiesflächen, die nicht als Parkplatz genutzt werden
          <img src="../img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">  
          </div>
          
          <div class="textInfoElements">
          Sandflächen ohne Sprunggrube für Sport
          <img src="../img/Fotos_Hilfestellungen/H13b_2_Sandflaeche.jpg" alt="H13b_2" width="100%">
          </div>
          
          <div class="textInfoElements">
          Flächen mit Geröll
          <img src="../img/Fotos_Hilfestellungen/H13b_3_Geroell.jpg" alt="H13b_3" width="100%">
          </div>
          
         `,
        }
      }); 
      
      page_strukturelemente.addElement("dropdownInput", "trocken_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "trocken_points",
        options: [
          { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      }); 

      //13c_gras_geomoid
      page_strukturelemente.addElement("mapInput", "c_gras_geomoid", {
        text: `13c: Markiere in der gezeigten Untersuchungsfläche Flächen mit Wiesen dessen Gras mindestens einmal im Jahr höher als 10 cm ist.`,
        area: "c_gras_area",
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Blumenwiese
          <img src="../img/Fotos_Hilfestellungen/H11a_3_Blumenwiese.jpg" alt="H11a_3" width="100%">
          </div>
          `,
        }
      }); 

      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "c_gras_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "c_gras_points",
        options: [
          { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });

      //13d_hecken_geomoid
      page_strukturelemente.addElement("mapInput", "d_hecken_geomoid", {
        text: `13d: Markiere in der gezeigten Untersuchungsfläche Flächen mit Sträuchern und/oder Hecken mit weitgehend heimischen Pflanzen.`,
        area: "d_hecken_area",
           //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Gruppe von heimischen Sträuchern
          <img src="../img/Fotos_Hilfestellungen/H13d_1_GruppevonStraeuchern.jpg" alt="H13d_1" width="100%">
          </div>
          <div class="textInfoElements">
          Hecke mit heimischen Sträuchern
          <img src="../img/Fotos_Hilfestellungen/H13d_2_Hecke.jpg" alt="H13d_2" width="100%">
          </div>
          `,
        }
      }); 

      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "d_hecken_arearatio", {
        text: "",
        placeholder: "Auswählen",
        points: "d_hecken_points",
        options: [
          { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });

      //13e_baeume_geomoid
      page_strukturelemente.addElement("mapInput", "e_baeume_geomoid", {
        text: `13e: Markiere in der gezeigten Untersuchungsfläche Flächen mit Bäumen, Baumgruppen oder Wald mit weitgehend heimischen Pflanzen.`,
        area: "e_baeume_area",
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Heimische Bäume in deutlich unterschiedlichen Höhen
          <img src="../img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          </div>
          `,
        }
      }); 

      //Bemerkung: kann man dies nicht automatisieren (counts und ratio?)
      page_strukturelemente.addElement("dropdownInput", "e_baeume_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "e_baeume_points",
        options: [
          { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });
      
      
             
      //13f_wasser_geomoid
      page_strukturelemente.addElement("mapInput", "f_wasser_geomoid", {
        text: `13f: Markiere Wasserflächen in der gezeigten Untersuchungsfläche.`,
        area: "f_wasser_area",
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Tümpel
          <img src="../img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>
          <div class="textInfoElements">
          Kleines Bächlein
          <img src="../img/Fotos_Hilfestellungen/H13f_2_kleinesBaechlein.jpg" alt="H13f_2" width="100%">
          </div>
          `,
          }
      }); 
   
      page_strukturelemente.addElement("dropdownInput", "f_wasser_arearatio", {
        text: " ",
        placeholder: "Auswählen",
        points: "f_wasser_points",
        options: [
          { key: "0", points: 0, label: "weniger als 3 Strukturelemente vorhanden" },
          { key: "1", points: 1, label: "3-4 Strukturelemente, wovon eines der Strukturelemente mehr als die Hälfte der ganzen Untersuchungsfläche bedeckt" },
          { key: "2", points: 2, label: "3-4 Strukturelemente, keines der Strukturelemente bedeckt mehr als die Hälfte der ganzen Untersuchungsfläche" },
          { key: "3", points: 4, label: "5 Strukturelemente, wovon eines der Strukturelemente mehr als 40% der ganzen Untersuchungsfläche bedeckt" },
          { key: "4", points: 6, label: "5 Strukturelemente, keines der Strukturelemente bedeckt mehr als 40% der ganzen Untersuchungsfläche" },
          { key: "5", points: 7, label: "6 Strukturelemente, wovon eines der Strukturelemente mehr als 30% der ganzen Untersuchungsfläche bedeckt" },
          { key: "6", points: 8, label: "6 Strukturelemente, keines der Strukturelemente bedeckt mehr als 30% der ganzen Untersuchungsfläche" },
        ],
      });

      //TEXTINFO
      /*
      Titel: Baumschicht (14) 
      */

      //14_baeume
      page_strukturelemente.addElement("dropdownInput", "baeume", {      
        text: "14: Gibt es auf der Untersuchungsfläche Bäume?",
        placeholder: "Auswählen",
        points: "baeume_points",
        options: [
          { key: "0", points: 0, label: "Keine Bäume vorhanden, die höher als 4 - 5 Meter sind." },
          { key: "1", points: 1, label: "Keine Bäume vorhanden, die höher als 4 - 5 Meter sind." },
          { key: "2", points: 2, label: "Nur 1 Baum vorhanden oder alle Bäume etwa gleich hoch." },
          { key: "3", points: 3, label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und mit insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden, aber ohne mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },
          { key: "4", points: 4, label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und mit insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden und mit mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },
          { key: "5", points: 2, label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und ohne insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden und ohne mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },
          { key: "6", points: 3, label: "Bäume in deutlich unterschiedlichen Höhen vorhanden und ohne insgesamt mindestens 3 verschiedene heimische Baumarten vorhanden, aber mit mindestens zwei der Bäume mit einen Umfang von mehr als 2 Meter." },          
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Es zählen nur Bäume, die höher sind als drei erwachsene Menschen, die einander auf den Schultern stehen:
          Hoher Baum
          [Bild H14_1] Bild fehlt!
          
          Hohe Bäume bieten Nahrung und Unterschlupf für eine Vielzahl von Lebewesen.
          </div>
          <div class="textInfoElements">
          Heimische Bäume in deutlich unterschiedlichen Höhen
          <img src="../img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          heimische Bäume in deutlich unterschiedlichen Höhen
          </div>
          `,
          }       
      });

      //TEXTINFO
      /*
      Titel: Sträucher ohne Hecken (15) 
      */   

      //15_straeucher
      page_strukturelemente.addElement("dropdownInput", "straeucher", {
        text: "15: Gibt es auf der Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
        placeholder: "Auswählen",
        points: "straeucher_points",
        options: [
          { key: "0", points: 0, label: "Keine Sträucher oder nur vereinzelte Sträucher vorhanden." },
          { key: "1", points: 0, label: "Überwiegend nicht-heimische Sträucher vorhanden. " },
          { key: "2", points: 1, label: "1-3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." },
          { key: "3", points: 3, label: "1-3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch. Insgesamt mehr als 5 verschiedene heimische Straucharten." },
          { key: "4", points: 3, label: "Mehr als 3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch." },
          { key: "5", points: 5, label: "Mehr als 3 Gruppen aus mindestens 5 Sträuchern vorhanden. Die meisten dieser Sträucher sind heimisch. Insgesamt mehr als 5 verschiedene heimische Straucharten." },
        ],
           //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Vögel bauen ihre Nester gerne in Gruppierungen von heimischen Sträuchern. Auch kleine Säugetiere wie Mäuse, Schläfer oder Wiesel finden in Strauchgruppen Versteck und Nahrung.
          Gruppe von heimischen Sträuchern
          <img src="../img/Fotos_Hilfestellungen/H13d_1_GruppevonStraeuchern.jpg" alt="H13d_1" width="100%">
          
          </div>
          `,
          }
      });

      //TEXTINFO
      /*
      Titel: Hecken (16) 
      */ 

      //16_hecken
      page_strukturelemente.addElement("dropdownInput", "hecken", {
        text: "16: Gibt es auf der Untersuchungsfläche Gruppen aus mindestens 5 Sträuchern?",
        placeholder: "Auswählen",
        points: "hecken_points",
        options: [
          { key: "0", points: 0, label: "Keine Hecke vorhanden." },
          { key: "1", points: 0, label: "Hecken vorhanden. Die Hecken bestehen aber überwiegend aus nicht-heimische Sträuchern." },
          { key: "2", points: 1, label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch." },
          { key: "3", points: 1, label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "4", points: 2, label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "5", points: 2, label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "6", points: 3, label: "Eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind  insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "7", points: 3, label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch." },
          { key: "8", points: 3, label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "9", points: 4, label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Keine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "11", points: 4, label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind nicht insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
          { key: "11", points: 5, label: "Mehr als eine Hecke von mindestens 4 Meter Länge. Die meisten der Sträucher der Hecke sind heimisch. In der Hecke sind  insgesamt mehr als 5 verschiedene heimische Straucharten vorhanden. Eine Hecke ist mindestens 2 Meter breit und 10 Meter lang." },
        ],
           //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Hecke mit heimischen Sträuchern bieten Tieren nicht nur ein Versteck, sondern auch Nahrung: Necktar und Pollen für Insekten, Früchte für Vögel und kleine Säugetiere.
          Im Unterschied dazu bieten Hecken aus gebietsfremden Pflanzen kaum Nahrung.
          <img src="../img/Fotos_Hilfestellungen/H13d_2_Hecke.jpg" alt="H13d_2" width="100%">
          
          </div>
          <div class="textInfoElements">
          Hecke aus Kirschlorbeer, ein schädlicher gebietsfremder Strauch
          <img src="../img/Fotos_Hilfestellungen/H16_1_Kirschlorbeer.jpg" alt="H16_1" width="100%">
          
          </div>
          `,
          }
      });

       //TEXTINFO
      /*
      Titel: Vielfalt an einem Ort (17) 
      */ 

      //17_vielfalt
      page_strukturelemente.addElement("dropdownInput", "vielfalt", {
        text: "17: Sind Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser zusammen an einem Ort anzutreffen?",
        placeholder: "Auswählen",
        points: "vielfalt_points",
        options: [
          { key: "0", points: 0, label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser sind nirgends zusammen anzutreffen." },
          { key: "1", points: 1, label: "Zwei der drei Elemente (1. Bäume, 2. Sträucher und 3. heimische Kräuter, Blumen oder Gräser) kommen zusammen vor. Alle drei Elemente kommen jedoch nirgends alle zusammen vor." },
          { key: "2", points: 2, label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser kommen alle zusammen an einer Stelle vor." },
          { key: "3", points: 4, label: "Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser kommen alle zusammen an mehr als einer Stelle vor." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <div class="textInfoElements">
          Kommen unterschiedliche Elemente wie Bäume, Sträucher sowie Kräuter, Gräser und Blumen alle an der gleichen Stelle vor, so finden auch mehr Lebewesen
          einen Lebensraum mit Nahrung und Versteck. Deshalb ist es wichtig, dass Bäume, Sträucher und Kräuter an manchen Stellen zusammen vorkommen:
          Kräuter, Gräser und Blumen unter Bäumen
            <br>[Bild H17_1] Bild fehlt!<br>
            
            </div>
            <div class="textInfoElements">
            Krautsaum unter Sträuchern
            <br>[Bild H17_2] Bild fehlt!<br>
            
            </div>
            <div class="textInfoElements">
            Sträucher zusammen mit Bäumen
            <img src="../img/Fotos_Hilfestellungen/H17_3_StrauchschichtBaumschicht.jpg" alt="H17_3" width="100%">
            
            </div>
            <div class="textInfoElements">
            alle drei Elemente (Bäume, Sträucher und heimische Kräuter, Blumen oder Gräser) an derselben Stelle
            <br> [Bild H17_4] Bild fehlt!<br>
            </div>
          `,
          }
      });

      //TEXTINFO
      /*
      Titel: Ruderalflächen (18) 
      */ 

      //18_ruderal
      page_strukturelemente.addElement("dropdownInput", "ruderal", {
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
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Ruderalflächen sind offene Bodenflächen auf denen keine Pflanzen angepflanzt wurden. 
          Beispiele von Ruderalflächen:
          <img src="../img/Fotos_Hilfestellungen/H13b_3_Geroell.jpg" alt="H13b_3" width="100%">
          Flächen mit Geröll
          <br>[Bild H13b_1] Bild fehlt!<br>
          Kiesflächen, die nicht als Parkplatz genutzt werden
          <img src="../img/Fotos_Hilfestellungen/H13b_2_Sandflaeche.jpg" alt="H13b_2" width="100%">
          Sandflächen ohne Sprunggrube für Sport
          Ruderalflächen bieten ein Zuhause für ganz spezielle Pflanzen und Tiere.
          `,
          }*/ 
      });

      //TEXTINFO
      /*
      Titel: Trockenmauern, Steinhaufen (19) 
      */ 

      //19_mauern
      page_strukturelemente.addElement("dropdownInput", "mauern", {
        text: "19: Gibt es auf der Untersuchungsfläche Trockenmauern oder Steinhaufen?",
        placeholder: "Auswählen",
        points: "mauern_points",
        options: [
          { key: "0", points: 0, label: "Keine Trockenmauern oder Steinhaufen vorhanden." },
          { key: "1", points: 1, label: "1 Trockenmauer oder Steinhaufen vorhanden." },
          { key: "2", points: 2, label: "2 Trockenmauern oder Steinhaufen vorhanden." },
          { key: "3", points: 4, label: "Mehr als 2 Trockenmauern oder Steinhaufen vorhanden." },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Trockenmauern und Steinhaufen bieten ein sicheres Versteck für Frösche, Kröten, Eidechsen und Schlangen aber auch für Wiesel, Schläfer und Mausarten. Viele dieser Tiere überwitntern auch in Trockenmauern oder Steinhaufen.
          <img src="../img/Fotos_Hilfestellungen/H19_1_Steinhaufen.jpg" alt="H19_1" width="100%">
          Steinhaufen
          <img src="../img/Fotos_Hilfestellungen/H19_2_Trockenmauer.jpg" alt="H19_2" width="100%">
          Trockenmauer
          `,
          }*/ 
      });

       //TEXTINFO
      /*
      Titel: Asthaufen, Totholz (20) 
      */ 

      //20_totholz
      page_strukturelemente.addElement("dropdownInput", "totholz", {
        text: "20: Gibt es auf der Untersuchungsfläche Asthaufen, abgestorbene Bäume oder Totholz?",
        placeholder: "Auswählen",
        points: "totholz_points",
        options: [
          { key: "0", points: 0, label: "Keine Asthaufen, abgestorbene Bäume oder Totholz vorhanden." },
          { key: "1", points: 1, label: "1 Asthaufen, abgestorbener Baum oder Totholzelement vorhanden." },
          { key: "2", points: 2, label: "2 Asthaufen, abgestorbene Bäume oder Totholzelemente vorhanden." },
          { key: "3", points: 4, label: "Mehr als 2 Asthaufen, abgestorbene Bäume oder Totholzelemente vorhanden." },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Asthaufen bieten ein Versteck für Igel, Mäuse aber auch für Blindschleichen sowie Kröten, Frösche und Molche.
          <img src="../img/Fotos_Hilfestellungen/H20_1_Asthaufen.jpg" alt="H20_1" width="100%">
          Asthaufen<br>
          Totholz und abgestorbene Bäume sind der Lebensraum für zahlreiche Insekten, Pilze und Moose.
          <img src="../img/Fotos_Hilfestellungen/H20_2_Totholz.jpg" alt="H20_2" width="100%">
          Totholz
          `,
          }*/ 
      });

      //TEXTINFO
      /*
      Titel: Künstliche Nisthilfen (21, 22, 23) 
      */ 

      //21_insekten
      page_strukturelemente.addElement("dropdownInput", "insekten", {
        text: "21: Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für Insekten?",
        placeholder: "Auswählen",
        points: "insekten_points",
        options: [
          { key: "0", points: 0, label: "Keine künstliche Nisthilfen für Insekten vorhanden." },
          { key: "1", points: 1, label: "1-3 künstliche Nisthilfen für Insekten vorhanden." },
          { key: "2", points: 2, label: "Mehr als 3 künstliche Nisthilfen für Insekten vorhanden." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Insekten spielen eine ganz wichtige Rolle in Nahrungsnetzen:
          Insekten sind wichtig für die Bestäubung von vielen Pflanzen. Insekten sind auch Nahrung für viele Tiere.
          <img src="../img/Fotos_Hilfestellungen/H21_1_Insektenhotel.jpg" alt="H21_1" width="100%">[Bild ]
          Insektenhotel
          <img src="../img/Fotos_Hilfestellungen/H22_1_NistkastenHoehlenbrueter.jpg" alt="H21_2" width="100%">
          Lebensturm
          `,
          }*/ 
      });
  
      //22_voegel
      page_strukturelemente.addElement("dropdownInput", "voegel", {
        text: "22: Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für Vögel?",
        placeholder: "Auswählen",
        points: "voegel_points",
        options: [
          { key: "0", points: 0, label: "Keine künstliche Nisthilfen für Vögel vorhanden." },
          { key: "1", points: 1, label: "1-3 künstliche Nisthilfen für Vögel vorhanden." },
          { key: "2", points: 2, label: "Mehr als 3 künstliche Nisthilfen für Vögel vorhanden." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Viele Vögel finden keine guten Möglichkeiten, um ihr Nest zu bauen. Nistkästen können hier Abhilfe schaffen:
          <br>[Bild H22_1] Bild fehlt! <br>
          Nistkasten für Höhlenbrüter
          <img src="../img/Fotos_Hilfestellungen/H22_2_NisthilfeSchwalben.jpg" alt="H22_2" width="100%">
          Nisthilfe für Mehlschwalben
          `,
          }*/ 
      });

      //23_saeuger
      page_strukturelemente.addElement("dropdownInput", "saeuger", {
        text: "23: Gibt es auf der Untersuchungsfläche künstliche Nisthilfen für kleine Säugetiere?",
        placeholder: "Auswählen",
        points: "saeuger_points",
        options: [
          { key: "0", points: 0, label: "Keine künstliche Nisthilfen für kleine Säugetiere vorhanden." },
          { key: "1", points: 1, label: "1-3 künstliche Nisthilfen für kleine Säugetiere vorhanden." },
          { key: "2", points: 2, label: "Mehr als 3 künstliche Nisthilfen für kleine Säugetiere vorhanden." },
        ],
           //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Kleine Säugetiere wie Igel, Fledermäuse, Siebenschläfer und Mausarten brauchen Verstecke. Auch brauchen diese Tiere Plätze, wo sie ihre Jungen zur Welt bringen können.
          <img src="../img/Fotos_Hilfestellungen/H23_1_Fledermauskasten.jpg" alt="H08_2" width="100%">
          Fledermauskasten
          <br>[Bild H23_2] Bild fehlt! <br>
          Schlafplatz für Igel
          <br>[Bild H23_3] Bild fehlt! <br>
          Versteck für Siebenschläfer
          `,
          }*/ 
      });
     
      //TEXTINFO
      /*
      Titel: Gewässer und Feuchtflächen (24, 25, 26) 
      */ 

      //24_feuchtfl
      page_strukturelemente.addElement("dropdownInput", "feuchtfl", {
        text: "24: Gibt es Feuchtflächen auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "feuchtfl_points",
        options: [
          { key: "0",points: 0, label: "Keine Feuchtflächen vorhanden." },
          { key: "1",points: 2, label: "Feuchtflächen insgesamt etwa so gross wie ein Autoparkplatz." },
          { key: "2",points: 4, label: "Feuchtflächen insgesamt grösser als ein Autoparkplatz." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Feuchte Flächen bieten spezialisierten Tieren und Pflanzen ein Zuhause:
          <img src="../img/Fotos_Hilfestellungen/H24_1_Sumpfstreifen.jpg" alt="H24_1" width="100%">
          Sumpfstreifen
          <img src="../img/Fotos_Hilfestellungen/H24_2_Moorwiese.jpg" alt="H24_2" width="100%">
          Moorwiese
          `,
          }*/ 
      });

      //25_stehgew
      page_strukturelemente.addElement("dropdownInput", "stehgew", {
        text: "Gibt es stehende Gewässer auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "stehgew_points",
        options: [
          { key: "0", points: 0, label: "Keine stehenden Gewässer vorhanden." },
          { key: "1", points: 1, label: "Fläche mit stehenden Gewässern  insgesamt etwa so gross wie 1 Autoparkplatz." },
          { key: "2", points: 2, label: "Fläche mit stehenden Gewässern  insgesamt etwa so gross wie 2 Autoparkplätze." },
          { key: "4", points: 4, label: "Fläche mit stehenden Gewässern  insgesamt grösser als 2 Autoparkplätze." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Zahlreiche Lebewesen sind auf das Leben in Wasser spezialisiert.
          Bestimmte Insekten und Amphibien brauchen beispielsweise zur Fortpflanzung stehende Gewässer.
          <img src="../img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          Tümpel
          `,
          }*/ 
      });

      //26_fliessgew
      page_strukturelemente.addElement("dropdownInput", "fliessgew", {
        text: "Gibt es Fliessgewässer auf der Untersuchungsfläche?",
        placeholder: "Auswählen",
        points: "fliessgew_points",
        options: [
          { key: "0" ,points: 0, label: "Keine Fliessgewässer oder nur Fliessgewässer kürzer als 3 Meter vorhanden." },
          { key: "1" ,points: 6, label: "Ein oder mehrere Fliessgewässer von insgesamt mehr als 3 Meter Länge vorhanden." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Zahlreiche fliegende Insekten verbringen einen Teil ihrer Entwicklung in fliessenden Gewässer.
          <br>[Bild H26_1] Bild fehlt! <br>
          kleines Bächlein
          `,
          }*/ 
      });

       //TEXTINFO
      /*
      Titel: Umgebung (27) 
      */ 

      //27_umgebung
      page_strukturelemente.addElement("dropdownInput", "umgebung", {
        text: "27: Ist die Untersuchungsfläche umgeben von intensiver Landwirtschaft oder überbautem Gebiet?",
        placeholder: "Auswählen",
        points: "umgebung_points",
        options: [
          { key: "0",points: 0, label: "Die Untersuchungsfläche ist zu ungefähr drei Viertel oder mehr umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
          { key: "1",points: 1, label: "Die Untersuchungsfläche ist zu einem Viertel bis zu drei Viertel umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
          { key: "2",points: 4, label: "Die Untersuchungsfläche ist zu weniger als einem Viertel umgeben von intensiver Landwirtschaft oder überbautem Gebiet." },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Chemische Mittel der intensiven Landwirtschaft töten nicht nur so genannte Schädlinge, sondern auch sehr viele andere Lebewesen. Düngemittel sorgen zudem dafür, dass nur einige wenige Pflanzen sehr stark wachsen. Alle diese Mittel gelangen über die Luft und das Wasser auch in die Umgebung.
          Zahlreiche Lebewesen können in überbauten Gebieten nicht überleben.
          `,
          }*/ 
      });

      /*Pflege*/
      let page_pflege = this.app.addPage("Pflege");

      //TEXTINFO
      /*
      Titel: Mähen von Rasen und Wiesen OHNE Sportrasen (28, 29, 29a, 29b) 
      */ 

      //28_geraet
      page_pflege.addElement("dropdownInput", "geraet", {
        text: "Markiere, mit welchen Geräten der grössere Teil der Grasfläche (ohne Sportrasen) geschnitten wird.?",
        placeholder: "Auswählen",
        points: "geraet_points",
        options: [
          { key: "0", points: 0, label: "Rasentraktor, Ride-on Mäher, Rasenmäher, Fadenmäher oder Motorsense." },
          { key: "1", points: 3, label: "Sense oder Balkenmäher." },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          <img src="../img/Fotos_Hilfestellungen/H28_1_Rasentraktor.jpg" alt="H28_1" width="100%">
          Rasentraktor, Ride-on Mäher
          <img src="../img/Fotos_Hilfestellungen/H28_2_Rasenmaeher.jpg" alt="H28_2" width="100%">
          Rasenmäher
          <img src="../img/Fotos_Hilfestellungen/H28_3_Fadenmaeher.jpg" alt="H28_3" width="100%">
          Fadenmäher, Motorsense
          <img src="../img/Fotos_Hilfestellungen/H28_4_Sense.jpg" alt="H28_4" width="100%">
          Sense
          <img src="../img/Fotos_Hilfestellungen/H28_5_Balkenmaeher.jpg" alt="H28_5" width="100%">
          Balkenmäher
          `,
          }*/ 
      });

      //29_maehen // Achtung Mehrfachauswahl!
      let elem29 = page_pflege.addElement("dropdownInput", "maehen", {
        text: "Markiere alle Aussagen, die auf Mähen von Gras zutreffen:",
        placeholder: "Auswählen",
        points: "maehen_points",
        options: [
          { key: "0", points: -2, label: "Das Gras wird zwischen April und Oktober im Durchschnitt zweimal oder öfter pro Monat geschnitten." },
          { key: "1", points: 1, label: "Das Gras wird zwischen April und Oktober im Durchschnitt höchstens einmal pro Monat geschnitten." },
          { key: "2", points: 1, label: "Es wird jeweils nicht die ganze Grasfläche zum gleichen Zeitpunkt geschnitten. Verschiedene Grasflächen werden zu unterschiedlichen Zeitpunkten geschnitten." },
          { key: "3", points: 1, label: "Ein Teil der Grasfläche wird jedes Jahr gar nicht geschnitten. Das kann jedes Jahr ein anderer Teil sein." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Je weniger das Gras gemäht wird, desto besser können sich Pflanzen durch Samen fortpflanzen. Häufiges Mähen stört oder tötet zahlreiche Kleintiere wie Insekten und kleine Säugetiere.
          `,
          }*/ 
      });

      //"[Falls bei Frage 29 eine oder beide der Optionen “Gras wird zwischen April und Oktober … ge-schnitten» angekreuzt wurde, dann direkt weiter mit Frage 30.
      //Und sollte das Folgende unverhältnismässig aufwendig sein, dann einfach bei Frage 29 eine wei-tere Auswahl anhängen: Es gibt Grasflächen (grösser als zwei Autoparkplätze), die erst nach dem 15. Juni geschnitten werden [1 P.]
      //Sonst bitte Fragen 29a und 29b anzeigen.]"

      //29a_zone
      let elem29a = page_pflege.addElement("dropdownInput", "a_zone", {
        text: "29a: Bestimme, in welcher landwirtschaftlichen Zone sich die Untersuchungsfläche befindet.",
        placeholder: "Auswählen",
        points: "umgebung_points",
        options: [
          { key: "0", points: 0, label: "Talzone oder Hügelzone." },
          { key: "1", points: 0, label: "Bergzonen I oder II." },
          { key: "2", points: 0, label: "Bergzonen III oder IV." },
        ],
        textInfo: {
          linkText: "Karte zur Bestimmung der landwirtschaftlichen Zone",
          text: `Link oder iFrame?<br>
          <iframe src='https://map.geo.admin.ch/embed.html?topic=blw&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=887,947&layers=ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo.swissboundaries3d-kanton-flaeche.fill,ch.blw.landwirtschaftliche-zonengrenzen&layers_opacity=0.15,1,1,0.75&layers_visibility=false,false,false,true&E=2759000.00&N=1222000.00&zoom=1' width='100%' height='250' frameborder='0' style='border:0' allow='geolocation'></iframe>
           <br>tbd`,
      }
      });


      //29b_schnitt
      let elem29b = page_pflege.addElement("dropdownInput", "b_schnitt", {
        text: "29b: Trifft die folgende Aussage zu?",
        placeholder: "Auswählen",
        points: "b_schnitt_points",
        options: [
          { key: "0", points: 2, label: "Es gibt Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 15. Juni geschnitten werden." },
          { key: "1", points: 2, label: "Es gibt Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 1. Juli geschnitten werden." },
          { key: "2", points: 2, label: "Es gibt Grasflächen (grösser als vier Autoparkplätze), die erst nach dem 15. Juli geschnitten werden." },
        ],
        textInfo: {
          linkText: "Karte zur Bestimmung der landwirtschaftlichen Zone",
          text: `Link oder iFrame?<br>
          <iframe src='https://map.geo.admin.ch/embed.html?topic=blw&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=887,947&layers=ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo.swissboundaries3d-kanton-flaeche.fill,ch.blw.landwirtschaftliche-zonengrenzen&layers_opacity=0.15,1,1,0.75&layers_visibility=false,false,false,true&E=2759000.00&N=1222000.00&zoom=1' width='100%' height='250' frameborder='0' style='border:0' allow='geolocation'></iframe>
           <br>tbd`,
      }
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem29a.element.style.display = "none";
      elem29b.element.style.display = "none";
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem29.rules = [{
        values: [
          "Es wird jeweils nicht die ganze Grasfläche zum gleichen Zeitpunkt geschnitten. Verschiedene Grasflächen werden zu unterschiedlichen Zeitpunkten geschnitten.",
          "Ein Teil der Grasfläche wird jedes Jahr gar nicht geschnitten. Das kann jedes Jahr ein anderer Teil sein." ], 
        elements: [elem29a, elem29b]
      }]
      
      //TEXTINFO
      /*
      Titel: Schädlingsregulierung (30, 31) 
      */ 
      
      //30_pestizide
      page_pflege.addElement("sliderInput", "pestizide", {
        text: "30: Auf welcher Fläche werden chemische Pestizide  zur Schädlingsbekämpfung eingesetzt?<br>Stelle mit dem Regler ein, wie gross der Anteil dieser Fläche an der gesamten unbebauten Untersuchungsfläche ist:",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{points: "2", value: 5},{points:"1", value:66},{points:"0", value:100}],
        points: "pestizide_points",
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Chemische Pestizide sind Mittel, die oft nicht nur so genannte Schädlinge töten, sondern oft auch zahlreiche harmlose oder sogar nützliche Lebewesen. Oft bleiben Pestizide lange im Boden. Auch gelangen Pestizide mit Regenwasser in Gewässer.
          `,
          }*/
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
        stops: [{points:"2",value:5},{points:"1", value:75},{points:"0",value:100}],
        points: "bekaempfung_points",
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Ökologische Mittel bestehen aus Stoffen, die ähnlich so auch in der Natur vorkommen. Andere ökologische Mittel bekämpfen Schädlinge durch natürliche Gegenspieler. Beispielsweise gibt es Schlupfwespen, die gefrässige Raupen abtöten.
          `,
          }*/
      });
      //kaum ökologische Schädlingsbekämpfung <5%	3
      //5.1-50%	2
      //50.1-75%	1
      //ökologische Schädlingsbekämpfung auf der gesamten unbebauten Fläche >75%	0
      //points: "bekaempfung_points",

      //TEXTINFO
      /*
      Titel: Unkrautregulierung (32) 
      */

      //32_unkraut
      page_pflege.addElement("dropdownInput", "unkraut", {
        text: "32: Wie werden Unkräuter oder unerwünschte Pflanzen zur Hauptsache bekämpft?",
        placeholder: "Auswählen",
        points: "unkraut_points",
        options: [
          { key: "0", points: 0, label: "Chemische Mittel, so genannte Herbizide." },
          { key: "1", points: 1, label: "Abflammen oder mit Hitze erzeugenden Geräten." },
          { key: "2", points: 2, label: "Heisses Wasser, Dampf und / oder biologische Mittel und / oder mit Fadenmäher." },
          { key: "3", points: 4, label: "Handarbeit." },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Unerwünschte Pflanzen lassen sich ganz unterschiedlich bekämpfen:
          Chemische Herbizide schaden oft auch erwünschten Pflanzen. Solche Herbizide bleiben manchmal lange im Boden. Auch gelangen Herbizide mit Regenwasser in Gewässer.
          Abflammen und Hitze erzeugende Geräte schaden oft auch Lebewesen in den oberen Bodenschichten . 
          <br>[Bild H32_1] Bild fehlt!<br>
          Abflammen
          <br>[Bild H32_2] Bild fehlt! <br>
          Hitze erzeugende Geräte
          `,
          }*/
      });

       //TEXTINFO
      /*
      Titel: Düngen (33) 
      */

      //33_duengen
      page_pflege.addElement("dropdownInput", "duengen", {
        text: "33: Wie werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) gedüngt?",
        placeholder: "Auswählen",
        points: "duengen_points",
        options: [
          { key: "0",points: 0, label: "Die gesamten Flächen mit Rasen oder Wiesen ist kleiner als die Fläche für zwei Autoparkplätze." },
          { key: "1",points: 0, label: "Grasflächen werden ohne Analyse des Bodens gedüngt." },
          { key: "2",points: 1, label: "Alle Grasflächen (Rasen und Wiesen) werden erst gedüngt, wenn eine Analyse des Bodens Bedarf anzeigt." },
          { key: "3",points: 2, label: "Rasen werden erst gedüngt, wenn eine Analyse des Bodens Bedarf anzeigt. Wiesen, deren Gras höher als 10 cm wächst, werden nicht gedüngt." },
          { key: "4",points: 4, label: "Es wird nicht gedüngt, weder Rasen noch Wiesen." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          In Böden mit wenig Nährstoffen ist die Artenvielfalt erstaunlicher Weise viel höher als in nährstoffreichen Böden. Düngemittel sind nichts Anderes als Nährstoffe für Pflanzen. Deshalb fördern Düngemittel oft das Wachstum von nur einigen wenigen Pflanzenarten.
          `,
          }*/
      });

      //TEXTINFO
      /*
      Titel: Düngemittel (34) 
      */

      //34_mitteln
      page_pflege.addElement("dropdownInput", "mitteln", {
        text: "34: Mit welchen Mitteln werden Grasflächen (Wiesen, Rasen inklusive Sportrasen) zur Hauptsache gedüngt?",
        placeholder: "Auswählen",
        points: "mitteln_points",
        options: [
          { key: "0", points: 0, label: "Die gesamten Flächen mit Rasen oder Wiesen ist kleiner als die Fläche für zwei Autopark-plätze." },
          { key: "1", points: 0, label: "Mineralischer Dünger, Torf." },
          { key: "2", points: 1, label: "Organischer Dünger wie Jauche, Mist oder Mulch, Bio-Knospenprodukte." },
          { key: "3", points: 2, label: "Eigener Kompost." },
          { key: "4", points: 0, label: "Kein Dünger." },
        ],
           //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Mineralische Düngemittel helfen zwar den Pflanzen, vernachlässigen aber Bodenlebewesen. Auch kann Mineraldünger zu einem chemischen Ungleichgewicht von Nährstoffen im Boden führen. Überschüssiger Mineraldünger wird zudem mit dem Regenwasser in Gewässer geschwemmt. In Gewässer kann Mineraldünger zu übermässigem Algenwachstum führen.
          `,
          }*/
      });

      //TEXTINFO
      /*
      Titel: Laub (35) 
      */

      //35_laub
      page_pflege.addElement("dropdownInput", "laub", {
        text: "35: Was passiert im Herbst mit dem Laub?",
        placeholder: "Auswählen",
        points: "laub_points",
        options: [
          { key: "0", points: 0, label: "Sämtliches Laub wird eingesammelt und entsorgt." },
          { key: "1", points: 1, label: "Vereinzelt wird Laub bewusst belassen." },
          { key: "2", points: 2, label: "Es werden bewusst zahlreiche Laubhaufen erstellt." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Laub ist Nahrung für zahlreiche kleine Krabbeltiere aber auch für Pflanzen. Laub spielt deshalb eine wichtige Rolle im Kreislauf der Natur.
          Laubhaufen bieten zudem vielen Tieren Lebensraum, Versteck und Schutz vor Kälte. Tiere wie Igel, Blindschleichen, Frösche, kleine Mausarten usw. überwintern gerne in Laubhaufen.
          <br>[Bild H35_1] Bild fehlt! <br>
          Laubhaufen"
          `,
          }*/
        
      });

       //TEXTINFO
      /*
      Titel: Alte Samenstände (36) 
      */

      //36_samen
      page_pflege.addElement("dropdownInput", "samen", {
        text: "36: Was passiert im Herbst mit alten Samenständen von Gras, Blumen und Sträucher?",
        placeholder: "Auswählen",
        points: "samen_points",
        options: [
          { key: "0", points: 0, label: "Alle alten Samenstände werden eingesammelt und entsorgt." },
          { key: "1", points: 1, label: "Vereinzelt werden alte Samenstände bewusst belassen." },
          { key: "2", points: 2, label: "Die meisten Samenstände werden bewusst belassen." },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Alte Samenstände können Vögel als Nahrung dienen. Weiter nutzen viele nützlichen Insekten alte Pflanzenstengel zum Überwintern. Viele Insekten legen auch ihre Eier in alte Pflanzenstengel ab.
          <br>[Bild H36_1] Bild fehlt! <br>
          alte Samenstände
          `,
          }*/
      });

      /*Bauliche Massnahmen*/
       let page_baumassnahmen = this.app.addPage("Bauliche Massnahmen");

      //TEXTINFO
      /*
      Titel: Begrünung von Dach oder Fassaden (37, 38) 
      */

      //37_fldacher
      page_baumassnahmen.addElement("dropdownInput", "fldacher", {
        text: "37: Gibt es auf Flachdächern eine Begrünung?",
        placeholder: "Auswählen",
        points: "fldacher_points",
        options: [
          { key: "0", points: 0, label: "Keine oder kaum Dachbegrünung." },
          { key: "1", points: 1, label: "Ungefähr die Hälfte der Flachdächer ist begrünt und enthält auch Sandflächen und Totholz." },
          { key: "2", points: 2, label: "Mehr als die Hälfte der Flachdächer ist begrünt und enthält auch Sandflächen und Totholz." },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Flachdächer können ebenfalls eine Vieflat kleiner Lebensräume bieten: Niedrige Kräuter und Blumen können dort wachsen. Zahlreiche Krabbeltiere können in Kies- und Sandflächen oder kleinen Haufen von Totholz leben.
          <img src="../img/Fotos_Hilfestellungen/H37_1_Flachdach.jpg" alt="H37_1" width="100%">
          Begrüntes Flachdach mit Totholz
          `,
          }*/
      });

    
      //38_fassaden
      page_baumassnahmen.addElement("dropdownInput", "fassaden", {
        text: "38: Gibt es Fassaden mit einer Begrünung?",
        placeholder: "Auswählen",
        points: "fassaden_points",
        options: [
          { key: "0", points: 0, label: "Keine oder nur vereinzelt Fassadenbegrünung." },
          { key: "1", points: 1, label: "Fassaden von einer Fläche von insgesamt mindestens zwei Autoparkplätzen ist begrünt." },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Begrünte Fassaden bieten Lebensraum für Krabbeltiere und Vögel. Begrünte Fassaden schützen auch vor Kälte und Hitze.
          <img src="../img/Fotos_Hilfestellungen/H38 1 alte Samenstaende.jpg" alt="H38_1" width="100%">
          `,
          }*/
      });

       //TEXTINFO
      /*
      Titel: Kräuter- oder Gemüsegarten (39) 
      */
     
      //39_kraeuter
      page_baumassnahmen.addElement("dropdownInput", "kraeuter", {
        title: "",
        text: "Gibt es auf der Untersuchungsfläche einen biologisch bearbeiteten Kräuter- oder Gemüsegarten?",
        placeholder: "Auswählen",
        points: "kraeuter_points",
        options: [
          { key: "0",points: 0, label: "Nein" },
          { key: "1",points: 1, label: "Ja" },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Ein Kräuter- oder Gemüsegarten sorgt nur dann für mehr Artenvielfalt, wenn er biologisch bearbeitet wird. Bei Einsatz von chemischen Pestiziden, Herbiziden und Mineraldünger schadet dies der Artenvielfalt hingegen.
          `,
          }*/
      });

       //TEXTINFO
      /*
      Titel: Fallen für Tiere (40a, 40b, 41a, 41b, 42) 
      */
      
      //40a_glas
      page_baumassnahmen.addElement("dropdownInput", "a_glas", {
        title: "",
        text: "40a: Gibt es an den Gebäuden grosse Glasflächen?",
        placeholder: "Auswählen",
        points: "a_glas_points",
        options: [
          { key: "0",points: 2, label: "Nein" },
          { key: "1",points: 0, label: "Ja" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Grosse Glasflächen können tödlich für Vögel sein. 
          Aufgeklebte Umrisse von Vögel schützen leider nur wenig.
          <img src="../img/Fotos_Hilfestellungen/H40_1_Greifvogel_Umrisse.jpg" alt="H40_1" width="100%">
          unwirksame Greifvogel-Umrisse<br>
          Wirksamer hingegen sind Streifenmuster:
          <img src="../img/Fotos_Hilfestellungen/H40_2_Vogelschutzstreifen.jpg" alt="H40_2" width="100%">
          Glasfläche mit aufgeklebten Vogelschutzstreifen
           `,
          }*/
      });

      //40b_glasschutz
      page_baumassnahmen.addElement("dropdownInput", "b_glasschutz", {
        text: "40b: Wie werden die Vögel vor diesen Glasscheiben geschützt?",
        placeholder: "Auswählen",
        points: "b_glasschutz_points",
        options: [
          { key: "0",points: 0, label: "Glasflächen ohne Vogelschutz." },
          { key: "1",points: 0, label: "Glasflächen mit aufgeklebten Umrissen von Vögeln." },
          { key: "2",points: 2, label: "Glasflächen mit aufgeklebten Vogelschutzstreifen. (Birdstripes)" },
        ],
      });

      //41a_licht
      page_baumassnahmen.addElement("dropdownInput", "a_licht", {
        text: "41a: Gibt es auf dem Untersuchungsgebiet Lichtquellen, die jeden Tag bis spät in die Nacht leuchten?",
        placeholder: "Auswählen",
        points: "a_licht_points",
        options: [
          { key: "0",points: 2, label: "Nein" },
          { key: "1",points: 0, label: "Ja" },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Zahlreiche Lebewesen sind aktiv in der Nacht. Viele von diesen Lebewesen kreisen um künstliche Lichtquellen und sterben schliesslich. Lichtquellen sollten deshalb nicht nach oben abstrahlen:
          <br>[Bild H41_1] Bild fehlt! <br>
          Schädliche Ausrichtung von Lichtquellen
          Auch ist gelbliches bis warm-weisses Licht von LED-Lampen weniger schädlich, als bläuliches Licht.
          <br> [Bild H41_2] Bild fehlt! <br>
          Schädlichkeit verschiedener Lichtquellen
           `,
          }*/
      });

      //41b_lichtart
      page_baumassnahmen.addElement("dropdownInput", "b_lichtart", {
        text: "41: bWie leuchten diesen Lichtquellen?",
        placeholder: "Auswählen",
        points: "b_lichtart_points",
        options: [
          { key: "0",points: 0, label: "Einige Lichtquellen strahlen auch nach oben ab, beispielsweise zur Beleuchtung des Gebäudes." },
          { key: "1",points: 1, label: "Gelbliche Lichtquellen, die fast nur nach unten strahlen, beispielsweise Wegbeleuchtung." },
        ],
      });

      //42_schaechte
      page_baumassnahmen.addElement("dropdownInput", "schaechte", {
        text: "42: Gibt es auf dem Untersuchungsgebiet Wasserschächte oder Lichtschächte, in denen Tiere gefangen bleiben?",
        placeholder: "Auswählen",
        points: "schaechte_points",
        options: [
          { key: "0", points: 2, label: "Nein oder nur sehr wenige." },
          { key: "1", points: 0, label: "Ja" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          /*textInfo: {
          linkText: "Zusatzinfos",
          text: `
          Wasserschächte und Lichtschächte können Fallen für Amphibien und andere Kleintiere sein. Denn diese Tiere kommen kaum selbständig wieder aus solchen Schächten heraus.
          <img src="../img/Fotos_Hilfestellungen/H42_1_AbdeckungenGitter.jpg" alt="H42_1" width="100%">
          Abdeckungen mit feinmaschigem Gitter verhindern, dass Kleintiere in Lichtschächte fallen.
          <br>[Bild H42_2] Bild fehlt! <br>
          Ausstiegshilfen ermöglichen runtergefallenen
          Tieren, sich wieder aus dem Schacht zu befreien.
           `,
          }*/
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
