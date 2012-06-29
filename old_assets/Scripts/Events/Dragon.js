#pragma strict

var mouth : GameObject;
var firebreath : GameObject;

var Ymax : float = 6.5;
var Ymin : float = 4.0;
var vel : float = 1;

private var shouldEnter : boolean = false;
private var shouldLeave : boolean = false;
private var enterVelocity : Vector3;
private var enterDuration : float = 1.0;
private var transitionTime : float = 0.0;
private var enterX : float = 2.69;
private var exitX : float = 13.0;

private var isBreathing : boolean = false;
private var breathDuration : float = 7.0;
private var currBreathDuration : float = 0.0;

private var dir : Direction;
private var thisTransform : Transform;


function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_DRAGON);
	dir = Direction.Up;
	thisTransform = transform;
}

function Update () {

	Move();

	if(shouldEnter) {
		Enter();
		
		transitionTime += Time.deltaTime;
		if(transitionTime >= enterDuration*3) {
			StopEntering();
		}
	}
	
	if(isBreathing) {
		currBreathDuration += Time.deltaTime;
		
		if(currBreathDuration >= breathDuration) {
			StopBreathing();
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


function Move() {

	var currY = thisTransform.position.y;
	
	UpdateDirection(currY);
	
	if(dir == Direction.Up) {
		thisTransform.position.y += vel * Time.deltaTime;
		thisTransform.rotation.z -= vel*(0.04) * Time.deltaTime;
	} else {
		thisTransform.position.y -= vel * Time.deltaTime;
		thisTransform.rotation.z += vel*(0.04) * Time.deltaTime;
	}
	
}

function UpdateDirection(currY : float) {
	if(dir == Direction.Up) {
		if(currY >= Ymax) {
			dir = Direction.Down;
		}
	} else {
		if(currY <= Ymin) {
			dir = Direction.Up;
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

function StopEntering() {
	shouldEnter = false;
	StartBreathing();
}

function StartBreathing() {
	isBreathing = true;
	currBreathDuration = 0.0;
	gameObject.audio.Play();
	firebreath.SetActiveRecursively(true);
}

function StopBreathing() {
	isBreathing = false;
	firebreath.SetActiveRecursively(false);
	shouldLeave = true;
	transitionTime = 0.0;
}

function Leave() {
	var pos : Vector3 = transform.position;
	var newPos : Vector3 = Vector3(exitX, pos.y, pos.z);
	transform.position = Vector3.SmoothDamp(pos, newPos, enterVelocity, enterDuration);
}

function StopLeaving() {
	shouldLeave = false;
	transitionTime = 0.0;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.DRAGON_END);
}
