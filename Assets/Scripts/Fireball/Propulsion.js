#pragma strict

var startForce : Vector3 = Vector3(5, 0, 0);

function Start () {
	rigidbody.AddForce(startForce);
}

function Update () {

}