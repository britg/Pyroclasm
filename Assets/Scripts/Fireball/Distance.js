var updateInterval = 0.2;
var distanceText : GUIText;

var distance : float = 0;

var Level : GameObject;

private var accum = 0.0; // FPS accumulated over the interval
private var frames = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval

private var Generator : Generator;

function ResetTimer () {
	timeleft = updateInterval;
    accum = 0.0;
    frames = 0;
}

function Start() {
	Generator = Level.GetComponent("Generator");
}

function Update () {
	distance += Generator.velocity * Time.deltaTime;
	
	timeleft -= Time.deltaTime;
    accum += Time.timeScale/Time.deltaTime;
    ++frames;
    
    if(timeleft <= 0.0) {
    	DisplayDistance();
    }
}

function DisplayDistance() {
	distanceText.text = "" + Mathf.Round(distance) + "m";
}