#pragma strict

var scrollButton : GUITexture;
var scroll : GUITexture;

private var GUIActive : boolean = false;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_BUTTON_TOUCHED);
}

function Update () {

}

function OnScrollButtonTouch () {
	Debug.Log("Scroll button touched!");
	
	if(GUIActive) {
		DeactivateGUI();
	} else {
		ActivateGUI();
	}

}

function ActivateGUI() {
	GUIActive = true;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_GUI_ACTIVATED);
	scrollButton.audio.Play();
}

function DeactivateGUI() {
	GUIActive = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_GUI_DEACTIVATED);
}