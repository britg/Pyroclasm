#pragma strict

var scrollButton : GUITexture;
var scrollPrefab : GUITexture;
var scrollText : GUIText;
var scrollBurn : GameObject;

private var GUIActive : boolean = false;
private var scrollsCreated : boolean = false;
private var scrolls : Hashtable;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_BUTTON_TOUCHED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_FIRST);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_NOT_FOUND);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ALREADY_USED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ACTIVATED);
	scrolls = new Hashtable();
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
	scrollText.enabled = true;
	scrollText.text = Scrolls.MESSAGE_DEFAULT;
	
	for(var color : int = 0; color < Scrolls.SCROLLS.length; color++) {
		var levels : Array = Scrolls.SCROLLS[color];
		
		for(var level : int = 0; level < levels.length; level++) {
			ActivateScrollAt(color, level);
		}
	}
}

function ActivateScrollAt(color : int, level : int) {

	var key = "" + color + "_" + level;

	var scroll : GUITexture = scrolls[key];
	var status : int = Scrolls.PlayerScrolls().ScrollStatus(color, level);
	
	if(!scroll) {
		scroll = Instantiate(scrollPrefab, scrollButton.transform.position, Quaternion.identity);
		scrolls[key] = scroll;
	}
	var scrollBehaviour : Scroll = scroll.GetComponent("Scroll");
	scrollBehaviour.Activate(color, level, status);
}

function DeactivateGUI() {
	GUIActive = false;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_GUI_DEACTIVATED);
	scrollButton.audio.Play();
	scrollText.enabled = false;
	
	for(var color : int = 0; color < Scrolls.SCROLLS.length; color++) {
		var levels : Array = Scrolls.SCROLLS[color];
		
		for(var level : int = 0; level < levels.length; level++) {
			DeactivateScrollAt(color, level);
		}
	}
}

function DeactivateScrollAt(color : int, level : int) {
	var key = "" + color + "_" + level;
	var scroll : GUITexture = scrolls[key];
	var scrollBehaviour : Scroll = scroll.GetComponent("Scroll");
	scrollBehaviour.Deactivate();
}

function OnScrollNotFound() {
	scrollText.text = Scrolls.MESSAGE_NOT_FOUND;
}

function OnScrollAlreadyUsed() {
	scrollText.text = Scrolls.MESSAGE_ALREADY_USED;
}

function OnScrollActivated(n : Notification) {
}