#pragma strict

var shouldFollow : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var maxY : float = 8.307953;
private var minY : float = 0.3;

private var started : boolean = false;
private var ended : boolean = false;
private var touchDown : boolean = false;
private var touchLastY : float;
private var touchDeltaY : float;

private var touchMinX : float = -7.0;
private var touchMaxX : float = 0.0;

function Start () {
	thisTransform = transform;
	thisRigidbody = rigidbody;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LIFT_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LIFT_END);
}

function Update () {

	if(!shouldFollow)
		return;
		
	if(ended)
		return;
		
	if(!started) {
		//thisRigidbody.isKinematic = true;
		return;
	}
		
	if(touchDown) {
		//thisRigidbody.isKinematic = true;
		GetDelta();
		Follow();
	} else {
		//thisRigidbody.isKinematic = false;
	}
	
	Clamp();
}

function Follow() {
	var toY : float = thisTransform.position.y + touchDeltaY;
	thisTransform.position.y = Mathf.Clamp(toY, minY, maxY);
}

function Clamp() {
	thisTransform.position.y = Mathf.Clamp(thisTransform.position.y, minY, maxY);
}

function OnGameStart () {
	started = true;
}

function OnGameEnd () {
	ended = true;
}

function OnTouchStart () {
	touchLastY = GetValidTouchY();
	touchDown = true;
}

function OnTouchEnd () {
	touchDown = false;
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

function GetDelta() {
    var touchNowY : float = GetValidTouchY();
	touchDeltaY = touchNowY - touchLastY;
    touchLastY = touchNowY;
}

function GetValidTouchY() {
	var touch : Touch = TouchInBounds();
	var touchInBounds : boolean = (touch.position.y != 0.0);
	var mouseInBounds : boolean = MouseInBounds();
	var touchInBoundsY : float;
	if(touchInBounds || mouseInBounds) {
		touchInBoundsY = GetTouchNowY(touch);
		return touchInBoundsY;
	}
	
	return touchLastY;
}

function GetTouchNowY (touch : Touch) {
	if(touch.position.y == 0.0) {
		return Camera.main.ScreenToWorldPoint(Input.mousePosition).y;
	} else {
    	return Camera.main.ScreenToWorldPoint(touch.position).y;
	}
}
