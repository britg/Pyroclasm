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