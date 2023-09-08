/*
--------------
ArcGis.js
--------------
All the code connected with the ArcGIS JS API. This is mainly the connection to the database and everything which has to do with maps.
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
  "esri/core/watchUtils",
  "esri/rest/print",
  "esri/rest/support/PrintTemplate",
  "esri/rest/support/PrintParameters",
  "esri/config",
  "dojo/dom-construct",
  "esri/layers/support/FeatureTemplate",
  "esri/intl"
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
  watchUtils,
  print,
  PrintTemplate,
  PrintParameters,
  esriConfig,
  domCtr,
  FeatureTemplate,
  intl
) {
  return class ArcGis {
    constructor(editMode, strings, callback) {
      this.editMode = editMode;
      this.strings = strings;
      esriConfig.portalUrl = "https://globe-swiss.maps.arcgis.com/";

      this.signedIn = false;
      this.info = new OAuthInfo({
        appId: "FtOdvl6jxebClqoJ",
        popup: false, // the default
      });

      this.links = {
        //geometryLayerI: "3c34d04c41fd47d4b8852788c00e2f1f",    // Daniel
        geometryLayerId: "2106076234904e29980c1d20aa317e98", //Christian
        geometryViewLayerId: "7426e05330d147c78052dffb482140ac",
        //dataLayerId: "51be950e7c1b4cbb8085c67a2c412868",    // Daniel
        dataLayerId: "3e5de63361774b82a560150dab5cdd68", //Christian
        dataViewLayerId: "60ef7db4c8d947c287de926cf88042f6",
        projectLayerId: "28aa4770fce5454d830bc51e53f12c07",
        projectViewLayerId: "5afeae52a425403180454df4b6bebbd4"
      };


      this.buildingsRenderer = {
        type: "simple",
        symbol: {
          type: "cim",
          data: {
            type: "CIMSymbolReference",
            symbol: {
              // CIM polygon symbol
              type: "CIMPolygonSymbol",
              symbolLayers: [
                {
                  // light blue outline around the polygon
                  type: "CIMSolidStroke",
                  enable: true,
                  width: 0.4,
                  color: [0, 0, 255, 255]
                },
                {
                  type: "CIMHatchFill",
                  enable: true,
                  lineSymbol: {
                    type: "CIMLineSymbol",
                    symbolLayers: [{
                      type: "CIMSolidStroke",
                      enable: true,
                      capStyle: "Butt",
                      joinStyle: "Miter",
                      miterLimit: 5,
                      width: 0.3,
                      color: [0, 0, 255, 255]
                    }]
                  },
                  rotation: 45,
                  separation: 5
                },
                {
                  // solid blue fill background
                  type: "CIMSolidFill",
                  enable: true,
                  color: [190, 190, 190, 150]
                }
              ]
            }
          }
        }
      };

      esriId.registerOAuthInfos([this.info]);

      esriId
        .checkSignInStatus(this.info.portalUrl + "/sharing")
        .then(() => {
          this.handleSignedIn();
          callback();
        })
        .catch(() => {
          this.handleSignedOut();
          callback();
        });

      this.createUI();
      this.clickHandler();

      intl.setLocale(strings.lang)
    }

    handleSignInOut() {
      if (this.signedIn) {
        esriId.destroyCredentials();
        window.location.reload();
      } else {
        esriId.getCredential(this.info.portalUrl + "/sharing");
      }
    }

    handleSignedIn() {
      const portal = new Portal();
      portal.load().then(() => {
        window.history.pushState(
          {
            path: window.location.href.substr(
              0,
              window.location.href.indexOf("#")
            ),
          },
          "",
          window.location.href.substr(0, window.location.href.indexOf("#"))
        );
        if (document.getElementById("login")) {
          document.getElementById("login").innerHTML =
            this.strings.get("logoutEsri");
          document.getElementById("userName").innerHTML =
            portal.user.username;
          start.userNameEsri = portal.user.username;
          start.addProjectMap();
        } else {
          app.userNameEsri = portal.user.username;
        }
        this.signedIn = true;
      })
        .catch(() => {
          esriId.destroyCredentials();
          window.location.reload();
          alert(this.strings.get("notAllowed"))
        });
    }

    handleSignedOut() {
      this.signedIn = false;
      if (document.getElementById("login")) {
        document.getElementById("login").innerText =
          this.strings.get("loginEsri");
        start.userNameEsri = null;
      } else {
        app.userNameEsri = null;
      }
    }

    createUI() { }

    clickHandler() { }

    // Here the ID of the table on AGO
    init(callback) {
      this.table = new FeatureLayer({
        portalItem: {
          id: this.editMode ? this.links.dataLayerId : this.links.dataViewLayerId,
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
            "The connection to the database could not be established: " + this.table.id + " " +
            error.toString()
          );
        });
    }

    initGeo(callback) {
      this.geometry = new FeatureLayer({
        portalItem: {
          id: this.editMode ? this.links.geometryLayerId : this.links.geometryViewLayerId,
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
            "The connection to the database could not be established: " + this.editMode ? this.links.geometryLayerId : this.links.geometryViewLayerId + " " +
              error.toString()
          );
        });
    }

    initProject(callback) {
      this.project = new FeatureLayer({
        portalItem: {
          id: this.editMode ? this.links.projectLayerId : this.links.projectViewLayerId,
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
            "The connection to the database could not be established: " + this.project.id + " " +
            error.toString()
          );
        });
    }

    // function to add one row to the table
    checkData(projectId, groupId, callback) {
      let featureClass = this.table;
      if (projectId == "null" || projectId == null) {
        callback(null)
        return;
      }
      if (app.mode == "project") {
        featureClass = this.project;
        var query = featureClass.createQuery();
        query.where = "objectid= '" + projectId + "'"
      }

      else {
        var query = featureClass.createQuery();
        query.where =
          groupId == null
            ? "projectid= '" + projectId + "'"
            : "projectid= '" + projectId + "' AND gruppe= '" + groupId + "'";
      }


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

          if (app.mode == "results") {
            callback(null)
          }
          else if (app.mode == "project") {
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

    checkDataProject(projectId, callback) {
      let featureClass = this.project;

      var query = featureClass.createQuery();
      query.where = "objectid= '" + projectId + "'";

      featureClass.queryFeatures(query).then((results) => {
        // If it already exists, load the existing values
        if (results.features.length > 0) {
          callback(results.features[0]);
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
      if (app.mode == "project") {
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
    updateFeature(objectid, data, project=false) {
      let featureClass = this.table;
      if (app.mode == "project" || project==true) {
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

    // function to change several data in the table
    updateFeatures(data) {
      let featureClass = this.table;

      return new Promise((resolve, reject) => {

        // finally, upload the new data to ArcGIS Online
        featureClass
          .applyEdits({
            updateFeatures: data,
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

      });
    }

    deleteProject(objectId) {
      objectId = objectId.substring(1, objectId.length - 1);
      let featureClass = this.project;

      return new Promise((resolve, reject) => {
        featureClass
          .queryFeatures({
            objectIds: [objectId],
            outFields: ["*"],
            returnGeometry: false,
          })
          // then take re existing entry and edit it
          .then((results) => {
            if (results.features.length > 0) {
              let editFeature = results.features[0];

              // finally, upload the new data to ArcGIS Online
              featureClass
                .applyEdits({
                  deleteFeatures: [editFeature],
                })
                .then((value) => {
                  // ToDo: Check for errors!
                  if (value.deleteFeatureResults.error == null) {
                    resolve(value);
                  } else {
                    reject(value.deleteFeatureResults.error);
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
    }

    // Only temporary function used once to switch the value that was saved in the database. First we saved all the data, then we switched to only saving the keys
    switchTextToKey() {
      app.arcgis.init(() => {
        app.arcgis.readFeatures("").then((results => {
          console.log(results);
          let elements = app.getAllElements(false);

          for (let i in results) {
            console.log(results[i].attributes.objectId)
            for (let j in results[i].attributes) {
              if (results[i].attributes[j] != null) {
                for (let k in elements) {
                  //console.log(elements[k].key)
                  //console.log(j)
                  if (elements[k].type == "radioButtonInput" && elements[k].key == j && elements[k].pointsDict[results[i].attributes[j]] != null) {
                    console.log(elements[k].pointsDict[results[i].attributes[j]].key)
                    results[i].attributes[j] = elements[k].pointsDict[results[i].attributes[j]].key
                  }
                }

              }
            }
          }
          console.log(results);
          app.arcgis.updateFeatures(results).then((response) => {
            console.log(response);
          })

        }));
      });
    }

    // ToDo: Get projectId and not objectid!
    calculateArea(objectIds, database) {
      let data = this.geometry;
      if (database == "project") {
        data = this.project;
      }

      return new Promise((resolve, reject) => {
        let totalArea = 0;
        let areas = {};
        if (objectIds == "") {
          resolve({ totalArea: totalArea, areas: areas });
          return;
        }

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
                areas[results.features[i].getObjectId()] = { area: area, type: results.features[i].attributes.Labels };
                totalArea += area;
              }
            }
            resolve({ totalArea: totalArea, areas: areas });
          })
          .catch((error) => {
            alert(error.message);
            reject();
          });
      });
    }

    addMap(containerMap, containerEditor, containerLegend, element, callback) {
      let editor;
      let prototype;
      let projectArea = new FeatureLayer({
        portalItem: {
          id: this.editMode ? this.links.projectLayerId : this.links.projectViewLayerId,
        },
        title: this.strings.get("projectArea"),
        popupEnabled: false,
        editingEnabled: false,
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

      let geometry = new FeatureLayer({
        portalItem: {
          id: this.editMode ? this.links.geometryLayerId : this.links.geometryViewLayerId,
        },
        editingEnabled: true,
        title: app.mode == "project" ? this.strings.get("P05.gebaeude.nameDisplay") : this.strings.get("data"),
        definitionExpression: "objectid = 0",
        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [...element.color, 0.5],
          },
        },

        formTemplate: {
          // autocastable to FormTemplate
          elements: [
            {
              // autocastable to FieldElement
              type: "field",
              fieldName: "Notes",
              label: "Notizen",
            },
          ],
        },
      });

      if (element.key == "gebiete") {
        projectArea.editingEnabled = true;
        geometry.editingEnabled = false;
        geometry.renderer = this.buildingsRenderer
        geometry.popupEnabled = false;
      }

      if (element.key == "gebaeude_geomoid") {
        projectArea.visible = false;
        geometry.editingEnabled = true;

        geometry.renderer = this.buildingsRenderer
      }


      if (app.projectAreaId != null) {
        projectArea.definitionExpression =
          "objectid = " +
          app.projectAreaId.substring(1, app.projectAreaId.length - 1);
      } else {
        projectArea.definitionExpression = "objectid = 0 ";
      }

      // TODO: Add Filter for group ID
      let map = new Map({
        basemap: "satellite",
      });

      map.add(projectArea);

      if (element.includeBuildings && app.buildings) {
        let buildings = new FeatureLayer({
          portalItem: {
            id: this.editMode ? this.links.geometryLayerId : this.links.geometryViewLayerId,
          },
          title: this.strings.get("P05.gebaeude.nameDisplay"),
          editingEnabled: false,
          popupEnabled: false,
          definitionExpression: "objectid in (" +
            app.buildings.substring(1, app.buildings.length - 1) +
            ")",
          renderer: this.buildingsRenderer,
        });
        map.add(buildings)
      }

      if (element.listTypes) {

        geometry.formTemplate = {
          // autocastable to FormTemplate
          elements: [
            {
              // autocastable to FieldElement
              type: "field",
              fieldName: "Labels",
              label: this.strings.get(element.nameListTypes),
              editable: false,
            },
            {
              // autocastable to FieldElement
              type: "field",
              fieldName: "Notes",
              label: this.strings.get("notes"),
            },
          ],
        };

        let templates = [];
        let uniqueValueInfos = [];
        for (let i in element.listTypes) {
          let type = element.listTypes[i].name;
          let color = element.listTypes[i].color;

          templates.push(
            new FeatureTemplate({
              name: this.strings.get(type),
              prototype: {
                attributes: {
                  Labels: this.strings.get(type),
                },
              },
            })
          )
          uniqueValueInfos.push(
            {
              // All features with value of "North" will be blue
              value: this.strings.get(type),
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: color,
              }
            }
          )
        }
        geometry.templates = templates;

        geometry.renderer = {
          type: "unique-value",
          field: "Labels",
          defaultSymbol: { type: "simple-fill" }, // autocasts as new SimpleFillSymbol()
          uniqueValueInfos: uniqueValueInfos
        }
      }
      map.add(geometry);

      let view = new MapView({
        map: map,
        container: containerMap,
      });

      new Legend({
        view: view,
        style: { type: "card", layout: "side-by-side" },
        container: containerLegend,
      });

      const homeButton = new Home({
        view: view,
      });
      if (app.projectAreaId != null) {
        this.readGeometry(app.projectAreaId, "project").then(
          (projectAreaFeature) => {
            homeButton.viewpoint = new Viewpoint({
              targetGeometry: projectAreaFeature[0].geometry.extent,
            });
            //projectArea.selectFeatures(projectAreaFeature);
          }
        );
      }

      view.ui.add(homeButton, "top-left");

      // create DOM object
      let fullScreenBtn = domCtr.toDom(
        "<div class='map-button esri-component esri-locate esri-widget--button esri-widget' role='button' title='Recenter'><span aria-hidden='true' role='presentation' class='esri-icon esri-icon-zoom-out-fixed'></span></div>"
      );
      // add to view
      view.ui.add(fullScreenBtn, "top-left");
      // add button click listener
      fullScreenBtn.addEventListener("click", () => {
        document.getElementById(containerMap).classList.toggle("fullscreen");
      });
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

      if (element.key == "gebiete") {
        projectArea.on("edits", function (editInfo) {
          if (editInfo.addedFeatures.length > 0) {
            if (editInfo.addedFeatures[0].objectId != -1) {
              projectArea.definitionExpression =
                "objectid = " + editInfo.addedFeatures[0].objectId.toString();
              editor.layerInfos[0].addEnabled = false;
              app.updateAttributes(
                "project",
                editInfo.addedFeatures[0].objectId
              );
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
              if (element.key == "gebaeude_geomoid") {
                // Update project area map
                element.map.geometry.definitionExpression = "objectid in (" +
                  JSON.stringify(newValue).substring(1, JSON.stringify(newValue).length - 1) +
                  ")"
              }
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
                const index = newValue.indexOf(editInfo.deletedFeatures[i].objectId);
                newValue.splice(index, 1);
              }
              if (newValue.length == 0) {
                element.setter(null);
                if (element.key == "gebaeude_geomoid") {
                  // Update project area map
                  element.map.geometry.definitionExpression = "objectid in (" +
                    JSON.stringify(newValue).substring(1, JSON.stringify(newValue).length - 1) +
                    ")"
                }

              }
              else {
                element.setter(JSON.stringify(newValue));
                if (element.key == "gebaeude_geomoid") {
                  // Update project area map
                  element.map.geometry.definitionExpression = "objectid in (" +
                    JSON.stringify(newValue).substring(1, JSON.stringify(newValue).length - 1) +
                    ")"
                }
              }
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
        if (containerEditor && app.mode != "results") {
          // Create the Editor
          editor = new Editor({
            view: view,
            container: containerEditor,

          });

          editor.loadLocale = () => {
            editor.messages = {
              ...editor.messages,
              selectTemplate: app.strings.get("selectTemplate"),
              editFeatures: app.strings.get("editFeatures"),
              editFeature: app.strings.get("editFeature"),
              addFeature: app.strings.get("addFeature"),
            };
          };

          editor.viewModel.watch("state", function (state) {
            if (state === "ready") {
              setTimeout(function () {
                let container = document.querySelector(
                  "#" + element.name + "_editor"
                );
                domCtr.place(
                  container.querySelector("#linkInstructions"),
                  container.querySelector(".esri-editor__header"),
                  "after"
                );

              }, 50);
            }
          });

          if (element.key == "gebiete") {
            projectArea.load().then(() => {
              prototype = projectArea.templates[0].prototype;

              callback({
                projectArea: projectArea,
                prototype: prototype,
                geometry: geometry,
                editor: editor,
              });
            });

            // Specify a few of the fields to edit within the form
            let layerInfos = {
              layer: projectArea,
              disableAttributeUpdateTriggers: ["projectid"],
              formTemplate: {
                // autocastable to FormTemplate
                elements: [
                  {
                    // autocastable to FieldElement
                    type: "field",
                    fieldName: "projectid",
                    label: this.strings.get("project") + " ID",
                  },
                  {
                    // autocastable to FieldElement
                    type: "field",
                    fieldName: "name",
                    label: this.strings.get("location"),
                  },
                  {
                    // autocastable to FieldElement
                    type: "field",
                    fieldName: "school",
                    label: this.strings.get("school"),
                  },
                  {
                    // autocastable to FieldElement
                    type: "field",
                    fieldName: "gebaeude_geomoid",
                    label: this.strings.get("P05.gebaeude.nameDisplay"),
                  },
                  /*{
                    // autocastable to FieldElement
                    type: "field",
                    fieldName: "owner",
                    label: "Owner",
                  },*/
                ],
              },
            };

            if (app.projectAreaId != null) {
              layerInfos.addEnabled = false;
              //editor.startUpdateWorkflowAtFeatureEdit();
            } else {
              layerInfos.updateEnabled = false;
            }

            editor.layerInfos = [layerInfos];
          } else {
            if (geometry.definitionExpression == "objectid = 0") {
              editor.layerInfos = [
                {
                  layer: geometry,
                  updateEnabled: false,
                },
              ];
            } else {
              editor.layerInfos = [
                {
                  layer: geometry,
                  updateEnabled: true,
                },
              ];
            }
          }
        }

        if (app.projectAreaId == null) {
          locate.when(() => {
            locate.locate();
          });
        } else {
          if (!app.offline) {
            this.readGeometry(app.projectAreaId, "project").then(
              (projectAreaFeature) => {
                view.goTo(projectAreaFeature[0].geometry);
              }
            );
          }
        }
      });
      if (app.mode == "results") {
        app.mapLoadedPromises.push(
          new Promise((resolve, reject) => {
            watchUtils.whenFalseOnce(view, "updating", () => {
              console.log("The map with id:" + element.key + " has loaded");
              this.printMap(view).then((image) => {
                element.screenshot.src = image.url;
                resolve();
              });
            });
          })
        );
      }
      callback({
        projectArea: projectArea,
        geometry: geometry,
        editor: editor /*mapLoaded: new Promise((resolve3, reject3) => {
          watchUtils.whenFalseOnce(view, "updating", () => {
            console.log("The map with id:" + element.key + " has loaded");
            view.takeScreenshot().then((screenshot) => {
              element.screenshot.src = screenshot.dataUrl;
              resolve3();
              reject3();
            })
           
          });
          
        }) 
        */,
      });
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
        color: [112, 112, 112, 0.19],
        size: "16px", // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: "black",
          width: 1, // points
        },
      };

      var customZoomAction = {
        title: "Zoom to",
        id: "custom-zoom",
        className: "esri-icon-zoom-in-magnifying-glass",
      };
      var template = {
        // autocasts as new PopupTemplate()
        title: "{name}",
        content: "{school}",
        actions: [customZoomAction],
      };
      template.overwriteActions = true;

      let polygonSymbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [75, 160, 0, 0.145],
      };

      let projectAreaPoint = new FeatureLayer({
        portalItem: {
          id: this.links.projectViewLayerId,
        },
        popupTemplate: template,
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
          id: this.links.projectViewLayerId,
        },
        popupTemplate: template,
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

      view.ui.add(new Locate({ view: view }), "top-left");

      homeButton.goToOverride = function (view) {
        start.unSelectProject();
        view.popup.close();
        return view.goTo({
          center: [8.722167506135465, 47.32443911582187],
          zoom: 9,
        });
      };

      view.ui.add(homeButton, "top-left");
      view.popup.on("trigger-action", function (evt) {
        if (evt.action.id === "custom-zoom") {
          let query = projectAreaPolygon.createQuery();
          query.where =
            "objectid in (" +
            view.popup.viewModel.selectedFeature.attributes.OBJECTID +
            ")";
          projectAreaPolygon.queryFeatures(query).then((results) => {
            // If it already exists, load the existing values
            if (results.features.length > 0) {
              view.goTo(results.features[0]);
            } else {
              alert("Dieses Projekt wurde nicht gefunden!");
            }
          });
        }
      });

      watchUtils.whenTrue(view.popup, "visible", function () {
        watchUtils.whenFalseOnce(view.popup, "visible", function () {
          start.unSelectProject();
        });
      });

      view.on("click", function (event) {
        view.hitTest(event.screenPoint).then(function (response) {
          if (response.results[0]) {
            let query = projectAreaPolygon.createQuery();
            query.where =
              "objectid in (" +
              response.results[0].graphic.attributes.OBJECTID +
              ")";
            projectAreaPolygon.queryFeatures(query).then((results) => {
              start.selectProject(
                results.features[0].attributes.OBJECTID,
                results.features[0].attributes.name,
                results.features[0].attributes.school,
                results.features[0].attributes.owner
              );
            });
          }
        });
      });

      view.when(function () {
        // MapView is now ready for display and can be used. Here we will
        // use goTo to view a particular location at a given zoom level and center
        view.goTo({
          center: [8.722167506135465, 47.32443911582187],
          zoom: 9,
        });

        /*
        
        view.whenLayerView(projectAreaPoint).then(function (lview) {
          watchUtils.whenFalseOnce(lview, "updating", function () {
            // Set up a click event handler and retrieve the screen x, y coordinates
            view.on("pointer-move", function (evt) {
              var screenPoint = {
                x: evt.x,
                y: evt.y
              };
              

              // the hitTest() checks to see if any graphics in the view
              // intersect the given screen x, y coordinates
              view.hitTest(screenPoint)
                .then(function (response) {
                  //changeCursor(response);
                  //getGraphics(response);
                });
            });
          });
        });
        */
      });


      function changeCursor(response) {
        if (response.results.length > 0) {
          document.getElementById("mapOverviewMap").style.cursor = "pointer";
        } else {
          document.getElementById("mapOverviewMap").style.cursor = "default";
        }
      }

      function getGraphics(response) {
        view.graphics.removeAll();
        if (response.results.length > 0) {
          var graphic = response.results[0].graphic;
          graphic.symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            style: "circle",
            color: [169, 240, 43, 0.35],
            size: "16px", // pixels
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: "black",
              width: 1, // points
            },
          }
          view.graphics.add(graphic);
        }
      }
      return [view, projectAreaPoint];
    }

    addMapResults(containerMap, containerLegend, mapLayers, screenshotDiv) {
      let projectArea = new FeatureLayer({
        portalItem: {
          id: this.links.projectViewLayerId,
        },

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

      if (app.projectAreaId != null) {
        projectArea.definitionExpression =
          "objectid = " +
          app.projectAreaId.substring(1, app.projectAreaId.length - 1);
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
              id: this.links.geometryViewLayerId,
            },
            title: mapLayers[i].name_display,
            definitionExpression:
              "objectid in (" +
              mapLayers[i].value.substring(1, mapLayers[i].value.length - 1) +
              ")",
            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: mapLayers[i].color,
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

      new Legend({
        view: view,
        style: { type: "card", layout: "side-by-side" },
        container: containerLegend,
      });
      view.ui.add(
        new Expand({
          view: view,
          expanded: false,
          content: new LayerList({ view: view }),
        }),
        "top-right"
      );

      const homeButton = new Home({
        view: view,
      });

      view.ui.add(homeButton, "top-left");
      if (app.projectAreaId != null) {
        this.readGeometry(app.projectAreaId, "project").then(
          (projectAreaFeature) => {
            homeButton.viewpoint = new Viewpoint({
              targetGeometry: projectAreaFeature[0].geometry.extent,
            });
          }
        );
      }
      view.when(() => {
        if (app.projectAreaId == null) {
          locate.when(() => {
            locate.locate();
          });
        } else {
          if (!app.offline) {
            this.readGeometry(app.projectAreaId, "project").then(
              (projectAreaFeature) => {
                view.goTo(projectAreaFeature[0].geometry);
              }
            );
          }
        }
      });

      app.mapLoadedPromises.push(
        new Promise((resolve, reject) => {
          watchUtils.whenFalseOnce(view, "updating", () => {
            this.printMap(view).then((image) => {
              screenshotDiv.src = image.url;
              resolve();
            });
          });
        })
      );
      return view;
    }

    printMap(view) {
      return new Promise((resolve, reject) => {
        // url to the print service
        const url =
          "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";

        const template = new PrintTemplate({
          format: "png32",
          layout: "map-only",
          exportOptions: {
            width: 800,
            height: 450,
          },
          scalePreserved: false,
        });

        const params = new PrintParameters({
          view: view,
          template: template,
        });

        // print when this function is called

        print
          .execute(url, params)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            alert("Exporting an image of the map did not work:   " + err);
          });
      });
    }
  };
});
