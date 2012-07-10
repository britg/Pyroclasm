#pragma strict

private var currentRoom : GameObject;
private var currentRoomLength : float;
private var patterns : Object[];

private var lastRoomX : float = 0.0;

private var z : float = -2.5;

var minY : float;
var maxY : float;
var patternPadding : float;

function Start () {
	Notification.Observe(this, Notification.NEW_ROOM);
	
	patterns = Resources.LoadAll("GemPatterns", GameObject);
}

function Update () {

}

function OnNewRoom (n : Notification) {
	currentRoom = n.data;
	var floor : GameObject = currentRoom.Find("Floor");
	currentRoomLength = floor.transform.localScale.x;
	
	FillRoom();
}

function FillRoom () {
	//Debug.Log("Current room's length is " + currentRoomLength);
	
	var i : int = 0;
	while ((i < 10) && (lastRoomX < currentRoomLength)) {
		AddPattern();
		i++;
	}
	
	lastRoomX = 0.0;
}

function PickPattern () {
	return patterns[Random.Range(0, patterns.length)];
}

function PatternY () {
	return Random.Range(minY, maxY);
}

function AddPattern () {
	var patternPrefab : GameObject 	= PickPattern();
	var pattern : GameObject 		= Instantiate(patternPrefab);
	var y : float 					= PatternY();
	
	pattern.transform.parent = currentRoom.transform;
	pattern.transform.localPosition = Vector3(lastRoomX, y, z);
	
	lastRoomX = GetLastX(pattern) + patternPadding;
	
	//Debug.Log("Added pattern, last room X was " + lastRoomX);
}

function GetLastX (pattern : GameObject) {
	var last : Transform;
	for (var child : Transform in pattern.transform) {
		last = child;
	}
	
	return (last.localPosition.x + pattern.transform.localPosition.x);
}