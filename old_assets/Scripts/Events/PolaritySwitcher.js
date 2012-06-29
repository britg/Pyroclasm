#pragma strict

var Ymax : float = 5.0;
var Ymin : float = 0.0;
var vel : float = 1;

private var dir : Direction;
private var thisTransform : Transform;

private var shouldEnter : boolean = false;
private var shouldLeave : boolean = false;
private var enterVelocity : Vector3;
private var enterDuration : float = 1.0;
private var transitionTime : float = 0.0;
private var enterX : float = 6.2;
private var exitX : float = 11;

var bolt : GameObject;

private var spellCaster : GameObject;

private var fireBall : GameObject;

var polarityTime : float = 20.0;
private var isReversed : boolean = false;
private var currPolarityTime : float = 0.0;

function Start () {
	thisTransform = transform;
	dir = Direction.Up;
	spellCaster = gameObject.Find("Spellcaster");
	fireBall = GameObject.Find("Fireball");
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_POLARITY_SWITCH);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLARITY_SWITCH_END);
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
	
	if(isReversed) {
		currPolarityTime += Time.deltaTime;
		if(currPolarityTime >= polarityTime) {
			Unpolerize();
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
	thisTransform.position.y = fireBall.transform.position.y-1;
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

function OnTriggerPolaritySwitch() {
	
	if(isReversed) {
		Debug.Log("Already switched! Ending...");
		yield WaitForSeconds(1);
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.POLARITY_SWITCH_END);	
		return;
	}
	
	shouldEnter = true;
	transitionTime = 0.0;
	gameObject.audio.Play();
}

function OnPolaritySwitchEnd() {
	transitionTime = 0.0;
}

function Enter() {
	var pos : Vector3 = transform.position;
	var newPos : Vector3 = Vector3(enterX, pos.y, pos.z);
	transform.position = Vector3.SmoothDamp(pos, newPos, enterVelocity, enterDuration);
}

function StopEntering() {
	shouldEnter = false;
	Shoot();
}


function Shoot() {
	yield WaitForSeconds(1);
	Debug.Log("Reversing Polarity!!");
	spellCaster.audio.Play();
	var start : Vector3 = spellCaster.transform.position;
	start.z = -1;
	Instantiate(bolt, start, Quaternion.identity);
	yield WaitForSeconds(2);
	StartLeaving();
	StartPolarityTimer();
}

function StartLeaving() {
	shouldLeave = true;
	transitionTime = 0.0;
}

function Leave() {
	var pos : Vector3 = transform.position;
	var newPos : Vector3 = Vector3(exitX, pos.y, pos.z);
	transform.position = Vector3.SmoothDamp(pos, newPos, enterVelocity, enterDuration);
}

function StopLeaving() {
	Debug.Log("Done leaving!");
	shouldLeave = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.POLARITY_SWITCH_END);
}

function StartPolarityTimer() {
	currPolarityTime = 0.0;
	isReversed = true;
}

function Unpolerize() {
	Debug.Log("Unpolerizing!");
	isReversed = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.UNPOLERIZE);
}