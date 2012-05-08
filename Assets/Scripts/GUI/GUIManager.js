#pragma strict

var titleScreen : GUITexture;
var highScore : GUIText;
var heatBar : GameObject;
var achievementsButton : GUITexture;
var leaderBoardButton : GUITexture;
var gameCenterLoading : GUITexture;
var pauseButton : GUITexture;
var scrollButton : GUITexture;
var scrollGUI : GameObject;
var distanceText : GUIText;
var scrollText : GUIText;

var restartButton : GUITexture;

private var startHold : boolean = true;

private var started : boolean = false;
private var touchDown : boolean = false;
private var scrollGUIActive : boolean = false;

function Awake () {
}

function EnableStartGUI() {
	var startGUI : GameObject = GameObject.Find('GUI');
	startGUI.SetActiveRecursively(true);
	heatBar.SetActiveRecursively(false);
}

function Start () {
	EnableStartGUI();
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_PAUSE);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_GUI_ACTIVATED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_GUI_DEACTIVATED);
	
	pauseButton.enabled = false;
	scrollText.enabled = false;
	distanceText.enabled = false;
	restartButton.enabled = false;
	
	var distance = PlayerPrefs.GetInt("distance");
	var longestStreak = PlayerPrefs.GetInt("streak");
	highScore.enabled = true;
	highScore.text = "Longest Run: " + Mathf.Round(distance) + "m\nLongest Streak: +" + longestStreak + "°";
	
	ReleaseStartHold();
}

function ReleaseStartHold() {
	yield WaitForSeconds(0.5);
	startHold = false;
}

function OnGameStart() {
	started = true;
	pauseButton.enabled = true;
	heatBar.SetActiveRecursively(true);
	titleScreen.enabled = false;
	highScore.enabled = false;
	scrollGUI.SetActiveRecursively(false);
	distanceText.enabled = true;
}

function Update() {

	if(inputsForTouch()) {
		
		if(!started) {
		
	    	if(TestAchievementsButton())
	    		return;
	    		
	    	if(TestLeaderBoardButton())
	    		return;
	    		
	    	if(TestScrollGUIButton())
	    		return;
	    		
	    	if(scrollGUIActive)
	    		return;
	    		
	    	if(startHold)
	    		return;
	    		
	    	InitialTouch();
	    	TouchDown();
	    	
	    } else {
	    
	    	if(TestPauseButton())
	    		return;
	    		
	    	if(TestRestartButton())
	    		return;
	    		
	    	if(!touchDown) {
	    		TouchDown();
	    	}
	    }
    		
	} else {
	
		if(touchDown) {
			TouchUp();
		}
	
	}

    
    
	
}

function TestAchievementsButton() {
	for (var touch : Touch in Input.touches) {
		if(achievementsButton.enabled && achievementsButton.HitTest(touch.position)) {
			if (touch.phase == TouchPhase.Began) {
				NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_ACHIEVEMENTS);
			}
			return true;
		}
    }
	
	return false;
}

function TestLeaderBoardButton() {
	for (var touch : Touch in Input.touches) {
		if(leaderBoardButton.enabled && leaderBoardButton.HitTest(touch.position)) {
			if (touch.phase == TouchPhase.Began) {
				NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_LEADERBOARD);
			}
			return true;
		}
	}
	
	return false;
}

function TestScrollGUIButton() {
	if(!scrollButton.enabled)
		return;
		
	for (var touch : Touch in Input.touches) {
		if(scrollButton.HitTest(touch.position)) {
			if (touch.phase == TouchPhase.Began) {
				NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_BUTTON_TOUCHED);
			}
			return true;
		}
	}

	if(Input.GetMouseButtonDown(0)) {
		if(scrollButton.HitTest(Input.mousePosition)) {
			Debug.Log("Scroll button clicked");
			NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_BUTTON_TOUCHED);
			return true;
    	}
    }
    
    if(Input.GetMouseButton(0)) {
		if(scrollButton.HitTest(Input.mousePosition)) {
			return true;
    	}
    }
	
	return false;
}

function TestPauseButton() {

	if(!pauseButton.enabled)
		return;

	for (var touch : Touch in Input.touches) {
    	if(pauseButton.HitTest(touch.position)) {
    		if (touch.phase == TouchPhase.Began) {
				NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_PAUSE);
			}
        	return true;
        }
    }

	if(Input.GetMouseButtonDown(0)) {
		if(pauseButton.HitTest(Input.mousePosition)) {
			NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_PAUSE);
			return true;
    	}
    }
    
    if(Input.GetMouseButton(0)) {
		if(pauseButton.HitTest(Input.mousePosition)) {
			return true;
    	}
    }
    
    return false;
}


function TestRestartButton() {

	if(!restartButton.enabled)
		return false;

	for (var touch : Touch in Input.touches) {
    	if(restartButton.HitTest(touch.position)) {
    		if (touch.phase == TouchPhase.Began) {
    			Restart();
			}
        	return true;
        }
    }

	if(Input.GetMouseButtonDown(0)) {
		if(restartButton.HitTest(Input.mousePosition)) {
			Restart();
			return true;
    	}
    }
    
    if(Input.GetMouseButton(0)) {
		if(restartButton.HitTest(Input.mousePosition)) {
			return true;
    	}
    }
    
    return false;
}

function Restart() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_PAUSE);
	Application.LoadLevel(0);
}

function OnTouchPause() {
	restartButton.enabled = true;
}

function InitialTouch() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_FIRST);
}

function TouchDown() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_LIFT_START);
	touchDown = true;
}

function TouchUp() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TOUCH_LIFT_END);
	touchDown = false;
}

function inputsForTouch() {
	var inputTest : boolean = ( Input.touchCount > 0 
								|| Input.GetMouseButton(0) 
								|| Input.GetKey("space") 
								|| Input.GetKey("up") );
    return inputTest;
}

function OnScrollGUIActivated () {
	scrollGUIActive = true;
	titleScreen.enabled = false;
	highScore.enabled = false;
	distanceText.enabled = false;
}

function OnScrollGUIDeactivated () {
	scrollGUIActive = false;
	titleScreen.enabled = true;
	highScore.enabled = true;
}