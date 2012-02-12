
var minY : float = 2.0;
var maxY : float = 5.5;

function Start () {
	transform.position.y = Random.value * (maxY - minY) + minY;
}