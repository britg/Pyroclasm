
var heatGem : Transform;

private var gem : Transform;

private var numGems : int 		= 20;
private var xSpacing : float 	= 0.75;

private var endX : float;

function Awake() {

	numGems = Random.Range(10, 20);
	var intensity : float = Random.Range(1.25, 1.75);
	intensity = 2;

	for(var i = 0; i < numGems; i++) {
		gem = Instantiate( heatGem , transform.position, Quaternion.identity );
		gem.parent = transform;
		gem.position = transform.position;
		gem.position.x += (i * xSpacing);
		var yPos = Mathf.Log10(i+1) * intensity;
		gem.position.y += yPos;
		
		endX = gem.localPosition.x;
	}
	
}

function OnEnable () {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.HEAT_PATTERN_END, endX);
}

function Update () {

}

