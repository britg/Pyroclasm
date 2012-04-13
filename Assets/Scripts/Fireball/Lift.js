
var force : float = 10.0;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var maxHeight : float = 8.307953;
private var minHeight : float = 0.1;

private var initialY : float;

private var started : boolean = false;
private var ended : boolean = false;
private var touchDown : boolean = false;

function Start() {
	thisTransform = transform;
	thisRigidbody = rigidbody;
	initialY = thisTransform.position.y;
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LIFT_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LIFT_END);
}

function OnEndGame() {
	this.enabled = false;
}

function Lift() {
	var velY : float = thisRigidbody.velocity.y;
	var minY = -1.5;
	if(velY < minY) {
		thisRigidbody.velocity.y = minY;
	}
	thisRigidbody.AddForce(Vector3.up * force);
}

function InitialFloat() {
	thisTransform.position.y = initialY;
	thisRigidbody.velocity.y = 0;
}

function Update () {
	if(thisTransform.position.y < minHeight) {
		thisTransform.position.y = minHeight;
		thisRigidbody.velocity.y = 0;
	} else if (thisTransform.position.y > maxHeight) {
		thisTransform.position.y = maxHeight;
		thisRigidbody.velocity.y = 0;
	}
}


function FixedUpdate () {	

	if(ended)
		return;

	if (!started) {
		InitialFloat();
	} else {
		thisRigidbody.AddForce(Vector3.down *8.0);
	}
	
	if ( touchDown ) {
		Lift();
	} else {
		var velY : float = thisRigidbody.velocity.y;
		var maxY = 5.0;
		if(velY > maxY) {
			thisRigidbody.velocity.y = maxY;
		}	
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