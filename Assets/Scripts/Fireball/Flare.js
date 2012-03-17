
var which : int = 1;

private var thisTransform : Transform;
private var intensity : GameObject;
private var fireball : GameObject;

function Start() {
	thisTransform = transform;
	intensity = gameObject.Find("Intensity");
	
	Deactivate();
	
	fireball = GameObject.Find("Fireball");
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_LEVEL_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.FLARE_USED);
	
	switch(which) {
	
		case 1:
			transform.localPosition = Vector3(1.414, 1.414, 0);
		break;
		case 2:
			transform.localPosition = Vector3(-2.0, 0, 0);
		break;
		case 3:
			transform.localPosition = Vector3(1.414, -1.414, 0);
		break;
	
	}
}

function Update () {
	Spin();
}

function Spin() {
	transform.RotateAround(fireball.transform.position, Vector3(0, 0, 1), 300*Time.deltaTime);
}

function OnStreakLevelChange (notification : Notification) {
	var streakLevel : int = notification.data;
	
	var whichFlare = (streakLevel - 1);
	
	if (which == whichFlare) {
		Activate();
	} 
	
}

function Activate () {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ANNOUNCEMENT, "Flare!");
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.FLARE_COUNT_CHANGED, which);
	intensity.SetActiveRecursively(true);
}

function Deactivate () {
	intensity.SetActiveRecursively(false);
}

function OnFlareUsed (notification : Notification) {
	var whichFlare : int = notification.data;
	
	if(whichFlare == which) {
		Deactivate();
	}
}