
private var thisFireball : GameObject;
private var Temp;

var sizeUpdateInterval : float = 1.0;
private var timeLeft : float;

function Start() {
	thisFireball = transform.gameObject.transform.parent.gameObject;
	Temp = thisFireball.GetComponent("Temperature");
	Debug.Log("Temperature is " + Temp);
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
	var size : float = (0.0 + Temp.heat)/200.0;
	transform.localScale.x = size;
	transform.localScale.y = size;
}

