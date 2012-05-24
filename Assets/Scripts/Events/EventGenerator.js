#pragma strict

private var fireBall : GameObject;
private var temp : Temperature;
private var events : Array = ["Ghost", "Wraith", "GemDemon", "PolaritySwitch"/*, "Dragon"*/];
private var helpfulEvents : Array = ["Ghost", "GemDemon"];
private var badEvents : Array = ["Ghost", "Wraith", "PolaritySwitch"];

var helpfulEventChance : float = 40.0;

function Start () {
	fireBall = GameObject.Find("Fireball");
	temp = fireBall.GetComponent("Temperature");
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_REQUESTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.WRAITH_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GHOST_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GEM_DEMON_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.DRAGON_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLARITY_SWITCH_END);
}

function Update () {

}

function OnEventRequested() {
	
	//var e : String = events[Mathf.Floor(Random.value*events.length)];
	//e = "Dragon" // Override for development
	//e = "PolaritySwitch";
	//e = "Ghost";
	
	var e = ChooseEvent();
	var msg : String = "Activate" + e;
	Debug.Log(msg);
	SendMessage(msg);
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_STARTED);
}

function ChooseEvent() {
	var per : float = temp.GetHeatPercentage();
	var e : String;
	if(per <= helpfulEventChance) {
		e = helpfulEvents[Mathf.Floor(Random.value*helpfulEvents.length)];
	} else {
		e = badEvents[Mathf.Floor(Random.value*badEvents.length)];
	}
	
	return e;
}

// Wraith

function ActivateWraith() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_WRAITH);
}

function OnWraithEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}

// Ghost

function ActivateGhost() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_GHOST);
}

function OnGhostEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}

// Gem Demon

function ActivateGemDemon() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_GEM_DEMON);
}

function OnGemDemonEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}

// Dragon

function ActivateDragon() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_DRAGON);
}

function OnDragonEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}

// Polarity Switch

function ActivatePolaritySwitch() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TRIGGER_POLARITY_SWITCH);
}

function OnPolaritySwitchEnd() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.EVENT_ENDED);
}