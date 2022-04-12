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
  "esri/widgets/Fullscreen",

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
  Fullscreen,
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


    initProject(callback) {
      this.project = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },
      });
      this.project.load()
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
      query.where = groupId == null ? "projectid= '" + projectId + "'" : "projectid= '" + projectId + "' AND gruppe= '" + groupId + "'";
 

      this.table.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback({newFeature: false, data: results.features[0], objectId: results.features[0].getObjectId()});
        } else {
          // Make a new entry
          const attributes = groupId == null ? { "projectid": projectId } : { "projectid": projectId, "gruppe": groupId };

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
      query.where =  "projectid= '" + projectId + "' AND gruppe <> 'all'";

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
    readGeometry(objectIds, database) {

      let data = this.geometry
      if (database == "project") {
        data = this.project
      }

      return new Promise((resolve, reject) => {
        // Create empty query, means to take all rows!
        var query = data.createQuery();
        query.where =  "objectid in (" + objectIds.substring(1,objectIds.length-1) + ")";

        data.queryFeatures(query).then((results) => {
          if (results.features.length > 0) {
            resolve(results.features);
          }
        });
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

      let featureClass = this.table;
      if (that.mode == "project") {
        featureClass = this.project;
      }
      return new Promise((resolve, reject) => {
        featureClass
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
            featureClass
              .applyEdits({
                updateFeatures: [editFeature],
              })
              .then((value) => {
                // ToDo: Check for errors!
                if (value.updateFeatureResults.error == null) {
                  resolve(value);
                }
                else {
                  reject(value.updateFeatureResults.error)
                }
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
    // ToDo: Get projectId and not objectid!
    calculateArea(objectIds, database) {

      let data = this.geometry
      if (database == "project") {
        data = this.project
      }
     
      return new Promise((resolve, reject) => {
        let totalArea = 0;
        var query = data.createQuery();
        query.where =  "objectid in (" + objectIds.substring(1,objectIds.length-1) + ")";
        
        data.queryFeatures(query).then((results) => {
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

    addMap(containerMap, containerEditor, element) {

      esriConfig.portalUrl = "https://swissparks.maps.arcgis.com/";
      let geometry = new FeatureLayer({
        portalItem: {
          id: this.links.geometryLayerId,
        },
        definitionExpression: "objectid = 0"
      });

      let projectArea = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },
        definitionExpression: "objectid = " + that.projectAreaId.substring(1, that.projectAreaId.length-1),
        editingEnabled: false, 
        renderer:  {
          type: "simple",  // autocasts as new SimpleRenderer()
          symbol: { 
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 0, 0, 0.145] },  
        }
      });


      // TODO: Add Filter for group ID
      let map = new Map({
        basemap: "satellite",
      });
      map.add(projectArea);
      map.add(geometry);

      // ToDo: Zoom to layer, or to reference area?
      

      let view = new MapView({
        map: map,
        container: containerMap,
      });

      let fullscreen = new Fullscreen({
        view: view
      });
      view.ui.add(fullscreen, "bottom-right");

      if (containerEditor) {
        const editor = new Editor({
          view: view,
          container: containerEditor
        });

        editor.watch("activeWorkflow.numPendingFeatures", function(newValue, oldValue) {
        
          /*
          if (editor.activeWorkflow) {
            calculateArea();
          }
          */
        });
        
      }
     /*
      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
      });
      */

      


      


      // TODO also calculate exisiting areas!
      function calculateAreaPending() {
        let totalArea = 0
        for (let i = 0; i < editor.activeWorkflow.pendingFeatures.length; i++) {
          let geom = editor.activeWorkflow.pendingFeatures.getItemAt(i).geometry;
          totalArea += geometryEngine.geodesicArea(geom, "square-meters");
        }
        return totalArea
      }

      geometry.on("edits", function(editInfo) {
        console.log(editInfo);
        if (editInfo.addedFeatures.length > 0) {
          if (editInfo.addedFeatures[0].objectId != -1) {
            let value = []
            for (let i=0;i<editInfo.addedFeatures.length; i++) {
              value.push(editInfo.addedFeatures[i].objectId)
            }
            let newValue = value;
            if (element.valueSet) {
              newValue = [...value, ...JSON.parse(element.value)];
            }
            element.setter(JSON.stringify(newValue));          
          }
          else {
            alert("Saving not possible: " + editInfo.addedFeatures[0].error.message)
          }
        }

        if (editInfo.deletedFeatures.length > 0) {
          if (editInfo.deletedFeatures[0].objectId != -1) {
            let newValue = JSON.parse(element.value);
            for (let i=0;i<editInfo.deletedFeatures.length; i++) {
              newValue.pop(editInfo.deletedFeatures[i].objectId)
            }
            element.setter(JSON.stringify(newValue));          
          }
          else {
            alert("Saving not possible: " + editInfo.addedFeatures[0].error.message)
          }
        }
        
      })

      

      view.when(() => {
        if (!that.offline) {
          this.readGeometry(that.projectAreaId, "project").then((projectAreaFeature) => {
            view.goTo(projectAreaFeature[0].geometry)
  
          });
        }
        
        /*
        locate.when(() => {
          locate.locate();
          
        });
        */
      });
      return geometry;

    }
  };
});
