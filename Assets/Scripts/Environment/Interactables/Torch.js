
var minY : float = 5.0;
var maxY : float = 7.5;

function Start () {
	transform.position.y = Random.value * (maxY - minY) + minY;
}