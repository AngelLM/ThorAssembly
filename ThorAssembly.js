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
var m_scenes 	= b4w.require("scenes");
var m_cam_ani 	= b4w.require("camera_anim");
var m_cam 		= b4w.require("camera");

var animationIndex = 0;
var partIndex = 0;

var assemblyTitles = ["Gripper", "Articulations 5&6", "Articulation 3&4", "Top Union", "Articulation 1", "Articulation 2", "Mid Union", "Base", "Bottom Union"]

var keyframes = [
	[75, 125, 175, 275, 350, 400, 500],
	[900, 950, 975, 1075, 1125, 1175, 1350, 1400, 1450, 1500, 1625, 1675, 1700, 1725, 1800, 1975, 2075],
	[2200, 2300, 2375, 2450, 2525, 2625, 2700, 2775, 2825, 2900, 2950, 3000],
	[3175, 3375, 3550],
	[4625, 4700, 4725, 4800, 4850, 4875, 4950, 5025],
	[6250, 6325, 6425, 6475, 6525, 6600, 6675, 6825, 6900, 6950, 7000, 7075],
	[7075, 7325, 7375, 7500, 7625, 7750, 7800],
	[8100, 8175, 8250, 8325, 8400, 8450, 8475, 8525, 8550, 8600, 8675, 8750, 8775, 8850, 8900, 9000],
	[9075, 9275, 9325, 9450]
	];

