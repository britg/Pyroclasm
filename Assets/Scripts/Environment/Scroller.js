var velocity : float = 5;
var acceleration : float = 0.5;

function Update() {

	velocity += acceleration * Time.deltaTime;

}