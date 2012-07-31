
var heatGem : Transform;

private var gem : Transform;

private var numGems : int 		= 20;
private var xSpacing : float 	= 0.75;
private var currY : float = 0.0;

private var endX : float;

function Awake() {
	currY = 0;

	var intensity : float = Random.Range(1.1, 1.4);
	for(var i : float = 0; i < numGems; i++) {
		gem = Instantiate( heatGem , transform.position, Quaternion.identity );
		gem.parent = transform;
		gem.position = transform.position;
		gem.position.x += (i * xSpacing);
		var rad : float = i/intensity;
		gem.position.y += Mathf.Sin(rad);
		
		endX = gem.localPosition.x;
	}
	
}

function OnEnable () {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.HEAT_PATTERN_END, endX);
}

function Update () {

}
