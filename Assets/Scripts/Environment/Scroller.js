
var velocity : float = 0;
var startVelocity : float = 10.0;
var acceleration : float = 0.07;
var maxVelocity : float = 25.0;

var started : boolean = false;

var titleScreen : GUITexture;
var highScore : GUIText;
var gameCenterButton : GUITexture;

function Start() {
	Time.timeScale = 1.0;
	
	var distance = PlayerPrefs.GetInt("distance");
	var longestStreak = PlayerPrefs.GetInt("streak");
	highScore.enabled = true;
	highScore.text = "Best Distance: " + Mathf.Round(distance) + "m\nBest Streak: +" + longestStreak + "°";
	
	if(GameCenterBinding.isGameCenterAvailable()) {
		GameCenterBinding.authenticateLocalPlayer();
		gameCenterButton.enabled = true;
	} else {
		gameCenterButton.enabled = false;
	}
}

function Begin() {
	started = true;
	velocity = startVelocity;
	titleScreen.enabled = false;
	highScore.enabled = false;
	gameCenterButton.enabled = false;
}

function Update() {

	if(started)
		velocity = Mathf.Clamp(velocity + (acceleration * Time.deltaTime), 0, maxVelocity);
	
	if(!started && inputsForStart()) {
	
		for (var touch : Touch in Input.touches) {
	        if (touch.phase == TouchPhase.Began) {
	        	if(gameCenterButton.HitTest(touch.position)) {
	        		return;
	        	}
	        }
	    }
	    
	    if(Input.GetMouseButtonDown(0)) {
			if(gameCenterButton.HitTest(Input.mousePosition)) {
	        	return;
	    	}
	    }
	    
		Begin();
	}

}

function inputsForStart() {
	return ( Input.touchCount > 0 || Input.GetMouseButton(0) || Input.GetKey("space") || Input.GetKey("up") );
}