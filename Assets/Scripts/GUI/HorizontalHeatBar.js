#pragma strict

var heatBar : GameObject;
private var originalHeatBarY : float;
private var originalHeatBarTiling : float;
private var maxTemperature : int = 2500;

var streakText : TextMesh;
var maxStreakTextScale : float = 1.0;
private var originalStreakTextSize : float;
private var originalStreakY : float;

var powerDownText : TextMesh;
var powerDownTimeout : float = 1.0;
private var powerDownValue : int;
private var powerDownTime : float;

private var fillChangeTime : float = 0.3;
private var targetFillScale : float;
private var targetFillTiling : float;
private var fillScaleChangeVelocity : float;
private var fillTilingChangeVelocity : float;

private var alignment = 1;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ANNOUNCE_MAX_TEMPERATURE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TEMPERATURE_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_UPDATED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_ENDED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POWERDOWN);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.UNPOLERIZE);
	
	originalHeatBarY = heatBar.transform.localScale.y;
	originalHeatBarTiling = heatBar.renderer.material.mainTextureScale.y;
	
	originalStreakTextSize = streakText.characterSize;
	originalStreakY = streakText.transform.position.y;
	
	powerDownText.renderer.material.color = Color(0.1, 1.0, 1.0, 1.0);
}

function OnMaxTemperatureAnnouncement (notification : Notification) {
	maxTemperature = notification.data;
}

function Update () {
    CheckPowerDownTimeout();
    
	var currFillScale : float = heatBar.transform.localScale.y;
	var newFillScale : float = Mathf.SmoothDamp(currFillScale, targetFillScale, fillScaleChangeVelocity, fillChangeTime);
	
	heatBar.transform.localScale.y = newFillScale;
	
	var currFillTiling : float = heatBar.renderer.material.mainTextureScale.y;
	var newFillTiling : float = Mathf.SmoothDamp(currFillTiling, targetFillTiling, fillTilingChangeVelocity, fillChangeTime);
	
	heatBar.renderer.material.mainTextureScale = Vector2(1, newFillTiling);
}

function OnTemperatureChange (notification : Notification) {
	var temperature : int = notification.data;
	
	//Debug.Log("New temperature is " + temperature);
	
	var pct : float = Mathf.Clamp(((0.0 + temperature) / (0.0 + maxTemperature)), 0, 1);
	targetFillScale = originalHeatBarY * pct;
	targetFillTiling = originalHeatBarTiling * pct;
}

function OnStreakStart (notification : Notification) {
	streakText.gameObject.active = true;
}

function OnStreakUpdate (notification : Notification) {
	var streakValue : int = notification.data;
	
	var symbol : String = "+";
	if(alignment == -1) {
		symbol = "-";
	}

	streakText.text = symbol + streakValue + "°";
	
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/500.0), originalStreakTextSize, maxStreakTextScale);
	streakText.characterSize = newSize;

	var newFill : float = heatBar.transform.position.x;
	newFill += heatBar.transform.localScale.y;
	
	streakText.transform.position.x = newFill;
}

function OnStreakEnd (notification : Notification) {
	streakText.gameObject.active = false;
	streakText.characterSize = originalStreakTextSize;
	streakText.transform.localPosition.y = originalStreakY;
}

function OnPowerDown (notification : Notification) {
	var delta : int = notification.data;
	
	powerDownTime = Time.time;
	powerDownText.gameObject.active = true;
	powerDownText.text = (delta*alignment) + "°";
	
	animation.Play();
}

function CheckPowerDownTimeout () {
	if((Time.time - powerDownTime) > powerDownTimeout) {
		powerDownText.gameObject.active = false;
	}
}

function Shake() {

}


function OnPolerize() {
	alignment = -1;
}

function OnUnpolerize() {
	alignment = 1;
}