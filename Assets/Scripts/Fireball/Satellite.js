
private var thisTransform : Transform;
var direction : String;
var range : float = 5.0;

function Start() {
	thisTransform = transform;
}

function Update () {
	Spin();
}

function Spin() {

	var y : float = thisTransform.localPosition.y;
	
	if(y >= range) {
		direction = "down";
	}
	
	if(y <= -range) {
		direction = "up";
	}
	
	var delta = Time.deltaTime * 25;

	if(direction == "up") {
		thisTransform.localPosition.y += delta;
	}
	
	if(direction == "down") {
		thisTransform.localPosition.y -= delta;
	}
}