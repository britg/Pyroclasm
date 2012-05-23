#pragma strict

var heatGem : GameObject;

var Ymax : float = 5.0;
var Ymin : float = 1.0;
var vel : float = 0.1;

private var dir : Direction;
private var thisTransform : Transform;

var shouldEmit : boolean = false;
var emitDelay : float = 0.2;
private var currEmitCounter : float = 0.0;

function Start () {
	thisTransform = transform;
	dir = Direction.Up;
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_GEM_DEMON);
}

function Update () {
	Move();
	
	var roll : float = Random.value * 100.0;
	if(roll <= 2) {
		ChangeDirection();
	}
	
	if(shouldEmit) {
		currEmitCounter += Time.deltaTime;
		
		if(currEmitCounter >= emitDelay) {
			EmitGem();
		}
	}
}

function EmitGem() {
	var pos : Vector3 = transform.localPosition;
	pos.z = -1;
	pos.x += 1;
	pos.y += 1;
	var gem : GameObject = Instantiate(heatGem, pos, Quaternion.identity);
	gem.AddComponent("Motor");
	gem.transform.position = pos;
	currEmitCounter = 0.0;
}

function ChangeDirection() {
	if(dir == Direction.Up) {
		dir = Direction.Down;
	} else {
		dir = Direction.Up;
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

function OnBecameVisible () {
	gameObject.audio.Play();
	shouldEmit = true;
}

function OnBecameInvisible() {
	shouldEmit = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GEM_DEMON_END);
}

function Insert() {
	gameObject.SetActiveRecursively(true);
	transform.position.x = -10;
	var ghostMotor : Motor = gameObject.GetComponent("Motor");
	ghostMotor.factor = -0.3;
	transform.position.y = Random.value * 4;
}

function OnTriggerGemDemon() {
	Debug.Log("Trigger gem demon");
	Insert();
}