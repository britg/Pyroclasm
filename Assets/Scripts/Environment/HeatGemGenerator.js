
var Level : GameObject;
var fireball : GameObject;
var p1 : Transform;
var p2 : Transform;
var p3 : Transform;
var p4 : Transform;
var p5 : Transform;

var startGenerationInterval : float = 1.8;
var minGenerationInterval : float = 0.2;
var distanceToMinGenerationInterval : int = 1200;

private var timeleft : float; // Left time for current interval

private var yMin = 0.1;
private var yMax = 8.307953;
private var xStart = 10;
private var nextObject : Transform;


private var Patterns : Array = [];

private var Distance;
private var scrolling;

function Awake () {
	Patterns = [p1, p2, p3, p4, p5];
	//Patterns = [p4];
}

function Start () {
	Distance = fireball.GetComponent("Distance");
	scrolling = Level.GetComponent("Scroller");
	ResetTimer();
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
	var prefab : Transform = Patterns[Mathf.Floor(Random.value*Patterns.length)];
	var yStart = Random.value * (yMax - yMin) + yMin;
	var pattern : Transform = Instantiate( prefab , Vector3(xStart, yStart, -1), Quaternion.identity );
	var motor : Motor = pattern.gameObject.GetComponent("Motor");
}