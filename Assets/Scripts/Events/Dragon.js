#pragma strict

var mouth : GameObject;

private var shouldEnter : boolean = false;
private var shouldLeave : boolean = false;
private var enterVelocity : Vector3;
private var enterDuration : float = 1.0;
private var transitionTime : float = 0.0;
private var enterX : float = 2.69;
private var exitX : float = 13.0;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_DRAGON);
	
}

function Update () {

	if(shouldEnter) {
		Enter();
		
		transitionTime += Time.deltaTime;
		if(transitionTime >= enterDuration*3) {
			StopEntering();
		}
	}
	
	if(shouldLeave) {
		Leave();
		
		transitionTime += Time.deltaTime;
		if(transitionTime >= enterDuration*3) {
			StopLeaving();
		}
	}

}

function OnTriggerDragon() {
	shouldEnter = true;
	transitionTime = 0.0;
}

function Enter() {
	var pos : Vector3 = transform.position;
	var newPos : Vector3 = Vector3(enterX, pos.y, pos.z);
	transform.position = Vector3.SmoothDamp(pos, newPos, enterVelocity, enterDuration);
}

function StartShooting() {
	gameObject.audio.Play();
}

function StopEntering() {
	shouldEnter = false;
	//StartShooting();
}

function Leave() {
	var pos : Vector3 = transform.position;
	var newPos : Vector3 = Vector3(exitX, pos.y, pos.z);
	transform.position = Vector3.SmoothDamp(pos, newPos, enterVelocity, enterDuration);
}

function StopLeaving() {
	shouldLeave = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.DRAGON_END);
}