var materials = [
	[
		["(1) GripperBodyBot", "(6) M3 Nut"],
		["(1) Servomotor", "(4) M3x12mm Screw"],
		["(1) Servomotor Disk", "(1) GripperActiveArm", "(3) Servomotor Screw"],
		["(1) GripperPassiveArm", "(1) GripperBodyTop", "(1) M3x12mm Screw", "(2) M3x20mm Screw"],
		["(2) GripperArm", "(2) M3 Nut", "(2) M3x20mm Screw"],
		["(1) GripperFingerRight", "(1) GripperFingerLeft", "(4) M3 Lock Nut", "(4) M3x16mm Screw"]
	],
	[
		["(1) Art4Body", "(12)  M3 Nut"],
		["(2) 625ZZ Bearing"],
		["(1) Art56MotorCoverRing", "(2) M3 Nut", "(1) M5 Nut", "(1) 625ZZ Bearing", "(1) CommonbearingFixThrough", "(2) M3x8mm Screw"],
		["(1) Art56GearPlate", "(1) 625ZZ Bearing", "(3) M3 Nut"],
		["(1) M5x18mm Screw"],
		["(1) 102x5mm Rod", "(2) Art56SmallGear", "(2) GT2x40 Pulley", "(2) GT2x208 Belt", "(2) M3x6mm Screw"],
		["(2) Art4BearingFix", "(4) M3x8mm Screw"],
		["(1) Microswitch", "(2) M2 Nut", "(2) M2x10mm Screw"],
		["(1) Servo Connector", "(2) M2 Nut", "(2) M2x6mm Screw"],
		["(2) Nema 17x34mm", "(2) GT2x20 Pulley", "(2) Art56MotorHolderA", "(2) Art56MotorHolderB", "(4) M3 Nut", "(8) M3x28mm Screw", "(8) M3x8mm Screw"],
		["(1) Art4BodyBot", "(8) M3 Nut"],
		["(4) M3x12mm Screw"], 
		["(4) M3x30mm Screw"],
		["(2) Art4bodyFan", "(2) 40x40mm Fan", "(8) M3x16mm Screw"],
		["(1) Art4BearingRing", "(1) Art4TransmissionColumn", "(30) 6mm Plastic Balls", "(8) M3 Nut", "(4) M3x16mm Screw"],
		["(1) Art4Optodisk", "(4) M3x8mm Screw"]
	],
	[
		["(1) Art3Body", "(7) M3 Nut"],
		["(1) 40x40mm Fan", "(4) M3 Nut", "(4) M3x12mm Screw"],
		["(1) Nema 17x34mm", "(1) Art4MotorFix", "(2) M3 Nut", "(4) M3x8mm Screw"],
		["(1) Art4MotorGear", "(1) M3 Nut", "(1) M3x8mm Screw"],
		["(2) M3x6mm Screw"],
		["(1) M3 Nut", "(1) OptoSwitch", "(1) M3x8mm Screw"],
		["(1) 625ZZ Bearing", "(1) CommonbearingFixThrough", "(2) M3x8mm Screw"],
		["(1) Art23Optodisk", "(2) M3x8mm Screw"],
		["(1) Art3Pulley", "(2) M3 Nut", "(1) 625ZZ Bearing", "(1) CommonbearingFixThrough", "(2) M3x8mm Screw"],
		["(1) GT2 Belt", "(1) M3 Nut", "(1) M3x16mm Screw"],
		["(3) M3x25mm Screw"]
	],
	[
		["(4) M3x18mm Screw"],
		["(3) M3x12mm Screw"]
	],
	[
		["(1) Art1Body", "(4) M3 Nut"],
		["(3) Nema 17 Gearbox"],
		["(2) Art2MotorGear", "(2) M3 Nut", "(2) M3x8mm Screw", "(1) GT2x20 Pulley"],
		["(1) Art2BodyACover", "(10) M3x40mm Screw"],
		["(8) M3x20mm Screw"],
		["(1) 625ZZ Bearing", "(1) CommonbearingFixThrough", "(2) M3x8mm Screw"],
		["(1) Art23Optodisk", "(2) M3x8mm Screw"]
	],
	[
		["(1) Art2BodyA", "(6) M3 Nut"],
		["(2) M3x25mm Screw", "(2) Art3TensionerBody", "(2) M3 Nut", "(2) 14x4mm Rod"],
		["(2) MF84ZZ Bearing", "(2) Art3TensionerPulley"],
		["(1) Art2BodyACover", "(1) M3x12mm Screw"],
		["(1) Art2BodyAWindow", "(2) M3 Nut", "(3) M3x12mm Screw"],
		["(2) 625ZZ Bearing", "(2) CommonbearingFix", "(4) M3x8mm Screw"],
		["(1) Art2BodyB", "(10) M3 Nut"],
		["(2) 625ZZ Bearing", "(2) CommonbearingFix", "(4) M3x8mm Screw"],
		["(2) OptoSwitch", "(4) M3x8mm Screw"],
		["(1) Art2BodyBCover", "(2) M3x12mm Screw"],
		["(1) Art2Union", "(8) M3 Nut", "(4) M3x40mm Screw"]
	],
	[
		["(1) 128x5mm Rod"],
		["(1) 32x5mm Rod"],
		["(1) 14.5mm Rod"],
		["(4) M3x40mm Screw"],
		["(6) 5mm Disk-Magnet"],
		["(2) Art2SideCover", "(6) 5mm Disk-Magnet"]
	],
	[
		["(1) BaseBot", "(3) M3 Nut"],
		["(1) 40x40mm Fan", "(4) M3 Nut", "(2) M3x40mm Screw", "(2) M3x16mm Screw"],
		["(2) M3 Nut", "(1) OptoSwitch", "(2) M3x12mm Screw"],
		["(1) Nema 17x40mm", "(1) Art1GearMotor", "(1) M3 Nut", "(1) M3x10mm Screw"],
		["(4) M3x30mm Screw"],
		["(1) BaseBoxBody", "(4) M3 Nut"],
		["(1) DC Jack", "(1) DC Jack Nut"],
		["(6) Heat Inserts"],
		["(1) Mega 2560", "(6) M3x10mm Screw"],
		["(4) 40x40mm Fan", "(16) M3 Nut", "(16) M3x18mm Screw"],
		["(4) M5 Nut", "(4) M5x25mm Screw"],
		["(1) Art1Bot", "(3) M3 Nut"],
		["(1) BaseTop", "(1) 16014ZZ Bearing"],
		["(1) BaseBearingFix", "(3) M3x40mm Screw"],
		["(1) Art1Top", "(4) M3 Nut", "(3) M3x25mm Screw","(2) 40x40mm Fan"]
	],
	[
		["(4) M3x16mm Screw"],
		["(1) BaseBoxCover", "(1) On/Off Button", "(1) Home Button", "(2) Button Nut"],
		["(4) M3x12mm Screw"]
	]
];

