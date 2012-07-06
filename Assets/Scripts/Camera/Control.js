#pragma strict

private var shouldControl : boolean = true;

private var Fireball : GameObject;
private var inputCurrentPosition : Vector3;
private var inputCurrentScreenPosition : Vector3;
private var cameraCurrentPosition : Vector3;

private var fireballPixelToWorld : float;
private var cameraPixelToWorld : float;

var fireballMultiplier : float;
var cameraMultiplierRatio : float;
private var cameraMultiplier : float;
var cameraMoveRatio : float;


var minCameraY : float;
var maxCameraY : float;

var minFireballY : float;
var maxFireballY : float;

var minX : float;
var maxX : float;

private var targetTransform : Transform;



function Start () {
	Fireball = GameObject.Find("Fireball");
	DeterminePixelToWorld();
	targetTransform = transform;
}

function DeterminePixelToWorld () {
	cameraMultiplier = cameraMultiplierRatio * fireballMultiplier;
	fireballPixelToWorld = GetRatioFromZ(Fireball.transform.position.z) * fireballMultiplier;
	cameraPixelToWorld = GetRatioFromZ(transform.position.z) * cameraMultiplier;
	
	Debug.Log("Fireball pixel to world: " + fireballPixelToWorld);
	Debug.Log("Camera pixel to world: " + cameraPixelToWorld);
}

function GetRatioFromZ ( z : float ) {
	var left : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(0, 0, z));
	var right : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(Screen.width, 0, z));
	var ratio : float = (left.x - right.x) / Screen.width;
	
	return ratio;
}

function Update () {
	if (shouldControl) {
		RespondToTouch();
		RespondToMouse();
	}
}

function RespondToTouch () {

	if (Input.touchCount > 0) {
		var touch : Touch = Input.GetTouch(0);
	
		if (touch.phase == TouchPhase.Began) {
			SetCurrentPosition(touch.position);
		}
		
		if (touch.phase == TouchPhase.Moved) {
			MoveWithDelta(touch.deltaPosition);
		}
	}
}

function RespondToMouse () {
	var delta : Vector3;

	if (Input.GetMouseButtonDown(0)) {
		inputCurrentScreenPosition = Input.mousePosition;
		SetCurrentPosition(Input.mousePosition);
	}
	
	if (Input.GetMouseButton(0)) {
		delta = Input.mousePosition - inputCurrentScreenPosition;
		MoveWithDelta(delta);
		inputCurrentScreenPosition = Input.mousePosition;
	}
}

function SetCurrentPosition (position : Vector3) {
	inputCurrentPosition = Camera.main.ScreenToWorldPoint(position);
	cameraCurrentPosition = Camera.main.transform.position;
	Debug.Log("Touch current position is " + inputCurrentPosition + " " + cameraCurrentPosition);
}

function MoveWithDelta (delta : Vector3) {

	var fireballDelta : Vector3 = delta * fireballPixelToWorld;
	var cameraDelta : Vector3 = delta * cameraPixelToWorld;
	
	var targetFireballPosition : Vector3 = Fireball.transform.localPosition + fireballDelta;
	
	targetFireballPosition.x = Mathf.Clamp(targetFireballPosition.x, minX, maxX);
	Fireball.transform.localPosition.x = targetFireballPosition.x;
	
	var targetCameraY : float = targetTransform.position.y + (cameraDelta.y * cameraMoveRatio);
	transform.position.y = Mathf.Clamp(targetCameraY, minCameraY, maxCameraY);
	
	var targetFireballY : float = Fireball.transform.localPosition.y + (fireballDelta.y * (1-cameraMoveRatio));
	Fireball.transform.localPosition.y = Mathf.Clamp(targetFireballY, minFireballY, maxFireballY);
	
	if ((targetCameraY > maxCameraY) || (targetCameraY < minCameraY)) {
		targetTransform = Fireball.transform;
		targetFireballY = Fireball.transform.localPosition.y + (fireballDelta.y * cameraMoveRatio);
		Fireball.transform.localPosition.y = Mathf.Clamp(targetFireballY, minFireballY, maxFireballY);
	} else {
		targetTransform = transform;
	}
	
}