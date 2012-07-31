
var startbg1 : GameObject;

var bg1 : GameObject;
private var bg1Pool : GameObjectPool;
var bg2 : GameObject;
private var bg2Pool : GameObjectPool;
var bg3 : GameObject;
private var bg3Pool : GameObjectPool;
var bg4 : GameObject;
private var bg4Pool : GameObjectPool;
var bg5 : GameObject;
private var bg5Pool : GameObjectPool;

var ghostPercent : int = 5;

var plainbg : GameObject;
private var plainBgPool : GameObjectPool;

var startTrees : GameObject;
var trees : GameObject;
private var treePool : GameObjectPool;

private var poolSize : int = 3;

private var activePool : GameObjectPool;
private var currPoolCount : int = 0;
var poolRepeat : int = 10;

private var Pools : Array;
private var bgs : Array;
private var activeTrees : Array;
private var treeStart : Vector3 = Vector3(12.2, 2, 5);

private var eventActive : boolean = false;

var blueHue : GameObject;
var blueHueAlpha : float = 39.0;
private var shouldFadeBlueHue : boolean = false;
private var currBlueHueFadeTime : float = 0.0;

private var bossFight : boolean = false;

function Awake() {
	//Application.targetFrameRate = 30.0;
	#if UNITY_IPHONE
		Application.targetFrameRate = 60.0;
	#endif
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
	bg5Pool = GameObjectPool( bg5, poolSize, true );
	bg5Pool.PrePopulate(poolSize);
	plainBgPool = GameObjectPool( plainbg, poolSize, true );
	plainBgPool.PrePopulate(poolSize);
	
	treePool = GameObjectPool( trees, 3, true );
	treePool.PrePopulate(3);
	
	Pools = [plainBgPool, bg1Pool, bg2Pool, bg3Pool, bg4Pool, bg5Pool];
	bgs = [startbg1];
	
	activeTrees = [startTrees];
	CreateBackground();
	ConnectBackgrounds();
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_STARTED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.EVENT_ENDED);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.POLERIZE);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.UNPOLERIZE);
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TRIGGER_WRAITH);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.WRAITH_END);
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
	//var screen : GameObject = GameObject.Instantiate(plainbg, Vector3(20, 0, 0), Quaternion.identity);
	bgs.Push(screen);
	currPoolCount++;
	
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

	//return bg5Pool;
	if (bossFight) {
		return bg3Pool;
	}
	
	if(activePool && currPoolCount <= poolRepeat) {
		return activePool;
	}
	
	var roll : float = Random.value * 100;
	
	if( roll <= 75 ) {
		return Pools[0];
	}
	
	activePool = Pools[Mathf.Floor(Random.value*Pools.length)];
	currPoolCount = 0;
	return activePool;
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


function OnEventStarted() {
	eventActive = true;
}

function OnEventEnded() {
	eventActive = false;
}

function OnPolerize() {
	//blueHue.SetActiveRecursively(true);
}

function OnUnpolerize() {
	//blueHue.SetActiveRecursively(false);
	
}

function FadeBlueHueOut() {
	var color : Color = blueHue.renderer.material.color;
	color.a -= 0.1f;
	renderer.material.color = color;
}

function OnTriggerWraith () {
	bossFight = true;
}

function OnWraithEnd () {
	bossFight = false;
}