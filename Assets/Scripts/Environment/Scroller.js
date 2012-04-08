
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

var started : boolean = false;

var titleScreen : GUITexture;
var highScore : GUIText;
var gameCenterButton : GUITexture;
var pauseButton :GUITexture;
var heatBar : GameObject;

var gameCenterHold : boolean = false;
var gameCenterHoldTimeout : float = 0.1;
var currentGameCenterHoldTime : float = 0.0;

function Start() {
	Time.timeScale = 1.0;
	
	var distance = PlayerPrefs.GetInt("distance");
	var longestStreak = PlayerPrefs.GetInt("streak");
	highScore.enabled = true;
	highScore.text = "Longest Run: " + Mathf.Round(distance) + "m\nLongest Streak: +" + longestStreak + "°";
	
	if(GameCenterBinding.isGameCenterAvailable()) {
		GameCenterBinding.authenticateLocalPlayer();
		gameCenterButton.enabled = true;
	} else {
		//gameCenterButton.enabled = false;
	}
	
	pauseButton.enabled = false;
	heatBar.SetActiveRecursively(false);
}

function Begin() {
	started = true;
	velocity = startVelocity;
	titleScreen.enabled = false;
	highScore.enabled = false;
	pauseButton.enabled = true;
	heatBar.SetActiveRecursively(true);
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GAME_START);
}

function Update() {

	if(started) {
		Accelerate();
	} else if (inputsForStart()) {
	
		if(!gameCenterHold) {
			Begin();
		} else {
			currentGameCenterHoldTime += Time.deltaTime;
			
			if(currentGameCenterHoldTime >= gameCenterHoldTimeout) {
				gameCenterHold = false;
				currentGameCenterHoldTime = 0.0;
			}
		}
	}
	
}

function Accelerate() {
	velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
}

function inputsForStart() {
	var inputTest : boolean = ( Input.touchCount > 0 
								|| Input.GetMouseButton(0) 
								|| Input.GetKey("space") 
								|| Input.GetKey("up") );
	
	for (var touch : Touch in Input.touches) {
    	if(gameCenterButton.enabled && gameCenterButton.HitTest(touch.position)) {
    		gameCenterHold = true;
    		return false;
    	}
    }
    
    return inputTest;
}