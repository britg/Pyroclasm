
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

private var poolSize : int = 5;
private var yMin = 2;
private var yMax = 7;
private var xStart = 10;
private var nextObject : Transform;

private var Pools : Array = [];

private var distance : Distance;
private var scrolling : Scroller;

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
	var pool : GameObjectPool = Pools[Mathf.Floor(Random.value*Pools.length)];
	var yStart = Random.value * (yMax - yMin) + yMin;
	pool.Spawn(Vector3(xStart, yStart, -1), Quaternion.identity);
}
