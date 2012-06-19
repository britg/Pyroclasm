#pragma strict

var shouldFollow : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var maxHeight : float = 8.307953;
private var minHeight : float = 0.3;

private var initialY : float;

private var started : boolean = false;
private var ended : boolean = false;
private var touchDown : boolean = false;

function Start () {
	thisTransform = transform;
	thisRigidbody = rigidbody;
	initialY = thisTransform.position.y;
	
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
		thisTransform.position.y = initialY;
		//thisRigidbody.velocity.y = 0;
		return;
	}
		
	if(touchDown) {
		Follow();
	} else {
		//thisTransform.position.y = thisTransform.position.y;
	}
}

function Follow() {
	for (var touch : Touch in Input.touches) {
		if(touch.phase != TouchPhase.Ended) {
			thisTransform.position.y = touch.position.y;
		}
    }
    
    if(Input.GetMouseButton(0)) {
		thisTransform.position.y = Camera.main.ScreenToWorldPoint(Input.mousePosition).y;
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
}

function OnTouchEnd () {
	touchDown = false;
}