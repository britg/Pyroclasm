
private var thisTransform : Transform;

private var startScale : Vector3 = Vector3(10, 9, 9);
private var isActive : boolean = false;

function Start() {
	thisTransform = transform;
	SendMessage("Update");
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_LEVEL_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POWERDOWN);
}

function Update () {
	thisTransform.Rotate(Time.deltaTime*140, 0, 0);
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
	thisTransform.localScale = Vector3(0, 0, 0);
}
