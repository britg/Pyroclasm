#pragma strict

var distance : float;
var updateInterval : float;
private var currentUpdateTime : float;

private var startX : float;

function Start () {
	currentUpdateTime = 0.0;
	startX = transform.position.x;
}

function Update () {
	CheckDistanceAnnouncement();
}

function CheckDistanceAnnouncement () {
	currentUpdateTime += Time.deltaTime;
	
	if(currentUpdateTime >= updateInterval) {
		distance = transform.position.x - startX;
		AnnounceDistanceUpdate();
		currentUpdateTime = 0.0;
	}
}

function AnnounceDistanceUpdate () {
	Notification.Post(this, Notification.DISTANCE_UPDATE, distance);
}