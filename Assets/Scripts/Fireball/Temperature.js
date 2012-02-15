
var updateInterval = 0.2;
var intensityUpdateInterval = 1.0;

var coolRate : float = 1;
var initialHeat : int = 500;
var maxHeat : int = 2500;

var displayText : GUIText;
var gameOverText : GUIText;

var streakText  : TextMesh;
var powerDownText : TextMesh;

private var originalStreakTextSize : float;
private var originalStreakY : float;

private var streakValue : int;
private var streakTime : float;
var streakTimeout : float = 1.0;

private var powerDownValue : int;
private var powerDownTime : float;
var powerDownTimeout : float = 1.0;

var pickupSound : AudioClip;
var cooldownSound : AudioClip;
var explosionSound : AudioClip;

var Level : GameObject;
private var scrolling;

private var timeleft : float;
private var intensityUpdateTimeLeft : float;

private var heat : int;
private var highTemp : int;

private var gameOver : boolean;
private var shouldUpdate : boolean = true;

private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;
private var thisEmitter : ParticleEmitter;
private var thisAnimator : ParticleAnimator;
private var thisDistance;

private var moving : boolean = false;

function Start () {
	heat = highTemp = initialHeat;
	thisTransform = transform;
	thisRigidbody = rigidbody;
	thisEmitter = thisTransform.Find("Intensity").GetComponent.<ParticleEmitter>();
	thisAnimator = thisTransform.Find("Intensity").GetComponent.<ParticleAnimator>();
	scrolling = Level.GetComponent("Scroller");
	thisDistance = gameObject.GetComponent("Distance");
	
	powerDownText.renderer.material.color = Color(0.1, 1.0, 1.0, 1.0);
	streakText.renderer.material.color = Color(1.0, 0.376, 0.203, 1.0);
	
	originalStreakTextSize = streakText.characterSize;
	//originalStreakY = streakText.transform.localPosition.y;
	
	ResetTimer();
	ResetIntensityUpdateTimer();
}

function ResetTimer () {
	timeleft = updateInterval;
}

function ResetIntensityUpdateTimer() {
	intensityUpdateTimeLeft = intensityUpdateInterval;
}

function Update () {

	if( !moving && scrolling.started ) {
		SimulateMotion();
	}

	timeleft -= Time.deltaTime;
	intensityUpdateTimeLeft -= Time.deltaTime;
    
    if(!gameOver) {
    
    	CheckTextTimeout();
    	
	    if( timeleft <= 0.0 ) {
	    	TrackHighestTemp();
	    	CoolOff();	
			ResetTimer();
		}
		
		if( intensityUpdateTimeLeft <= 0.0 ) {
			UpdateIntensity();
			ResetIntensityUpdateTimer();
		}
	} else if(shouldUpdate) {
		GameOver();
	}
}

function DisplayTemp() {
	displayText.text = "" + heat + "°";
}

function OnTriggerEnter(collider : Collider){

	// Cancel the collision
	//thisRigidbody.velocity.y = prevYVelocity;
	
	var obj : GameObject = collider.gameObject;
	var tempChanger : TempChanger = obj.GetComponent("TempChanger");
	
	if(tempChanger != null) {
		TempChange(tempChanger.tempDiff, true);
		
		if(tempChanger.playPickupSound) {
			audio.PlayOneShot(pickupSound);
		}
		
		if(tempChanger.playCooldownSound) {
			audio.PlayOneShot(cooldownSound);
		}
		
		if(tempChanger.playExplosionSound) {
			audio.PlayOneShot(explosionSound);
		}
		
		if(tempChanger.removeOnCollision) {
			Destroy(obj);
		}
		
		if(tempChanger.disableOnCollision) {
			obj.SetActiveRecursively(false);
		}
		
		if(tempChanger.shakesCamera) {
			Camera.main.animation.Play();
		}
	}

}

function GetDistance() {
	return thisDistance.distance;
}

function TrackHighestTemp() {
	if(heat > highTemp) {
		highTemp = heat;
	}
}

function CoolOff() {
	var distance = GetDistance();
	var coolAmount : int = -Mathf.Round(coolRate * Mathf.Sqrt(distance));
	if(heat + coolAmount <= 10) {
		coolAmount = -heat + 10;
	}
	
	if(!streakText.gameObject.active) {
		TempChange(coolAmount, false);
	}
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
	}
	
}

function NotifyTempChange(delta) {
	
	var symbol = "";
	var start : Vector2 = Camera.main.WorldToViewportPoint(thisTransform.position);
	start.x += 0.1;
	var floater : FloatingText;
	
	if(delta > 0) {
		streakTime = Time.time;
		
		if(!streakText.gameObject.active) {
			streakText.gameObject.active = true;
			originalStreakTextSize = streakText.characterSize;
			//originalStreakY = streakText.transform.localPosition.y;
		}
		
		IncreaseStreak(delta);
		
	} else {
		powerDownTime = Time.time;
		EndStreak();
		
		powerDownText.gameObject.active = true;
		powerDownText.text = "" + delta + "°";
		
	}
	
}

function CheckTextTimeout () {
	
	if((Time.time - streakTime) > streakTimeout) {
		EndStreak();
	}
	
	if((Time.time - powerDownTime) > powerDownTimeout) {
		powerDownText.gameObject.active = false;
	}
}

function IncreaseStreak(delta) {
	streakValue += delta;
	streakText.text = "+" + streakValue + "°";
	
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/200.0), originalStreakTextSize, 3);
	//var newY : float = originalStreakY + ((0.0+streakValue)/100.0);
	streakText.characterSize = newSize;
	//streakText.transform.localPosition.y = newY;
}

function EndStreak() {
	streakText.gameObject.active = false;
	streakValue = 0;
	streakText.characterSize = originalStreakTextSize;
	streakText.transform.localPosition.y = originalStreakY;
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
	UpdateIntensity();
}

function UpdateIntensity() {
	thisEmitter.maxEmission = heat / 10 + 10;
	thisAnimator.force.x = - 5*scrolling.velocity;
}