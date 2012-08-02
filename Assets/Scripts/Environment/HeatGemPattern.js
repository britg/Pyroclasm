#pragma strict

private var xStart : int = 10;

function OnEnable () {
	transform.position.x = xStart;
	AnnounceLastObjectPosition();
}

function AnnounceLastObjectPosition() {

	var last : Transform;

	for( var child : Transform in transform ) {
		last = child;
	}

	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.HEAT_PATTERN_END, last.localPosition.x);
}

