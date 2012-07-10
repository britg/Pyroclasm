#pragma strict

private var gemCount : int;

function Start () {
	Notification.Observe(this, Notification.GEM_COLLECTED);
}

function OnGemCollected (n : Notification) {
	gemCount++;
}