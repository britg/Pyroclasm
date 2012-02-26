
var tempChangeText : GUIText;
var wallTempChange : int = 2;

private var fireball : GameObject;
private var fireballTemperature;


function Start() {

	fireball = GameObject.Find("Fireball");
	fireballTemperature = fireball.GetComponent("Temperature");

}

function React() {
	gameObject.SetActiveRecursively(false);
}

function OnTriggerEnter (collider : Collider) {

	var obj = collider.gameObject;
	var isCollector = obj.GetComponent("Collector");
	
	if((isCollector && isCollector.wallActive)) {
		React();
		
		fireballTemperature.TempChange(wallTempChange, true);
		
	}
}

