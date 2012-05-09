
var updateInterval = 0.2;

var coolRate : float = 1;
var initialHeat : int = 500;
var maxHeat : int = 2500;

var gameOverText : GUIText;

private var timeleft : float;

var heat : int;

private var gameOver : boolean;
private var shouldUpdate : boolean = true;

var Level : GameObject;
private var scrolling : Scroller;
private var thisTransform : Transform;
private var thisRigidbody : Rigidbody;
private var thisEmitter : ParticleEmitter;
private var thisAnimator : ParticleAnimator;
private var thisSmokeAnimator : ParticleAnimator;
private var thisDistance : Distance;
private var thisStreak : Streak;

private var moving : boolean = false;

function Start () {

	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);

	heat = initialHeat;
	
	thisTransform = transform;
	thisRigidbody = rigidbody;
	thisEmitter = thisTransform.Find("Intensity").GetComponent.<ParticleEmitter>();
	thisAnimator = thisTransform.Find("Intensity").GetComponent.<ParticleAnimator>();
	thisSmokeAnimator = thisTransform.Find("Smoke").GetComponent.<ParticleAnimator>();
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

	var scroll : Hashtable = Scrolls.PlayerScrolls().scrollForNextRun;
	
	if(scroll && scroll["color"] == Scrolls.GREEN) {
		var level : int = scroll["level"];
		heat += level * Scrolls.TEMP_MULTIPLIER;
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
	if(heat + coolAmount <= 10) {
		coolAmount = -heat + 10;
	}
	
	if(!thisStreak.ongoing) {
		TempChange(coolAmount, false);
	}
}

function TempChange(delta : int, isPublic : boolean) {
	//Debug.Log("delta is " + delta);
	heat += delta;
	
	heat = Mathf.Clamp(heat, 0, maxHeat);
	
	if(isPublic) {
		thisStreak.UpdateStreak(delta);
	}
	
	if(heat <= 0) {
		heat = 0;	
		gameOver = true;
	}
	
	if(shouldUpdate) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.TEMPERATURE_CHANGED, heat);
	}
	
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
	thisSmokeAnimator.force.y = 0;
	UpdateIntensity();
}

function UpdateIntensity() {
	thisAnimator.force.x = - 5*scrolling.velocity;
	thisSmokeAnimator.force.x = - 5*scrolling.velocity;
}