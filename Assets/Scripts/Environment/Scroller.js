
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

private var maxTemp : float = 2500.0;
var boosting : boolean = false;
var boostMultiplier : float = 2.0;

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

function Update() {
	if(started) {
		//Accelerate();
	}
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
	SetVelocity();
}

function OnBoostEnd() {
	boosting = false;
}