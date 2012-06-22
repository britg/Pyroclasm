#pragma strict

var shouldBoost : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var maxY : float = 8.307953;
private var minY : float = 0.3;

private var started : boolean = false;
private var ended : boolean = false;
private var touchDown : boolean = false;

private var touchMinX : float = 0.1;
private var touchMaxX : float = 7.0;

private var boosting : boolean = false;

function Start () {
	thisTransform = transform;
	thisRigidbody = rigidbody;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LIFT_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LIFT_END);
}

function Update () {

	if(!shouldBoost)
		return;
		
	if(ended)
		return;
		
	if(!started) {
		return;
	}
	
}

function OnGameStart () {
	started = true;
}

function OnGameEnd () {
	ended = true;
}

function OnTouchStart () {
	touchDown = true;
	
	if(shouldBoost && !ended && started) {
		StartBoost();
	}
}

function OnTouchEnd () {
	touchDown = false;
}

function StartBoost() {
	var touch : Touch = TouchInBounds();
	var touchInBounds : boolean = (touch.position.y != 0.0);
	var mouseInBounds : boolean = MouseInBounds();
	
	if(touchInBounds || mouseInBounds) {
		boosting = true;
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.BOOST_START);
	}
}

function EndBoost() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.BOOST_END);
	boosting = false;
}

function TouchInBounds() {
	var pos : float;
	for (var touch : Touch in Input.touches) {
		if(touch.phase != TouchPhase.Ended) {
			pos = Camera.main.ScreenToWorldPoint(touch.position).x;
			if(pos <= touchMaxX && pos >= touchMinX) {
				return touch;
			}
		}
    }
}

function MouseInBounds() {
	var pos : float;
	if(Input.GetMouseButton(0)) {
		pos = Camera.main.ScreenToWorldPoint(Input.mousePosition).x;
	
		if(pos <= touchMaxX && pos >= touchMinX) {
			return true;
		}
	}
	return false;
}