var showObjects = [
	[
		['BG00', 'BG01', 'BG01.001', 'BG02', 'BG04', 'BG05', 'BG06', 'BG07', 'BG25', 'BG26'],
		['BG08', 'BG09', 'BG10', 'BG11', 'BG12'],
		['BG13', 'BG14', 'BG15', 'BG16', 'BG17'],
		['BG18', 'BG19', 'BG20', 'BG21', 'BG22'],
		['BG23', 'BG24', 'BG27','BG28'],
		['BG29', 'BG30', 'BG31', 'BG32', 'BG33', 'BG34', 'BG35', 'BG36', 'BG37', 'BG38']
	],
	[
		['BT00', 'BT00.', 'BT01', 'BT02', 'BT03', 'BT04', 'BT05', 'BT06', 'BT07', 'BT08', 'BT09', 'BT10', 'BT11'],
		['BT12', 'BT13'],
		['BT14', 'BT14.', 'BT14..', 'BT15', 'BT16', 'BT17', 'BT18', 'BT19'],
		['BT20', 'BT21', 'BT22', 'BT23', 'BT24'],
		['BT25'],
		['BT26', 'BT27', 'BT28', 'BT29', 'BT30', 'BT31', 'BT32', 'BT33', 'BT34'],
		['BT35', 'BT36', 'BT37', 'BT38', 'BT39', 'BT40'],
		['BT41', 'BT42', 'BT43', 'BT44', 'BT45'],
		['BT46', 'BT47', 'BT48', 'BT49', 'BT50'],
		['BT51', 'BT52', 'BT53', 'BT54', 'BT55', 'BT56', 'BT57', 'BT58', 'BT59', 'BT60', 'BT61', 'BT62', 'BT63', 'BT64', 'BT65', 'BT66', 'BT67', 'BT68', 'BT69', 'BT70', 'BT71', 'BT72', 'BT73', 'BT74', 'BT75', 'BT76', 'BT77', 'BT78', 'BT79', 'BT80'],
		['BT81', 'BT82', 'BT83', 'BT84', 'BT85', 'BT86', 'BT87', 'BT88', 'BT89'],
		['BT90', 'BT91', 'BT92', 'BT93'],
		['BT94', 'BT95', 'BT96', 'BT97'],
		['BT98', 'BT99', 'BT100', 'BT101', 'BT102', 'BT103', 'BT104', 'BT105', 'BT106', 'BT107', 'BT108', 'BT109'],
		['BT110', 'BT111', 'BT112', 'BT113', 'BT114', 'BT115', 'BT116', 'BT117', 'BT118', 'BT119', 'BT120', 'BT121', 'BT122', 'BT123', 'BT124', 'BT125', 'BT126', 'BT127', 'BT128', 'BT129', 'BT130', 'BT131', 'BT132', 'BT133', 'BT134', 'BT135', 'BT136', 'BT137', 'BT138', 'BT139', 'BT140', 'BT141', 'BT142', 'BT143'],
		['BT144', 'BT145', 'BT146', 'BT147', 'BT148']
	],
	[
		['BM00', 'BM01', 'BM02', 'BM03', 'BM04', 'BM05', 'BM06', 'BM07'],
		['BM08', 'BM09', 'BM10', 'BM11', 'BM12', 'BM13', 'BM14', 'BM15', 'BM16'],
		['BM17', 'BM18', 'BM19', 'BM20', 'BM21', 'BM22', 'BM23', 'BM24'],
		['BM25', 'BM26', 'BM27'],
		['BM28', 'BM29'],
		['BM30', 'BM31', 'BM32'],
		['BM33', 'BM34', 'BM35', 'BM36'],
		['BM37', 'BM38', 'BM39'],
		['BM40', 'BM40.', 'BM40..', 'BM41', 'BM42', 'BM43', 'BM44'],
		['BM45', 'BM46', 'BM47'],
		['BM48', 'BM49', 'BM50']
	],
	[
		['Art4-.044', 'Art4-.045', 'Art4-.046', 'Art4-.047'],
		['Art56-.074', 'Art56-.075', 'Art56-.076']
	],
	[
		['BA00', 'BA01', 'BA02', 'BA03', 'BA04'],
		['BA05', 'BA06', 'BA07'],
		['BA08', 'BA09', 'BA10', 'BA11', 'BA12', 'BA13', 'BA14', 'BA15'],
		['BA16', 'BA17', 'BA18', 'BA19', 'BA20', 'BA21', 'BA22', 'BA23', 'BA24', 'BA25', 'BA26'],
		['BA27', 'BA28', 'BA29', 'BA30', 'BA31', 'BA32', 'BA33', 'BA34'],
		['BA35', 'BA36', 'BA37', 'BA38'],
		['BA39', 'BA40', 'BA41']
	],
	[
		['BB001', 'BB002', 'BB003', 'BB004', 'BB005', 'BB006', 'BB007'],
		['BB008', 'BB009', 'BB010', 'BB011', 'BB012', 'BB013', 'BB014', 'BB015'],
		['BB016', 'BB017', 'BB018', 'BB019'],
		['BB020', 'BB021'],
		['BB022', 'BB023', 'BB024', 'BB025', 'BB026', 'BB027'],
		['BB028', 'BB029', 'BB030', 'BB031', 'BB032', 'BB033', 'BB034', 'BB035'],
		['BB036', 'BB037', 'BB038', 'BB039', 'BB040', 'BB041', 'BB042', 'BB043', 'BB044', 'BB045', 'BB046'],
		['BB047', 'BB048', 'BB049', 'BB050', 'BB051', 'BB052', 'BB053', 'BB054'],
		['BB055', 'BB056', 'BB057', 'BB058', 'BB059', 'BB060'],
		['BB061', 'BB062', 'BB063'],
		['BB064', 'BB065', 'BB066', 'BB067', 'BB068', 'BB069', 'BB070', 'BB071', 'BB072', 'BB073', 'BB074', 'BB075', 'BB076']
	],
	[
		['ShaftArt3'],
		['BB077.001'],
		['BB077'],
		['BB078', 'BB079', 'BB080', 'BB081'],
		['BB082', 'BB083', 'BB084', 'BB085', 'BB086', 'BB087'],
		['BB088', 'BB089', 'BB090', 'BB091', 'BB092', 'BB093', 'BB094', 'BB095']
	],
	[
		['BC001', 'BC002', 'BC003', 'BC004'],
		['BC005', 'BC006', 'BC007', 'BC008', 'BC009', 'BC010', 'BC011', 'BC012', 'BC013'],
		['BC014', 'BC015', 'BC016', 'BC017', 'BC018'],
		['BC019', 'BC020', 'BC021', 'BC022'],
		['BC023', 'BC024', 'BC025', 'BC026'],
		['BC027', 'BC028', 'BC029', 'BC030', 'BC031'],
		['BC032', 'BC033'],
		['BC034', 'BC035', 'BC036', 'BC037', 'BC038', 'BC039'],
		['BC040', 'BC041', 'BC042', 'BC043', 'BC044', 'BC045', 'BC046'],
		['BC047', 'BC048', 'BC049', 'BC050', 'BC051', 'BC052', 'BC053', 'BC054', 'BC055', 'BC056', 'BC057', 'BC058', 'BC059', 'BC060', 'BC061', 'BC062', 'BC063', 'BC064', 'BC065', 'BC066', 'BC067', 'BC068', 'BC069', 'BC070', 'BC071', 'BC072', 'BC073', 'BC074', 'BC075', 'BC076', 'BC077', 'BC078', 'BC079', 'BC080', 'BC081', 'BC082'],
		['BC083', 'BC084', 'BC085', 'BC086', 'BC087', 'BC088', 'BC089', 'BC090'],
		['BC091', 'BC092', 'BC093', 'BC094'],
		['BC095', 'BC096'],
		['BC097', 'BC098', 'BC099', 'BC100'],
		['BC101', 'BC102', 'BC103', 'BC104', 'BC105', 'BC106', 'BC107', 'BC108'],
		['BC109', 'BC110']
	],
	[
		['BC111', 'BC112', 'BC113', 'BC114'],
		['BC115', 'BC116', 'BC117', 'BC118', 'BC119'],
		['BC120', 'BC121', 'BC122', 'BC123']
	]
];


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

	var buttonStartAssembly_elem = document.getElementById("StartButton");
    buttonStartAssembly_elem.addEventListener("mousedown", button_start_assembly_click, false);
	
    var buttonPrevious_elem = document.getElementById("buttonPrevious");
    buttonPrevious_elem.addEventListener("mousedown", button_previous_click, false);

    var buttonReplay_elem = document.getElementById("buttonReplay");
    buttonReplay_elem.addEventListener("mousedown", button_replay_click, false);

    var buttonNext_elem = document.getElementById("buttonNext");
    buttonNext_elem.addEventListener("mousedown", button_next_click, false);
	
	var buttonNextStep_elem = document.getElementById("buttonNextStep");
    buttonNextStep_elem.addEventListener("mousedown", button_next_step_click, false);
	
	var buttonPreviousStep_elem = document.getElementById("buttonPreviousStep");
    buttonPreviousStep_elem.addEventListener("mousedown", button_previous_step_click, false);

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
    m_nla.stop();
	var camera = m_scenes.get_active_camera();
	var TARGET_DIST_LIMITS = { min: 1000, max: 5000 };
	var POS = new Float32Array([707.03, -1257.05, 843.869]);
	var LOOK_AT = new Float32Array([0, 95, 350]);
	m_cam.set_velocities(camera, {zoom:0.01});
	m_cam.target_setup(camera, { pos: POS, pivot: LOOK_AT,
        dist_lim: TARGET_DIST_LIMITS, use_panning: false});
	m_cam_ani.auto_rotate(0.2);
	m_nla.set_frame(10000);
	document.getElementById("StartButton").style.display = "block";
	
	
}

