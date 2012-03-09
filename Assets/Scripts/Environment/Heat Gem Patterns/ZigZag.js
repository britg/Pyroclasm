
var heatGem : Transform;

private var gem : Transform;

private var numGems : int 		= 20;
private var xSpacing : float 	= 0.75;
private var currY : float = 0.0;

function Awake() {
	currY = 0;

	for(var i : float = 0; i < numGems; i++) {
		gem = Instantiate( heatGem , transform.position, Quaternion.identity );
		gem.parent = transform;
		gem.position = transform.position;
		gem.position.x += (i * xSpacing);
		var rad : float = i/3.0;
		gem.position.y += Mathf.Sin(rad);
	}

}

function Update () {

}
