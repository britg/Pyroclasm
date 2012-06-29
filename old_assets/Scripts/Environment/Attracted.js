
private var positionSet : boolean = false;
private var originalPos : Vector3;
private var fireball : GameObject;
private var thisTransform : Transform;

function Start() {
	fireball = GameObject.Find("Fireball");
	thisTransform = transform;
}

function Update () {
}

function OnDisable() {
	if(!positionSet) {
		//originalPos = Vector3(transform.localPosition.x, transform.localPosition.y, transform.localPosition.z);
		positionSet = true;
	}
}

function OnEnable() {
	//transform.localPosition = originalPos;
}

function OnTriggerStay(collider : Collider) {
	//Debug.Log("On Trigger Stay");

	var obj = collider.gameObject;
	var collector = obj.GetComponent("Collector");
	
	if(collector) {
		transform.position = Vector3.Lerp(thisTransform.position, fireball.transform.position, 0.3);
		var yDelta : float = Mathf.Abs(fireball.transform.position.y - transform.position.y);
		if(yDelta < 0.2) {
			//Debug.Log("Setting");
			transform.position = fireball.transform.position;
		}
	}
	
}