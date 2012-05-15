#pragma strict

var scrollAcquiredSound : AudioClip;

private var thisDistance : Distance;
private var thisTemperature : Temperature;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ACQUIRED);
	thisDistance = gameObject.GetComponent("Distance");
	thisTemperature = gameObject.GetComponent("Temperature");
}

function Update () {

}

function OnScrollAcquired() {
	gameObject.audio.PlayOneShot(scrollAcquiredSound);
	var scroll : Hashtable = Scrolls.PlayerScrolls().AcquireScroll(thisDistance.distance, thisTemperature.heat);
	
	Debug.Log("Acquired Scroll " + scroll["name"]);
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_AWARDED, scroll);
}