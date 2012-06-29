
private var originalX : float;

function OnEnable () {

	if(!originalX) {
		originalX = transform.localPosition.x;
	}
	
	
	transform.localPosition.x = originalX;
}