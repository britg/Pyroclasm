
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

private var maxTemp : float = 2500.0;

var started : boolean = false;

function Start() {
	Time.timeScale = 1.0;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_FIRST);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TEMPERATURE_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ANNOUNCE_MAX_TEMPERATURE);
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
	var temp : int = n.data;
	SetVelocityByHeat(temp);
}

function SetVelocityByHeat(temp : int) {
	velocity = (temp / maxTemp) * 1.2 * maxVelocity + 4.5;
}

function Accelerate() {
	velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
}
