
var heatGem : Transform;

private var gem : Transform;

private var xSpacing : float 	= 0.6;
private var ySpacing : float 	= 0.6;

private var rows : int 			= 1;
private var cols : int 			= 5;

function Awake() {

	rows += Mathf.Round(Random.value * 1);
	cols += Mathf.Round(Random.value * 5);
	

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
