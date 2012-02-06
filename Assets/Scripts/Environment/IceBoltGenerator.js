
var Level : GameObject;

var startGenerationInterval : float = 1.0;
var minGenerationInterval : float = 0.1;
var distanceToMinGenerationInterval : int = 1200;

var iceBolt : Transform;
var fireball : GameObject;

private var timeleft : float;

private var yMin = 1.1;
private var yMax = 9;
private var xStart = 10;
private var nextObject : Transform;

private var speedFactor : float = 1;
private var tempChangeFactor : float = 1;

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
	
	speedFactor = Random.value*0.5 + 1.3;
	tempChangeFactor = Random.value * 7 + 1;
	
	var h : Transform = Instantiate( iceBolt, Vector3(xStart, yStart, -1), Quaternion.identity );
	var motor : Motor = h.gameObject.GetComponent("Motor");
	motor.Level = gameObject;
	motor.factor = speedFactor;
	
	var tempChange : TempChanger = h.gameObject.GetComponent("TempChanger");
	tempChange.tempDiff = tempChange.tempDiff * tempChangeFactor;
}