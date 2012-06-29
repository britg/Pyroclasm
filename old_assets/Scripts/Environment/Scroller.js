
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

private var maxTemp : float = 2500.0;

private var boosting : boolean = false;
var boostMultiplier : float = 2.0;
var boostDuration : float = 1.0;
private var boostCurrentTime : float = 0.0;

var started : boolean = false;

private var currentTemp : float;

function Start() {
	Time.timeScale = 1.0;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_FIRST);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TEMPERATURE_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ANNOUNCE_MAX_TEMPERATURE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.BOOST_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.BOOST_END);
}

function Update() {

	if(boosting) {
		TickBoost();
	}

}

function OnTouchFirst () {
	Begin();
}

function OnMaxTemperatureAnnouncement(n : Notification) {
	maxTemp = n.data;
}

function Begin() {
	started = true;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GAME_START);
}

function OnTemperatureChange (n : Notification) {
	if(!started) {
		return;
	}
	currentTemp = n.data;
	SetVelocity();
}

function SetVelocity() {
	var activeBoost : float = (boosting ? boostMultiplier : 1.0);
	velocity = ((currentTemp / maxTemp) * 1.8 * maxVelocity + 4.5) * activeBoost;
}

function Accelerate() {
	velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
}

function OnBoostStart() {
	boosting = true;
	boostCurrentTime = 0.0;
	SetVelocity();
}

function TickBoost() {
	boostCurrentTime += Time.deltaTime;
	
	if(boostCurrentTime >= boostDuration) {
		EndBoost();
	}
}


function EndBoost() {
	boosting = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.BOOST_END);
	SetVelocity();
}