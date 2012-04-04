
var minY : float = 2.0;
var maxY : float = 5.5;

function Start () {
	SetHeight();
}

function OnEnable() {
	SetHeight();
}

function SetHeight () {
	transform.position.y = Random.value * (maxY - minY) + minY;
}

function OnBecameVisible () {
	gameObject.audio.Play();
}