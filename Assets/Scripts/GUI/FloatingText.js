
var floatHeight : float = 0.2;
var floatTime : float = 0.3;
var floatFrom : Transform;

private var currentY : float;
private var targetY : float;
private var floatVelocity : float;

private var thisTransform : Transform;

function Start () {
	thisTransform = transform;
	currentY = thisTransform.position.y;
	targetY = currentY + floatHeight;
}

function Update () {
	transform.position.y = currentY = Mathf.SmoothDamp(currentY, targetY, floatVelocity, floatTime);
	
	if(Mathf.Abs(targetY - currentY) < 0.01) {
		Destroy(gameObject);
	}
}