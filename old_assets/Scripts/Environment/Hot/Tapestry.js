
var minY : float = 2.0;
var maxY : float = 4.0;

function Start () {
	SetHeight();
}

function OnEnable() {
	SetHeight();
}

function SetHeight () {
	transform.position.y = Random.value * (maxY - minY) + minY;
}