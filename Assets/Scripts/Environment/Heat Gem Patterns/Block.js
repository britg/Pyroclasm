
var heatGem : Transform;

private var gem : Transform;

private var xSpacing : float 	= 0.6;
private var ySpacing : float 	= 0.6;

private var rows : int 			= 2;
private var cols : int 			= 2;

function Start() {

	rows += Mathf.Round(Random.value * 10);
	cols += Mathf.Round(Random.value * 3);
	

	for(var i = 0; i < rows; i++) {
		for(var j = 0; j < cols; j++) {
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