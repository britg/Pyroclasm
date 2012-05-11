#pragma strict

var scrollAcquiredSound : AudioClip;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ACQUIRED);
}

function Update () {

}

function OnScrollAcquired() {
	gameObject.audio.PlayOneShot(scrollAcquiredSound);
	var scroll : Hashtable = Scrolls.PlayerScrolls().AcquireScroll();
	
	Debug.Log("Acquired Scroll " + scroll["name"]);
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_AWARDED, scroll);
}