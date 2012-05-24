
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

function Start () {

	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.UNPOLERIZE);
	
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

function AnnounceMaxTemperature () {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ANNOUNCE_MAX_TEMPERATURE, maxHeat);
}

function OnGameStart() {

	TempChange((initialHeat-heat), false);
	thisStreak.EndStreak();

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
	}
	
	if(heat <= 0) {
		heat = 0;	
		gameOver = true;
	}
	
	if(shouldUpdate && prevHeat != heat) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TEMPERATURE_CHANGED, heat);
	}
	
	UpdateIntensity();
	
}


function GameOver() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GAME_END);
	thisEmitter.emit = false;	
	shouldUpdate = false;
	
	var distance = GetDistance();
	gameOverText.enabled = true;
	gameOverText.text = "Game Over!\nThis Run: " + Mathf.Round(distance) + "m\nLongest Streak: +" + thisStreak.longestStreak + "°";
	
	var prevDistance : int = PlayerPrefs.GetInt("distance");
	var prevStreak : int = PlayerPrefs.GetInt("streak");
	
	if(distance > prevDistance) {
		PlayerPrefs.SetInt("distance", distance);
		if(GameCenterBinding.isGameCenterAvailable()) {
			GameCenterBinding.reportScore(distance, "pyrodev.run");
		}
	}
	
	if(thisStreak.longestStreak > prevStreak) {
		PlayerPrefs.SetInt("streak", thisStreak.longestStreak);
	}
	
	if(distance > 1000) {
    	GameCenterBinding.reportAchievement("pyrodev.1000m", 100.0);
	}
	
	if(distance > 2000) {
    	GameCenterBinding.reportAchievement("pyrodev.2000m", 100.0);
	}
	
	if(distance > 3000) {
    	GameCenterBinding.reportAchievement("pyrodev.3000m", 100.0);
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