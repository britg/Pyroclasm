
var updateInterval : float = 1.4;
var p1 : Transform;
var p2 : Transform;
var p3 : Transform;
var p4 : Transform;

private var timeleft : float; // Left time for current interval

private var yMin = 1.1;
private var yMax = 9;
private var xStart = 10;
private var minUpdateInterval = 0.3;
private var nextObject : Transform;

private var speedFactor : float = 1;

private var Patterns : Array = [];

function Awake () {
	Patterns = [p1, p2, p3, p4];
}

function Start () {
	ResetTimer();
}

function ResetTimer () {
	timeleft = Random.value * updateInterval + minUpdateInterval;
}

function Update () {
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
	motor.Level = gameObject;
	motor.factor = speedFactor;
}