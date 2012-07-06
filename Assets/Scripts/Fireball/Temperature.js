#pragma strict

var initialTemp : int 	= 500;
var maxTemp : int 		= 2500;
var coolRate : float 	= -10;

private var coolTick : float = 1.0;
private var currentCoolTick : float = 0.0;

private var currentTemp : int;

function Awake () {
	currentTemp = initialTemp;
}

function Start () {
	Notification.Post(this, Notification.START_TEMP, currentTemp);
	Notification.Observe(this, Notification.TEMP_COLLISION);
}

function Update () {
	UpdateCoolTick();
}

function UpdateCoolTick () {
	currentCoolTick += Time.deltaTime;
	if (currentCoolTick >= coolTick) {
		CoolOff();
		currentCoolTick = 0;
	}
}

function CoolOff () {
	ChangeTemp(coolRate, false);
}

function ChangeTemp (delta : int) { ChangeTemp(delta, true); }
function ChangeTemp (delta : int, announce : boolean) {
	SetTemp(currentTemp + delta, announce);
}

function SetTemp (temp : int) { SetTemp(temp, true); }
function SetTemp (temp : int, announce : boolean) {
	var newTemp : int = Mathf.Clamp(temp, 0, maxTemp);
	if (newTemp != currentTemp) {
		currentTemp = newTemp;
		
		PostTempChange(announce);
	}
}

function PostTempChange () { PostTempChange(true); }
function PostTempChange (announce : boolean) {
	var tempChangeData : Hashtable = Hashtable();
	tempChangeData["temp"] = currentTemp;
	tempChangeData["announce"] = announce;
	
	Debug.Log("Temp change " + currentTemp);
	Notification.Post(this, Notification.TEMP_CHANGE, tempChangeData);
}

function OnTempCollision (n : Notification) {
	var delta : int = n.data;
	ChangeTemp(delta);
}