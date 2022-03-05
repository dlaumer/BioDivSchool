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

    "biodivschool/Links",
    "esri/config"

], function (
    Accessor, FeatureLayer, Map, MapView, Editor, Expand, Locate, Links, esriConfig) {
        return class ArcGis {
        constructor(content) {
            this.createUI();
            this.clickHandler();
            this.content = content;
            this.links = new Links();
        }

        createUI() {


        }

        clickHandler() {

        }

        addMap(container) {
            esriConfig.portalUrl = "https://swissparks.maps.arcgis.com/";
            let geometry = new FeatureLayer({
            portalItem: {
                id: this.links.geometryLayerId
            }
            });

            // TODO: Add Filter for group ID
            let map = new Map({
            basemap: "satellite"
            });

            map.add(geometry);

            let view = new MapView({
            map: map,
            container: container
            });

            const editor = new Editor({
            view: view
            });

            view.ui.add(new Expand({content: editor, view: view}), "top-right");

            const locate = new Locate({
                view: view,
                useHeadingEnabled: false,
              });
              view.ui.add(locate, "top-left");
              view.when(() => {
                  locate.when(() => {
                    locate.locate();
                  })
              })

        }
    }
})