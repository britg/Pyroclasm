#pragma strict

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ACQUIRED);
}

function Update () {

}

function OnScrollAcquired() {
	var scroll : Hashtable = Scrolls.PlayerScrolls().AcquireScroll();
	
	Debug.Log("Acquired Scroll " + scroll["name"]);
}