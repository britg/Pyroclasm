var Level : GameObject;
var factor : float = 1.0;

private var scrolling : Scroller;
private var minX : float = -30.0;
private var thisTransform : Transform;

function Start () {
	scrolling = Level.GetComponent("Scroller");
	thisTransform = transform;
}

function Update () {
	if(scrolling == null) {
		return;
	}
	
	var delta = scrolling.velocity * Time.deltaTime * factor;
	thisTransform.position.x = Mathf.Lerp(thisTransform.position.x, thisTransform.position.x - delta, 1);
	//thisTransform.position.x -= delta;
	
	if(transform.position.x < minX) {
		Destroy(gameObject);
	}
}