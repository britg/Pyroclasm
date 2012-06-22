
var Level : GameObject;
var iceBolt : GameObject;
var fireball : GameObject;
private var distance : Distance;
private var scrolling : Scroller;

var startGenerationInterval : float = 1.0;
var minGenerationInterval : float = 0.1;
var distanceToMinGenerationInterval : int = 1200;

var maxSpeedFactor : float = 1.4;
var minSpeedFactor : float = 1.1;

var minChance : float = 30.0;

private var iceBoltPool : GameObjectPool;
private var poolSize : int = 1;

private var timeleft : float;

private var yMin : float = 0.1;
private var yMax : float = 7.307953;
private var xStart = 7.42;
private var nextObject : Transform;

var warningTime : float = 1.5;

private var eventActive : boolean = false;

private var alignment : int = 1;
private var shouldFollow : boolean = false;
private var activeBolt : GameObject;

function Start () {
	distance = fireball.GetComponent("Distance");
	ResetTimer();
	scrolling = Level.GetComponent("Scroller");
	
	iceBoltPool = GameObjectPool( iceBolt, poolSize, true );
	iceBoltPool.PrePopulate(poolSize);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_ENDED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.UNPOLERIZE);
}

function ResetTimer () {
	var distPercent : float = distance.distance / distanceToMinGenerationInterval;
	if(distPercent > 1.0) {
		distPercent = 1.0;
	}
	var delta : float = (startGenerationInterval - minGenerationInterval) * distPercent;
	timeleft = startGenerationInterval - delta;
}

function Update () {
	
	if(scrolling.velocity == 0) {
		return;
	}
	
	timeleft -= Time.deltaTime;
    
    if( timeleft <= 0.0 ) {
		ResetTimer();
		Generate();
	}
	
	if(shouldFollow && alignment == 1) {
		activeBolt.transform.position.y = fireball.transform.position.y;
	}
}

function Generate () {
	var yStart : float;
	
	if(alignment == -1) {
		yStart = Random.value * (yMax - yMin) + yMin;
	} else {
		yStart = fireball.transform.position.y;
	}
	
	if(!ShouldGenerate(yStart)) {
		return;
	}
	
	activeBolt = iceBoltPool.Spawn(Vector3(xStart, yStart, -1), Quaternion.identity);
	var motor : Motor = activeBolt.gameObject.GetComponent("Motor");
	
	motor.fixedSpeed = 0.0;
	shouldFollow = true;
	yield WaitForSeconds(warningTime);
	shouldFollow = false;
	var warning : GameObject = activeBolt.Find("Warning");
	warning.SetActiveRecursively(false);
	motor.fixedSpeed = 8 + scrolling.velocity;
}

function ShouldGenerate(y : float) {

	if(y < 0.3) {
		return true;
	}
	
	if(alignment == -1) {
		return true;
	}
	
	if(eventActive) {
		return false;
	}
	
	var temp : Temperature = fireball.GetComponent("Temperature");
	var heatPercentage : float = temp.GetHeatPercentage();
	//Debug.Log("Heat percentage is " + heatPercentage);
	var actualChance : float = Mathf.Clamp(temp.GetHeatPercentage(), minChance, 100);
	//Debug.Log("actual chance is " + actualChance);
	var roll : float = (Random.value * 100.0);
	//Debug.Log("roll is " + roll);
	return ( roll < actualChance );
}

function OnEventStarted() {
	eventActive = true;
}

function OnEventEnded() {
	eventActive = false;
}

function OnPolerize() {
	alignment = -1;
}

function OnUnpolerize() {
	alignment = 1;
}