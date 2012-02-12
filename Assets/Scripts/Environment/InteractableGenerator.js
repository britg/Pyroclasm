
var Level : GameObject;

var maxGenerationInterval : float = 7.0;
var minGenerationInterval : float = 2.0;

var gargoyle : Transform;
var bookshelf : Transform;
var torch : Transform;
var tapestry : Transform;

var fireball : GameObject;

private var timeleft : float;

private var xStart = 10;

private var Distance;
private var scrolling;

private var objects : Array;

function Start () {
	Distance = fireball.GetComponent("Distance");
	ResetTimer();
	scrolling = Level.GetComponent("Scroller");
	objects = [gargoyle, bookshelf, torch, tapestry];
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
	var ind = Mathf.Floor(Random.value * objects.length);
	var object : Transform = objects[ind];
	
	var h : Transform = Instantiate( object, Vector3(xStart, object.position.y, -1), Quaternion.identity );
}