
var tempDiff : int;
var disableOnCollision : boolean = false;
var shakesCamera : boolean = false;
var used : boolean = true;
var isHeatGem : boolean = false;

function OnEnable() {
	used = false;
	
	if(isHeatGem) {
		renderer.material.SetTextureOffset ("_MainTex", Vector2(0, 0));
	}
}
