
var floatHeight : float = 0.1;
var floatTime : float = 0.3;

private var currentY : float;
private var targetY : float;
private var floatVelocity : float;

function Start () {
	currentY = transform.position.y;
	targetY = currentY + floatHeight;
}

function Update () {
	transform.position.y = currentY = Mathf.SmoothDamp(currentY, targetY, floatVelocity, floatTime);
	
	if(Mathf.Abs(targetY - currentY) < 0.01) {
		Destroy(gameObject);
	}
}