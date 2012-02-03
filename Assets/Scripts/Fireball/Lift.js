
var force : float = 10.0;
var respondToTouch : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;

private var touched : boolean;

private var maxHeight : float = 9.0;
private var minHeight : float = 1.1;

function Start() {
	// Cache component lookups at startup instead of every frame
	thisTransform = transform;
	thisRigidbody = rigidbody;
	
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
	thisRigidbody.AddForce(Vector3.up * 8);
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
