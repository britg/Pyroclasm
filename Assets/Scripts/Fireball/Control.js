#pragma strict

private var Fireball : GameObject;
private var shouldRespondToTouch : boolean = true;
private var touchCurrentPosition : Vector3;

function Start () {
	Fireball = GameObject.Find("Fireball");
}

function Update () {
	Debug.Log("0,0 " + Camera.main.ScreenToWorldPoint(Vector3(0, 0, 0)));
	Debug.Log("100,100 " + Camera.main.ScreenToWorldPoint(Vector3(100, 100, 0)));
	
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
	Debug.Log("Touch current position is " + touchCurrentPosition);
}

function MoveWithTouch (touch : Touch) {
	var worldPos = Camera.main.ScreenToWorldPoint(touch.position);
	
}