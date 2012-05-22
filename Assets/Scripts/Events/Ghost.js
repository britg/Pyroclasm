#pragma strict

var Ymax : float = 5.0;
var Ymin : float = 1.0;
var vel : float = 0.1;

private var dir : Direction;
private var thisTransform : Transform;

function Start () {
	thisTransform = transform;
	dir = Direction.Up;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_GHOST);
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

function OnBecameInvisible() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GHOST_END);
}

function OnTriggerEnter(collider : Collider) {
	
	var obj : GameObject = collider.gameObject;
	var test : Temperature = obj.GetComponent("Temperature");
	
	if(test) {
		var acquisitionBurn : GameObject = gameObject.Find("ScrollAcquisitionBurn");
		var emitter : ParticleEmitter = acquisitionBurn.GetComponent.<ParticleEmitter>();
		emitter.emit = true;
		
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_ACQUIRED);
	}
}

function OnTriggerGhost() {
	Insert();
}

function Insert() {
	if(transform.position.x > -9.73 && transform.position.x < 6.68) {
		return;
	}
	gameObject.SetActiveRecursively(true);
	transform.position.x = 15;
	var ghostMotor : Motor = gameObject.GetComponent("Motor");
	ghostMotor.factor = 0.5;
	transform.position.y = Random.value * 4;
	
	var acquisitionBurn : GameObject = gameObject.Find("ScrollAcquisitionBurn");
	var emitter : ParticleEmitter = acquisitionBurn.GetComponent.<ParticleEmitter>();
	emitter.emit = false;
}