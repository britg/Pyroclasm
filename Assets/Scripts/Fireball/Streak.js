
var streakText  : TextMesh;
private var streakValue : int;
private var streakTime : float;

var streakTimeout : float = 1.0;
var longestStreak : int;

private var originalStreakTextSize : float;
private var originalStreakY : float;

var streakBombReq : int = 250;
var streakTwinsReq : int = 500;
var streakWallReq : int = 750;

private var streakBombRewarded : boolean;
private var streakTwinsRewarded : boolean;
private var streakWallRewarded : boolean;

var ongoing : boolean;

function Start() {
	ongoing = false;
	longestStreak = 0;
	streakText.renderer.material.color = Color(1.0, 0.376, 0.203, 1.0);
	originalStreakTextSize = streakText.characterSize;
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
        RewardBomb();
    }

    if(streakValue >= streakTwinsReq && !streakTwinsRewarded) {
        RewardTwins();
    }

    if(streakValue >= streakWallReq && !streakWallRewarded) {
        RewardWall();
    }
	
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/200.0), originalStreakTextSize, 3);
	streakText.characterSize = newSize;
	TrackLongestStreak();
}

function RewardBomb() {
    Debug.Log("Rewarding bomb!");
    streakBombRewarded = true;
}

function RewardTwins() {
    streakTwinsRewarded = true;
}

function RewardWall() {
    streakWallRewarded = true;
}

function EndStreak() {
	ongoing = false;
	streakText.gameObject.active = false;
	streakValue = 0;
	streakText.characterSize = originalStreakTextSize;
	streakText.transform.localPosition.y = originalStreakY;

    streakBombRewarded = false;
    streakTwinsRewarded = false;
    streakWallRewarded = false;
}