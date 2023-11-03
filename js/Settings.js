/*
--------------
Settings.js
--------------
 The code concerned with the settings panel which occurs in several pages, therefore it was seperated to re-use.
*/
define([
    "dojo/dom-construct",
    "dojo/on",

], function (domCtr, on) {
    return class Settings {
        constructor(strings, mode, version) {
            this.strings = strings;
            this.mode = mode;
            this.version = version;
        }
        addSettings(container) {


            // Setting button
            let settingsBtnContainer = domCtr.create(
                "div",
                {
                    className: "btn3_container",
                    style: "height: 60%;margin: 0 5px;"
                },
                container
            );

            let btn_settings = domCtr.create(
                "div",
                {
                    id: "btn_settings",
                    className: "btn3 btn1",
                },
                settingsBtnContainer
            );

            domCtr.create(
                "img",
                {
                    className: "btn_icon",
                    src: "./img/Icons/Settings_black.svg",
                },
                btn_settings
            );
            domCtr.create(
                "div",
                {
                    className: "btn_label",
                    innerHTML: this.strings.get("settings"),
                },
                btn_settings
            );

            this.settingsPanel = domCtr.create(
                "div",
                {
                    className: "btn3Panel",
                },
                settingsBtnContainer
            );

            domCtr.create(
                "div",
                { className: "nonselectableElement", innerHTML: this.strings.get("versionLabel") },
                this.settingsPanel
            );

            let versionsContainer = domCtr.create(
                "div",
                {
                    className: "panelElementContainer"
                },
                this.settingsPanel
            );

            let shortElement = domCtr.create(
                "div",
                {
                    className: this.version == "short" ? "selectableElement selectableElementActive" : "selectableElement",
                    innerHTML: this.strings.get("short"),
                },
                versionsContainer
            );
            let longElement = domCtr.create(
                "div",
                {
                    className: this.version == "long" ? "selectableElement selectableElementActive" : "selectableElement",
                    innerHTML: this.strings.get("long"),
                },
                versionsContainer
            );

            let that = this;
            on(shortElement, "click", function (evt) {
                if (!shortElement.classList.contains("selectableElementActive")) {
                    longElement.classList.toggle("selectableElementActive")
                    shortElement.classList.toggle("selectableElementActive")
                    that.updateAttributes("version", "short");
                    if (that.mode != "start") {
                        window.open(window.location.href, "_self");
                    }
                }
            });

            on(longElement, "click", function (evt) {
                if (!longElement.classList.contains("selectableElementActive")) {
                    longElement.classList.toggle("selectableElementActive")
                    shortElement.classList.toggle("selectableElementActive")
                    that.updateAttributes("version", "long");
                    if (that.mode != "start") {
                        window.open(window.location.href, "_self");
                    }
                }
            });

            domCtr.create(
                "div",
                { className: "nonselectableElement", innerHTML: this.strings.get("langLabel") },
                this.settingsPanel
            );

            let langContainer = domCtr.create(
                "div",
                {
                    className: "panelElementContainer"
                },
                this.settingsPanel
            );

            let langElement = {};
            for (const i in this.strings.languages) {
                langElement[this.strings.languages[i]] = domCtr.create(
                    "div",
                    {
                        className: "selectableElement",
                        innerHTML: this.strings.languages[i],
                    },
                    langContainer
                );

                if (this.strings.languages[i] == this.strings.lang) {
                    langElement[this.strings.languages[i]].classList.toggle("selectableElementActive")
                }

            }


            on(btn_settings, "click", function (evt) {
                that.settingsPanel.classList.toggle("btn3PanelActive");
                btn_settings.classList.toggle("btn_active");
                btn_settings.querySelector('.btn_icon').classList.toggle("btn_icon_active");
                btn_settings.querySelector('.btn_label').classList.toggle("btn_label_active");
                document.getElementById("infoBox")?.classList.toggle("infoBox_inactive");
                document.getElementById("save")?.classList.toggle("infoBox_inactive");
                if (that.mode == "start") {
                    start.mapOverviewProject.style.top = 0.87 * window.innerHeight + "px";
                }
            });

            // Close sort and settings window whenever a click happens outside of those elements
            on(window, "click", function (evt) {
                if (evt.srcElement.id != "btn_settings" && that.settingsPanel.classList.contains("btn3PanelActive")) {
                    that.settingsPanel.classList.toggle("btn3PanelActive");
                    btn_settings.classList.toggle("btn_active");
                    btn_settings.querySelector('.btn_icon').classList.toggle("btn_icon_active");
                    btn_settings.querySelector('.btn_label').classList.toggle("btn_label_active");
                    document.getElementById("infoBox")?.classList.toggle("infoBox_inactive");
                    document.getElementById("save")?.classList.toggle("infoBox_inactive");

                };
            })

            for (const i in this.strings.languages) {

                let that = this;
                on(langElement[that.strings.languages[i]], "click", function (evt) {
                    for (const j in that.strings.languages) {
                        langElement[that.strings.languages[j]].classList.remove("selectableElementActive")
                    }
                    langElement[that.strings.languages[i]].classList.toggle("selectableElementActive")

                    that.updateAttributes(
                        "lang",
                        that.strings.languages[i]
                    );
                    window.open(window.location.href, "_self");
                })
            }
        }
        updateAttributes(key, value) {
            // Construct URLSearchParams object instance from current URL querystring.
            var queryParams = new URLSearchParams(window.location.search);

            // Set new or modify existing parameter value.
            queryParams.set(key, value);

            // Replace current querystring with the new one.
            history.replaceState(null, null, "?" + queryParams.toString());
        }
    }
})

