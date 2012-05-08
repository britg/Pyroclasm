#pragma strict

var baseEnabled : Texture;
var baseUsed : Texture;

var greenEnabled : Texture;
var purpleEnabled : Texture;
var redEnabled : Texture;

var greenDisabled : Texture;
var purpleDisabled : Texture;
var redDisabled : Texture;

var greenUsed : Texture = baseUsed;
var purpleUsed : Texture = baseUsed;
var redUsed : Texture = baseUsed;

private var interactable : boolean = false;
private var origin : Vector3;
private var shouldMove : boolean = false;
private var color : int;
private var level : int;
private var status : int;
private var destination : Vector3;
private var destinationVelocity : Vector3;

private var destinationAnimation : float = 0.1;

function Awake () {

}

function Start () {
	origin = transform.position;
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
}

function Update () {

	if(shouldMove) {
		MoveTowardsDestination();
	}
	
	if(inputsForTouch()) {
		TestTouched();
	}

}

function Activate(_color : int, _level : int, _status : int) {
	color = _color;
	level = _level;
	status = _status;
	SetPosition();
	SetTexture();
	yield WaitForSeconds(destinationAnimation);
	interactable = true;
}

function SetPosition() {
	var yPos : float = 1.0 - (color * 0.3) - 0.27;
	var xPos : float = 1.0/8.0 * (level + 1) + 0.08;
	destination = Vector3(xPos, yPos, -1);
	Debug.Log("Destination is " + destination);
	shouldMove = true;
}

function MoveTowardsDestination() {
	transform.position = Vector3.SmoothDamp(transform.position, destination, destinationVelocity, destinationAnimation);
}

function SetTexture() {

	Debug.Log("Scroll status is " + status);
	if(status == Scrolls.STATUS_USED) {
		guiTexture.texture = baseUsed;
		return;
	}
	
	switch(color) {
		case Scrolls.GREEN:
			guiTexture.texture = (status == Scrolls.STATUS_DISABLED) ? greenDisabled : greenEnabled;
		break;
		case Scrolls.PURPLE:
			guiTexture.texture = (status == Scrolls.STATUS_DISABLED) ? purpleDisabled : purpleEnabled;
		break;
		case Scrolls.RED:
			guiTexture.texture = (status == Scrolls.STATUS_DISABLED) ? redDisabled : redEnabled;
		break;
	}
}

function Deactivate() {
	destination = origin;
	shouldMove = true;
	interactable = false;
}

function OnGameStart() {
	Destroy(guiTexture);
}

function inputsForTouch() {
	var inputTest : boolean = ( Input.touchCount > 0 
								|| Input.GetMouseButton(0) );
    return inputTest;
}

function TestTouched() {

	if(!interactable) {
		return;
	}

	for (var touch : Touch in Input.touches) {
    	if(guiTexture.HitTest(touch.position)) {
    		if (touch.phase == TouchPhase.Began) {
				AttemptUse();
			}
        	return true;
        }
    }

	if(Input.GetMouseButtonDown(0)) {
		if(guiTexture.HitTest(Input.mousePosition)) {
			AttemptUse();
			return true;
    	}
    }
    
    return false;
}

function AttemptUse() {
	if(status == Scrolls.STATUS_DISABLED) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_NOT_FOUND);
		return;
	}
	
	if(status == Scrolls.STATUS_USED) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_ALREADY_USED);
		return;
	}
	
	var name : String = Scrolls.PlayerScrolls().scrollNameAt(color, level);
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_ACTIVATED, name);
}