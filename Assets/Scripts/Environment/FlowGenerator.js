
var Level : GameObject;
var fireball : GameObject;

var bonusBlock : GameObject;

var line : GameObject;
private var linePool : GameObjectPool;
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

private var poolSize : int = 5;
private var yMin = 2;
private var yMax = 6;
private var xStart = 10;
private var nextObject : Transform;

private var Pools : Array = [];

private var distance : Distance;
private var scrolling : Scroller;

private var lastX : float = 10.0;
private var lastMark : float;

var patternPaddingMin : float = 5.0;
var patternPaddingMax : float = 15.0;
private var patternPadding : float = 10.0;

private var objectRequested : boolean = false;

var bonusChance : float 			= 40.0;
private var bonuses : Array 		= ["torch", "bookcase", "gargoyle", "tapestry"];
private var bonusTiers : Array 		= [60.0, 	70.0, 		80.0, 		100.0];
private var obstacles : Array 		= ["iceshards", "gargoyle"];

function Awake () {

	linePool = GameObjectPool( line, poolSize, true );
	linePool.PrePopulate(poolSize);	
	blockPool = GameObjectPool( block, poolSize, true );
	blockPool.PrePopulate(poolSize);
	upPool = GameObjectPool( up, poolSize, true );
	upPool.PrePopulate(poolSize);
	downPool = GameObjectPool( down, poolSize, true );
	downPool.PrePopulate(poolSize);
	zigzagPool = GameObjectPool( zigzag, poolSize, true );
	zigzagPool.PrePopulate(poolSize);
	
	Pools = [linePool, blockPool, upPool, downPool, zigzagPool];
	//Pools = [blockPool];
}

function Start () {
	distance = fireball.GetComponent("Distance") as Distance;
	scrolling = Level.GetComponent("Scroller");
	ResetTimer();
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
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

function OnGameStart() {

	var scroll : Hashtable = Scrolls.PlayerScrolls().scrollForNextRun;
	
	if(scroll && scroll["color"] == Scrolls.RED) {
		var level : int = scroll["level"];
		var lust : GameObject = Instantiate(bonusBlock, Vector3(0, 3.0, -1), Quaternion.identity);	
		var blockBehaviour : BonusBlock = lust.GetComponent("BonusBlock");
		blockBehaviour.cols += level*2;
		blockBehaviour.DrawGems();
	}

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
		objectRequested = false;
		lastMark = distance.distance;
		patternPadding = Random.value * (patternPaddingMax - patternPaddingMin) + patternPaddingMin;
	}
}

function RequestObject (x : float) {

	var hit : RaycastHit;
	
	objectRequested = true;
	
	if(Physics.Raycast(Vector3(x, 1, -10), Vector3(0, 0, 1), hit, 20.0)) {
		//Debug.Log("Hit occurred on " + hit.collider.gameObject);
		return;
	}
	
	var bonusRoll : float = Mathf.Floor(Random.value * 100.0);
	
	if(bonusRoll <= bonusChance) {
		RequestBonus(x);
	} else {
		RequestObstacle(x);
	}
	
}

function RequestBonus (x : float) {
	Debug.Log("Bonus Requested!");
	var roll : float = Mathf.Floor(Random.value * 100.0);
	var which : int;
	var tier : float;
	
	for ( which = 0; which < bonusTiers.length; which++ ) {
		tier = bonusTiers[which];
		if(roll <= tier) {
			break;
		}
	}
	
	var obj : String = bonuses[which];
	var note : String;
	switch (obj) {
		case "torch":
			note = Notifications.GENERATE_TORCH;
		break;
		case "bookcase":
			note = Notifications.GENERATE_BOOKCASE;
		break;
		case "gargoyle":
			note = Notifications.GENERATE_GARGOYLE_BONUS;
		break;
		case "tapestry":
			note = Notifications.GENERATE_TAPESTRY;
		break;
	}
	
	NotificationCenter.DefaultCenter().PostNotification(this, note, x);
}

function RequestObstacle (x : float) {
	Debug.Log("Obstacle Requested!");
	
	var obstacle : String = obstacles[Mathf.Floor(Random.value * obstacles.length)];
	var note: String;
	
	switch(obstacle) {
		
		case "gargoyle":
			note = Notifications.GENERATE_GARGOYLE_OBSTACLE;
		break;
		case "iceshards":
			note = Notifications.GENERATE_ICESHARDS;
		break;
	
	}
	
	NotificationCenter.DefaultCenter().PostNotification(this, note, x);

}

function Generate () {
	var pool : GameObjectPool = Pools[Mathf.Floor(Random.value*Pools.length)];
	var yStart = Random.value * (yMax - yMin) + yMin;
	pool.Spawn(Vector3(xStart, yStart, -1), Quaternion.identity);
}

function OnHeatPatternEnd (notification : Notification) {
	lastX = notification.data;
	lastMark = distance.distance;
	
	var objPos : float = lastX + xStart + patternPadding/2 - 2;
	RequestObject(objPos);
}