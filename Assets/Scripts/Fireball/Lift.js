
var force : float = 10.0;
var respondToTouch : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var touched : boolean;

private var maxHeight : float = 10.0;
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
	if (!touched)
		InitialFloat();
	
	if ( inputsForLift() ) {
		touched = true;
		Lift();
	}
}

function inputsForLift() {
	return ( Input.touchCount > 0 || Input.GetMouseButton(0) || Input.GetKey("space") );
}
