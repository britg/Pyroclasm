
var floatHeight : float = 0.2;
var floatTime : float = 0.3;
var floatFrom : Transform;

var lastUpdateTime : float = 0.0;
var floatTextTimeout : float = 1.0;

private var currentY : float;
private var targetY : float;
private var floatVelocity : float;

private var maxY : float = 8.0;

private var thisTransform : Transform;

function Start () {
	thisTransform = transform;
	currentY = thisTransform.position.y;
	targetY = Mathf.Clamp(currentY + floatHeight, 0, maxY);
}

function Update () {
	transform.position.y = currentY = Mathf.SmoothDamp(currentY, targetY, floatVelocity, floatTime);
	
	var reached : boolean = Mathf.Abs(targetY - currentY) < 0.01;
	var timeout : boolean = (Time.time - lastUpdateTime) > floatTextTimeout;
	
	if (reached && timeout) {
		Destroy(gameObject);
	}
}