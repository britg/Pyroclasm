
var force : float = 10.0;
var respondToTouch : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var touched : boolean;

private var maxHeight : float = 8.307953;
private var minHeight : float = 0.1;

private var initialY : float;

function Start() {
	// Cache component lookups at startup instead of every frame
	thisTransform = transform;
	thisRigidbody = rigidbody;
	initialY = thisTransform.position.y;
	
	touched = false;
}

function OnEndGame() {
	this.enabled = false;
}

function Lift() {
	if(!respondToTouch) {
		return;
	}
	var velY : float = thisRigidbody.velocity.y;
	var minY = -3.0;
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
	if (!touched) {
		InitialFloat();
	} else {
		thisRigidbody.AddForce(Vector3.down *5.0);
	}
	
	if ( inputsForLift() ) {
		touched = true;
		Lift();
	}
}

function inputsForLift() {
	return ( Input.touchCount > 0 || Input.GetMouseButton(0) || Input.GetKey("space") || Input.GetKey("up") );
}
