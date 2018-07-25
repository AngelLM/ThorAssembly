"use strict"

// register the application module
b4w.register("ThorAssembly_main", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
var m_ver       = require("version");
var m_nla       = require("nla");

var importantFrames = [4500,5000,2000,71,81,91,101,111,131,141,161,171,181,191,201,211,221,231,241,251];
var animationIndex = 0;

/*var materials = [
    ["1x Art1Body piece", "3x M3 Nut", "3x M3x20mm Screw"],
    ["2x Art1Body piece", "2x M3 Nut", "2x M3x20mm Screw"]
];

*/
// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("ThorAssembly");

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true
    });
}

/**
 * callback executed when the app is initialized
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    var buttonPrevious_elem = document.getElementById("buttonPrevious");
    buttonPrevious_elem.addEventListener("mousedown", button_previous_click, false);

    var buttonReplay_elem = document.getElementById("buttonReplay");
    buttonReplay_elem.addEventListener("mousedown", button_replay_click, false);

    var buttonNext_elem = document.getElementById("buttonNext");
    buttonNext_elem.addEventListener("mousedown", button_next_click, false);

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load(APP_ASSETS_PATH + "ThorAssembly.json", load_cb, preloader_cb);
	//m_data.load("../assets/ThorAssembly.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();

    // place your code here
    // m_nla.set_frame(40);

    m_nla.stop();


}

function button_previous_click(e) {
    if (animationIndex>0 && !m_nla.is_play()){
        m_nla.set_frame(importantFrames[animationIndex-1]);
        animationIndex--;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/100");
    }
}

function button_replay_click(e) {
    if (animationIndex>0 && !m_nla.is_play()){
        m_nla.set_frame(importantFrames[animationIndex-1]);
        m_nla.set_range(importantFrames[animationIndex-1], importantFrames[animationIndex]);
        deleteListItems();
        m_nla.play();
    }
}

function button_next_click(e) {
    if (animationIndex<importantFrames.length && !m_nla.is_play()){
        m_nla.set_frame(importantFrames[animationIndex]);
        m_nla.set_range(importantFrames[animationIndex], importantFrames[animationIndex+1]);
        listItems(animationIndex);
        animationIndex++;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/100");
        m_nla.play();
    }
}

function listItems(i){
    /*deleteListItems();
    var list = document.getElementById('list');
    var j;
    for (j=0; j<materials[i].length; j++){
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(materials[i][j]));
        list.appendChild(entry);
    }*/
	return;
}

function deleteListItems(){
    var list = document.getElementById('list');
    while (list.hasChildNodes()){
        list.removeChild(list.firstChild);
    }
}

});

// import the app module and start the app by calling the init method
b4w.require("ThorAssembly_main").init();
