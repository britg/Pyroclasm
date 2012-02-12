
var updateInterval = 0.2;
var coolRate : float = 1;
var initialHeat : int = 500;
var maxHeat : int = 2500;

var displayText : GUIText;
var gameOverText : GUIText;

var tempChangeUpText : GUIText;
var tempChangeDownText : GUIText;
private var currentTempChangeUpValue : int;
private var currentTempChangeUpText : GUIText;
private var currentTempChangeDownValue : int;
private var currentTempChangeDownText : GUIText;

var pickupSound : AudioClip;
var cooldownSound : AudioClip;

var Level : GameObject;
private var scrolling;

private var timeleft : float;

private var heat : int;
private var highTemp : int;

private var gameOver : boolean;
private var shouldUpdate : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;
private var thisEmitter : ParticleEmitter;
private var thisAnimator : ParticleAnimator;

private var yVelocity : float;

private var moving : boolean = false;

function Start () {
	heat = highTemp = initialHeat;
	thisTransform = transform;
	thisRigidbody = rigidbody;
	thisEmitter = thisTransform.Find("Intensity").GetComponent.<ParticleEmitter>();
	thisAnimator = thisTransform.Find("Intensity").GetComponent.<ParticleAnimator>();
	scrolling = Level.GetComponent("Scroller");
	
	ResetTimer();
}

function ResetTimer () {
	timeleft = updateInterval;
}

function Update () {

	if( !moving && scrolling.started ) {
		SimulateMotion();
	}

	yVelocity = thisRigidbody.velocity.y;
	
	timeleft -= Time.deltaTime;
    
    if(!gameOver) {
	    if( timeleft <= 0.0 ) {
	    	TrackHighestTemp();
	    	CoolOff();	
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
		
		if(tempChanger.playPickupSound) {
			audio.PlayOneShot(pickupSound);
		}
		
		if(tempChanger.playCooldownSound) {
			audio.PlayOneShot(cooldownSound);
		}
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
	
	heat = Mathf.Clamp(heat, 0, maxHeat);
	
	if(notify) {
		NotifyTempChange(delta);
	}
	
	if(heat <= 0) {
		heat = 0;	
		gameOver = true;
	}
	
	if(shouldUpdate) {
		DisplayTemp();
		UpdateFireball();
	}
	
}

function NotifyTempChange(delta) {
	
	var symbol = "";
	var start : Vector2 = Camera.main.WorldToViewportPoint(thisTransform.position);
	var floater : FloatingText;
	
	if(delta > 0) {
		
		if(!currentTempChangeUpText) {
			currentTempChangeUpValue = delta;
			currentTempChangeUpText = Instantiate( tempChangeUpText, start, Quaternion.identity );
			floater = currentTempChangeUpText.GetComponent("FloatingText");
			floater.floatFrom = thisTransform;
			floater.lastUpdateTime = Time.time;
		} else {
			currentTempChangeUpValue += delta;
			floater = currentTempChangeUpText.GetComponent("FloatingText");
			floater.lastUpdateTime = Time.time;
		}
		
		currentTempChangeUpText.text = "+" + currentTempChangeUpValue + "°";
		
	} else {
	
		if(!currentTempChangeDownText) {
			currentTempChangeDownValue = delta;
			currentTempChangeDownText = Instantiate( tempChangeDownText, start, Quaternion.identity );
			floater = currentTempChangeDownText.GetComponent("FloatingText");
			floater.floatFrom = thisTransform;
			floater.lastUpdateTime = Time.time;
		} else {
			currentTempChangeDownValue += delta;
			floater = currentTempChangeDownText.GetComponent("FloatingText");
			floater.lastUpdateTime = Time.time;
		}
		
		currentTempChangeDownText.text = "" + currentTempChangeDownValue + "°";
		
	}
	
}

function GameOver() {
	shouldUpdate = false;
	
	var distance = GetDistance();
	gameOverText.enabled = true;
	gameOverText.text = "Game Over!\nDistance: " + Mathf.Round(distance) + "m\nHighest Temp: " + highTemp + "°";
	var lift : Lift = gameObject.GetComponent("Lift");
	lift.respondToTouch = false;
	
	var prevDistance : int = PlayerPrefs.GetInt("distance");
	var prevTemp : int = PlayerPrefs.GetInt("temp");
	
	if(distance > prevDistance) {
		PlayerPrefs.SetInt("distance", distance);
	}
	
	if(highTemp > prevTemp) {
		PlayerPrefs.SetInt("temp", highTemp);
	}
	
	
	ReloadAfterDelay();
}

function ReloadAfterDelay() {
	yield WaitForSeconds(3);
	Application.LoadLevel(0);
}

function SimulateMotion() {
	moving = true;
	thisAnimator.force.y = 0;
	thisAnimator.force.x = -100;
}

function UpdateFireball() {
	thisEmitter.maxEmission = heat * 10;
}