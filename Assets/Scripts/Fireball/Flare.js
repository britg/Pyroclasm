
private var thisTransform : Transform;
var direction : String;
var range : float = 5.0;

private var rotation : Quaternion;
private var radius : Vector3 = Vector3(0.1, 0, 0);
private var currentRotation : float = 0.0;

private var fireball : GameObject;

function Start() {
	thisTransform = transform;
	fireball = GameObject.Find("Fireball");
}

function Update () {
	Spin();
}

function Spin() {
	transform.RotateAround(fireball.transform.position, Vector3(0, 0, 1), 500*Time.deltaTime);
}