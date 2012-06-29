
var heatGem : Transform;

private var gem : Transform;

private var xSpacing : float 	= 0.75;
private var ySpacing : float 	= 0.75;

var rows : int 			= 3;
var cols : int 			= 5;

private var endX : float;

function DrawGems() {

	for(var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			gem = Instantiate( heatGem , transform.position, Quaternion.identity );
			gem.parent = transform;
			gem.position = transform.position;
			gem.position.x += (i * xSpacing);
			gem.position.y += (j * ySpacing);
		}
	}

}

function Update () {

}
