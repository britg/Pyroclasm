
var splashText : TextMesh;
private var streakValue : int;
private var streakTime : float;

var streakTimeout : float = 1.0;
var longestStreak : int;

var streakTrigger : int = 350;
private var streakLevel : int = 0;

var ongoing : boolean;

var alignment : int = 1;

function Start() {
	ongoing = false;
	longestStreak = 0;
}

function Update () {
	
	if((Time.time - streakTime) > streakTimeout && ongoing) {
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
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.POWERDOWN, delta);
	} else {

		streakTime = Time.time;
		
		if(!ongoing) {
			StartStreak();
		}
		
		IncreaseStreak(delta);
	
	}
	
	if(alignment == 1) {
		UpdateStreakLevel();
	}
}

function StartStreak() {
	ongoing = true;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.STREAK_STARTED);
}

function IncreaseStreak(delta : int) {
	streakValue += delta;
	TrackLongestStreak();
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.STREAK_UPDATED, streakValue);
}

function UpdateStreakLevel() {
	var previousStreakLevel : int = streakLevel;
	streakLevel = Mathf.FloorToInt(streakValue / streakTrigger);
	
	if(streakLevel != previousStreakLevel) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.STREAK_LEVEL_CHANGED, streakLevel);
	}
	
}

function EndStreak() {
	ongoing = false;
	streakValue = 0;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.STREAK_ENDED);
}

function OnPolerize() {
	alignment = -1;
}

function OnUnpolerize() {
	alignment = 1;
}