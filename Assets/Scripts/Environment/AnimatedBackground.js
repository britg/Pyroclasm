
var Level : GameObject;
var factor : float = 0.1;

private var offset : Vector2;
private var scrolling : Scroller;


function Start () {
	offset = renderer.material.GetTextureOffset("_MainTex");
	scrolling = Level.GetComponent("Scroller");
}

function Update () {
	offset.x += scrolling.velocity * Time.deltaTime * factor;
	renderer.material.SetTextureOffset ("_MainTex", offset);
	
}