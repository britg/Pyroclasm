
var updateInterval = 0.2;
var coolRate : float = 1;
var initialHeat : int = 500;

var displayText : GUIText;
var gameOverText : GUIText;

var tempChangeUpText : GUIText;
var tempChangeDownText : GUIText;
private var tempChangeText : GUIText;

var Level : GameObject;

private var timeleft : float;

private var heat : int;
private var highTemp : int;

private var gameOver : boolean;
private var shouldUpdate : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;
private var thisEmitter : ParticleEmitter;

private var yVelocity : float;

function Start () {
	gameOverText.enabled = false;
	
	heat = highTemp = initialHeat;
	thisTransform = transform;
	thisRigidbody = rigidbody;
	thisEmitter = thisTransform.Find("Intensity").GetComponent.<ParticleEmitter>();
	
	ResetTimer();
}

function ResetTimer () {
	timeleft = updateInterval;
}

function Update () {
	yVelocity = thisRigidbody.velocity.y;
	
	timeleft -= Time.deltaTime;
    
    if(!gameOver) {
	    if( timeleft <= 0.0 ) {
	    	TrackHighestTemp();
	    	CoolOff();
	    	DisplayTemp();
			ResetTimer();
		}
	} else if(shouldUpdate) {
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
		heat = 0;	
		gameOver = true;
	}
	
	if(shouldUpdate) {
		UpdateFireball();
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
	var objLabel : ObjectLabel = tempChangeText.GetComponent("ObjectLabel");
	objLabel.target = thisTransform;
	
}

function GameOver() {
	shouldUpdate = false;
	
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
	thisEmitter.maxEmission = heat * 10;
}