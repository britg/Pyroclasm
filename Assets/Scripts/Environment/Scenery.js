
var startbg1 : GameObject;

var bg1 : GameObject;
private var bg1Pool : GameObjectPool;
var bg2 : GameObject;
private var bg2Pool : GameObjectPool;
var bg3 : GameObject;
private var bg3Pool : GameObjectPool;
var bg4 : GameObject;
private var bg4Pool : GameObjectPool;

var plainbg : GameObject;
private var plainBgPool : GameObjectPool;

var startTrees : GameObject;
var trees : GameObject;
private var treePool : GameObjectPool;

private var poolSize : int = 1;

private var Pools : Array;
private var bgs : Array;
private var activeTrees : Array;
private var treeStart : Vector3 = Vector3(12.2, 2, 5);

function Awake() {
	Application.targetFrameRate = 30.0;
	//Application.targetFrameRate = 60.0;
}

function Start () {
	bg1Pool = GameObjectPool( bg1, poolSize, true );
	bg1Pool.PrePopulate(poolSize);
	bg2Pool = GameObjectPool( bg2, poolSize, true );
	bg2Pool.PrePopulate(poolSize);
	bg3Pool = GameObjectPool( bg3, poolSize, true );
	bg3Pool.PrePopulate(poolSize);
	bg4Pool = GameObjectPool( bg4, poolSize, true );
	bg4Pool.PrePopulate(poolSize);
	plainBgPool = GameObjectPool( plainbg, poolSize, true );
	plainBgPool.PrePopulate(poolSize);
	
	treePool = GameObjectPool( trees, 3, true );
	treePool.PrePopulate(3);
	
	Pools = [plainBgPool, bg1Pool, bg2Pool, bg3Pool, bg4Pool];
	bgs = [startbg1];
	
	activeTrees = [startTrees];
	CreateBackground();
	ConnectBackgrounds();
}

function Update () {

	RemoveDestroyedScenery();

	if(bgs.length < 3) {
		CreateBackground();
	}
	
	if(activeTrees.length < 3) {
		CreateTrees();
	}
	
}

function RemoveDestroyedScenery () {
	for(var i = 0; i < bgs.length; i++) {
		var bg : GameObject = bgs[i];
		if(bg == null || !bg.active) {
			bgs.RemoveAt(i);
		}
	}
	
	for(var j = 0; j < activeTrees.length; j++) {
		var tree : GameObject = activeTrees[j];
		if(tree == null || !tree.active) {
			activeTrees.RemoveAt(j);
		}
	}
}

function CreateBackground() {
	var pool : GameObjectPool  = ChooseBackgroundPool();
	var screen : GameObject = pool.Spawn( Vector3(20, 0, 0), Quaternion.identity ); 
	bgs.Push(screen);
	
	yield WaitForSeconds(0.1);
	ConnectBackgrounds();
	FillScreen(screen);
}

function ConnectBackgrounds () {
	var left : GameObject;
	
	if(bgs.length < 2) {
		left = bgs[0];
	} else {
	  	left = bgs[bgs.length-2];
	}
	
	var right : GameObject = bgs[bgs.length-1];
	
	right.transform.position.x = left.transform.position.x + left.transform.localScale.x;
}

function FillScreen(screen : GameObject) {
	screen.SendMessage("OnScreenActivate", UnityEngine.SendMessageOptions.DontRequireReceiver);
}

function ChooseBackgroundPool() {
	var roll : float = Random.value * 10;
	
	if( roll <= 4 ) {
		return Pools[0];
	}
	
	return Pools[Mathf.Floor(Random.value*Pools.length)];
}


function CreateTrees() {
	var tree : GameObject = treePool.Spawn( treeStart, Quaternion.identity ); 
	activeTrees.Push(tree);
	
	yield WaitForSeconds(0.1);
	ConnectTrees();
}

function ConnectTrees () {
	var l : int = Mathf.Clamp(activeTrees.length-2, 0, 1000);
	var left : GameObject = activeTrees[l];
	var right : GameObject = activeTrees[activeTrees.length-1];
	
	right.transform.position.x = left.transform.position.x + left.transform.localScale.x;
}
