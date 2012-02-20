var factor : float = 1.0;
var removeOffScreen : boolean = true;

private var scrolling : Scroller;
private var minX : float = -30.0;
private var thisTransform : Transform;
private var Level : GameObject;
private var pool : GameObjectPool;

function Start () {
	Level = GameObject.Find("Level");
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
	
	if(removeOffScreen && (transform.position.x < minX)) {
	
		if(pool) {
			//Debug.Log("Unspawning a " + gameObject + " from " + pool);
			pool.Unspawn(gameObject);
		} else {
			Destroy(gameObject);
		}
	}
}

function SetPool(_pool : GameObjectPool) {
	pool = _pool;
}