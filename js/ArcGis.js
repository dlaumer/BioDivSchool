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

  "biodivschool/Links",
  "esri/config",
], function (
  Accessor,
  FeatureLayer,
  Map,
  MapView,
  Editor,
  Expand,
  Locate,
  Graphic,
  Links,
  esriConfig
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
    init() {
      this.table = new FeatureLayer({
        portalItem: {
          id: this.links.dataLayerId,
        },
      });
      var that = this;
      that.table.load();
    }
    // function to add one row to the table
    addFeature(gruppenId, callback) {
      var query = this.table.createQuery();
      query.where = "gruppenId = " + gruppenId;

      this.table.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
            console.log(results)
          callback({newFeature: false, data: results.features[0], objectId: results.features[0].getObjectId()});
          //TODO: Fill in existing data!
        } else {
          // Make a new entry
          const attributes = { gruppenId: gruppenId };

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
              callback({newFeature: true, data: editInfo.addFeatureResults[0], objectId: editInfo.addFeatureResults[0].objectId});
            });
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
    updateFeature(objectid, data, callback) {
      // Create empty query, means to take all rows!

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
              editFeature.attributes[item] = data[item].value;
            }
            // finally, upload the new data to ArcGIS Online
            this.table
              .applyEdits({
                updateFeatures: [editFeature],
              })
              .then((value) => {
                callback(value);
              })
              .catch((reason) => {
                callback(reason);
              });
          } else {
          }
        });
    }

    addMap(container) {
      esriConfig.portalUrl = "https://swissparks.maps.arcgis.com/";
      let geometry = new FeatureLayer({
        portalItem: {
          id: this.links.geometryLayerId,
        },
      });

      // TODO: Add Filter for group ID
      let map = new Map({
        basemap: "satellite",
      });

      map.add(geometry);

      let view = new MapView({
        map: map,
        container: container,
      });

      const editor = new Editor({
        view: view,
      });

      view.ui.add(new Expand({ content: editor, view: view }), "top-right");

      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
      });
      view.ui.add(locate, "top-left");
      view.when(() => {
        locate.when(() => {
          locate.locate();
        });
      });
    }
  };
});
