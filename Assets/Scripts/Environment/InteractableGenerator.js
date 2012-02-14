
var fireball : GameObject;
var Level : GameObject;

var maxGenerationInterval : float = 7.0;
var minGenerationInterval : float = 2.0;

var gargoyle : GameObject;
private var gargoylePool : GameObjectPool;
var bookshelf : GameObject;
private var bookshelfPool : GameObjectPool;
var torch : GameObject;
private var torchPool : GameObjectPool;
var tapestry : GameObject;
private var tapestryPool :GameObjectPool;

private var poolSize : int = 3;


private var timeleft : float;
private var xStart = 10;
private var Distance;
private var scrolling;

private var Pools : Array;

function Start () {
	Distance = fireball.GetComponent("Distance");
	ResetTimer();
	scrolling = Level.GetComponent("Scroller");
	
	
	gargoylePool = GameObjectPool( gargoyle, poolSize, function(target : GameObject){ target.SendMessage("SetPool", gargoylePool); }, true );
	gargoylePool.PrePopulate(poolSize);
	bookshelfPool = GameObjectPool( bookshelf, poolSize, function(target : GameObject){ target.SendMessage("SetPool", bookshelfPool); }, true );
	bookshelfPool.PrePopulate(poolSize);
	torchPool = GameObjectPool( torch, poolSize, function(target : GameObject){ target.SendMessage("SetPool", torchPool); }, true );
	torchPool.PrePopulate(poolSize);
	tapestryPool = GameObjectPool( tapestry, poolSize, function(target : GameObject){ target.SendMessage("SetPool", tapestryPool); }, true );
	tapestryPool.PrePopulate(poolSize);
	
	Pools = [gargoylePool, bookshelfPool, torchPool, tapestryPool];
}

function ResetTimer () {
	timeleft = Random.value * (maxGenerationInterval - minGenerationInterval) + minGenerationInterval;
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
	pool.Spawn(Vector3(xStart, 0, -1), Quaternion.identity);
}