function button_start_assembly_click(e) {
    document.getElementById("StartButton").style.display = "none";
	m_cam_ani.auto_rotate(0);
	hideAllObjects();
	m_cam.eye_setup(m_scenes.get_active_camera())
	m_nla.set_frame(keyframes[partIndex][animationIndex]);
    m_nla.set_range(keyframes[partIndex][animationIndex], keyframes[partIndex][animationIndex+1]);
    listItems(animationIndex);
	hideShowObjects(animationIndex);
    animationIndex++;
    document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
    m_nla.play();
}

function button_previous_click(e) {
    if (animationIndex>1 && !m_nla.is_play()){
        m_nla.set_frame(keyframes[partIndex][animationIndex-2]);
		m_nla.set_range(keyframes[partIndex][animationIndex-2], keyframes[partIndex][animationIndex-1]);
        listItems(animationIndex-2);
		hideShowObjects(animationIndex-1)
		animationIndex--;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
		m_nla.play();
    }
	
	else if (animationIndex<=1 && !m_nla.is_play() && partIndex>0){
		hideShowObjects(animationIndex-1)
		partIndex--;
		animationIndex=keyframes[partIndex].length-1;
		m_nla.set_frame(keyframes[partIndex][animationIndex-1]);
		m_nla.set_range(keyframes[partIndex][animationIndex-1], keyframes[partIndex][animationIndex]);
        listItems(animationIndex-1);
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
		document.getElementById("stepTitle").innerHTML = assemblyTitles[partIndex];
		m_nla.play();
	}
	
}

