#pragma strict

var Ymax : float = 5.0;
var Ymin : float = 1.0;
var vel : float = 0.1;

enum Direction { Up, Down };
private var dir : Direction;
private var thisTransform : Transform;

function Start () {
	thisTransform = transform;
	dir = Direction.Up;
}

function Update () {
	Move();
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

function OnBecameVisible () {
	gameObject.audio.Play();
}

function OnTriggerEnter(collider : Collider) {
	
	var obj : GameObject = collider.gameObject;
	var test : Temperature = obj.GetComponent("Temperature");
	
	Debug.Log("Collision Detected");
	
	if(test) {
		Debug.Log("Fireball!");
		
		var acquisitionBurn : GameObject = gameObject.Find("ScrollAcquisitionBurn");
		var emitter : ParticleEmitter = acquisitionBurn.GetComponent.<ParticleEmitter>();
		emitter.emit = true;
		
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_ACQUIRED);
	}
}