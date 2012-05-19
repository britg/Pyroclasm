#pragma strict

function Start () {

	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_REQUESTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.WRAITH_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GHOST_END);

}

function Update () {

}

function OnEventRequested() {
	Debug.Log("Event Requested!");
	var roll : float = Random.value * 100.0;
	
	if(roll < 50.0) {
		ActivateWraith();
	} else {
		ActivateGhost();
	}
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_STARTED);
}

// WRAITH

function ActivateWraith() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_WRAITH);
}

function OnWraithEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}

// GHOST

function ActivateGhost() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_GHOST);
}

function OnGhostEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}