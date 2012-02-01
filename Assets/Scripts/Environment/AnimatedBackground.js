
var Level : GameObject;
var factor : float = 0.1;

private var offset : Vector2;
private var Generator : Generator;


function Start () {
	offset = renderer.material.GetTextureOffset("_MainTex");
	Generator = Level.GetComponent("Generator");
}

function Update () {
	offset.x += Generator.velocity * Time.deltaTime * factor;
	renderer.material.SetTextureOffset ("_MainTex", offset);
	
}