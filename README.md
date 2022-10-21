# BioDivSchool

BioDivSchool Web App

Lehrpersonen: Lehrpersonen (LP) lautet https://dlaumer.github.io/BioDivSchool/?intern=true.
Schülerinnen und schüler, Öffentlichkeit: https://dlaumer.github.io/BioDivSchool

### Local installation

- Clone the repo
- Open the index.html file in a local server

### Development

- Clone the repo
- Open the files in you prefered file editor
- Change any of the code
- Open the index.html file in a local server and see the changes

### Code architecture

- content - Contains all the textual data (all strings) in the different languages in the form of csv tables
    - measures.csv - All the different measures depending on the answers given in the collection
    - strings.csv - General text data for the application
    - content.csv - The texts for the different questions for the collection

- css - Contains the style sheet
    - style.css - Contains all the css style definitions for the whole project

- img - Contains all the images used in the app

- js - Contains all the code and logical functionality
    - Start.js - Start page for all the sub-applications. Shows all the different projects and provides links to the subsequent applications. 
    - Login.js - Used as a starter screen to the following main app, used by the user to select project and group etc
    - App.js - Main code base for sub-applications like collection, consolidation, results and projects! Depending on the `mode` property the codepath is slightly different
    - Page.js - The app's main structure is based on pages and elements, an app can have several pages and a page can have several elements. One element corresponds to one entry in the database! (One input per element)
    - Element.js
    - Consolidation.js
    - Content.js
    - ArcGis.js
    - Links.js
    - StringsApp.js

- index.html - Holds the basic html, but most of the dom elements are created during runtime using dojo. 

