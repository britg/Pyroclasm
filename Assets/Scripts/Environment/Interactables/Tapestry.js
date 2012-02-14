
var minY : float = 5.5;
var maxY : float = 7.5;

function Start () {
	SetHeight();
}

function OnEnable() {
	SetHeight();
}

function SetHeight () {
	transform.position.y = Random.value * (maxY - minY) + minY;
}