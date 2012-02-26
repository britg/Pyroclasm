
private var thisTransform : Transform;
var direction : String;
var range : float = 10.0;

function Start() {
	thisTransform = transform;
}

function Update () {

}

function Spin() {

	var y : float = thisTransform.localPosition.y;
	
	if(y >= range) {
		direction = "down";
	}
	
	if(y <= -range) {
		direction = "up";
	}
	
	var delta = Time.deltaTime * 50/(Mathf.Abs(y) + 1);

	if(direction == "up") {
		thisTransform.localPosition.y += delta;
	}
	
	if(direction == "down") {
		thisTransform.localPosition.y -= delta;
	}
}