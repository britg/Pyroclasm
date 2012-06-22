
private var thisTransform : Transform;

private var startScale : Vector3 = Vector3(5, 4.5, 4.5);
private var powerUpScale : Vector3 = Vector3(10, 9, 9);
private var targetScale : Vector3;
private var isActive : boolean = false;
private var isPowerUpActive : boolean = false;

private var scaleVelocity : Vector3;
var scaleTime : float = 0.5;

private var currActiveTime : float = 0.0;
var activeTime : float = 5.0;

private var fireball : GameObject;
private var streak : Streak;

var powerUpSound : AudioClip;
var activateSound : AudioClip;

function Start() {
	thisTransform = transform;
	SendMessage("Update");
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_LEVEL_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POWERDOWN);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GARGOYLE_ACTIVATED);
	
	fireball = GameObject.Find("Fireball");
	streak = fireball.GetComponent("Streak");
}

function OnGameStart() {

	var scroll : Hashtable = Scrolls.PlayerScrolls().scrollForNextRun;
	
	if(scroll && scroll["color"] == Scrolls.PURPLE) {
		var level : float = scroll["level"];
		activeTime += 1 + level;
		
		var factor : float = (1.0 + level*Scrolls.CORONA_MULTIPLIER);
		Debug.Log("level " + level);
		Debug.Log("factor " + factor);
		Debug.Log("mult " + Scrolls.CORONA_MULTIPLIER);
		var effect : Vector3 = Vector3(factor, factor, factor);
		startScale = Vector3.Scale(startScale, effect);
		
		Activate();
	}

}

function Update () {
	Rotate();
	
	if(isActive) {
		CheckTimeout();
	}
	
	ChangeSize();
}

function Rotate() {
	thisTransform.Rotate(Time.deltaTime*140, 0, 0);
}

function CheckTimeout() {
	currActiveTime += Time.deltaTime;
	
	if(currActiveTime >= activeTime ) {
		if(isPowerUpActive) {
			Deactivate();
		}
		
		if(!streak.ongoing) {
			Deactivate();
		}
	}
}

function OnStreakLevelChange (notification : Notification) {
	var streakLevel : int = notification.data;
	
	if(streakLevel >= 1 && !isActive) {
		//Activate();
	}
}

function OnPowerDown (notification : Notification) {
	Deactivate();
}

function Activate (scale : Vector3) {
	isActive = true;
	targetScale = scale;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ANNOUNCEMENT, "Corona Activated!");
	audio.PlayOneShot(activateSound);
}

function Activate () {
	Activate(startScale);
}

function Deactivate() {
	isActive = false;
	isPowerUpActive = false;
	currActiveTime = 0.0;
	targetScale = Vector3(0, 0, 0);
}

function ChangeSize() {
	if(thisTransform.localScale == targetScale)
		return;
		
	thisTransform.localScale = Vector3.SmoothDamp(thisTransform.localScale, targetScale, scaleVelocity, scaleTime);
}


function OnGargoyleActivate () {
	if(isPowerUpActive) {
		return;
	}
	
	isActive = true;
	isPowerUpActive = true;
	targetScale = powerUpScale;
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.ANNOUNCEMENT, "Demon's Rage!");
	Camera.mainCamera.audio.PlayOneShot(powerUpSound);
}