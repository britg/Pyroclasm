
var Level : GameObject;

var startGenerationInterval : float = 1.0;
var minGenerationInterval : float = 0.1;
var distanceToMinGenerationInterval : int = 1200;

var maxSpeedFactor : float = 1.4;
var minSpeedFactor : float = 1.1;


var iceBolt : Transform;
var fireball : GameObject;

private var timeleft : float;

private var yMin : float = 0.1;
private var yMax : float = 8.307953;
private var xStart = 10;
private var nextObject : Transform;

private var speedFactor : float = 1;

private var Distance;
private var scrolling;

function Start () {
	Distance = fireball.GetComponent("Distance");
	ResetTimer();
	scrolling = Level.GetComponent("Scroller");
}

function ResetTimer () {
	var distPercent : float = Distance.distance / distanceToMinGenerationInterval;
	if(distPercent > 1.0) {
		distPercent = 1.0;
	}
	var delta : float = (startGenerationInterval - minGenerationInterval) * distPercent;
	timeleft = startGenerationInterval - delta;
}

function Update () {
	if(scrolling.velocity == 0) {
		return;
	}
	
	timeleft -= Time.deltaTime;
    
    if( timeleft <= 0.0 ) {
		ResetTimer();
		Generate();
	}
}

function Generate () {
	var yStart = Random.value * (yMax - yMin) + yMin;
	
	speedFactor = Random.value* (maxSpeedFactor - minSpeedFactor) + minSpeedFactor;
	
	var h : Transform = Instantiate( iceBolt, Vector3(xStart, yStart, -1), Quaternion.identity );
	var motor : Motor = h.gameObject.GetComponent("Motor");
	motor.factor = speedFactor;
}