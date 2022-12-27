# BioDivSchool

BioDivSchool Web App

Lehrpersonen: Lehrpersonen (LP) lautet https://dlaumer.github.io/BioDivSchool/?admin=true.
Schülerinnen und schüler, Öffentlichkeit: https://dlaumer.github.io/BioDivSchool

## Local installation

- Clone the repo
- Open the index.html file in a local server

## Development

- Clone the repo
- Open the files in you prefered file editor
- Change any of the code
- Open the index.html file in a local server and see the changes

## General infos about the app
The goal of this app is to provide a platform to collect and process data about biodiversity on swiss schools.

The workflow is the following: First the teacher can create a new project, where he defines the name and draws the area of the project. 
Then the data is collected by the students in different groups. All groups collect the same data. Afterwards, the teacher can look at the different results in the consolidation mode and decide on a final solution. Finally the results are presented in a results view where the user gets points for each answer and is presented with measures for future improvements. 
#### Start page
This is the landing page for all other functionalities. It serves as either a presentation of the results to the public as well as a link to all the other functionalities like collection, consolidation, results and projects.

It consists of a list of projects on the left and a map on the right. When you choose a project, the map zooms to that location and the available options/links for this project appear on the bottom. The avaibality of the options depends on the logged in user and if the internal version of the page is loaded. 

It has a login button on top right, which promts you to login to your ArcGIS Online account. If this login is successful, the list changes and seperates between the users projects and the other ones. 

The internal page is loaded if `admin=true` is set in the url parameters. The only difference that then, the button to add a new project is visible. Also if you choose one of your projects, you can edit/delete this project. 

#### Project
This is used to add/edit/delete a project. When adding, the UI is a bit different then when in edit/delete mode. When adding, the user is first prompted with a few text inputs and then the map is loaded to draw the project area. WIn edit and delete mode. the map is directly loaded.
The project app functions similarly to the collection app, with the difference that the edits are not saved when giving an input, only finishing drawing the project area. The reason for that is that the entry in the database can only exist once the geometry exists and since the drawing happens as a final step nothing can be saved before hand. 
#### Collection
This is the core app of the whole project. It handles the input of all the data by the different groups. There are several pages with each several elements. Each element represents one input in the database (except calculated inputs like area or points).

There are many different forms of inputs, like textual, date, dropdown, radio button, slider or map. Each input consists of a label posing the question and the actual input. It is also possible to add additional infos in a collapsable field. Between elements there can be simple text infos which are not connected to an input. 

As soon as an input is made, the value is stored to the database on ArcGIS Online. The database consists of a large table, the columns represent the different elements and the rows represent one user/one group of students. 

#### Consolidation
After all students finished the data collection, the teacher compares the different results and decides for a final result. This is done in the consolidation app. On the right it offers the exact same view as the collection, but on the left it additionally shows the results of all the groups. There are two modes to see this results, either all next to each other or in the form of statistical diagramss, showing the amount of how often each result was selected by the users. 

When making a change in this consolidation app, the results are uploaded as a new user with group-name `all` which then represents the final result.
#### Results
The final result is then presented in the results app. It has the same format as the collection, but the input cannot be edited anymore and additionally a measure is presented for each element which gives suggestions and advice to improve biodiversity in the future. Also there are points for each result which give an indication of how well it is for the biodiversity. 

The starting page also has some additional elements: For each page the total number of points is calculated and compared to the maximum possible number of points. This is then shown in a graph which also classifies the number of points by how well the biodiverity is in this topic. The classes are represented in red, yellow and green. 
On the bottom of the start page there is also an overview map which combines all the map inputs and colors each layer with a different color. There is also a legend which help to differentiate the colors and match then to the inputs. 

## Code architecture

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
    - App.js - Main code base for sub-applications like collection, consolidation, results and projects! Depending on the `mode` property the codepath is slightly different. But since all sub-applications are so similar it makes sense to share most of the code.
    - Page.js - The app's main structure is based on pages and elements, an app can have several pages and a page can have several elements. One element corresponds to one entry in the database! (One input per element)
    - Element.js - One element is responsible to the input collection for one (!) entry in the database, one key-value pair. There are many different types of input:
        - simpleTextInput
        - dateInput
        - dropdownInput
        - radioButtonInput
        - sliderInput
        - mapInput
        - textInfo (special case without connected database entry, just info)
    - Consolidation.js - A special version of page.js. It is used as a wrapper for the page during the consolidation mode since there is a page for every page then. 
    - Content.js - Seperation of code for functionality and content. Here all the inputs are defined and also the rules for points and the link to the database.
    - ArcGis.js - All the code connected with the ArcGIS JS API. This is mainly the connection to the database and everything which has to do with maps.
    - StringsApp.js - The code concerned with loading all the texts with different languages

- index.html - Holds the basic html, but most of the dom elements are created during runtime using dojo. 

