
var Level : GameObject;
var fireball : GameObject;

var block : GameObject;
private var blockPool : GameObjectPool;
var down : GameObject;
private var downPool : GameObjectPool;
var up : GameObject;
private var upPool : GameObjectPool;
var zigzag : GameObject;
private var zigzagPool : GameObjectPool;

var startGenerationInterval : float = 1.8;
var minGenerationInterval : float = 0.3;
var distanceToMinGenerationInterval : int = 1200;

private var timeleft : float; // Left time for current interval

private var poolSize : int = 3;
private var yMin = 2;
private var yMax = 7;
private var xStart = 10;
private var nextObject : Transform;

private var Pools : Array = [];

private var distance : Distance;
private var scrolling : Scroller;

private var lastX : float = 10.0;
private var lastMark : float;

var patternPaddingMax : float = 1.0;
var patternPaddingMin : float = 20.0;
private var patternPadding : float = 5.0;

function Awake () {

	blockPool = GameObjectPool( block, poolSize, true );
	blockPool.PrePopulate(poolSize);
	upPool = GameObjectPool( up, poolSize, true );
	upPool.PrePopulate(poolSize);
	downPool = GameObjectPool( down, poolSize, true );
	downPool.PrePopulate(poolSize);
	zigzagPool = GameObjectPool( zigzag, poolSize, true );
	zigzagPool.PrePopulate(poolSize);
	
	Pools = [blockPool, upPool, downPool, zigzagPool];
}

function Start () {
	distance = fireball.GetComponent("Distance") as Distance;
	scrolling = Level.GetComponent("Scroller");
	ResetTimer();
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.HEAT_PATTERN_END);
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
	
	//TimerBasedGeneration();
	DistanceBasedGeneration();
}

function TimerBasedGeneration () {

	timeleft -= Time.deltaTime;
    
    if( timeleft <= 0.0 ) {
		ResetTimer();
		Generate();
	}
}

function DistanceBasedGeneration () {
	var distDelta : float = distance.distance - lastMark;
	
	if(distDelta > (lastX + patternPadding)) {
		Generate();
		lastMark = distance.distance;
		patternPadding = Random.value * (patternPaddingMax - patternPaddingMin) + patternPaddingMin;
		
		if(patternPadding > 10.0) {
			RequestInterstitial();
		}
	}
}

function RequestInterstitial () {
	
}

function Generate () {
	var pool : GameObjectPool = Pools[Mathf.Floor(Random.value*Pools.length)];
	var yStart = Random.value * (yMax - yMin) + yMin;
	pool.Spawn(Vector3(xStart, yStart, -1), Quaternion.identity);
}

function OnHeatPatternEnd (notification : Notification) {
	lastX = notification.data;
	lastMark = distance.distance;
	Debug.Log("Received end X notification " + lastX);
}