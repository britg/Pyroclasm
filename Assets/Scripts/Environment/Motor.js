var Level : GameObject;
var factor : float = 1.0;

private var Generator : Generator;
private var minX : float = -10.0;

function Start () {
	Generator = Level.GetComponent("Generator");
}

function Update () {
	if(Generator == null) {
		return;
	}
	
	var delta = Generator.velocity * Time.deltaTime * factor;
	transform.position.x -= delta;
	
	if(transform.position.x < minX) {
		Destroy(gameObject);
	}
}