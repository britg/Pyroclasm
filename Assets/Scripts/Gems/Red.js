#pragma strict
private var Fireball : GameObject;

var tempChange : int = 10;

function Start () {
	Fireball = GameObject.Find("Fireball");
}

function Update () {

}

function OnTriggerEnter (collider : Collider) {
	
	if (collider.gameObject != Fireball)
		return;
		
	Notification.Post(this, Notification.TEMP_COLLISION, tempChange);
	
	Destroy(gameObject.GetComponent("tk2dSprite"));
	Destroy(gameObject.renderer);
	
}