function button_replay_click(e) {
    if (animationIndex>0 && !m_nla.is_play()){
        m_nla.set_frame(keyframes[partIndex][animationIndex-1]);
        m_nla.set_range(keyframes[partIndex][animationIndex-1], keyframes[partIndex][animationIndex]);
        m_nla.play();
    }
}

function button_next_click(e) {
    if (animationIndex<keyframes[partIndex].length-1 && !m_nla.is_play()){
        m_nla.set_frame(keyframes[partIndex][animationIndex]);
        m_nla.set_range(keyframes[partIndex][animationIndex], keyframes[partIndex][animationIndex+1]);
        listItems(animationIndex);
		hideShowObjects(animationIndex);
        animationIndex++;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
        m_nla.play();
    }
	
	else if (animationIndex>=keyframes[partIndex].length-1 && !m_nla.is_play() && partIndex<assemblyTitles.length-1){
		partIndex++;
		animationIndex=0;
		m_nla.set_frame(keyframes[partIndex][animationIndex]);
        m_nla.set_range(keyframes[partIndex][animationIndex], keyframes[partIndex][animationIndex+1]);
        listItems(animationIndex);
		hideShowObjects(animationIndex);
        animationIndex++;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
		document.getElementById("stepTitle").innerHTML = assemblyTitles[partIndex];
        m_nla.play();
	}
	
}

