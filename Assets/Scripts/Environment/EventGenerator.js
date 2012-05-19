#pragma strict

private var events : Array = ["ActivateGhost", "ActivateWraith", "ActivateGemDemon"];

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_REQUESTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.WRAITH_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GHOST_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GEM_DEMON_END);
}

function Update () {

}

function OnEventRequested() {
	Debug.Log("Event Requested!");
	
	var e : String = events[Mathf.Floor(Random.value*events.length)];
	//SendMessage(e);
	SendMessage("ActivateGhost");
	
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

// Gem Demon

function ActivateGemDemon() {
	Debug.Log("Activate gem demon notification");
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_GEM_DEMON);
}

function OnGemDemonEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}