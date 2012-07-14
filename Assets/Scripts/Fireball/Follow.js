#pragma strict

var shouldFollow : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var maxY : float = 8.307953;
private var minY : float = 0.3;

private var maxX : float = 0;
private var minX : float = -6.24;

private var started : boolean = false;
private var ended : boolean = false;
private var touchDown : boolean = false;
private var touchLastY : float;
private var lastTouchPosition : Vector3;
private var touchDeltaY : float;
private var deltaTouchPosition : Vector3;

private var touchMinX : float = -7.0;
private var touchMaxX : float = 7.0;

private var xFactor : float = 1.5;
private var yFactor : float = 1.5;

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
	
	//Clamp();
}

function Follow() {
	var toY : float = thisTransform.position.y + (deltaTouchPosition.y * yFactor);
	var toX : float = thisTransform.position.x + (deltaTouchPosition.x * xFactor);
	thisTransform.position.y = Mathf.Clamp(toY, minY, maxY);
	thisTransform.position.x = Mathf.Clamp(toX, minX, maxX);
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
	lastTouchPosition = GetValidTouchPosition();
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
    var touchNowPosition : Vector3 = GetValidTouchPosition();
	deltaTouchPosition = touchNowPosition - lastTouchPosition;
    lastTouchPosition = touchNowPosition;
}

function GetValidTouchPosition() {
	var touch : Touch = TouchInBounds();
	var touchInBounds : boolean = (touch.position.y != 0.0);
	var mouseInBounds : boolean = MouseInBounds();
	var touchPosition : Vector3;
	if(touchInBounds || mouseInBounds) {
		touchPosition = GetTouchPosition(touch);
		return touchPosition;
	}
	
	return lastTouchPosition;
}

function GetTouchPosition (touch : Touch) {
	if(touch.position.y == 0.0) {
		return Camera.main.ScreenToWorldPoint(Input.mousePosition);
	} else {
    	return Camera.main.ScreenToWorldPoint(touch.position);
	}
}