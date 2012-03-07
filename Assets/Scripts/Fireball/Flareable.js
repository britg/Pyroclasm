
var flare1 : GameObject;
var flare2 : GameObject;
var flare3 : GameObject;

private var flares : Array = [];
private var activeFlares : Array = [];

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_LEVEL_CHANGED);
	flares = [flare1, flare2, flare3];
}

function Update () {
	
}

function OnStreakLevelChange (notification : Notification) {
	var streakLevel : int = notification.data;
	
	Debug.Log("Flareable streak level notification arrived " + streakLevel);
	
	if (activeFlares.length < streakLevel-1 && activeFlares.length < flares.length) {
		ActivateFlare();
	} else {
		//DeactivateFlare();
	}
	
}

function ActivateFlare () {
	
	var flare : GameObject = flares[activeFlares.length];
	flare.SetActiveRecursively(true);
	
	activeFlares.push(flare);
}

function DeactivateFlare () {

	if(activeFlares.length < 1)
		return;
		
	var flare : GameObject = activeFlares.Shift();
	flare.SetActiveRecursively(false);
}