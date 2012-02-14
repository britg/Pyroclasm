
var heatGem : Transform;

private var gem : Transform;

private var numGems : int 		= 10;
private var xSpacing : float 	= 0.75;

function Awake() {

	for(var i = 0; i < numGems; i++) {
		gem = Instantiate( heatGem , transform.position, Quaternion.identity );
		gem.parent = transform;
		gem.position = transform.position;
		gem.position.x += (i * xSpacing);
	}

}

function Update () {

}