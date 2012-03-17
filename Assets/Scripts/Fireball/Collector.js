
private var thisTransform : Transform;

private var startScale : Vector3 = Vector3(7, 6, 6);
private var targetScale : Vector3;
private var isActive : boolean = false;

private var scaleVelocity : Vector3;
var scaleTime : float = 0.5;

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
	
	ChangeSize();
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
	targetScale = startScale;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ANNOUNCEMENT, "Corona Activated!");
}

function Deactivate() {
	isActive = false;
	currActiveTime = 0.0;
	targetScale = Vector3(0, 0, 0);
}

function ChangeSize() {
	if(thisTransform.localScale == targetScale)
		return;
		
	thisTransform.localScale = Vector3.SmoothDamp(thisTransform.localScale, targetScale, scaleVelocity, scaleTime);
}
