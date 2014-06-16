private var paused : boolean = false;

function Start() {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_PAUSE);
}

function OnTouchPause ( notification : Notification ) {
	TogglePause();
}

function TogglePause() {

	if(paused) {
		Time.timeScale = 1;
		AudioListener.volume = 0.2;
	} else {
		AudioListener.volume = 0.05;
		Time.timeScale = 0;
	}
	
	paused = !paused;
	
}