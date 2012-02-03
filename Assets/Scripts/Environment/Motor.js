var Level : GameObject;
var factor : float = 1.0;

private var scrolling : Scroller;
private var minX : float = -10.0;

function Start () {
	scrolling = Level.GetComponent("Scroller");
}

function Update () {
	if(scrolling == null) {
		return;
	}
	
	var delta = scrolling.velocity * Time.deltaTime * factor;
	transform.position.x -= delta;
	
	if(transform.position.x < minX) {
		Destroy(gameObject);
	}
}