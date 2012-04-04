#pragma strict

private var HeatBar : GameObject;

private var shouldMove : boolean = false;
private var thisTransform : Transform;

function Start () {
	thisTransform = transform;
	HeatBar = GameObject.Find("Fill");
}

function Update () {

	if(shouldMove) {
		transform.position = Vector3.Lerp(thisTransform.position, HeatBar.transform.position, 0.3);
		
		var yDelta : float = Mathf.Abs(HeatBar.transform.position.y - transform.position.y);
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