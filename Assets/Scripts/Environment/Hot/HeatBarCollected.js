#pragma strict

private var HeatBar : GameObject;

private var shouldTrigger : boolean = false;
private var thisTransform : Transform;
private var target : Vector3;

function Start () {
	thisTransform = transform;
	HeatBar = GameObject.Find("Fill");
	target = HeatBar.transform.position + Vector3(2, -1, 0);
}

function Update () {

	if(shouldTrigger) {
		TravelToHeatBar();
	}

}

function Trigger() {
	//shouldTrigger = true;
	
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.HEAT_COLLECTED);
}

function TravelToHeatBar () {
	//Debug.Log("Travelling to heat bar!");
	transform.position = Vector3.Lerp(thisTransform.position, target, 0.3);
		
	var yDelta : float = Mathf.Abs(target.y - transform.position.y);
	if(yDelta < 0.1) {
		shouldTrigger = false;
		gameObject.SetActiveRecursively(false);
	}
}