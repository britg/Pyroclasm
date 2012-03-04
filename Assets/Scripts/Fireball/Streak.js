
var streakText : TextMesh;
var splashText : TextMesh;
private var streakValue : int;
private var streakTime : float;

var streakTimeout : float = 1.0;
var longestStreak : int;

private var originalStreakTextSize : float;
private var originalStreakY : float;

var streakBombReq : int = 250;
var streakTwinsReq : int = 500;
var streakWallReq : int = 1000;

private var streakBombRewarded : boolean = false;
private var streakTwinsRewarded : boolean = false;
private var streakWallRewarded : boolean = false;

var topSatellite : GameObject;
var bottomSatellite : GameObject;
var collector;

var ongoing : boolean;

function Start() {
	ongoing = false;
	longestStreak = 0;
	streakText.renderer.material.color = Color(1.0, 0.376, 0.203, 1.0);
	splashText.renderer.material.color = Color(1.0, 0.376, 0.203, 1.0);
	originalStreakTextSize = streakText.characterSize;
	
	var collectorObject = GameObject.Find("Collector");
}

function Update () {
	
	if((Time.time - streakTime) > streakTimeout) {
		EndStreak();
	}
	
}

function TrackLongestStreak() {
	if(streakValue > longestStreak) {
		longestStreak = streakValue;
	}
}

function UpdateStreak (delta) {

	if(delta < 0) {
		EndStreak();
		return;
	}

	streakTime = Time.time;
	
	if(!ongoing) {
		StartStreak();
	}
	
	IncreaseStreak(delta);
}

function StartStreak() {
	ongoing = true;
	streakText.gameObject.active = true;
	originalStreakTextSize = streakText.characterSize;
}

function IncreaseStreak(delta) {
	streakValue += delta;
	streakText.text = "+" + streakValue + "°";

    if(streakValue >= streakBombReq && !streakBombRewarded) {
        //RewardBomb();
    }

    if((streakValue >= streakTwinsReq) && !streakTwinsRewarded) {
        //ActivateTwins();
    }

    if((streakValue >= streakWallReq) && !streakWallRewarded) {
        //ActivateWall();
    }
	
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/200.0), originalStreakTextSize, 3);
	streakText.characterSize = newSize;
	TrackLongestStreak();
}

function RewardBomb() {
    streakBombRewarded = true;
}

function ActivateTwins() {
    streakTwinsRewarded = true;
    topSatellite.SetActiveRecursively(true);
    bottomSatellite.SetActiveRecursively(true);
    
    splashText.text = "HEAT WAVE!";
    splashText.gameObject.SetActiveRecursively(true);
    yield WaitForSeconds(1);
    splashText.gameObject.SetActiveRecursively(false);
    
    yield WaitForSeconds(10);
    DeactivateTwins();
}

function DeactivateTwins() {
	streakTwinsRewarded = false;
    topSatellite.SetActiveRecursively(false);
    bottomSatellite.SetActiveRecursively(false);
}

function ActivateWall() {
    streakWallRewarded = true;
    collector.ActivateWall();
    
    splashText.text = "FIREWALL ACTIVATED!";
    splashText.gameObject.SetActiveRecursively(true);
    yield WaitForSeconds(1);
    splashText.gameObject.SetActiveRecursively(false);
    
    yield WaitForSeconds(5);
    DeactivateWall();
}


function DeactivateWall() {
    streakWallRewarded = false;
    collector.DeactivateWall();
}

function EndStreak() {
	ongoing = false;
	streakText.gameObject.active = false;
	streakValue = 0;
	streakText.characterSize = originalStreakTextSize;
	streakText.transform.localPosition.y = originalStreakY;
}