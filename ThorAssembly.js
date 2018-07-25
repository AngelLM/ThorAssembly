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
var scene 		= b4w.require("scenes");

var importantFrames = [75, 125, 175, 275, 350, 400, 500];
var animationIndex = 0;

var materials = [
	["GripperBodyBot", "6x M3 Nut"],
	["Servomotor", "4x M3x12mm Screw"],
	["Servomotor disk", "GripperActiveArm", "3x Servomotor Screw"],
	["GripperPassiveArm", "GripperBodyTop", "1x M3x12mm Screw", "2x M3x20mm Screw"],
	["2x GripperArm", "2x M3 Nut", "2x M3x20mm Screw"],
	["GripperFingerRight", "GripperFingerLeft", "4x M3 Lock Nut", "4x M3x16mm Screw"]
];

var showObjects = [
	['BG00', 'BG01', 'BG01.001', 'BG02', 'BG04', 'BG05', 'BG06', 'BG07', 'BG25', 'BG26'],
	['BG08', 'BG09', 'BG10', 'BG11', 'BG12'],
	['BG13', 'BG14', 'BG15', 'BG16', 'BG17'],
	['BG18', 'BG19', 'BG20', 'BG21', 'BG22'],
	['BG23', 'BG24', 'BG27','BG28'],
	['BG29', 'BG30', 'BG31', 'BG32', 'BG33', 'BG34', 'BG35', 'BG36', 'BG37', 'BG38']
]


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
	hideAllObjects();
    m_nla.stop();
}

function button_previous_click(e) {
    if (animationIndex>1 && !m_nla.is_play()){
        m_nla.set_frame(importantFrames[animationIndex-2]);
		m_nla.set_range(importantFrames[animationIndex-2], importantFrames[animationIndex-1]);
        listItems(animationIndex-2);
		hideShowObjects(animationIndex-1)
		animationIndex--;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/6");
		m_nla.play();
    }
}

function button_replay_click(e) {
    if (animationIndex>0 && !m_nla.is_play()){
        m_nla.set_frame(importantFrames[animationIndex-1]);
        m_nla.set_range(importantFrames[animationIndex-1], importantFrames[animationIndex]);
        m_nla.play();
    }
}

function button_next_click(e) {
    if (animationIndex<importantFrames.length && !m_nla.is_play()){
        m_nla.set_frame(importantFrames[animationIndex]);
        m_nla.set_range(importantFrames[animationIndex], importantFrames[animationIndex+1]);
        listItems(animationIndex);
		hideShowObjects(animationIndex)
        animationIndex++;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/6");
        m_nla.play();
    }
}

function listItems(i){
    deleteListItems();
    var list = document.getElementById('list');
    for (var j=0; j<materials[i].length; j++){
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(materials[i][j]));
        list.appendChild(entry);
    }
}

function deleteListItems(){
    var list = document.getElementById('list');
    while (list.hasChildNodes()){
        list.removeChild(list.firstChild);
    }
}

function hideAllObjects(){
	var scene_object_list = scene.get_all_objects("MESH");
	for (var j=0; j<scene_object_list.length; j++){
		scene.hide_object(scene_object_list[j]);
	}
}

function hideShowObjects(animationIndex){
	for (var j=0; j<showObjects[animationIndex].length; j++){
		hideShow(showObjects[animationIndex][j]);
	}
}

function hideShow(objectName){
	var objectHideShow = scene.get_object_by_name(objectName);
	if (scene.is_hidden(objectHideShow)){
		scene.show_object(objectHideShow);
	}
	else{
		scene.hide_object(objectHideShow);
	}
}


});

// import the app module and start the app by calling the init method
b4w.require("ThorAssembly_main").init();
