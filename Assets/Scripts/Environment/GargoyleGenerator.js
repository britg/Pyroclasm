
var Level : GameObject;

var startGenerationInterval : float = 1.0;
var minGenerationInterval : float = 0.1;
var distanceToMinGenerationInterval : int = 1200;

var gargoyle : Transform;
var fireball : GameObject;

private var timeleft : float;

private var yMin : float = 1.5;
private var yMax : float = 5.5;
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
	
	var h : Transform = Instantiate( gargoyle, Vector3(xStart, yStart, -1), Quaternion.identity );
}