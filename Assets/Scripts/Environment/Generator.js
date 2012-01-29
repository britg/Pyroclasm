
var updateInterval = 3;
var velocity : float = 1;

var hotThing : Transform;
var coldThing : Transform;

private var accum = 0.0; // FPS accumulated over the interval
private var frames = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval

private var yMin = 1.0;
private var yMax = 7.6;
private var xStart = 10;
private var minUpdateInterval = 0;
private var nextObject : Transform;


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
		GenerateThing();
	}
}

function GenerateThing () {
	var yStart = Random.value * (yMax - yMin) + yMin;
	
	hot = (Random.value * 2) > 1;
	
	
	if(hot) {
		nextObject = hotThing;
	} else {
		nextObject = coldThing;
	}
	var h : Transform = Instantiate( nextObject, Vector3(xStart, yStart, -1), Quaternion.identity );
	var motor : Motor = h.gameObject.GetComponent("Motor");
	motor.Level = gameObject;
}