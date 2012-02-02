
var updateInterval = 0.2;
var coolRate : float = 1;
var initialHeat : int = 500;

var displayText : GUIText;
var gameOverText : GUIText;

var tempChangeUpText : GUIText;
var tempChangeDownText : GUIText;
private var tempChangeText : GUIText;

var Level : GameObject;


private var accum = 0.0; // FPS accumulated over the interval
private var frames = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval

private var heat : int;
private var highTemp : int;

private var Generator : Generator;

private var gameOver : boolean;

private var thisRigidbody : Rigidbody;
private var yVelocity : float;

function Start () {
	heat = highTemp = initialHeat;
	Generator = Level.GetComponent("Generator");
	thisRigidbody = rigidbody;
	ResetTimer();
	gameOverText.enabled = false;
}

function ResetTimer () {
	timeleft = updateInterval;
    accum = 0.0;
    frames = 0;
}

function Update () {
	yVelocity = thisRigidbody.velocity.y;
	
	timeleft -= Time.deltaTime;
    accum += Time.timeScale/Time.deltaTime;
    ++frames;
    
    if(!gameOver) {
	    if( timeleft <= 0.0 ) {
	    	TrackHighestTemp();
	    	CoolOff();
	    	UpdateFireball();
	    	DisplayTemp();
			ResetTimer();
		}
	} else {
		UpdateFireball();
		DisplayTemp();
		GameOver();
	}
}

function DisplayTemp() {
	displayText.text = "" + heat + "°";
}

function OnCollisionEnter(theCollision : Collision){

	// Cancel the collision
	thisRigidbody.velocity.y = yVelocity;
	
	var obj : GameObject = theCollision.gameObject;
	var tempChanger : TempChanger = obj.GetComponent("TempChanger");
	
	if(tempChanger != null) {
		TempChange(tempChanger.tempDiff, true);
	}
}

function GetDistance() {
	var distance : Distance = gameObject.GetComponent('Distance');
	return distance.distance;
}

function TrackHighestTemp() {
	if(heat > highTemp) {
		highTemp = heat;
	}
}

function CoolOff() {
	var distance = GetDistance();
	var coolAmount : int = -Mathf.Round(coolRate * Mathf.Sqrt(distance));
	TempChange(coolAmount, false);
}

function TempChange(delta, notify) {
	heat += delta;
	
	if(notify) {
		NotifyTempChange(delta);
	}
	
	if(heat <= 0) {
		gameOver = true;
		heat = 0;	
	}
}

function NotifyTempChange(delta) {
	
	var symbol = "";
	if(delta > 0) {
		symbol = "+";
		tempChangeText = Instantiate( tempChangeUpText, Vector2(0.5, 0.5), Quaternion.identity );
	} else {
		tempChangeText = Instantiate( tempChangeDownText, Vector2(0.5, 0.5), Quaternion.identity );
	}
	
	tempChangeText.text = "" + symbol + delta + "°";
}

function GameOver() {

	var distance = GetDistance();
	gameOverText.enabled = true;
	gameOverText.text = "Game Over! Distance: " + Mathf.Round(distance) + "m / Highest Temp: " + highTemp + "°";
	var lift : Lift = gameObject.GetComponent("Lift");
	lift.respondToTouch = false;
	
	ReloadAfterDelay();
}

function ReloadAfterDelay() {
	yield WaitForSeconds(5);
	Application.LoadLevel(0);
}

function UpdateFireball() {
	var emitter : ParticleEmitter = transform.Find("Intensity").GetComponent.<ParticleEmitter>();
	emitter.maxEmission = heat * 10;
}