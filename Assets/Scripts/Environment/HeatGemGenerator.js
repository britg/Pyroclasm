
var updateInterval : float = 0.5;
var heatGem : Transform;

private var timeleft : float; // Left time for current interval

private var yMin = 1.1;
private var yMax = 9;
private var xStart = 10;
private var minUpdateInterval = 0;
private var nextObject : Transform;

private var speedFactor : float = 1;

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
	var yStart = Random.value * (yMax - yMin) + yMin;
	var h : Transform = Instantiate( heatGem, Vector3(xStart, yStart, -1), Quaternion.identity );
	var motor : Motor = h.gameObject.GetComponent("Motor");
	motor.Level = gameObject;
	motor.factor = speedFactor;
}