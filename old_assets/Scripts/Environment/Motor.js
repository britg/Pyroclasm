var factor : float = 1.0;
var fixedSpeed : float = 0.0;
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
	
	Move();
	
	if(removeOffScreen && (transform.position.x < minX)) {
	
		if(pool) {
			//Debug.Log("Unspawning a " + gameObject + " from " + pool);
			pool.Unspawn(gameObject);
		} else {
			Destroy(gameObject);
		}
	}
}

function FixedUpdate() {
	//Move();
}

function Move() {

	if(scrolling == null) {
		return;
	}
	
	var delta : float;
	
	if(fixedSpeed > 0 && scrolling.velocity > 0) {
		delta = Time.deltaTime * fixedSpeed;
	} else {
	 	delta = scrolling.velocity * Time.deltaTime * factor;
	}
	
	thisTransform.position.x -= delta;

}

function SetPool(_pool : GameObjectPool) {
	pool = _pool;
}