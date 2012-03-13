
var streakText : TextMesh;
var splashText : TextMesh;
private var streakValue : int;
private var streakTime : float;

var streakTimeout : float = 1.0;
var longestStreak : int;

private var originalStreakTextSize : float;
private var originalStreakY : float;
var maxStreakTextScale : float = 1.0;

var streakTrigger : int = 250;
private var streakLevel : int = 0;

var ongoing : boolean;

var heatBarVertical : boolean;
var heatBar : GameObject;

function Start() {
	ongoing = false;
	longestStreak = 0;
	originalStreakTextSize = streakText.characterSize;
	originalStreakY = streakText.transform.position.y;
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

function UpdateStreak (delta : int) {

	if(delta < 0) {
		EndStreak();
	} else {

		streakTime = Time.time;
		
		if(!ongoing) {
			StartStreak();
		}
		
		IncreaseStreak(delta);
	
	}
	
	UpdateStreakLevel();
}

function StartStreak() {
	ongoing = true;
	streakText.gameObject.active = true;
	originalStreakTextSize = streakText.characterSize;
}

function IncreaseStreak(delta : int) {
	streakValue += delta;
	UpdateStreakDisplay();
	TrackLongestStreak();
}

function UpdateStreakLevel() {
	var previousStreakLevel : int = streakLevel;
	streakLevel = Mathf.FloorToInt(streakValue / streakTrigger);
	
	if(streakLevel != previousStreakLevel) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.STREAK_LEVEL_CHANGED, streakLevel);
	}
	
}

function UpdateStreakDisplay() {
	streakText.text = "+" + streakValue + "°";
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/500.0), originalStreakTextSize, maxStreakTextScale);
	streakText.characterSize = newSize;
	
	PositionStreakDisplay();
}

function PositionStreakDisplay() {
	var y : float = heatBar.transform.position.y;
	y += heatBar.transform.localScale.y;
	streakText.transform.position.y = y + streakText.transform.localScale.y;
}

function EndStreak() {
	ongoing = false;
	streakText.gameObject.active = false;
	streakValue = 0;
	streakText.characterSize = originalStreakTextSize;
	streakText.transform.localPosition.y = originalStreakY;
}