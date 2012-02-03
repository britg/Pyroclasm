
var updateInterval : float = 0.5;
var heatGem : Transform;

private var accum = 0.0; // FPS accumulated over the interval
private var frames = 0; // Frames drawn over the interval
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
    accum = 0.0;
    frames = 0;
}

function Update () {
	timeleft -= Time.deltaTime;
    accum += Time.timeScale/Time.deltaTime;
    ++frames;
    
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