
var updateInterval = 0.2;

var coolRate : float = 1;
var initialHeat : int = 500;
var maxHeat : int = 2500;
var heat : int;

var gameOverText : GUIText;

private var timeleft : float;


private var gameOver : boolean;
private var shouldUpdate : boolean = true;

var Level : GameObject;
private var scrolling : Scroller;
private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;
private var thisEmitter : ParticleEmitter;
private var polarizedEmitter : ParticleEmitter;
private var thisAnimator : ParticleAnimator;
private var polarizedAnimator : ParticleAnimator;

private var thisDistance : Distance;
private var thisStreak : Streak;

private var moving : boolean = false;

var alignment : int = 1;

var firstPowerdown : boolean = false;
var firstPowerup : boolean = false;

private var boosting : boolean = false;
private var boostSpent : boolean = false;
var boostCost : int = -100;

function Start () {

	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.UNPOLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.BOOST_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.BOOST_END);
	
	thisTransform = transform;
	thisRigidbody = rigidbody;
	thisEmitter = thisTransform.Find("Intensity").GetComponent.<ParticleEmitter>();
	polarizedEmitter = thisTransform.Find("Polarized").GetComponent.<ParticleEmitter>();
	thisAnimator = thisTransform.Find("Intensity").GetComponent.<ParticleAnimator>();
	polarizedAnimator = thisTransform.Find("Polarized").GetComponent.<ParticleAnimator>();
	scrolling = Level.GetComponent("Scroller") as Scroller;
	thisDistance = gameObject.GetComponent("Distance") as Distance;
	thisStreak = gameObject.GetComponent("Streak") as Streak;
	
	ResetTimer();
	AnnounceMaxTemperature();
}

function ResetTimer () {
	timeleft = updateInterval;
}

function AnnounceTemperature() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TEMPERATURE_CHANGED, heat);
}

function AnnounceMaxTemperature () {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ANNOUNCE_MAX_TEMPERATURE, maxHeat);
}

function OnGameStart() {

	AnnounceTemperature();

	var scroll : Hashtable = Scrolls.PlayerScrolls().scrollForNextRun;
	
	if(scroll && scroll["color"] == Scrolls.GREEN) {
		var level : int = scroll["level"];
		var delta : int = level * Scrolls.TEMP_MULTIPLIER;
		TempChange(delta, false);
	}

}

function Update () {

	if( !moving && scrolling.started ) {
		SimulateMotion();
	}

	timeleft -= Time.deltaTime;
    
    if(!gameOver) {
    
	    if( timeleft <= 0.0 ) {
	    	CoolOff();	
			ResetTimer();
		}
		
	} else if(shouldUpdate) {
		GameOver();
	}
}

function GetDistance() {
	return thisDistance.distance;
}

function CoolOff() {
	var distance = GetDistance();
	var coolAmount : int = -Mathf.Round(coolRate * Mathf.Sqrt(distance));
	
	if( (heat + (coolAmount * alignment)) <= 10) { // Don't die by cooling off
		return;
	}
	
	if(!thisStreak.ongoing) {
		TempChange(coolAmount * alignment, false);
	}
	
	// Boost effect
	if(boosting) {
		if(boostSpent || heat <= Mathf.Abs(boostCost)) {
			NotificationCenter.DefaultCenter().PostNotification(this, Notifications.BOOST_END);
		} else {
			TempChange(boostCost * alignment, false);
			boostSpent = true;
		}
	}
}

function TempChange(delta : int, isPublic : boolean) {

	var prevHeat : int = heat;
	var factor : int = 1;
	
	if(alignment == -1 && delta > 0 && isPublic) {
		factor = 5;
	}
	delta = (delta * alignment * factor);
	heat += delta;
	
	heat = Mathf.Clamp(heat, 0, maxHeat);
	
	if(isPublic ) {
		thisStreak.UpdateStreak(delta);
		
		if(delta < 0 && !firstPowerdown && alignment == 1) {
			NotifyFirstPowerdown();
		}
		
		if(delta > 0 && !firstPowerup && alignment == 1) {
			NotifyFirstPowerup();
		}
	}
	
	if(heat <= 0) {
		heat = 0;	
		gameOver = true;
	}
	
	if(shouldUpdate && prevHeat != heat) {
		AnnounceTemperature();
	}
	
	UpdateIntensity();
	
}

function NotifyFirstPowerdown() {
	var distance : int = GetDistance();
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.FIRST_POWERDOWN, distance);
	firstPowerdown = true;
}

function NotifyFirstPowerup() {
	var distance : int = GetDistance();
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.FIRST_POWERUP, distance);
	firstPowerup = true;
}


function GameOver() {
	thisEmitter.emit = false;	
	shouldUpdate = false;
	
	var distance : int = GetDistance();
	var streak : int = thisStreak.longestStreak;
	
	var score : Hashtable = new Hashtable();
	score.Add("distance", distance);
	score.Add("streak", streak);
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GAME_END, score);
	
	DisplayScore(distance, streak);
	ReloadAfterDelay();
}

function DisplayScore(distance : int, streak : int) {
	gameOverText.enabled = true;
	gameOverText.text = "Game Over!\nThis Run: " + distance + "m\nLongest Streak: +" + streak + "°";
}


function ReloadAfterDelay() {
	yield WaitForSeconds(3);
	Application.LoadLevel(0);
}

function SimulateMotion() {
	moving = true;
	thisAnimator.force.y = 0;
	polarizedAnimator.force.y = 0;
	UpdateIntensity();
}

function UpdateIntensity() {
	thisAnimator.force.x = - 3*scrolling.velocity;
	polarizedAnimator.force.x = - 3*scrolling.velocity;
	
	if(moving) {
		var newEmission : float = Emission();
		thisEmitter.maxEmission = newEmission;
		thisEmitter.minEmission = newEmission;
		polarizedEmitter.maxEmission = newEmission;
		polarizedEmitter.minEmission = newEmission;
	}
}

function Emission() {
	var factor : float = scrolling.velocity / 1.2;
	return Mathf.Clamp(factor*factor, 10.0, 75.0);
}

function GetHeatPercentage() {
	var currHeatPercentage : float = (0.0 + heat) / (0.0 + maxHeat) * 100.0;
	return currHeatPercentage;
}

function OnPolerize() {
	Debug.Log("Polerizing!");
	alignment = -1;
	polarizedEmitter.emit = true;
	thisEmitter.emit = false;
}

function OnUnpolerize() {
	Debug.Log("Unpolerizing!");
	alignment = 1;
	polarizedEmitter.emit = false;
	thisEmitter.emit = true;
}

function OnBoostStart() {
	boosting = true;
	boostSpent = false;
}

function OnBoostEnd() {
	boosting = false;
}