#pragma strict

var tempToThrustRatio : float = 1.0/200.0;

function Start () {
	Notification.Observe(this, Notification.START_TEMP);
	Notification.Observe(this, Notification.TEMP_CHANGE);
}

function Update () {

}

function OnStartTemp (n : Notification) {
	var temp : int = n.data;
	SetVelocityFromTemp(temp);
}

function OnTempChange (n : Notification) {
	var data : Hashtable = n.data;
	var temp : int = data["temp"];
	SetVelocityFromTemp(temp);
}

function SetVelocityFromTemp (temp : int) {
	var newVel : float = temp * tempToThrustRatio;
	rigidbody.velocity = Vector3(newVel, 0, 0);
}