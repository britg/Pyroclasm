
var minY : float = 3.5;
var maxY : float = 3.5;

function Start () {
	SetHeight();
}

function OnEnable() {
	SetHeight();
}

function SetHeight () {
	transform.position.y = Random.value * (maxY - minY) + minY;
}

function OnTriggerEnter ( collider : Collider ) {
	var obj : GameObject = collider.gameObject;
	var test : Temperature = obj.GetComponent("Temperature");
	
	if(test) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.GARGOYLE_ACTIVATED);
	}
}