#pragma strict

var preloadDistance : float;

private var Fireball : GameObject;
private var currentRoom : GameObject;
private var triggerRoom : GameObject;
private var roomPool : Object[];

function Start () {
	Fireball 	= GameObject.Find("Fireball");
	currentRoom = GameObject.Find("Room");
	roomPool 	= Resources.LoadAll("Rooms", GameObject);
	
	Notification.Observe(this, Notification.ROOM_ONSCREEN);
	Notification.Observe(this, Notification.ROOM_OFFSCREEN);
	Notification.Observe(this, Notification.DISTANCE_UPDATE);
}

function Update () {

}

function OnDistanceUpdate (n : Notification) {
		
	if(!triggerRoom) {
		InstantiateNewRoom();
		return;
	}
	
	if(triggerRoom == currentRoom)
		return;
		
	if(currentRoom.transform.position.x < Fireball.transform.position.x) {
		InstantiateNewRoom();
	}
		
}

function InstantiateNewRoom () {
	var room : GameObject = roomPool[Random.Range(0, roomPool.length)];
	var start : Vector3 = currentRoom.transform.position;
	var wall : GameObject = currentRoom.Find("BackWall");
	start.x += wall.renderer.bounds.size.x;
	Instantiate(room, start, Quaternion.identity);
	triggerRoom = currentRoom;
}

function OnRoomOnScreen (n : Notification) {
	//Debug.Log("Updating current room");
	currentRoom = n.data;
}

function OnRoomOffScreen (n : Notification) {
	var room : GameObject = n.data;
	
	if(room.transform.position.x < Fireball.transform.position.x) {
		GameObject.Destroy(room);
	}
}