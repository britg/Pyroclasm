
var heatGem : Transform;

private var gem : Transform;

private var numGems : int 		= 10;
private var xSpacing : float 	= 0.75;

private var endX : float;

function Awake() {

	for(var i = 0; i < numGems; i++) {
		gem = Instantiate( heatGem , transform.position, Quaternion.identity );
		gem.parent = transform;
		gem.position = transform.position;
		gem.position.x += (i * xSpacing);
		
		endX = gem.localPosition.x;
	}

}

function OnEnable () {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.HEAT_PATTERN_END, endX);
}

function Update () {

}