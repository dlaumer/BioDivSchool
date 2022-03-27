/*
--------------
ArcGis.js
--------------
Used for all functions which need the esri arcgis js api
*/
define([
  "esri/core/Accessor",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "esri/widgets/Locate",
  "esri/Graphic",
  "esri/geometry/geometryEngine",

  "biodivschool/Links",
  "esri/config",
  "dojo/dom-construct",

], function (
  Accessor,
  FeatureLayer,
  Map,
  MapView,
  Editor,
  Expand,
  Locate,
  Graphic,
  geometryEngine,
  Links,
  esriConfig,
  domCtr
) {
  return class ArcGis {
    constructor(content) {
      this.createUI();
      this.clickHandler();
      this.content = content;
      this.links = new Links();
    }

    createUI() {}

    clickHandler() {}

    // Here the ID of the table on AGO
    init(callback) {
      this.table = new FeatureLayer({
        portalItem: {
          id: this.links.dataLayerId,
        },
      });
      this.table.load()
      .then(() => { 
        callback();

       })
      .catch((error) => {
        console.log(error);
        alert("The connection to the database could not be established: " +  error.toString());
      });

      
        
    }


    initGeo(callback) {
      this.geometry = new FeatureLayer({
        portalItem: {
          id: this.links.geometryLayerId,
        },
      });
      this.geometry.load()
      .then(() => { 
        callback();
       })
      .catch((error) => {
        console.log(error);
        alert("The connection to the database could not be established: " +  error.toString());
      });
    }

    // function to add one row to the table
    checkData(projectId, groupId, callback) {
      var query = this.table.createQuery();
      query.where =  "projectid= '" + projectId + "' AND groupid= '" + groupId + "'";

      this.table.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback({newFeature: false, data: results.features[0], objectId: results.features[0].getObjectId()});
        } else {
          // Make a new entry
          const attributes = { "projectid": projectId, "groupid": groupId };

          const addFeature = new Graphic({
            geometry: null,
            attributes: attributes,
          });
          // Apply uploading the (almost) empty row
          const promise = this.table
            .applyEdits({
              addFeatures: [addFeature],
            })
            .then((editInfo) => {
              if (editInfo.addFeatureResults[0].objectId != -1) {
                callback({newFeature: true, data: editInfo.addFeatureResults[0], objectId: editInfo.addFeatureResults[0].objectId});

              }
              else {
                alert("loading not possible: " + editInfo.addFeatureResults[0].error.message)
                console.error(editInfo.addFeatureResults[0].error)
              }
            });
        }
      });
    }

    checkDataGroups(projectId, callback) {
      var query = this.table.createQuery();
      query.where =  "projectid= '" + projectId + "' AND groupid <> 'all'";

      this.table.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback(results.features);
        } else {
          alert("Es gibt keine Gruppen mit dieser ProjektID")
        }
      });
    }

    // function to read one row of the table
    readFeature(objectid, callback) {
      // Look for a specific onbjectid
      this.table
        .queryFeatures({
          objectIds: [objectid],
          outFields: ["*"],
          returnGeometry: false,
        })
        .then((results) => {
          if (results.features.length > 0) {
            editFeature = results.features[0];
            callback(editFeature); // returm the fatatures
          }
        });
    }

    // function to read all rows of the tables
    readFeatures() {
      return new Promise((resolve, reject) => {
        // Create empty query, means to take all rows!
        var query = this.table.createQuery();

        this.table.queryFeatures(query).then((results) => {
          if (results.features.length > 0) {
            resolve(results.features);
          }
        });
      });
    }

    // function to change one row in the table
    updateFeature(objectid, data) {

      return new Promise((resolve, reject) => {
        this.table
        .queryFeatures({
          objectIds: [objectid],
          outFields: ["*"],
          returnGeometry: false,
        })
        // then take re existing entry and edit it
        .then((results) => {
          if (results.features.length > 0) {
            let editFeature = results.features[0];
            for (const item in data) {
              editFeature.attributes[item] = data[item];
            }
            // finally, upload the new data to ArcGIS Online
            this.table
              .applyEdits({
                updateFeatures: [editFeature],
              })
              .then((value) => {
                resolve(value);
              })
              .catch((reason) => {
                reject(reason);
              });
          } else {
            reject("Object not found")
          }
        });
       
    })
      // Create empty query, means to take all rows!


      
    }

    calculateArea(objectIds) {

      return new Promise((resolve, reject) => {
        let totalArea = 0;
        var query = this.geometry.createQuery();
        query.where =  "objectid in (" + objectIds.substring(1,objectIds.length-1) + ")";
        
        this.geometry.queryFeatures(query).then((results) => {
          // If it already exists, load the existing values
          if (results.features.length > 0) {
              for (let i=0; i< results.features.length;i++) {
                  let geom = results.features[i].geometry;
                  totalArea += geometryEngine.geodesicArea(geom, "square-meters");
              }
          };
          resolve(totalArea);
         
        })
        .catch((error) => {
            alert(error.message);
            reject();
        });

      });
      
    }

    addMap(containerMap, containerEditor, createButton, element) {

      esriConfig.portalUrl = "https://swissparks.maps.arcgis.com/";
      let geometry = new FeatureLayer({
        portalItem: {
          id: this.links.geometryLayerId,
        },
        definitionExpression: "objectid = 0"
      });

      // TODO: Add Filter for group ID
      let map = new Map({
        basemap: "satellite",
      });

      map.add(geometry);

      let view = new MapView({
        map: map,
        container: containerMap,
      });

      const editor = new Editor({
        view: view,
        container: containerEditor
      });

      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
      });

      

      createButton.addEventListener("click", () => {
        createButton.innerHTML = "Creating...";
        createButton.style.pointerEvents = "none"
        editor.activeWorkflow.data.creationInfo.layer.applyEdits({addFeatures: editor.activeWorkflow.pendingFeatures}).then((editInfo) => {
          if (editInfo.addFeatureResults[0].objectId != -1) {
          let value = []
          for (let i=0;i<editInfo.addFeatureResults.length; i++) {
            value.push(editInfo.addFeatureResults[i].objectId)
          }
          let newValue = value;
          if (element.valueSet) {
            newValue = [...value, ...JSON.parse(element.value)];
          }
          element.setter(JSON.stringify(newValue));
          editor.activeWorkflow.reset();
          
          createButton.className = "btn1 btn_disabled"
        }
        else {
          alert("Saving not possible: " + editInfo.addFeatureResults[0].error.message)
          createButton.style.pointerEvents = ""
          console.error(editInfo.addFeatureResults[0].error)
        }
        createButton.innerHTML = "Create";
        });
      })

      
      editor.watch("activeWorkflow.numPendingFeatures", function(newValue, oldValue) {
        if (newValue != 0) {
          createButton.className = "btn1"
        }
        /*
        if (editor.activeWorkflow) {
          calculateArea();
        }
        */
      });
      

      // TODO also calculate exisiting areas!
      function calculateAreaPending() {
        let totalArea = 0
        for (let i = 0; i < editor.activeWorkflow.pendingFeatures.length; i++) {
          let geom = editor.activeWorkflow.pendingFeatures.getItemAt(i).geometry;
          totalArea += geometryEngine.geodesicArea(geom, "square-meters");
        }
        return totalArea
      }

      editor.viewModel.featureFormViewModel.on("value-change", () => {
        console.log("I'm here")
        // This should fire when I click "create"
      })


      editor.when(() => {
        let panel = document.getElementById(containerEditor).querySelector(".esri-editor__panel-content")
      })

      //view.ui.add(createButton, "bottom-right");
      view.when(() => {
        locate.when(() => {
          locate.locate();
          
        });
      });
      return geometry;

    }
  };
});
