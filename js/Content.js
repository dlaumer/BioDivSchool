/*
--------------
Content.js
--------------
 Seperation of code for functionality and content. Here all the inputs are defined and also the rules for points and the link to the database.
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
    constructor() {

      //group labels
      this.groups = [
        { key: "a", label: "groupA" },
        { key: "b", label: "groupB" },
        { key: "c", label: "groupC" },
        { key: "d", label: "groupD" },
        { key: "e", label: "groupE" },
        { key: "f", label: "groupF" },

      ]

      this.instructions = "instructionsProject"
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

    dropdownInput
    --------------
    - text
    - placeholder
    - points (optional)
    - options
        - key 
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
        - key 
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


    HTML code which can be in the csv:

    <br>
    <strong>
    <ul>
    <li>
    <a 
    */



     //01_page 
     app.addZeroPage("BioDivSchool");
      /*Regionalität der Pflanzen*/
      let page_regionalitaet = app.addChapter("P01.title", {
        pointsInfo: {long:[0, 10], short: [0,10]}
      });

      // 01_textinfo
      page_regionalitaet.addTextInfo({
        title: "T01.title",
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `<div class='textual'>T01.textInfo.text</div>
          <img src="img/Fotos_Hilfestellungen/H01_1.png" alt="H01_1" width="100%">
          `,
        } 
      })

      //08_wild_geomoid
      page_regionalitaet.addElement("mapInput", "wild_geomoid", {
        text: "E08.text",
        area: "wild_geomarea",
        measure: "A08.0",
        ratio: {
          key: "wild_geomarearatio",
          stops: [{ points: 0, value: 0.25, measure: "A08.1" }, { points: 2, value: 0.50, measure: "A08.2" }, { points: 4, value: 0.75, measure: "A08.3" }, { points: 6, value: 1, measure: "A08.4" }]
        },
        color: [74, 186, 27],
        name_display: "E08.nameDisplay",
        includeBuildings: true,
        points: "wild_points",
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `<div class="textInfoElements"><img src="img/Fotos_Hilfestellungen/H08_1_heimische_Blumenstraeucher.jpg" alt="H08_1" width="100%">
          <div class='textual'>E08.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class='textual'>E08.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H08_2_Sportrasen.jpg" alt="H08_2" width="100%">
          <div class="textual">E08.textInfo.text.3</div>
          </div>
          `,
        }
      });  


      //09_arten
      page_regionalitaet.addElement("radioButtonInput", "arten", {
        text: "E09.text",
        placeholder: "E.placeholder",
        points: "arten_points",
        measure: "A09.0",
        options: [
          { key: "0", points: 0, label: "E09.options.label.0", measure: "A09.1" },
          { key: "1", points: 1, label: "E09.options.label.1", measure: "A09.2" },
          { key: "2", points: 2, label: "E09.options.label.2", measure: "A09.3" },
          { key: "3", points: 4, label: "E09.options.label.3", measure: "A09.4" },
          { key: "4", points: 6, label: "E09.options.label.4", measure: "A09.5" },
        ],
        textInfo: {
            linkText: "E09.textInfo.linkText",
            text: `<div class="textual">E09.textInfo.text.1</div>
                <a target = "_blank", href = "https://identify.plantnet.org/de">identify.plantnet.org</a>
                <div class="textual">E09.textInfo.text.2</div>
                <br>
                <ul>
                <li><a target = "_blank" href = "https://floraincognita.com">Flora Incognita</a></li>
                <li><a target="_blank", href="https://plantnet.org/">PlantNet</a></li>
              </ul>`,
        }
      });

      //02_textInfo
      page_regionalitaet.addTextInfo({
        title: "T02.title",
      })

  
      //10_neophyten
      let elem10 = page_regionalitaet.addElement("radioButtonInput", "neophyten", {
        text: "E10.text",
        placeholder: "E.placeholder",
        points: "neophyten_points",
        measure: "A10.0",
        options: [
          { key: "0", points: 2, label: "E10.options.label.0",  measure: "A10.1" },
          { key: "1", points: 0, label: "E10.options.label.1", measure: "A10.2" },
          { key: "2", points: -2, label: "E10.options.label.2",  measure: "A10.2" },
        ],
        textInfo: {
            linkText: "T.textInfo.linkText",
            text: `<div class="textual">E10.textInfo.text.1</div>
            <br>
            <ul>
            <li><a target = "_blank" href = "https://www.neophyt.ch">neophyt.ch</a></li>
            <li><a target = "_blank" href = "http://www.neophyten-schweiz.ch/index.php?l=D&p=1&t=5">neophyten-schweiz.ch</a></li>
            </ul>
            <br>
            <div class="textual">E10.textInfo.text.2</div>
            <a href="./content/Praxishilfe_invasive_Neophyten_ANJF_20_ZH.pdf" target="_blank">Neophytenarten</a>`,
        }
      });


      //10a_neophytenmenge
      let elem10a = page_regionalitaet.addElement("radioButtonInput", "neophytenmenge", {
        text: "E10a.text",
        placeholder: "E.placeholder",
        points: "neophytenmenge_points",
        options: [
          { key: "0", points: -1, label: "E10a.options.label.0", measure: "A10.2" },
          { key: "1", points: -2, label: "E10a.options.label.1",  measure: "A10.2" },
        ],
      });

      //10b_neophyten__geomoid - Liste und Points tbd
      let elem10b = page_regionalitaet.addElement("mapInput", "neophyten__geomoid", {
        text: "E10b.text",
        placeholder: "E.placeholder",
        color: [147, 145, 98, 0.7],
        name_display: "E10b.nameDisplay",
        nameListTypes: "E10b.nameListTypes",
        version: ["long"],
        listTypes: [
          {name: "E10b.listTypes.1", color: "blue"},
          {name: "E10b.listTypes.2", color: "red"},
          {name: "E10b.listTypes.3", color: "blue"},
          {name: "E10b.listTypes.4", color: "orange"},
          {name: "E10b.listTypes.5", color: "green"},
          {name: "E10b.listTypes.6", color: "yellow"},
          {name: "E10b.listTypes.7", color: "brown"},
          {name: "E10b.listTypes.8", color: "black"},
          {name: "E10b.listTypes.9", color: "pink"},
          {name: "E10b.listTypes.10", color: "white"},
        ]
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem10a?.hide();
      elem10b?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem10.rules = [{
        values: [
          "E10.options.label.1",
          "E10.options.label.2"], 
        elements: [elem10a, elem10b]
      }]

      //02_page 
      /*Strukturelemente*/      
      let page_strukturelemente = app.addChapter("P02.title", {
      pointsInfo: {long:[8, 32], short:[8,24]}});

      //03_textInfo
      page_strukturelemente.addTextInfo({        
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">T03.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <br>
          </div>
          <div class="textInfoElements">
          <div class="textual">T03.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T03.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H11a_2_Straeucher.jpg" alt="H11a_2" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T03.textInfo.text.4</div>
          <img src="img/Fotos_Hilfestellungen/H11a_3_Blumenwiese.jpg" alt="H11a_3" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T03.textInfo.text.5</div>
          <img src="img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">
          </div>
          <div class="textInfoElements">     
          <div class="textual">T03.textInfo.text.6</div>
          <img src="img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>        
          <div class="textual">T03.textInfo.text.7</div>"
          `
        }
      })

      //04_textInfo
      page_strukturelemente.addTextInfo({
        title: "T04.title",
        text: "T04.text",

        textInfo: {
          linkText: "T04.textInfo.linkText",
          text:
          `
          <div class= textInfoElements>
          <div class="textual">T04.textInfo.text.1</div>
            <img src="img/Fotos_Hilfestellungen/H11_1_Asphalt.jpg" alt="H11_1" width="100%">
            </div>
            <div class= textInfoElements>
            <div class="textual">T04.textInfo.text.2</div>
            <img src="img/Fotos_Hilfestellungen/H11_2_Sportbelag.jpg" alt="H11_2 width="100%">
            </div>
            `
          }
      })
      

      //11_versieg_geomoid
      page_strukturelemente.addElement("mapInput", "versieg_geomoid", {
        text: "E11.text",
        area: "versieg_area",
        measure: "A11.0",
        ratio: {
          key: "versieg_arearatio",
          stops: [{ points: 4, value: 0.33, measure: "A11.3" }, { points: 2, value: 0.5, measure: "A11.2" }, { points: 1, value: 0.66, measure: "A11.1" }, { points: 6, value: 1, measure: "A11.1" }]
        },
        color: [64, 9, 105, 0.7],
        name_display: "E11.nameDisplay",
        points: "versieg_points",
      }); 

      //05_textInfo
      page_strukturelemente.addTextInfo({
        title: "T05.title",
      })

      //12_rasen_geomoid
      page_strukturelemente.addElement("mapInput", "rasen_geomoid", {      
        text: "E12.text",
        area: "rasen_area",
        measure: "A12.0",
        ratio: {
          key: "rasen_area_ratio",
          stops: [{ points: 2, value: 0.25, measure: "A12.3" }, { points: 1, value: 0.5, measure: "A12.2", }, { points: 0, value: 1, measure: "A12.1", }]
        },
        color: [46, 37, 72, 0.7],
        name_display: "E12.nameDisplay",
        includeBuildings: true,
        points: "rasen_points",
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H08_2_Sportrasen.jpg" alt="H08_2" width="100%">
          <div class="textual">E12.textInfo.text.1</div>"
          </div>
           `,
        }

      }); 

      //06_textInfo
      page_strukturelemente.addTextInfo({
        title: "T06.title",
        text: "T06.text",
        textInfo: {
          linkText: "T06.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H13a_1_Gemuesebeet.jpg" alt="H13a_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H13a_2_Gartenbeet.jpg" alt="H13a_2" width="100%">
          </div>  
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">  
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.4</div>
          <img src="img/Fotos_Hilfestellungen/H13b_2_Sandflaeche.jpg" alt="H13b_2" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.5</div>
          <img src="img/Fotos_Hilfestellungen/H13b_3_Geroell.jpg" alt="H13b_3" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.6</div>
          <img src="img/Fotos_Hilfestellungen/H11a_3_Blumenwiese.jpg" alt="H11a_3" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.7</div>
          <img src="img/Fotos_Hilfestellungen/H13d_1_GruppevonStraeuchern.jpg" alt="H13d_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.8</div>
          <img src="img/Fotos_Hilfestellungen/H13d_2_Hecke.jpg" alt="H13d_2" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.9</div>
          <img src="img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.10</div>
          <img src="img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">T06.textInfo.text.11</div>
          <img src="img/Fotos_Hilfestellungen/H13f_2_kleinesBaechlein.jpg" alt="H13f_2" width="100%">
          </div>
         `,
        },
        version: ["long"]
      })
      //13_flaechen_geomoid
      page_strukturelemente.addElement("mapInput", "flaechen_geomoid", {
        text: "E13a.text",
        area: "flaechen_area",
        points: "flaechen_points",
        measure: "A13.0",
        ratio: {
          key: "flaechen_arearatio",
          options: [
            { key: "0", points: 0, label: "E13a.options.label.0", measure: "A13.1" },
            { key: "1", points: 1, label: "E13a.options.label.1", measure: "A13.2" },
            { key: "2", points: 2, label: "E13a.options.label.2", measure: "A13.3" },
            { key: "3", points: 4, label: "E13a.options.label.3", measure: "A13.4" },
            { key: "4", points: 6, label: "E13a.options.label.4", measure: "A13.5" },
            { key: "5", points: 7, label: "E13a.options.label.5", measure: "A13.6" },
            { key: "6", points: 8, label: "E13a.options.label.6", measure: "A13.7" },
          ]
        },
        color: [129, 0, 157, 0.7],
        name_display : "E13a.nameDisplay",
        version: ["long"],
        name_display : "E13a.nameListTypes",
        listTypes: [
          {name: "E13a.listTypes.1", color: "brown"},
          {name: "E13a.listTypes.2", color: "red"},
          {name: "E13a.listTypes.3", color: "yellow"},
          {name: "E13a.listTypes.4", color: "orange"},
          {name: "E13a.listTypes.5", color: "green"},
          {name: "E13a.listTypes.6", color: "blue"},
        ],
        version: ["long"]
      }); 

      //07.textInfo
      page_strukturelemente.addTextInfo({
        title: "T07.title", 
      })
    
      //14_baeume
      let elem14 = page_strukturelemente.addElement("radioButtonInput", "baeume", {      
        text: "E14.text",
        placeholder: "E.placeholder",
        points: "baeume_points",
        measure: "A14.0",
        options: [
          { key: "0", points: 0, label: "E14.options.label.0", measure: "A14.1" },
          { key: "1", points: 1, label: "E14.options.label.1", measure: "A14.2" },
          { key: "2", points: 2, label: "E14.options.label.2", measure: "A14.3" },
          { key: "3", points: 3, label: "E14.options.label.3", measure: "A14.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E14.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H14_1_Baum.jpg" alt="H14_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E14.textInfo.text.2</div>
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H11a_1_Baeume.jpg" alt="H11a_1" width="100%">
          <div class="textual">E14.textInfo.text.3</div>
          </div>
          `,
          }       
      });

      //[Falls bei 14 eine der beiden Optionen mit mehr als einem Baum angekreuzt wird, dann Fragen 14a und 14b einblenden:] gelöst durch mehrere Schnittmengen

      //14a_baeume
      let elem14a = page_strukturelemente.addElement("radioButtonInput", "a_baeume", {
        text: "E14a.text",
        placeholder: "E.placeholder",
        points: "a_baeume_points",
        options: [
          { key: "0", points: 1, label: "E14a.options.label.0", measure: "A14.4" },
          { key: "1", points: 0, label: "E14a.options.label.1", measure: "A14.5" },
        ],
      });

       //14b_baeume
       let elem14b = page_strukturelemente.addElement("radioButtonInput", "b_baeume", {
        text: "E14b.text",
        placeholder: "E.placeholder",
        points: "b_baeume_points",
        options: [
          { key: "0", points: 2, label: "E14b.options.label.0", measure: "A14.6" },
          { key: "1", points: 0, label: "E14b.options.label.1", measure: "A14.7" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem14a?.hide();
      elem14b?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem14.rules = [{
        values: [
          "E14.options.label.2",
          "E14.options.label.3"], 
        elements: [elem14a, elem14b]
      }]

      //08_textInfo
      page_strukturelemente.addTextInfo({
        title: "T08.textInfo", 
      })
      
      //15_straeucher
      let elem15 = page_strukturelemente.addElement("radioButtonInput", "straeucher", {
        text: "E15.text",
        placeholder: "E.placeholder",
        points: "straeucher_points",
        measure: "A15.0",
        options: [
          { key: "0", points: 0, label: "E15.options.label.0", measure: "A15.1" },
          { key: "1", points: 0, label: "E15.options.label.1", measure: "A15.2" },
          { key: "2", points: 1, label: "E15.options.label.2", measure: "A15.3" },
          { key: "3", points: 3, label: "E15.options.label.3", measure: "A15.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E15.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H13d_1_GruppevonStraeuchern.jpg" alt="H13d_1" width="100%">
          </div>
          `,
          }
      });

      //[Falls bei 15 eine der beiden Optionen mit Gruppen von Sträuchern angekreuzt wird, dann Fragen 15a einblenden:]

       //15a_straeucher
       let elem15a = page_strukturelemente.addElement("radioButtonInput", "a_straeucher", {
        text: "E15a.text",
        placeholder: "E.placeholder",
        points: "a_straeucher_points",
        options: [
          { key: "0", points: 2, label: "E15a.options.label.0", measure: "A15.4" },
          { key: "1", points: 0, label: "E15a.options.label.1", measure: "A15.5" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem15a?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem15.rules = [{
        values: [
          "E15.options.label.2",
          "E15.options.label.3"], 
        elements: [elem15a]
      }]


      //09_textInfo
      page_strukturelemente.addTextInfo({
        title: "T09.title", 
      })       

      //16_hecken
      let elem16 = page_strukturelemente.addElement("radioButtonInput", "hecken", {
        text: "E16.text",
        placeholder: "E.placeholder",
        points: "hecken_points",
        measure: "A16.0",
        options: [
          { key: "0", points: 0, label: "E16.options.label.0", measure: "A16.1" },
          { key: "1", points: 0, label: "E16.options.label.1", measure: "A16.2" },
          { key: "2", points: 1, label: "E16.options.label.2", measure: "A16.3" },
          { key: "3", points: 3, label: "E16.options.label.3", measure: "A16.3" },
       ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E16.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H13d_2_Hecke.jpg" alt="H13d_2" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E16.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H16_1_Kirschlorbeer.jpg" alt="H16_1" width="100%">          
          </div>
          `,
          }
      });

      //[Falls bei 16 eine der beiden Optionen mit Hecken mit heimischen Sträuchern angekreuzt wird, dann Fragen 16a und 16b einblenden:]
      //16a_hecken
      let elem16a = page_strukturelemente.addElement("radioButtonInput", "a_hecken", {
        text: "E16a.text",
        placeholder: "E.placeholder",
        points: "a_hecken_points",
        options: [
          { key: "0", points: 2, label: "E16a.options.label.0", measure: "A16.4" },
          { key: "1", points: 0, label: "E16a.options.label.1", measure: "A16.5" },
        ],
      });

      //16b_hecken
      let elem16b = page_strukturelemente.addElement("radioButtonInput", "b_hecken", {
        text: "E16b.text",
        placeholder: "E.placeholder",
        points: "b_hecken_points",
        options: [
          { key: "0", points: 1, label: "E16b.options.label.0", measure: "A16.6" },
          { key: "1", points: 0, label: "E16b.options.label.1", measure: "A16.7" },
        ],
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem16a?.hide();
      elem16b?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem16.rules = [{
        values: [
          "E16.options.label.2",
          "E16.options.label.3"], 
        elements: [elem16a, elem16b]
      }]

      //10_textInfo
      page_strukturelemente.addTextInfo({
        title: "T10.title", 
        version: ["long"]
      })  

      //17_vielfalt
      page_strukturelemente.addElement("radioButtonInput", "vielfalt", {
        text: "E17.text",
        placeholder: "E.placeholder",
        points: "vielfalt_points",
        measure: "A17.0",
        options: [
          { key: "0", points: 0, label: "E17.options.label.0", measure: "A17.1" },
          { key: "1", points: 1, label: "E17.options.label.1", measure: "A17.2" },
          { key: "2", points: 2, label: "E17.options.label.2", measure: "A17.3" },
          { key: "3", points: 4, label: "E17.options.label.3", measure: "A17.4" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E17.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H17_1_KrautschichtBaumschicht.jpg" alt="H17_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E17.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H17_2_KrautschichtStrauchschicht.jpg" alt="H17_2" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E17.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H17_3_StrauchschichtBaumschicht.jpg" alt="H17_3" width="100%"> 
          </div>
          <div class="textInfoElements">
          <div class="textual">E17.textInfo.text.4</div>
          <img src="img/Fotos_Hilfestellungen/H17_4_alle3Schichten.jpg" alt="H17_4" width="100%"> 
          </div>
          `,
          },
          version: ["long"]
      });

      //11_textInfo
      page_strukturelemente.addTextInfo({
        title: "T11.title", 
      }) 

      //18_ruderal
      page_strukturelemente.addElement("radioButtonInput", "ruderal", {
        text: "E18.text",
        placeholder: "E.placeholder",
        points: "ruderal_points",
        measure: "A18.0",
        options: [
          { key: "0", points: 0, label: "E18.options.label.0", measure: "A18.1" },
          { key: "1", points: 0, label: "E18.options.label.1", measure: "A18.2" },
          { key: "2", points: 1, label: "E18.options.label.2", measure: "A18.3" },
          { key: "3", points: 2, label: "E18.options.label.3", measure: "A18.4" },
          { key: "4", points: 3, label: "E18.options.label.4", measure: "A18.5" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E18.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E18.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H13b_3_Geroell.jpg" alt="H13b_3" width="100%">
          </div>
          <div class="textInfoElements"> 
          <div class="textual">E18.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H11a_4_Kiesflaeche.jpg" alt="H11a_4" width="100%">      
          </div>        
          <div class="textInfoElements">
          <div class="textual">E18.textInfo.text.4</div>          
          <img src="img/Fotos_Hilfestellungen/H13b_2_Sandflaeche.jpg" alt="H13b_2" width="100%">
          <div class="textual">E18.textInfo.text.5</div>
          </div>
          `,
          } 
      });

      //12_textInfo
      page_strukturelemente.addTextInfo({
        title: "T12.title", 
      }) 

      //19_mauern
      page_strukturelemente.addElement("radioButtonInput", "mauern", {
        text: "E19.text",
        placeholder: "E.placeholder",
        points: "mauern_points",
        measure: "A19.0",
        options: [
          { key: "0", points: 0, label: "E19.options.label.0", measure: "A19.1" },
          { key: "1", points: 1, label: "E19.options.label.1", measure: "A19.2" },
          { key: "2", points: 2, label: "E19.options.label.2", measure: "A19.2" },
          { key: "3", points: 4, label: "E19.options.label.3", measure: "A19.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E19.textInfo.text.1</div>
          </div>
          <div class="textual">E19.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H19_1_Steinhaufen.jpg" alt="H19_1" width="100%">
          <div class="textInfoElements">
          <div class="textual">E19.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H19_2_Trockenmauer.jpg" alt="H19_2" width="100%">
          </div>
          `,
          } 
      });

      //13_textInfo
      page_strukturelemente.addTextInfo({
        title: "T13.title", 
      }) 

      //20_totholz
      page_strukturelemente.addElement("radioButtonInput", "totholz", {
        text: "E20.text",
        placeholder: "E.placeholder",
        points: "totholz_points",
        measure: "A20.0",
        options: [
          { key: "0", points: 0, label: "E20.options.label.0", measure: "A20.1" },
          { key: "1", points: 1, label: "E20.options.label.1", measure: "A20.2" },
          { key: "2", points: 2, label: "E20.options.label.2", measure: "A20.2" },
          { key: "3", points: 4, label: "E20.options.label.3", measure: "A20.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">          
          <div class="textual">E20.textInfo.text.1</div>         
          <img src="img/Fotos_Hilfestellungen/H20_1_Asthaufen.jpg" alt="H20_1" width="100%">
          <div class="textual">E20.textInfo.text.2</div>
          <br>
          <div class="textInfoElements">          
          <div class="textual">E20.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H20_2_Totholz.jpg" alt="H20_2" width="100%">
          <div class="textual">E20.textInfo.text.4</div>
          </div>
          `,
          }
      });

      //14_textInfo
      page_strukturelemente.addTextInfo({
        title: "T14.title", 
      }) 

      //21_insekten
      page_strukturelemente.addElement("radioButtonInput", "insekten", {
        text: "E21.text",
        placeholder: "E.placeholder",
        points: "insekten_points",
        measure: "A21.0", 
        options: [
          { key: "0", points: 0, label: "E21.options.label.0", measure: "A21.1" },
          { key: "1", points: 1, label: "E21.options.label.1", measure: "A21.2" },
          { key: "2", points: 2, label: "E21.options.label.2", measure: "A21.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E21.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E21.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H21_1_Insektenhotel.jpg" alt="H21_1" width="100%">         
          </div>
          <div class="textInfoElements">
          <div class="textual">E21.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H21_2_Lebensturm.jpg" alt="H21_2" width="100%">          
          </div>
          `,
          }
      });
  
      //22_voegel
      page_strukturelemente.addElement("radioButtonInput", "voegel", {
        text: "E22.text",
        placeholder: "E.placeholder",
        points: "voegel_points",
        measure: "A22.0", 
        options: [
          { key: "0", points: 0, label: "E22.options.label.0", measure: "A22.1" },
          { key: "1", points: 1, label: "E22.options.label.1", measure: "A22.2" },
          { key: "2", points: 2, label: "E22.options.label.2", measure: "A22.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E22.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E22.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H22_1_NistkastenHoehlenbrueter.jpg" alt="H22_1" width="100%">         
          </div>
          <div class="textInfoElements">
          <div class="textual">E22.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H22_2_NisthilfeSchwalben.jpg" alt="H22_2" width="100%">          
          </div>
          `,
          }
      });

      //23_saeuger
      page_strukturelemente.addElement("radioButtonInput", "saeuger", {
        text: "E23.text",
        placeholder: "E.placeholder",
        points: "saeuger_points",
        measure: "A23.0",
        options: [
          { key: "0", points: 0, label: "E23.options.label.0", measure: "A23.1" },
          { key: "1", points: 1, label: "E23.options.label.1", measure: "A23.2" },
          { key: "2", points: 2, label: "E23.options.label.2", measure: "A23.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E23.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E23.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H23_1_Fledermauskasten.jpg" alt="H08_2" width="100%">          
          </div>
          <div class="textInfoElements">
          <div class="textual">E23.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H23_2_SchlafplatzIgel.jpg" alt="H23_2" width="100%">          
          </div>
          <div class="textInfoElements">
          <div class="textual">E23.textInfo.text.4</div>
          <img src="img/Fotos_Hilfestellungen/H23_3_VersteckSiebenschlaefer.jpg" alt="H23_3" width="100%">          
          </div>
          `,
          }
      });
     
      //15_textInfo
      page_strukturelemente.addTextInfo({
        title: "T15.title", 
      }) 

      //24_feuchtfl
      page_strukturelemente.addElement("radioButtonInput", "feuchtfl", {
        text: "E24.text",
        placeholder: "E.placeholder",
        points: "feuchtfl_points",
        measure: "A24.0", 
        options: [
          { key: "0", points: 0, label: "E24.options.label.0", measure: "A24.1" },
          { key: "1", points: 2, label: "E24.options.label.1", measure: "A24.2"},
          { key: "2", points: 4, label: "E24.options.label.2", measure: "A24.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E24.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E24.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H24_1_Sumpfstreifen.jpg" alt="H24_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E24.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H24_2_Moorwiese.jpg" alt="H24_2" width="100%">
          </div>
          `,
          }
      });

      //25_stehgew
      page_strukturelemente.addElement("radioButtonInput", "stehgew", {
        text: "E25.text",
        placeholder: "E.placeholder",
        points: "stehgew_points",
        measure: "A25.0",
        options: [
          { key: "0", points: 0, label: "E25.options.label.0", measure: "A25.1" },
          { key: "1", points: 2, label: "E25.options.label.1", measure: "A25.2" },
          { key: "2", points: 4, label: "E25.options.label.2", measure: "A25.2" },
          { key: "4", points: 6, label: "E25.options.label.3", measure: "A25.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E25.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E25.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H11a_5_Tuempel.jpg" alt="H11a_5" width="100%">
          </div>
          `,
          }
      });

      //26_fliessgew
      page_strukturelemente.addElement("radioButtonInput", "fliessgew", {
        text: "E26.text",
        placeholder: "E.placeholder",
        points: "fliessgew_points",
        options: [
          { key: "0", points: 0, label: "E26.options.label.0", measure: "A26.1" },
          { key: "1", points: 6, label: "E26.options.label.1", measure: "A26.2" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E26.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E26.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H13f_2_kleinesBaechlein.jpg" alt="H13f_2" width="100%">       
          </div>
          `,
          }
      });

      //16_textInfo
      page_strukturelemente.addTextInfo({
        title: "T16.title", 
        version: ["long"]
      }) 

      //27_umgebung
      page_strukturelemente.addElement("radioButtonInput", "umgebung", {
        text: "E27.text",
        placeholder: "E.placeholder",
        points: "umgebung_points",
        measure: "A27.0",
        options: [
          { key: "0", points: 0, label: "E27.options.label.0", measure: "A27.1" },
          { key: "1", points: 1, label: "E27.options.label.1", measure: "A27.2" },
          { key: "2", points: 4, label: "E27.options.label.2", measure: "A27.3" },
        ],
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E27.textInfo.text.1</div>
          </div>
          `,
          },
          version: ["long"]
      });

      //03_page
      /*Pflege*/
      let page_pflege = app.addChapter("P03.title", {
      pointsInfo: {long:[2, 11], short:[2,10]}});

      //17_textInfo
      page_pflege.addTextInfo({
        title: "T17.title", 
      }) 

      
      page_pflege.addTextInfo({
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E28.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H28_1_Rasentraktor.jpg" alt="H28_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E28.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H28_2_Rasenmaeher.jpg" alt="H28_2" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E28.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H28_3_Fadenmaeher.jpg" alt="H28_3" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E28.textInfo.text.4</div>
          <img src="img/Fotos_Hilfestellungen/H28_4_Sense.jpg" alt="H28_4" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E28.textInfo.text.5</div>
          <img src="img/Fotos_Hilfestellungen/H28_5_Balkenmaeher.jpg" alt="H28_5" width="100%">          
          </div>
          `
        }
      }) 

      //28_geraet
      page_pflege.addElement("sliderInput", "geraet", {
        text: "E28.text",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{ points: 0, value: 20, measure: "A28.1" }, { points: 1, value: 50, measure: "A28.2" }, { points: 2, value: 80, measure: "A28.2" }, { points: 3, value: 100, measure: "A28.3" }],
        measure: "A28.0",
        points: "geraet_points",
      });
      //0 P.	< 20 %, 1 P.	21 – 50 %, 2 P.	51 % - 80 %, 3 P.	> 80% 

      //18_textInfo
      page_pflege.addTextInfo({
        textInfo: {
          linkText: "T18.textInfo.linkText",
          text: `
        <div class="textInfoElements">
        <div class="textual">T18.textInfo.text</div>
        </div>
        `
        }
      })

      //29a_maehen
      let elem29a = page_pflege.addElement("radioButtonInput", "a_maehen", {
        text: "E29a.text",
        placeholder: "E.placeholder",
        measure: "A29.0",
        points: "a_maehen_points",
        options: [
          { key: "0", points: 1, label: "E29a.options.label.0", measure: "A29a.1" },
          { key: "1", points: 0, label: "E29a.options.label.1", measure: "A29.P" },
        ],
      });

       //29b_maehen
       page_pflege.addElement("radioButtonInput", "b_maehen", {
        text: "E29b.text",
        placeholder: "E.placeholder",
        measure: "A29.0",
        points: "b_maehen_points",
        options: [
          { key: "0", points: 1, label: "E29b.options.label.0", measure: "A29b.1"  },
          { key: "1", points: -2, label: "E29b.options.label.1", measure: "A29.P"  },
        ],
      });

       //29c_maehen
       page_pflege.addElement("radioButtonInput", "c_maehen", {
        text: "E29c.text",
        placeholder: "E.placeholder",
        measure: "A29.0",
        points: "c_maehen_points",
        options: [
          { key: "1", points: 1, label: "E29c.options.label.0", measure: "A29c.1"  },
          { key: "0", points: 0, label: "E29c.options.label.1", measure: "A29.P"  },
        ],
        version: ["long"]
      });
    

      //29d_zone
      let elem29d = page_pflege.addElement("radioButtonInput", "d_zone", {
        text: "E29d.text",
        placeholder: "E.placeholder",
        options: [
          { key: "0", points: 0, label: "E29d.options.label.0" },
          { key: "1", points: 0, label: "E29d.options.label.1" },
          { key: "2", points: 0, label: "E29d.options.label.2" },
        ],
        textInfo: {
          linkText: "E29d.textInfo.linkText",
          text: `<div class="textual">E29.textInfo.text.1</div>
          <br>
          <div class="textInfoElements">
          <img src="https://api.geo.admin.ch/static/images/legends/ch.blw.landwirtschaftliche-zonengrenzen_de.png" alt="legend" width="100%">
          </div>
          <div class="textInfoElements">
          <iframe src='https://map.geo.admin.ch/embed.html?topic=blw&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&catalogNodes=887,947&layers=ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill,ch.swisstopo.swissboundaries3d-kanton-flaeche.fill,ch.blw.landwirtschaftliche-zonengrenzen&layers_opacity=0.15,1,1,0.75&layers_visibility=false,false,false,true&E=2759000.00&N=1222000.00&zoom=1' width='100%' height='250' frameborder='0' style='border:0' allow='geolocation'></iframe>
          </div>
          `,
        },
        version: ["long"]
      });

      //[Je nach gewählter Zone wird in 29e nur die entsprechende Frage zum Anklicken angezeigt:]

      //29etal
      let elem29etal = page_pflege.addElement("radioButtonInput", "e_tal_schnitt", {
        text: "E29etal.text",
        placeholder: "E.placeholder",
        points: "e_schnitt_points",
        measure: "A29.0",
        options: [
          { key: "0", points: 2, label: "E29etal.options.label.0", measure: "A29e.1"  },
          { key: "1", points: 0, label: "E29etal.options.label.1", measure: "A29.P"  },
        ],
        version: ["long"]
      });

       //29eberg1
       let elem29eberg1 = page_pflege.addElement("radioButtonInput", "e_berg1_schnitt", {
        text: "E29eberg1.text",
        placeholder: "E.placeholder",
        points: "e_schnitt_points",
        measure: "A29.0",
        options: [
          { key: "0", points: 2, label: "E29eberg1.options.label.0", measure: "A29e.1"  },
          { key: "1", points: 0, label: "E29eberg1.options.label.1", measure: "A29.P"  },
        ],
        version: ["long"]
      });

       //29eberg2
       let elem29eberg2 = page_pflege.addElement("radioButtonInput", "e_berg2_schnitt", {
        text: "E29eberg2.text",
        placeholder: "E.placeholder",
        measure: "A29.0",
        points: "e_schnitt_points",
        options: [
          { key: "0", points: 2, label: "E29eberg2.options.label.0", measure: "A29e.1"  },
          { key: "1", points: 0, label: "E29eberg2.options.label.1", measure: "A29.P"  },
        ],
        version: ["long"]
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem29etal?.hide();
      elem29eberg1?.hide();
      elem29eberg2?.hide();
      

      //@Dani: gell diese Regel ist nötig!?
      elem29d.rules = [{
        values: [
          "E29d.options.label.0",
        ],
        elements: [elem29etal]
      },
      {
        values: [
          "E29d.options.label.1",
        ],
        elements: [elem29eberg1]
      },
      {
        values: [
          "E29d.options.label.2",
        ],
        elements: [elem29eberg2]
      }]

      //19_textInfo
      page_pflege.addTextInfo({
        title: "T19.title", 
      }) 
      
      //30_pestizide
      page_pflege.addElement("sliderInput", "pestizide", {
        text: "E30.text",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{ points: 2, value: 5, measure: "A30.1" }, { points: 1, value: 66, measure: "A30.2" }, { points: 0, value: 100, measure: "A30.3" }],
        measure: "A30.0", 
        points: "pestizide_points",
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: "E30.textInfo.text.1",
          }
      });
      //Chemische Pestizide werden kaum eingesetzt. <5%	2
      //5.1-66%	1
      //Chemische Pestizide werden auf der gesamten unbebauten Fläche eingesetzt. >66%	0
      //points: "pestizide_points",

      //31_bekaempfung
      page_pflege.addElement("sliderInput", "bekaempfung", {
        text: "E31.text",
        min: 0,
        max: 100,
        step: 0.1,
        stops: [{ points: 3, value: 5, measure: "A31.1" }, { points: 2, value: 50, measure: "A31.2" }, { points: 1, value: 75, measure: "A31.3" }, { points: 0, value: 100, measure: "A31.3" }],
        measure: "A31.0",
        points: "bekaempfung_points",
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: "E31.textInfo.text.1",
          },
          version: ["long"]
      });
     
      //20_textInfo
      page_pflege.addTextInfo({
        title: "T20.title",       
      }) 

      //32a_unkraut
      let elem32a = page_pflege.addElement("radioButtonInput", "a_unkraut", {
        text: "E32a.text",
        placeholder: "E.placeholder",
        measure: "A32.0", 
        options: [
          { key: "0", points: 0, label: "E32a.options.label.0" }, // TODO: Add measure
          { key: "1", points: 4, label: "E32a.options.label.1", measure: "A32.1" },
        ],
        points: "a_unkraut_points",
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E32a.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E32a.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H32_1_Abflammen.jpg" alt="H32_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E32a.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H32_2_HitzeGeraete.jpg" alt="H32_2" width="100%">
          </div>
          `
        },
      });

       //32b_unkraut
       let elem32b = page_pflege.addElement("radioButtonInput", "b_unkraut", {
        text: "E32b.text",
        placeholder: "E.placeholder",
        measure: "A32.0", 
        options: [
          { key: "0", points: 0, label: "E32b.options.label.0", measure: "A32.2" },
          { key: "1", points: 1, label: "E32b.options.label.1", measure: "A32.3" },
          { key: "2", points: 2, label: "E32b.options.label.2", measure: "A32.4" },
        ],
        points: "b_unkraut_points",
        version: ["long"]
      });
      
      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem32b?.hide();
      
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem32a.rules = [{
        values: [
          "E32a.options.label.0",
          ], 
        elements: [elem32b]
      }]     
     

      //T21_title
      page_pflege.addTextInfo({
        title: "T21.title",          
      }) 

      //33_duengen
      let elem33 = page_pflege.addElement("radioButtonInput", "duengen", {
        text: "E33duengen.text",
        placeholder: "E.placeholder",
        measure: "A33.0",     
        options: [
          { key: "0",points: 0, label: "E33duengen.options.label.0" },
          { key: "1",points: 0, label: "E33duengen.options.label.1", measure: "A33.0"},      
        ],          
      });

      //Falls Ja, dann Items 33_grasduengen und 34er, Falls Nein, dann weiter mit Item 35 (Laub) 


      //33_grasduengen
      let elem33gras = page_pflege.addElement("radioButtonInput", "grasduengen", {
        text: "E33gras.text",
        placeholder: "E.placeholder",
        measure: "A33.0",    
        options: [
          { key: "0",points: 0, label: "E33gras.options.label.0" },
          { key: "1",points: 4, label: "E33gras.options.label.1", measure: "A33.1" },      
        ],
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E33gras.textInfo.text.1</div>
          </div>
          `
        },       
      });

      //Falls Ja, dann Items und 33a_duengen und 34, Falls Nein, dann weiter mit Item 35 (Laub)

      
      //33a_duengen
      let elem33a = page_pflege.addElement("radioButtonInput", "a_duengen", {
        text: "E33a.text",
        placeholder: "E.placeholder",
        measure: "A33.0",   
        options: [
          { key: "0", points: 0, label: "E33a.options.label.0", measure: "A33.2" },
          { key: "1", points: 1, label: "E33a.options.label.1", measure: "A33.3" },      
        ],
        points: "a_duengen_points", 
        version: ["long"]    
      });    
  


      //34_mitteln
      let elem34 = page_pflege.addElement("radioButtonInput", "mitteln", {
        text: "E34.text",
        placeholder: "E.placeholder",
        measure: "A34.0", 
        options: [
          { key: "0", points: 0, label: "E34.options.label.0", measure: "A34.1" },
          { key: "1", points: 1, label: "E34.options.label.1", measure: "A34.2" },  
          { key: "2", points: 2, label: "E34.options.label.2", measure: "A34.3" },      
        ],
        points: "mitteln_points",
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: "E34.textInfo.text.1",
          },
          version: ["long"]
      });

    

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem33gras?.hide();
      elem33a?.hide();    
      elem34?.hide();

      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem33.rules = [{
        values: [
          "E33duengen.options.label.0",
          ], 
        elements: [elem33gras, elem34]
      }] 
      elem33gras.rules = [{
        values: [
          "E33gras.options.label.0",
          ], 
        elements: [elem33a, elem34]
      }] 

      //22_textinfo
      page_pflege.addTextInfo({
        title: "T22.title", 
      }) 
      
      //35_laub
      page_pflege.addElement("radioButtonInput", "laub", {
        text: "E35.text",
        placeholder: "E.placeholder",
        points: "laub_points",
        measure: "A35.0",
        options: [
          { key: "0", points: 0, label: "E35.options.label.0", measure: "A35.1" },
          { key: "1", points: 1, label: "E35.options.label.1", measure: "A35.2" },
          { key: "2", points: 2, label: "E35.options.label.2", measure: "A35.3" },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E35.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E35.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H35_1 Laubhaufen.jpg" alt="H35_1" width="100%">
          </div>
          `,
          }
        
      });

      //23_textInfo
      page_pflege.addTextInfo({
        title: "T23.title", 
      }) 

      //36_samen
      page_pflege.addElement("radioButtonInput", "samen", {
        text: "E36.text",
        placeholder: "E.placeholder",
        points: "samen_points",
        measure: "A36.0",
        options: [
          { key: "0", points: 0, label: "E36.options.label.0", measure: "A36.1" },
          { key: "1", points: 1, label: "E36.options.label.1", measure: "A36.2" },
          { key: "2", points: 2, label: "E36.options.label.2", measure: "A36.3" },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E36.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E36.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H36_1 alte Samenstaende.jpg" alt="H36_1" width="100%">          
          </div>
          `,
          }
      });

      //04_page (-> P04
      /*Bauliche Massnahmen*/
       let page_baumassnahmen = app.addChapter("P04.title", {
       pointsInfo: {long:[0, 2], short:[0,2]}});

       //24_textInfo
      page_baumassnahmen.addTextInfo({
        title: "T24.title", 
      }) 

      //37_fldacher
      page_baumassnahmen.addElement("radioButtonInput", "fldacher", {
        text: "E37.text",
        placeholder: "E.placeholder",
        points: "fldacher_points",
        measure: "A37.0",
        options: [
          { key: "0", points: 0, label: "E37.options.label.0", measure: "A37.1" },
          { key: "1", points: 0, label: "E37.options.label.1", measure: "A37.1" },
          { key: "2", points: 1, label: "E37.options.label.2", measure: "A37.2" },
          { key: "3", points: 1, label: "E37.options.label.3", measure: "A37.3" },
          { key: "4", points: 2, label: "E37.options.label.4", measure: "A37.4" },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E37.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <div class="textual">E37.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H37_1_Flachdach.jpg" alt="H37_1" width="100%">          
          </div>
          `,
          }
      });

    
      //38_fassaden
      page_baumassnahmen.addElement("radioButtonInput", "fassaden", {
        text: "E38.text",
        placeholder: "E.placeholder",
        points: "fassaden_points",
        measure: "A38.0",
        options: [
          { key: "0", points: 0, label: "E38.options.label.0", measure: "A38.1" },
          { key: "1", points: 1, label: "E38.options.label.1", measure: "A38.2" },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: "E38.textInfo.text.1",
          }
      });

      //25_textInfo
      page_baumassnahmen.addTextInfo({
        title: "T25.title", 
      }) 
     
      //39_kraeuter
      page_baumassnahmen.addElement("radioButtonInput", "kraeuter", {
        title: "",
        text: "E39.text",
        placeholder: "E.placeholder",
        points: "kraeuter_points",
        measure: "A39.0",
        options: [
          { key: "0", points: 0, label: "E39.options.label.0", measure: "A39.1" },
          { key: "1", points: 1, label: "E39.options.label.1", measure: "A39.2" },
        ],
          //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: "E39.textInfo.text.1",
          }
      });

      //26_textInfo
      page_baumassnahmen.addTextInfo({
        title: "T26.title", 
      }) 
      
      //40a_glas
      let elem40a = page_baumassnahmen.addElement("radioButtonInput", "a_glas", {
        title: "",
        text: "E40a.text",
        placeholder: "E.placeholder",
        points: "a_glas_points",
        measure: "A40.0",
        options: [
          { key: "0", points: 2, label: "E40a.options.label.0", measure: "A40.1" },
          { key: "1", points: 0, label: "E40a.options.label.1", measure: "null" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E40a.textInfo.text.1</div>
          <br>
          <img src="img/Fotos_Hilfestellungen/H40_1_Greifvogel_Umrisse.jpg" alt="H40_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E40a.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H40_2_Vogelschutzstreifen.jpg" alt="H40_2" width="100%">
          <div class="textual">E40a.textInfo.text.3</div>
          </div>
           `,
          }
      });

      //Item 40b sollte nur eingeblendet werden, wenn zuvor Item 40a mit Ja beantwortet wurde.

      //40b_glasschutz
      let elem40b = page_baumassnahmen.addElement("radioButtonInput", "b_glasschutz", {
        text: "E40b.text",
        placeholder: "E.placeholder",
        points: "b_glasschutz_points",
        measure: "A40.0",
        options: [
          { key: "0", points: 0, label: "E40b.options.label.0", measure: "A40.2" },
          { key: "1", points: 0, label: "E40b.options.label.1", measure: "A40.2" },
          { key: "2", points: 1, label: "E40b.options.label.2", measure: "A40.3" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
         textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E40b.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H40_1_Greifvogel_Umrisse.jpg" alt="H40_1" width="100%">
          </div>
          <div class="textInfoElements">
          <div class="textual">E40b.textInfo.text.2</div>
          <img src="img/Fotos_Hilfestellungen/H40_2_Vogelschutzstreifen.jpg" alt="H40_2" width="100%">
          <div class="textual">E40b.textInfo.text.3</div>
          </div>
           `,
          }
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      elem40b?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      elem40a.rules = [{
        values: ["E40a.options.label.1"], 
        elements: [elem40b]
      }]

   
      //41a_licht
      let elem41a = page_baumassnahmen.addElement("radioButtonInput", "a_licht", {
        text: "E41a.text",
        placeholder: "E.placeholder",
        points: "a_licht_points",
        measure: "A41.0",
        options: [
          { key: "0", points: 2, label: "E41a.options.label.0", measure: "A41.1" },
          { key: "1", points: 0, label: "E41a.options.label.1", measure: "null" },
        ],
        //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E41a.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H41_1.png" alt="H41_1" width="100%">
          <div class="textual">E41a.textInfo.text.2</div>
          </div> 
          <div class="textInfoElements">                   
          <div class="textual">E41a.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H41_2.png" alt="H41_2" width="100%">
          <div class="textual">E41a.textInfo.text.4</div>
          </div>
           `,
          }
      });

      //Item 41b sollte nur eingeblendet werden, wenn zuvor Item 41a mit Ja beantwortet wurde.

      //41b_lichtart
      let elem41b = page_baumassnahmen.addElement("radioButtonInput", "b_lichtart", {
        text: "E41b.text",
        placeholder: "E.placeholder",
        points: "b_lichtart_points",
        measure: "A41.0",
        options: [
          { key: "0", points: 0, label: "E41b.options.label.0", measure: "A41.2" },
          { key: "1", points: 1, label: "E41b.options.label.1", measure: "A41.3" },
        ],
        textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E41b.textInfo.text.1</div>
          <img src="img/Fotos_Hilfestellungen/H41_1.png" alt="H41_1" width="100%">
          <div class="textual">E41b.textInfo.text.2</div>
          </div> 
          <div class="textInfoElements">                   
          <div class="textual">E41b.textInfo.text.3</div>
          <img src="img/Fotos_Hilfestellungen/H41_2.png" alt="H41_2" width="100%">
          <div class="textual">E41b.textInfo.text.4</div>
          </div>
           `,
        },
        version: ["long"]
      });

       // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
       elem41b?.hide();
       // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
       elem41a.rules = [{
         values: ["E41a.options.label.1"], 
         elements: [elem41b]
       }]

       

      //42_schaechte
      page_baumassnahmen.addElement("radioButtonInput", "schaechte", {
        text: "E42.text",
        placeholder: "E.placeholder",
        points: "schaechte_points",
        measure: "A42.0",
        options: [
          { key: "0", points: 2, label: "E42.options.label.0", measure: "A42.1" },
          { key: "1", points: 0, label: "E42.options.label.1", measure: "A42.2" },
        ],
         //bitte noch Hilfestellung/Zusatzinfos hinzufügen
          textInfo: {
          linkText: "T.textInfo.linkText",
          text: `
          <div class="textInfoElements">
          <div class="textual">E42.textInfo.text.1</div>
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H42_1_AbdeckungenGitter.jpg" alt="H42_1" width="100%">
          <div class="textual">E42.textInfo.text.2</div>
          </div>
          <div class="textInfoElements">
          <img src="img/Fotos_Hilfestellungen/H42_2_Ausstiegshilfen.jpg" alt="H42_2" width="100%">
          <div class="textual">E42.textInfo.text.3</div>
          </div>
           `,
          }
      });      

      //app.addFinalPage("E42.finaPage");     
    }

    //05_page
  
    makeNewProject() {
      let page0 = app.addChapter("P05.title");

      let projektid = page0.addElement("simpleTextInput", "projectid", {
        text: "P05.project.text.1",
        placeholder: "P05.project.placeholder",
      });

      let name = page0.addElement("simpleTextInput", "name", {
        text: "P05.project.text.2",
        placeholder: "null",
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      name?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      projektid.rules = [{
        values: [null], 
        elements: [name]
      }]
      
      //P05.school
      let school = page0.addElement("simpleTextInput", "school", {
        text: "P05.school.text",
        placeholder: "null",
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      school?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      name.rules = [{
        values: [null], 
        elements: [school]
      }]

      //P05.gebaeude
      let buildings = page0.addElement("mapInput", "gebaeude_geomoid", { 
        color: [0, 0, 255, 0.5],
        name_display: "P05.gebaeude.nameDisplay",
        text: "P05.gebaeude.text" 
      });

      // Antwort-abhängige display: Zuerst die Elemente ausblenden welche nur bedingt eingeblendet sind
      buildings?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      school.rules = [{
        values: [null], 
        elements: [buildings]
      }]

      //P05.gebiete
      let map = page0.addElement("mapInput", "gebiete", { 
        color: [255, 0, 0, 0.7],
        name_display: "P05.gebiete.nameDisplay",
        text: "P05.gebiete.text" 
      });
      projektid.map = map;
      name.map = map;
      school.map = map;
      buildings.map = map;

      // IMPORTANT: Don't use hide here, because it used display: none and this does not make the map load
      map?.hide();
      // Dann eine Regel erstellen. Wenn die Values ausgewaehlt sind, dann die folgenden Elemente aus oder einblenden:
      buildings.rules = [{
        values: [null], 
        elements: [map]
      }]

      //app.addFinalPage("P05.finalPage");

    }

    //P06
    editProject() {
      let page0 = app.addChapter("P06.page");

      page0.addTextInfo({
        title: "P06.title.1",
      })
     
      page0.addTextInfo({
        title: "P06.title.2",
      })

      //P05.gebaeude
      let buildings = page0.addElement("mapInput", "gebaeude_geomoid", { 
        color: [0, 0, 255, 0.5],
        name_display: "P06.gebaeude.nameDisplay",
        text: "P06.gebaeude.text" 
      });

      let map = page0.addElement("mapInput", "gebiete", { 
        color: [255, 0, 0, 0.7],
        name_display: "P06.nameDisplay",
        text: "P06.text"
      });

      buildings.map = map;


      //app.addFinalPage("P06.finalPage");

    }

    //not used
    makeContent2() {
      let page0 = app.addChapter("P00.1.addPage");
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

      let page1 = app.addChapter("Slider Test");

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

      let page2 = app.addChapter("Page 2");
      page2.addElement("mapInput", "gebiete", { text: "Zeichne die Gebiete" });

      let page3 = app.addChapter("Page 3");
      let page4 = app.addFinalPage("Ende");
    }
  };
});
