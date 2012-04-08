#pragma strict

private var thisEmitter : ParticleEmitter;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_ENDED);
	
	thisEmitter = transform.Find("Glow").GetComponent.<ParticleEmitter>(); 
}

function Update () {

}

function OnStreakStart () {
	thisEmitter.emit = true;
}

function OnStreakEnd () {
	thisEmitter.emit = false;
}