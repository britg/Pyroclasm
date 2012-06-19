var updateInterval = 0.2;
var distanceText : GUIText;

var distance : float = 0;

var Level : GameObject;

private var timeleft : float; // Left time for current interval

private var scrolling : Scroller;

private var bestDistance : int;

function ResetTimer () {
	timeleft = updateInterval;
}

function Start() {
	scrolling = Level.GetComponent("Scroller");
	bestDistance = PlayerPrefs.GetInt("distance");
}

function Update () {
	distance += scrolling.velocity * Time.deltaTime;
	
	timeleft -= Time.deltaTime;
    
    if(timeleft <= 0.0) {
    	DisplayDistance();
    	AnnounceDistance();
    }
    
}

function DisplayDistance() {
	distanceText.text = "" + Mathf.Round(distance) + "m";
}

function AnnounceDistance() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.DISTANCE_UPDATE, Mathf.Round(distance));
}