/*
--------------
ArcGis.js
--------------
Used for all functions which need the esri arcgis js api
*/
define([
  "esri/portal/Portal",
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager",
  "esri/core/Accessor",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "esri/widgets/Locate",
  "esri/widgets/Home",
  "esri/Viewpoint",
  "esri/Graphic",
  "esri/geometry/geometryEngine",
  "esri/widgets/Fullscreen",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",

  "biodivschool/Links",
  "esri/config",
  "dojo/dom-construct",
], function (
  Portal, 
  OAuthInfo,
  esriId,
  Accessor,
  FeatureLayer,
  Map,
  MapView,
  BasemapToggle,
  Editor,
  Expand,
  Locate,
  Home,
  Viewpoint,
  Graphic,
  geometryEngine,
  Fullscreen,
  Legend, 
  LayerList,
  Links,
  esriConfig,
  domCtr
) {
  return class ArcGis {
    constructor(strings) {

      this.strings = strings;
      esriConfig.portalUrl = "https://swissparks.maps.arcgis.com/";

      this.signedIn = false;
      this.info = new OAuthInfo({
        appId: "1HVYw8T7xd77rBjt",
        popup: false // the default
      });

      esriId.registerOAuthInfos([this.info]);

      esriId
      .checkSignInStatus(this.info.portalUrl + "/sharing")
      .then(() => {
        this.handleSignedIn();
      })
      .catch(() => {
        this.handleSignedOut();
      })

      this.createUI();
      this.clickHandler();
      this.links = new Links();
    }

    handleSignInOut() {
      if (this.signedIn) {
        esriId.destroyCredentials();
        window.location.reload();
      }
      else {
        esriId.getCredential(this.info.portalUrl + "/sharing");
      }
    }

    handleSignedIn() {
      const portal = new Portal();
      portal.load().then(() => {
        window.history.pushState({ path: window.location.href.substr(0, window.location.href.indexOf('#')) }, '', window.location.href.substr(0, window.location.href.indexOf('#')));
        if ( document.getElementById("login")) {
          document.getElementById("login").innerHTML = this.strings.get("logoutEsri");
          document.getElementById("userNameEsri").innerHTML = portal.user.username;
          start.userNameEsri = portal.user.username;
        }
        else {
          that.userNameEsri = portal.user.username;
        }
        this.signedIn = true;
      });
    }

    handleSignedOut() {
      this.signedIn = false;
      if ( document.getElementById("login")) {
        document.getElementById("login").innerText = this.strings.get("loginEsri");
        start.userNameEsri = null;
      }
      else {
        that.userNameEsri = null;
      }
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
      this.table
        .load()
        .then(() => {
          callback();
        })
        .catch((error) => {
          console.log(error);
          alert(
            "The connection to the database could not be established: " +
              error.toString()
          );
        });
    }

    initGeo(callback) {
      this.geometry = new FeatureLayer({
        portalItem: {
          id: this.links.geometryLayerId,
        },
      });
      this.geometry
        .load()
        .then(() => {
          callback();
        })
        .catch((error) => {
          console.log(error);
          alert(
            "The connection to the database could not be established: " +
              error.toString()
          );
        });
    }

    initProject(callback) {
      this.project = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },
      });
      this.project
        .load()
        .then(() => {
          callback();
        })
        .catch((error) => {
          console.log(error);
          alert(
            "The connection to the database could not be established: " +
              error.toString()
          );
        });
    }

    // function to add one row to the table
    checkData(projectId, groupId, callback) {
      let featureClass = this.table;
      if (that.mode == "project") {
        featureClass = this.project;
      }

      var query = featureClass.createQuery();
      query.where =
        groupId == null
          ? "projectid= '" + projectId + "'"
          : "projectid= '" + projectId + "' AND gruppe= '" + groupId + "'";

      featureClass.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback({
            newFeature: false,
            data: results.features[0],
            objectId: results.features[0].getObjectId(),
          });
        } else {
          // Make a new entry
          // In the case of project mode, just say that there is none yet

          if (that.mode == "project") {
            callback(null);
          } else {
            const attributes =
              groupId == null
                ? { projectid: projectId }
                : { projectid: projectId, gruppe: groupId };

            const addFeature = new Graphic({
              geometry: null,
              attributes: attributes,
            });
            // Apply uploading the (almost) empty row
            const promise = featureClass
              .applyEdits({
                addFeatures: [addFeature],
              })
              .then((editInfo) => {
                if (editInfo.addFeatureResults[0].objectId != -1) {
                  callback({
                    newFeature: true,
                    data: editInfo.addFeatureResults[0],
                    objectId: editInfo.addFeatureResults[0].objectId,
                  });
                } else {
                  alert(
                    "loading not possible: " +
                      editInfo.addFeatureResults[0].error.message
                  );
                  console.error(editInfo.addFeatureResults[0].error);
                }
              });
          }
        }
      });
    }

    // function to add one row to the table
    checkDataProject(projectId, callback) {
      let featureClass = this.project;

      var query = featureClass.createQuery();
      query.where = "projectid= '" + projectId + "'";

      featureClass.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback(results.features[0].getObjectId());
        } else {
          alert("Dieses Projekt existiert noch nicht!");
        }
      });
    }

    checkDataGroups(projectId, callback) {
      var query = this.table.createQuery();
      query.where = "projectid= '" + projectId + "' AND gruppe <> 'all'";

      this.table.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback(results.features);
        } else {
          alert("Es gibt keine Gruppen mit dieser ProjektID");
        }
      });
    }

    // function to read one row of the table
    readFeature(objectid, callback) {
      let featureClass = this.table;
      if (that.mode == "project") {
        featureClass = this.project;
      }

      // Look for a specific onbjectid
      featureClass
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
      let data = this.geometry;
      if (database == "project") {
        data = this.project;
      }

      return new Promise((resolve, reject) => {
        // Create empty query, means to take all rows!
        var query = data.createQuery();
        query.where =
          "objectid in (" + objectIds.substring(1, objectIds.length - 1) + ")";

        data.queryFeatures(query).then((results) => {
          if (results.features.length > 0) {
            resolve(results.features);
          }
        });
      });
    }

    // function to read all rows of the tables
    readFeatures(featureClassName) {
      let featureClass = this.table;
      if (featureClassName == "project") {
        featureClass = this.project;
      }
      return new Promise((resolve, reject) => {
        // Create empty query, means to take all rows!
        var query = featureClass.createQuery();

        featureClass.queryFeatures(query).then((results) => {
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
                  } else {
                    reject(value.updateFeatureResults.error);
                  }
                })
                .catch((reason) => {
                  reject(reason);
                });
            } else {
              reject("Object not found");
            }
          });
      });
      // Create empty query, means to take all rows!
    }
    // ToDo: Get projectId and not objectid!
    calculateArea(objectIds, database) {
      let data = this.geometry;
      if (database == "project") {
        data = this.project;
      }

      return new Promise((resolve, reject) => {
        let totalArea = 0;
        let areas = {}
        var query = data.createQuery();
        query.where =
          "objectid in (" + objectIds.substring(1, objectIds.length - 1) + ")";

        data
          .queryFeatures(query)
          .then((results) => {
            // If it already exists, load the existing values
            if (results.features.length > 0) {
              for (let i = 0; i < results.features.length; i++) {
                let geom = results.features[i].geometry;
                let area = geometryEngine.geodesicArea(geom, "square-meters");
                areas[results.features[i].getObjectId()] = area;
                totalArea += area;
              }
            }
            resolve({totalArea:totalArea, areas: areas});
          })
          .catch((error) => {
            alert(error.message);
            reject();
          });
      });
    }

    addMap(containerMap, containerEditor, element, callback) {
      
      let geometry;
      let editor;
      let prototype;
      let projectArea = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },

        editingEnabled: true,
        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 0, 0, 0.145],
          },
        },
        minScale: 0,
        maxScale: 0,
      });

      if (that.projectAreaId != null) {
        projectArea.definitionExpression =
          "objectid = " +
          that.projectAreaId.substring(1, that.projectAreaId.length - 1);
      } else {
        projectArea.definitionExpression = "objectid = 0 ";
      }

      // TODO: Add Filter for group ID
      let map = new Map({
        basemap: "satellite",
      });
      map.add(projectArea);

      if (that.mode != "project") {
        projectArea.editingEnabled = false;
        geometry = new FeatureLayer({
          portalItem: {
            id: this.links.geometryLayerId,
          },
          definitionExpression: "objectid = 0",
          renderer: {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              color:  [...element.color, 0.5],
            },
          },
        });
        map.add(geometry);
      }

      let view = new MapView({
        map: map,
        container: containerMap,
      });

      const fullscreen = new Fullscreen({
        view: view,
      });
      view.ui.add(fullscreen, "bottom-right");

      const homeButton = new Home({
        view: view,
      });
      if (that.projectAreaId != null) {
        this.readGeometry(that.projectAreaId, "project").then(
          (projectAreaFeature) => {
            homeButton.viewpoint = new Viewpoint({
              targetGeometry: projectAreaFeature[0].geometry.extent,
            });
          }
        );
      }

      view.ui.add(homeButton, "top-left");

      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
      });

      view.ui.add(locate, "top-left");

      // TODO also calculate exisiting areas!
      function calculateAreaPending() {
        let totalArea = 0;
        for (let i = 0; i < editor.activeWorkflow.pendingFeatures.length; i++) {
          let geom =
            editor.activeWorkflow.pendingFeatures.getItemAt(i).geometry;
          totalArea += geometryEngine.geodesicArea(geom, "square-meters");
        }
        return totalArea;
      }

      if (that.mode == "project") {
        projectArea.on("edits", function (editInfo) {
          console.log(editInfo);
          if (editInfo.addedFeatures.length > 0) {
            if (editInfo.addedFeatures[0].objectId != -1) {
              projectArea.definitionExpression =
                "objectid = " + editInfo.addedFeatures[0].objectId.toString();
              editor.layerInfos[0].addEnabled = false;
              that.updateAttributes("project",editInfo.edits.addFeatures[0].attributes.projectid)
              location.reload();
            } else {
              alert(
                "Saving not possible: " +
                  editInfo.addedFeatures[0].error.message
              );
            }
          }
        });
      } else {
        geometry.on("edits", function (editInfo) {
          console.log(editInfo);
          if (editInfo.addedFeatures.length > 0) {
            if (editInfo.addedFeatures[0].objectId != -1) {
              let value = [];
              for (let i = 0; i < editInfo.addedFeatures.length; i++) {
                value.push(editInfo.addedFeatures[i].objectId);
              }
              let newValue = value;
              if (element.valueSet) {
                newValue = [...value, ...JSON.parse(element.value)];
              }
              element.setter(JSON.stringify(newValue));
              editor.layerInfos[0].updateEnabled = true;
            } else {
              alert(
                "Saving not possible: " +
                  editInfo.addedFeatures[0].error.message
              );
            }
          }

          if (editInfo.deletedFeatures.length > 0) {
            if (editInfo.deletedFeatures[0].objectId != -1) {
              let newValue = JSON.parse(element.value);
              for (let i = 0; i < editInfo.deletedFeatures.length; i++) {
                newValue.pop(editInfo.deletedFeatures[i].objectId);
              }
              element.setter(JSON.stringify(newValue));
            } else {
              alert(
                "Saving not possible: " +
                  editInfo.addedFeatures[0].error.message
              );
            }
          }
        });
      }

      view.when(() => {
        if (containerEditor) {
          // Create the Editor
          editor = new Editor({
            view: view,
            container: containerEditor,

            // Pass in the configurations created above
          });

          editor.viewModel.watch('state', function(state){
            if(state === 'ready'){
              setTimeout(function(){
                var actions = document.getElementsByClassName("esri-editor__feature-list-name");
                Array.from(actions).forEach(function(ele){
                  ele.innerHTML = ele.innerHTML.replace("Feature", that.strings.get("feature"))
                });
              }, 50);
            }
          })

          if (that.mode == "project") {
            projectArea.load().then(() => {
              prototype = projectArea.templates[0].prototype;
              callback({ projectArea: projectArea, prototype: prototype,  geometry: null, editor: editor })
            })

            let layerInfos;
            view.map.layers.forEach((layer) => {
              // Specify a few of the fields to edit within the form
              layerInfos = {
                layer: layer,
                formTemplate: {
                  // autocastable to FormTemplate
                  elements: [
                    {
                      // autocastable to FieldElement
                      type: "field",
                      fieldName: "projectid",
                      label: "Projekt ID",
                    },
                    {
                      // autocastable to FieldElement
                      type: "field",
                      fieldName: "name",
                      label: "Ort",
                    },
                    {
                      // autocastable to FieldElement
                      type: "field",
                      fieldName: "school",
                      label: "Schule",
                    },
                    {
                      // autocastable to FieldElement
                      type: "field",
                      fieldName: "owner",
                      label: "Owner",
                    },
                  ],
                },
              };
            });

            if (that.projectAreaId != null) {
              layerInfos.addEnabled = false;
            }
            else {
              layerInfos.updateEnabled = false;
            }

            editor.layerInfos = [layerInfos];
          }
          else {
            if (geometry.definitionExpression == "objectid = 0") {
              editor.layerInfos = [{
                layer: geometry,
                updateEnabled: false
            }]
            }
            else {
              editor.layerInfos = [{
                layer: geometry,
                updateEnabled: true
            }]
            }
            
        }

          editor.watch(
            "activeWorkflow.numPendingFeatures",
            function (newValue, oldValue) {
              /*
            if (editor.activeWorkflow) {
              calculateArea();
            }
            */
            }
          );
        }

        if (that.projectAreaId == null) {
          locate.when(() => {
            locate.locate();
          });
        } else {
          if (!that.offline) {
            this.readGeometry(that.projectAreaId, "project").then(
              (projectAreaFeature) => {
                view.goTo(projectAreaFeature[0].geometry);
              }
            );
          }
        }
      });
      if (that.mode != "project") {
        callback({ projectArea: projectArea, geometry: geometry, editor: editor });
      }
       
    }

    addMapOverview(containerMap) {

      let labelClass = {
        // autocasts as new LabelClass()
        symbol: {
          type: "text", // autocasts as new TextSymbol()
          color: "black",
          font: {
            // autocast as new Font()
            size: 8,
            weight: "bold",
          },

          yoffset: 10,
          xoffset: 10,
        },
        labelExpressionInfo: {
          expression: "$feature.name",
        },
      };

      let pointSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        style: "circle",
        color: [75, 160, 0, 0.145],
        size: "12px", // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: "black",
          width: 1, // points
        },
      };

      let polygonSymbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [75, 160, 0, 0.145],
      };

      let projectAreaPoint = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },

        editingEnabled: false,
        labelingInfo: [labelClass],
        renderer: {
          type: "simple",
          symbol: pointSymbol,
        },
        minScale: 0,
        maxScale: 144447,
      });

      let projectAreaPolygon = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },

        editingEnabled: false,
        labelingInfo: [labelClass],
        renderer: {
          type: "simple",
          symbol: polygonSymbol,
        },
        minScale: 144447,
        maxScale: 0,
      });

      // TODO: Add Filter for group ID
      let map = new Map({
        basemap: "topo-vector",
      });
      map.add(projectAreaPoint);
      map.add(projectAreaPolygon);

      let view = new MapView({
        map: map,
        container: containerMap,
      });

      let fullscreen = new Fullscreen({
        view: view,
      });
      view.ui.add(fullscreen, "bottom-right");

      let basemapToggle = new BasemapToggle({
        view: view, // view that provides access to the map's 'topo-vector' basemap
        nextBasemap: "satellite", // allows for toggling to the 'satellite' basemap
      });
      view.ui.add(basemapToggle, "top-right");

      const homeButton = new Home({
        view: view,
      });

      homeButton.goToOverride = function (view) {
        start.unSelectProject();
        return view.goTo({
          center: [8.222167506135465, 46.82443911582187],
          zoom: 8,
        });
      };

      view.ui.add(homeButton, "top-left");

      view.when(function () {
        // MapView is now ready for display and can be used. Here we will
        // use goTo to view a particular location at a given zoom level and center
        view.goTo({
          center: [8.222167506135465, 46.82443911582187],
          zoom: 8,
        });
      });
      return view;
    }

    addMapResults(containerMap, containerLegend, mapLayers) {
      let projectArea = new FeatureLayer({
        portalItem: {
          id: this.links.projectLayerId,
        },

        editingEnabled: true,
        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [0, 0, 0, 0],
          },
        },
        minScale: 0,
        maxScale: 0,
      });

      if (that.projectAreaId != null) {
        projectArea.definitionExpression =
          "objectid = " +
          that.projectAreaId.substring(1, that.projectAreaId.length - 1);
      } else {
        projectArea.definitionExpression = "objectid = 0 ";
      }

      let map = new Map({
        basemap: "topo-vector",
      });
      map.add(projectArea);

      for (let i in mapLayers) {
        if (mapLayers[i].value != null && mapLayers[i].value != "") {
          let layer = new FeatureLayer({
            portalItem: {
              id: this.links.geometryLayerId,
            },
            title: mapLayers[i].name,
            definitionExpression:  "objectid in (" + mapLayers[i].value.substring(1,mapLayers[i].value.length-1) + ")",
            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color:  [...mapLayers[i].color, 0.5],
              },
            },
          });
          map.add(layer);
        }

      }

      let view = new MapView({
        map: map,
        container: containerMap,
      });

      let fullscreen = new Fullscreen({
        view: view,
      });
      view.ui.add(fullscreen, "bottom-right");

      let basemapToggle = new BasemapToggle({
        view: view, // view that provides access to the map's 'topo-vector' basemap
        nextBasemap: "satellite", // allows for toggling to the 'satellite' basemap
      });
      view.ui.add(basemapToggle, "top-right");

      new Legend({view:view, container: containerLegend})
      view.ui.add(new Expand({view:view, expanded: false, content: new LayerList({view:view})}), "top-right");


      const homeButton = new Home({
        view: view,
      });

      view.ui.add(homeButton, "top-left");
      if (that.projectAreaId != null) {
        this.readGeometry(that.projectAreaId, "project").then(
          (projectAreaFeature) => {
            homeButton.viewpoint = new Viewpoint({
              targetGeometry: projectAreaFeature[0].geometry.extent,
            });
          }
        );
      };
      view.when(() => {
        if (that.projectAreaId == null) {
          locate.when(() => {
            locate.locate();
          });
        } else {
          if (!that.offline) {
            this.readGeometry(that.projectAreaId, "project").then(
              (projectAreaFeature) => {
                view.goTo(projectAreaFeature[0].geometry);
              }
            );
          }
        }
      })
      
      return view;
    }
  };
});
