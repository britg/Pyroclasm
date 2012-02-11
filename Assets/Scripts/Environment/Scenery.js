
var startbg : Transform;
var bg1 : Transform;
var bg2 : Transform;
var bg3 : Transform;
var plainbg : Transform;

private var bgPool : Array;
private var bgs : Array;

function Start () {
	bgPool = [bg1, bg2, bg3];
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
		var bg : Transform = bgs[i];
		if(bg == null) {
			bgs.RemoveAt(i);
		}
	}
}

function CreateBackground() {
	var chosen : Transform = ChooseBackground();
	var bg : Transform = Instantiate( chosen , Vector3(20, 0, 0), Quaternion.identity ); 
	var motor : Motor = bg.GetComponent("Motor");
	motor.Level = gameObject;
	bgs.Push(bg);
	
	Invoke("ConnectBackgrounds", 0.1);
}

function GetNextStartPosition() {

}

function ConnectBackgrounds () {
	var left : Transform = bgs[bgs.length-2];
	var right : Transform = bgs[bgs.length-1];
	
	right.position.x = left.position.x + left.localScale.x;
}

function ChooseBackground() {
	var roll : float = Random.value * 10;
	
	if( roll <= 6 ) {
		return plainbg;
	}
	
	return bgPool[Mathf.Floor(Random.value*bgPool.length)];
}