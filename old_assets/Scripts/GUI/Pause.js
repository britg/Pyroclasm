private var paused : boolean = false;

function Start() {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_PAUSE);
}

function OnTouchPause ( notification : Notification ) {
	TogglePause();
}

function TogglePause() {

	if(paused) {
		AudioListener.volume = 1;
		Time.timeScale = 1;
		AudioListener.volume = 1;
	} else {
		AudioListener.volume = .3;
		Time.timeScale = 0;
		AudioListener.volume = 0.3;
	}
	
	paused = !paused;
	
}