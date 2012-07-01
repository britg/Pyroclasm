#pragma strict

private var room : GameObject;

function Start () {
	room = transform.parent.gameObject;
}

function Update () {

}

function OnBecameVisible () {
	//Debug.Log("Became visible!");
	Notification.Post(this, Notification.ROOM_ONSCREEN, room);
}

function OnBecameInvisible () {
	Notification.Post(this, Notification.ROOM_OFFSCREEN, room);
}