
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

var started : boolean = false;

var titleScreen : GUITexture;
var highScore : GUIText;
var heatBar : GameObject;

function Start() {
	Time.timeScale = 1.0;
	
	var distance = PlayerPrefs.GetInt("distance");
	var longestStreak = PlayerPrefs.GetInt("streak");
	highScore.enabled = true;
	highScore.text = "Longest Run: " + Mathf.Round(distance) + "m\nLongest Streak: +" + longestStreak + "°";
	
	heatBar.SetActiveRecursively(false);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_FIRST);
}

function OnTouchFirst () {
	Begin();
}

function Begin() {
	started = true;
	velocity = startVelocity;
	titleScreen.enabled = false;
	highScore.enabled = false;
	heatBar.SetActiveRecursively(true);
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GAME_START);
}

function Update() {

	if(started) {
		Accelerate();
	}
}

function Accelerate() {
	velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
}
