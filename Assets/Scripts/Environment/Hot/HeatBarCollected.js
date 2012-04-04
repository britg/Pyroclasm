#pragma strict

private var HeatBar : GameObject;

private var shouldMove : boolean = false;
private var thisTransform : Transform;
private var target : Vector3;

function Start () {
	thisTransform = transform;
	HeatBar = GameObject.Find("Fill");
	target = HeatBar.transform.position + Vector3(2, -1, 0);
}

function Update () {

	if(shouldMove) {
		transform.position = Vector3.Lerp(thisTransform.position, target, 0.3);
		
		var yDelta : float = Mathf.Abs(target.y - transform.position.y);
		if(yDelta < 0.1) {
			shouldMove = false;
			gameObject.SetActiveRecursively(false);
		}
	}

}

function TravelToHeatBar () {
	//Debug.Log("Travelling to heat bar!");
	shouldMove = true;
}