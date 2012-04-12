#pragma strict

var achievementsButton : GUITexture;
var leaderBoardButton : GUITexture;
var gameCenterLoading : GUITexture;
var pauseButton : GUITexture;

private var started : boolean = false;
private var touchDown : boolean = false;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	pauseButton.enabled = false;
}

function OnGameStart() {
	started = true;
	pauseButton.enabled = true;
}

function Update() {

	if(inputsForTouch()) {
		
		if(!started) {
		
	    	if(TestAchievementsButton())
	    		return;
	    		
	    	if(TestLeaderBoardButton())
	    		return;
	    		
	    	InitialTouch();
	    	TouchDown();
	    	
	    } else {
	    
	    	if(TestPauseButton())
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
    
    return false;
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