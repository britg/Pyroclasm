
enum TouchState
{
	WaitingForFirstTouch,
	WaitingForNoFingers
}

var force : float = 10.0;
var respondToTouch : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;


// State for tracking touches
private var state = TouchState.WaitingForFirstTouch;
private var fingerDown : int[] = new int[ 2 ];
private var fingerDownPosition : Vector2[] = new Vector2[ 2 ];
private var fingerDownFrame : int[] = new int[ 2 ];
private var firstTouchTime : float;
private var touched : boolean;

function Start()
{
	// Cache component lookups at startup instead of every frame
	thisTransform = transform;
	thisRigidbody = rigidbody;
	
	// Initialize control state
	ResetTouchState();
	
	touched = false;
}

function OnEndGame()
{
	// Don't allow any more control changes when the game ends	
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

function ResetTouchState()
{
	// Return to origin state and reset fingers that we are watching
	state = TouchState.WaitingForFirstTouch;
	fingerDown[ 0 ] = -1;
	fingerDown[ 1 ] = -1;
}

function Update () {
	if(thisTransform.position.y < 1.1) {
		thisTransform.position.y = 1.1;
	} else if (thisTransform.position.y > 7.8) {
		thisTransform.position.y = 7.8;
	}
}


function FixedUpdate () 
{	

	if (!touched) {
		InitialFloat();
	}

	var touchCount : int = Input.touchCount;
	if ( touchCount > 0 || Input.GetMouseButton(0) ) {
		touched = true;
		Lift();
	}
	else {
		ResetTouchState();
	}
			
}
