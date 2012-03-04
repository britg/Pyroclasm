
private var thisFireball : GameObject;
private var Temp;

var sizeUpdateInterval : float = 0.2;
private var timeLeft : float;

var wallActive : boolean = false;

function Start() {
	thisFireball = GameObject.Find("Fireball");
	Temp = thisFireball.GetComponent("Temperature");
	ResetTimer();
}

function ResetTimer() {
	timeLeft = sizeUpdateInterval;
}

function Update () {
	timeLeft -= Time.deltaTime;
	
	if(timeLeft <= 0) {
		UpdateSize();
		ResetTimer();
	}
}

function UpdateSize() {

	if(wallActive) {
		return;
	}
	
	var size : float = (0.0 + Temp.heat)/250.0;
	transform.localScale.x = size;
	transform.localScale.y = size;
}

function ActivateWall() {
	wallActive = true;
	transform.localScale.x = 50;
	transform.localScale.y = 50;
}

function DeactivateWall() {
	wallActive = false;
	UpdateSize();
}

