/*
--------------
StringsApp.js
--------------
 The code concerned with loading all the texts with different languages
*/
define([
  ], function () {
    return class StringsApp {
      constructor(language) {
        this.lang = language;
        this.data = {}
               
      }
      init (mode) {
        let promises = [];
        promises.push(new Promise((resolve, reject) => {
            window.fetch("content/strings.csv").then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                var this2 = this;
                reader.onload = function (e) {
                    const text = e.target.result;
                    this2.csvToArray(text);
                    resolve()
                };
                reader.readAsText(blob);
            })
          }))

          if (mode != "start") {
            promises.push(new Promise((resolve, reject) => {
              window.fetch("content/measures.csv").then(response => response.blob())
              .then(blob => {
                  const reader = new FileReader();
                  var this2 = this;
                  reader.onload = function (e) {
                      const text = e.target.result;
                      this2.csvToArray(text);
                      resolve()
                  };
                  reader.readAsText(blob);
              })
            }))

            promises.push(new Promise((resolve, reject) => {
              window.fetch("content/mainContent.csv").then(response => response.blob())
              .then(blob => {
                  const reader = new FileReader();
                  var this2 = this;
                  reader.onload = function (e) {
                      const text = e.target.result;
                      this2.csvToArray(text);
                      resolve()
                  };
                  reader.readAsText(blob);
              })
            }))
  
          }
          return promises
      }

      csvToArray(str, delimiter = ";") {
        var this2 = this;

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
        rows.forEach(function (row) {
            const values = row.split(delimiter);
            const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
            }, {});
            if (Object.keys(this2.data).includes(el["id"]) && el["id"] != "") {
              alert("The content has two identical IDs: " + el["id"])
            }
            else {
              this2.data[el["id"]] = el;
            }
        });

        // return the array
      }

      checkString(stringID) {
        if (Object.keys(this.data).includes(stringID)) {
          return true
        }
        else {
          return false
        }
      }

      get(stringID) {

        if (Object.keys(this.data).includes(stringID)) {
          let string = this.data[stringID][this.lang];
          if (string[0] == `"`) {string = string.substring(1)}
          if (string[string.length-1] == `"`) {string = string.substring(0,string.length - 1)}
          return string

        }
        else if (stringID == ""  || stringID == null) {
          return ""
        }
        else if (stringID.includes("textual")) {
          return stringID
        }
        else {
          alert("There is a missing string: " + stringID)
        }
      }

    }
});
  