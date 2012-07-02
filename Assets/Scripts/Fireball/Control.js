#pragma strict

private var Fireball : GameObject;
private var shouldRespondToTouch : boolean = true;
private var touchCurrentPosition : Vector3;
private var cameraCurrentPosition : Vector3;

// Magic number!
// Derived by calculating hte different between 
// 0 and 960 pixels converted to world coordinates
// 960 : 4.4 = .004583333
// multiplied by 4 just 'cuz
private var pixelToWorld : float;
var multiplier : float = 4.0;

function Start () {
	Fireball = GameObject.Find("Fireball");
	
	DeterminePixelToWorld();
}

function DeterminePixelToWorld () {
	var left : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(0, 0, Fireball.transform.position.z));
	var right : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(Screen.width, 0, Fireball.transform.position.z));
	
	var ratio : float = (left.x - right.x) / Screen.width;
	pixelToWorld = ratio * multiplier;
}

function Update () {

	if (shouldRespondToTouch && Input.touchCount > 0) {
		var touch : Touch = Input.GetTouch(0);
	
		if (touch.phase == TouchPhase.Began) {
			SetTouchCurrentPosition(touch);
		}
		
		if (touch.phase == TouchPhase.Moved) {
			MoveWithTouch(touch);
		}
	}

}

function SetTouchCurrentPosition (touch : Touch) {
	touchCurrentPosition = Camera.main.ScreenToWorldPoint(touch.position);
	cameraCurrentPosition = Camera.main.transform.position;
	Debug.Log("Touch current position is " + touchCurrentPosition + " " + cameraCurrentPosition);
}

function MoveWithTouch (touch : Touch) {
	Fireball.transform.localPosition += touch.deltaPosition * pixelToWorld;
}