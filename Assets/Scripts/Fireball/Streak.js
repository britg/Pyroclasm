
var streakText  : TextMesh;
private var streakValue : int;
private var streakTime : float;

var streakTimeout : float = 1.0;
var longestStreak : int;

private var originalStreakTextSize : float;
private var originalStreakY : float;

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
	
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/200.0), originalStreakTextSize, 3);
	streakText.characterSize = newSize;
	TrackLongestStreak();
}

function EndStreak() {
	ongoing = false;
	streakText.gameObject.active = false;
	streakValue = 0;
	streakText.characterSize = originalStreakTextSize;
	streakText.transform.localPosition.y = originalStreakY;
}