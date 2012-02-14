
var tempChangeText : GUIText;
var bombTempChange : int = 2;

function DisplayBombPoints() {
	var start : Vector2 = Camera.main.WorldToViewportPoint(transform.position);
	var bombText : GUIText = Instantiate( tempChangeText, start, Quaternion.identity );
	bombText.text = "+" + bombTempChange + "°";
	var floater : FloatingText = bombText.GetComponent("FloatingText");
	floater.floatFrom = transform;
}

function React() {
	DisplayBombPoints();
	gameObject.SetActiveRecursively(false);
}

