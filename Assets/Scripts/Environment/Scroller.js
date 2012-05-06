
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

var started : boolean = false;

function Start() {
	Time.timeScale = 1.0;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_FIRST);
}

function OnTouchFirst () {
	Begin();
}

function Begin() {
	started = true;
	velocity = startVelocity;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GAME_START);
}

function Update() {

	if(started) {
		Accelerate();
	}
}

function Accelerate() {
	velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
}
