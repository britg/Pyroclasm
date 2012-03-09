
var Level : GameObject;

var startGenerationInterval : float = 1.0;
var minGenerationInterval : float = 0.1;
var distanceToMinGenerationInterval : int = 1200;

var maxSpeedFactor : float = 1.4;
var minSpeedFactor : float = 1.1;


var iceBolt : GameObject;
var fireball : GameObject;

private var iceBoltPool : GameObjectPool;
private var poolSize : int = 5;

private var timeleft : float;

private var yMin : float = 0.1;
private var yMax : float = 8.307953;
private var xStart = 10;
private var nextObject : Transform;

private var speedFactor : float = 1;

private var distance : Distance;
private var scrolling : Scroller;

function Start () {
	distance = fireball.GetComponent("Distance");
	ResetTimer();
	scrolling = Level.GetComponent("Scroller");
	
	iceBoltPool = GameObjectPool( iceBolt, poolSize, function(target : GameObject){ target.SendMessage("SetPool", iceBoltPool); }, true );
	iceBoltPool.PrePopulate(poolSize);
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
}

function Generate () {
	var yStart = Random.value * (yMax - yMin) + yMin;
	speedFactor = Random.value* (maxSpeedFactor - minSpeedFactor) + minSpeedFactor;
	
	var bolt : GameObject = iceBoltPool.Spawn(Vector3(xStart, yStart, -1), Quaternion.identity);
	var motor : Motor = bolt.gameObject.GetComponent("Motor");
	motor.factor = speedFactor;
}