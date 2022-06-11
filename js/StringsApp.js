/*
--------------
StringsApp.js
--------------
Used to populate the webpage with the specific input elements. Trying to seperate the logic to make the site and the actual "data" for the app

*/
define([
  ], function () {
    return class StringsApp {
      constructor(language) {
        this.lang = language;
               
      }
      init () {
        return new Promise((resolve, reject) => {
            window.fetch("js/strings/strings.csv").then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                var this2 = this;
                reader.onload = function (e) {
                    const text = e.target.result;
                    this2.data = this2.csvToArray(text);
                    resolve()
                };
                reader.readAsText(blob);
            })
          })
      }

      csvToArray(str, delimiter = ",") {
        // slice from start of text to the first \n index
        // use split to create an array from string by delimiter
        const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        this.languages = [...headers]
        this.languages.shift();
        this.languages.pop()
        // slice from \n index + 1 to the end of the text
        // use split to create an array of each csv value row
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");

        
        // Map the rows
        // split values from each row into an array
        // use headers.reduce to create an object
        // object properties derived from headers:values
        // the object passed as an element of the array
        const arr = {}
        rows.forEach(function (row) {
            const values = row.split(delimiter);
            const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
            }, {});
            arr[el["id"]] = el;
        });

        // return the array
        return arr;
      }

      get(stringID) {
        if (Object.keys(this.data).includes(stringID)) {
          return this.data[stringID][this.lang]

        }
        else {
          alert("There is a missing string: " + stringID)
        }
      }

    }
});
  