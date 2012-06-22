#pragma strict

var Ymax : float = 6.5;
var Ymin : float = 3.0;
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

private var shouldShoot : boolean = false;
private var shootPause : float = 0.2;
private var shootTime : float = 0.0;
private var shootDuration : float = 10.0;
private var currShootDuration : float = 0.0;

private var spellCaster : GameObject;
var wraithBolt : GameObject;
private var wraithBoltPool : GameObjectPool;

function Start () {
	thisTransform = transform;
	dir = Direction.Up;
	spellCaster = gameObject.Find("Spellcaster");
	
	wraithBoltPool = GameObjectPool( wraithBolt, 5, true );
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_WRAITH);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.WRAITH_END);
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
	
	if(shouldShoot) {
		shootTime += Time.deltaTime;
		currShootDuration += Time.deltaTime;
		if(shootTime >= shootPause) {
			Shoot();
		}
		
		if(currShootDuration >= shootDuration) {
			StopShooting();
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
	} else {
		thisTransform.position.y -= vel * Time.deltaTime;
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

function OnTriggerWraith() {
	shouldEnter = true;
	transitionTime = 0.0;
	gameObject.audio.Play();
}

function OnWraithEnd() {
	transitionTime = 0.0;
}

function Enter() {
	var pos : Vector3 = transform.position;
	var newPos : Vector3 = Vector3(enterX, pos.y, pos.z);
	transform.position = Vector3.SmoothDamp(pos, newPos, enterVelocity, enterDuration);
}

function StopEntering() {
	shouldEnter = false;
	StartShooting();
}

function StartShooting() {
	Debug.Log("Starting to shoot");
	shouldShoot = true;
	currShootDuration = 0.0;
	shootTime = 0.0;
}

function Shoot() {
	Debug.Log("Shooting!");
	spellCaster.audio.Play();
	shootTime = 0.0;
	var start : Vector3 = spellCaster.transform.position;
	start.z = -1;
	wraithBoltPool.Spawn(start, Quaternion.identity);
}

function StopShooting() {
	Debug.Log("Stopping shoot");
	shouldShoot = false;
	shouldLeave = true;
	gameObject.audio.Play();
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
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.WRAITH_END);
}