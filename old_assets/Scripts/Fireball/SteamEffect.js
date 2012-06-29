#pragma strict

private var thisEmitter : ParticleEmitter;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ICE_COLLISION);
	thisEmitter = gameObject.GetComponent.<ParticleEmitter>(); 
}

function Update () {

}

function OnIceCollision () {
	thisEmitter.emit = true;
	yield WaitForSeconds(0.5);
	thisEmitter.emit = false;
}

