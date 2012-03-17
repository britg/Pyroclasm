#pragma strict

private var isActive : boolean = false;
private var currActiveTime : float = 0.0;
var activeTime : float = 1.0;
private var splashTime : float;

private var queue : Array = [];

private var originalY : float;
var lift : float = 1.0;
private var targetY : float;
private var liftVelocity : float;

private var originalSize : float;
var scale : float = 2.0;
private var targetSize : float;
private var scaleVelocity : float;

private var thisMesh : TextMesh;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ANNOUNCEMENT);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_LEVEL_CHANGED);
	
	thisMesh = gameObject.GetComponent(TextMesh);
	
	originalY = thisMesh.transform.position.y;
	targetY = originalY + lift;
	
	originalSize = thisMesh.characterSize;
	targetSize = originalSize * scale;
	
	splashTime = activeTime/10.0;
	Debug.Log("Splash time is: " + splashTime);
}

function Update () {
	if(isActive) {
		Splash();
		CheckTimeout();
	}
}

function OnAnnouncement (notification : Notification) {
	var msg : String = notification.data;
	Queue(msg);
}

function Queue(msg) {
	queue.Push(msg);
	ProcessQueue();
}

function ProcessQueue() {

	if(queue.length < 1) {
		return;
	}
	
	if(isActive) {
		return;
	}
	
	var msg = queue.Shift();
	Announce(msg);

}

function Announce (msg : String) {
	thisMesh.transform.position.y = originalY;
	thisMesh.characterSize = originalSize;
	thisMesh.text = msg;
	isActive = true;
}

function CheckTimeout () {
	currActiveTime += Time.deltaTime;
	
	if(currActiveTime >= activeTime) {
		Deactivate();
	}
}

function Splash () {
	var currentY : float = thisMesh.transform.position.y;
	thisMesh.transform.position.y = Mathf.SmoothDamp(currentY, targetY, liftVelocity, splashTime);
	
	var currentSize : float = thisMesh.characterSize;
	thisMesh.characterSize = Mathf.SmoothDamp(currentSize, targetSize, scaleVelocity, splashTime);
}

function Deactivate () {
	thisMesh.text = "";
	currActiveTime = 0.0;
	isActive = false;
	ProcessQueue();
}

function OnStreakLevelChange (notification : Notification) {
	
	var streakLevel : int = notification.data;
	
	switch(streakLevel) {
		case 1:
			Queue("Hot Streak!");
		break;
		case 2:
			Queue("Mega Streak!");
		break;
		case 3:
			Queue("ULTRA Streak!");
		break;
	}

}