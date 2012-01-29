
var speed : float = 0.01;

private var offset : Vector2;


function Start () {
	offset = renderer.material.GetTextureOffset("_MainTex");
}

function Update () {
	offset.x += speed;
	renderer.material.SetTextureOffset ("_MainTex", offset);
}