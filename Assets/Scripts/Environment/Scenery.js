
var startbg : GameObject;

var bg1 : GameObject;
private var bg1Pool : GameObjectPool;
var bg2 : GameObject;
private var bg2Pool : GameObjectPool;
var bg3 : GameObject;
private var bg3Pool : GameObjectPool;

var plainbg : GameObject;
private var plainBgPool : GameObjectPool;

private var poolSize : int = 3;

private var Pools : Array;
private var bgs : Array;

function Start () {
	bg1Pool = GameObjectPool( bg1, poolSize, true );
	bg1Pool.PrePopulate(poolSize);
	bg2Pool = GameObjectPool( bg2, poolSize, true );
	bg2Pool.PrePopulate(poolSize);
	bg3Pool = GameObjectPool( bg3, poolSize, true );
	bg3Pool.PrePopulate(poolSize);
	plainBgPool = GameObjectPool( plainbg, poolSize, true );
	plainBgPool.PrePopulate(poolSize);
	
	Pools = [plainBgPool, bg1Pool, bg2Pool, bg3Pool];
	bgs = [startbg];
}

function Update () {

	RemoveDestroyedBackgrounds();

	if(bgs.length < 2) {
		CreateBackground();
	}
	
}

function RemoveDestroyedBackgrounds () {
	for(var i = 0; i < bgs.length; i++) {
		var bg : GameObject = bgs[i];
		if(bg == null || !bg.active) {
			bgs.RemoveAt(i);
		}
	}
}

function CreateBackground() {
	var chosen : GameObjectPool  = ChooseBackgroundPool();
	var bg : GameObject = chosen.Spawn( Vector3(20, 0, 0), Quaternion.identity ); 
	bgs.Push(bg);
	
	Invoke("ConnectBackgrounds", 0.1);
}

function ConnectBackgrounds () {
	var left : GameObject = bgs[bgs.length-2];
	var right : GameObject = bgs[bgs.length-1];
	
	right.transform.position.x = left.transform.position.x + left.transform.localScale.x;
}

function ChooseBackgroundPool() {
	var roll : float = Random.value * 10;
	
	if( roll <= 6 ) {
		return Pools[0];
	}
	
	return Pools[Mathf.Floor(Random.value*Pools.length)];
}