function button_previous_step_click(e) {
    if (partIndex>0 && !m_nla.is_play()){
		for(var j=0; j<showObjects[partIndex].length; j++){
			for(var i=0; i<showObjects[partIndex][j].length; i++){
				m_scenes.hide_object(m_scenes.get_object_by_name(showObjects[partIndex][j][i]));
			}
		}
		partIndex--;
		for(var j=0; j<showObjects[partIndex].length; j++){
			for(var i=0; i<showObjects[partIndex][j].length; i++){
				m_scenes.hide_object(m_scenes.get_object_by_name(showObjects[partIndex][j][i]));
			}
		}
		animationIndex=0;
        m_nla.set_frame(keyframes[partIndex][animationIndex]);
        m_nla.set_range(keyframes[partIndex][animationIndex], keyframes[partIndex][animationIndex+1]);
        listItems(animationIndex);
		hideShowObjects(animationIndex);
        animationIndex++;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
		document.getElementById("stepTitle").innerHTML = assemblyTitles[partIndex];
        m_nla.play();
    }
}

function button_next_step_click(e) {
    if (partIndex<assemblyTitles.length-1 && !m_nla.is_play()){
		for(var j=0; j<showObjects[partIndex].length; j++){
			for(var i=0; i<showObjects[partIndex][j].length; i++){
				m_scenes.show_object(m_scenes.get_object_by_name(showObjects[partIndex][j][i]));
			}
		}
		partIndex++;
		animationIndex=0;
        m_nla.set_frame(keyframes[partIndex][animationIndex]);
        m_nla.set_range(keyframes[partIndex][animationIndex], keyframes[partIndex][animationIndex+1]);
        listItems(animationIndex);
		hideShowObjects(animationIndex);
        animationIndex++;
        document.getElementById("stepCounter").innerHTML = animationIndex.toString().concat("/").concat((keyframes[partIndex].length-1).toString());
		document.getElementById("stepTitle").innerHTML = assemblyTitles[partIndex];
        m_nla.play();
    }
}


function listItems(i){
    deleteListItems();
    var list = document.getElementById('list');
    for (var j=0; j<materials[partIndex][i].length; j++){
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(materials[partIndex][i][j]));
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
	var scene_object_list = m_scenes.get_all_objects("MESH");
	for (var j=0; j<scene_object_list.length; j++){
		m_scenes.hide_object(scene_object_list[j]);
	}
}

function hideShowObjects(animationIndex){
	for (var j=0; j<showObjects[partIndex][animationIndex].length; j++){
		hideShow(showObjects[partIndex][animationIndex][j]);
	}
}

function hideShow(objectName){
	var objectHideShow = m_scenes.get_object_by_name(objectName);
	if (m_scenes.is_hidden(objectHideShow)){
		m_scenes.show_object(objectHideShow);
	}
	else{
		m_scenes.hide_object(objectHideShow);
	}
}


});

// import the app module and start the app by calling the init method
b4w.require("ThorAssembly_main").init();
