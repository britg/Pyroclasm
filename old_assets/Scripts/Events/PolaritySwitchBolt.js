#pragma strict

private var fireball : GameObject;
private var toY : float;

function Start () {
}

function OnEnable() {
}

function Update () {
	Aim();
}

function Aim() {
	fireball = GameObject.Find("Fireball");
	toY = fireball.transform.position.y;
	transform.position.y = Mathf.Lerp(transform.position.y, toY, 1);
}

function OnTriggerEnter(collider : Collider) {
	var obj : GameObject = collider.gameObject;
	var test : Temperature = obj.GetComponent("Temperature");
	
	if(test) {
		NotificationCenter.DefaultCenter().PostNotification(this, Notifications.POLERIZE);
	}
}