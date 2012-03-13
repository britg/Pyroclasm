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

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.ANNOUNCE_MAX_TEMPERATURE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TEMPERATURE_CHANGED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_UPDATED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.STREAK_ENDED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POWERDOWN);
	
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
}

function OnTemperatureChange (notification : Notification) {
	var temperature : int = notification.data;
	
	//Debug.Log("New temperature is " + temperature);
	
	var pct : float = Mathf.Clamp(((0.0 + temperature) / (0.0 + maxTemperature)), 0, 1);
	heatBar.transform.localScale.y = originalHeatBarY * pct;
	heatBar.renderer.material.mainTextureScale = Vector2(1, originalHeatBarTiling * pct);
}

function OnStreakStart (notification : Notification) {
	streakText.gameObject.active = true;
}

function OnStreakUpdate (notification : Notification) {
	var streakValue : int = notification.data;

	streakText.text = "+" + streakValue + "°";
	
	var newSize : float = Mathf.Clamp(originalStreakTextSize + ((0.0+streakValue)/500.0), originalStreakTextSize, maxStreakTextScale);
	streakText.characterSize = newSize;

	var y : float = heatBar.transform.position.x;
	y += heatBar.transform.localScale.y;
	streakText.transform.position.x = y + streakText.transform.localScale.x;
	streakText.transform.position.x = y;
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
	powerDownText.text = "" + delta + "°";
}

function CheckPowerDownTimeout () {
	if((Time.time - powerDownTime) > powerDownTimeout) {
		powerDownText.gameObject.active = false;
	}
}