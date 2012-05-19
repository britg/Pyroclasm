
var fireball : GameObject;
var Level : GameObject;

var maxGenerationInterval : float = 7.0;
var minGenerationInterval : float = 2.0;

var gargoyle : GameObject;
private var gargoylePool : GameObjectPool;
var gargoyleWithGem : GameObject;
private var gargoyleWithGemPool : GameObjectPool;
var bookshelf : GameObject;
private var bookshelfPool : GameObjectPool;
var torch : GameObject;
private var torchPool : GameObjectPool;
var icicle : GameObject;
private var iciclePool :GameObjectPool;
var tapestry : GameObject;
private var tapestryPool : GameObjectPool;

private var poolSize : int = 3;


private var timeleft : float;
private var xStart = 10;

private var distance : Distance;
private var scrolling : Scroller;

private var Pools : Array;

private var eventActive : boolean = false;

function Start () {
	distance = fireball.GetComponent("Distance");
	scrolling = Level.GetComponent("Scroller");
	
	ResetTimer();
	
	gargoylePool = GameObjectPool( gargoyle, poolSize, true );
	gargoylePool.PrePopulate(poolSize);
	gargoyleWithGemPool = GameObjectPool( gargoyleWithGem, poolSize, true );
	gargoyleWithGemPool.PrePopulate(poolSize);
	bookshelfPool = GameObjectPool( bookshelf, poolSize, true );
	bookshelfPool.PrePopulate(poolSize);
	torchPool = GameObjectPool( torch, poolSize, true );
	torchPool.PrePopulate(poolSize);
	iciclePool = GameObjectPool( icicle, poolSize, true );
	iciclePool.PrePopulate(poolSize);
	tapestryPool = GameObjectPool( tapestry, poolSize, true );
	tapestryPool.PrePopulate(poolSize);
	
	Pools = [gargoylePool, gargoyleWithGemPool, bookshelfPool, torchPool, iciclePool, tapestryPool];
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_ENDED);
}

function ResetTimer () {
	timeleft = Random.value * (maxGenerationInterval - minGenerationInterval) + minGenerationInterval;
}

function Update () {
	if(scrolling.velocity == 0) {
		return;
	}
	
	if(eventActive) {
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
	pool.Spawn(Vector3(xStart, 0, -1), Quaternion.identity);
}

function OnEventStarted() {
	eventActive = true;
}

function OnEventEnded() {
	eventActive = false;
}