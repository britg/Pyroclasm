
private var thisTransform : Transform;

private var startScale : Vector3 = Vector3(7, 6, 6);
private var isActive : boolean = false;

private var currActiveTime : float = 0.0;
var activeTime : float = 5.0;

private var fireball : GameObject;
private var streak : Streak;

function Start() {
	thisTransform = transform;
	SendMessage("Update");
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_LEVEL_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POWERDOWN);
	
	fireball = GameObject.Find("Fireball");
	streak = fireball.GetComponent("Streak");
}

function Update () {
	Rotate();
	
	if(isActive) {
		CheckTimeout();
	}
}

function Rotate() {
	thisTransform.Rotate(Time.deltaTime*140, 0, 0);
}

function CheckTimeout() {
	currActiveTime += Time.deltaTime;

	if(currActiveTime >= activeTime && !streak.ongoing) {
		Deactivate();
	}
}

function OnStreakLevelChange (notification : Notification) {
	var streakLevel : int = notification.data;
	
	if(streakLevel >= 1 && !isActive) {
		Activate();
	}
}

function OnPowerDown (notification : Notification) {
	Deactivate();
}

function Activate () {
	isActive = true;
	thisTransform.localScale = startScale;
}

function Deactivate() {
	isActive = false;
	currActiveTime = 0.0;
	thisTransform.localScale = Vector3(0, 0, 0);
}
