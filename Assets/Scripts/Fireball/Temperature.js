
var updateInterval = 0.2;
var coolRate : float = 0.1;
var displayText : GUIText;
var distanceText : GUIText;
var initialHeat : int = 500;
var Level : GameObject;
var gameOverText : GUIText;

private var accum = 0.0; // FPS accumulated over the interval
private var frames = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval
private var initialX : float;

private var heat : int;
private var highTemp : int;
private var distance : float;

private var Generator : Generator;

private var gameOver : boolean;

function Start () {
	heat = highTemp = initialHeat;
	Generator = Level.GetComponent("Generator");
	ResetTimer();
	gameOverText.enabled = false;
	
	initialX = gameObject.transform.position.x;
}

function ResetTimer () {
	timeleft = updateInterval;
    accum = 0.0;
    frames = 0;
}

function Update () {
	timeleft -= Time.deltaTime;
    accum += Time.timeScale/Time.deltaTime;
    ++frames;
    
    if(!gameOver) {
	    distance += Generator.velocity * Time.deltaTime;
	    
	    if( timeleft <= 0.0 ) {
	    	TrackHighestTemp();
	    	CoolOff();
	    	UpdateFireball();
			displayText.text = "" + heat + "°";
			distanceText.text = "" + Mathf.Round(distance) + "m";
			ResetTimer();
		}
	}
}

function OnCollisionEnter(theCollision : Collision){
	
	var obj : GameObject = theCollision.gameObject;
	
	Debug.Log("Hit "+ obj.tag);
	
	if(obj.tag == 'hot') {
		heat += 39;
	} else if (obj.tag == 'cold') {
		heat -= 27;
	}
	
}

function TrackHighestTemp() {
	if(heat > highTemp) {
		highTemp = heat;
	}
}

function CoolOff() {
	heat -= Mathf.Round(coolRate * distance);
	if(heat <= 0) {
		gameOver = true;
		heat = 0;
	}
}

function GameOver() {
	gameOverText.enabled = true;
	gameOverText.text = "Game Over! Distance: " + Mathf.Round(distance) + "m / Highest Temp:" + highTemp + "°";
	var lift : Lift = gameObject.GetComponent("Lift");
	lift.respondToTouch = false;
	ReloadAfterDelay();
}

function ReloadAfterDelay() {
	yield WaitForSeconds(5);
	Application.LoadLevel(0);
}

function OnGUI() {
	if(gameOver) {
		GameOver();
	}
}

function UpdateFireball() {

}