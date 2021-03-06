#pragma strict

var scrollGUI : GameObject;
var scrollButton : GUITexture;
var scrollPrefab : GUITexture;
var scrollText : GUIText;
var scrollBurnedText : GUIText;
var scrollAbilityText : GUIText;
var scrollBurn : GameObject;
var scrollButtonBurn : GameObject;

var scrollDeactivateSound : AudioClip;

private var GUIActive : boolean = false;
private var scrollsCreated : boolean = false;
private var scrolls : Hashtable;
private var scrollChosen : boolean = false;

private var activationPause : float = 0.5;

private var scrollAwarded : Hashtable;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_BUTTON_TOUCHED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_FIRST);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_NOT_FOUND);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ALREADY_USED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_ACTIVATED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_AWARDED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_AWARD_ANIMATION_ENDED);
	scrolls = new Hashtable();
}

function Update () {

}

function OnScrollButtonTouch () {
	Debug.Log("Scroll button touched!");
	
	if(GUIActive) {
		DeactivateGUI();
	} else if (!scrollChosen) {
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
	Camera.main.audio.PlayOneShot(scrollDeactivateSound);
	
	var scroll : Hashtable = Scrolls.PlayerScrolls().scrollForNextRun;
	if(scroll && scroll["name"]) {
		DisplayScrollSelected(scroll);
	} else {
		scrollText.enabled = false;
	}
	
	for(var color : int = 0; color < Scrolls.SCROLLS.length; color++) {
		var levels : Array = Scrolls.SCROLLS[color];
		
		for(var level : int = 0; level < levels.length; level++) {
			DeactivateScrollAt(color, level);
		}
	}
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_GUI_DEACTIVATED);
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
	var scroll : Hashtable = n.data;
	scrollChosen = true;
	Scrolls.PlayerScrolls().ActivateScroll(scroll);
	BurnScroll(scroll);
	yield WaitForSeconds(activationPause);
	DisplayActiveScroll(scroll);
	DeactivateGUI();
}

function OnScrollAwarded(n : Notification) {
	scrollAwarded = n.data;
	scrollButton.guiTexture.active = true;
	scrollButton.enabled = true;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_AWARD_ANIMATION_START);
}

function OnScrollAwardAnimationEnded(n : Notification) {
	DisplayScrollForSeconds(scrollAwarded, 5);
}

function DisplayActiveScroll(scroll : Hashtable) {
	scrollButton.SendMessage("ShowButtonAs", scroll);
	var emitter : ParticleEmitter = scrollButtonBurn.GetComponent.<ParticleEmitter>();
	emitter.emit = true;
}

function BurnScroll(scroll : Hashtable) {
	var guiPos : Vector3 = Scrolls.PlayerScrolls().getPosition(scroll["color"], scroll["level"]);
	var worldPos : Vector3 = Camera.mainCamera.ViewportToWorldPoint(guiPos);
	worldPos.z = -2;
	scrollBurn.transform.localPosition = worldPos;
	var emitter : ParticleEmitter = scrollBurn.GetComponent.<ParticleEmitter>();
	emitter.emit = true;
	scrollBurn.audio.Play();
	yield WaitForSeconds(activationPause);
	emitter.emit = false;
}

function DisplayScrollForSeconds(scroll : Hashtable, sec : int) {
	DisplayScrollAward(scroll);
	yield WaitForSeconds(sec);
	scrollGUI.SetActiveRecursively(false);
}

function DisplayScrollSelected(scroll : Hashtable) {
	scrollGUI.SetActiveRecursively(true);
	scrollText.enabled = true;
	scrollText.text = scroll["name"];
	scrollBurnedText.enabled = true;
	scrollBurnedText.text = "Scroll Burned:";
	scrollAbilityText.enabled = true;
	scrollAbilityText.text = "Effect: " + scroll["ability"];
}

function DisplayScrollAward(scroll : Hashtable) {
	scrollGUI.SetActiveRecursively(true);
	scrollButton.SendMessage("ShowButtonAs", scroll);
	scrollText.enabled = true;
	scrollText.text = scroll["name"];
	scrollBurnedText.enabled = true;
	scrollBurnedText.text = "Scroll Recovered!";
	scrollAbilityText.enabled = false;
}
