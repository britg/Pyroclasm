
var factor : float = 0.1;

private var offset : Vector2;
private var Level : GameObject;
private var scrolling : Scroller;

private var thisRenderer : Renderer;
private var thisMaterial : Material;


function Start () {
	Level = GameObject.Find("Level");
	
	thisRenderer = renderer;
	thisMaterial = thisRenderer.material;
	offset = renderer.material.GetTextureOffset("_MainTex");
	scrolling = Level.GetComponent("Scroller");
}

function Update () {
	offset.x += scrolling.velocity * Time.deltaTime * factor;
	thisMaterial.SetTextureOffset ("_MainTex", offset);
}