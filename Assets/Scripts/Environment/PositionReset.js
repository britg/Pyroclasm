
//private var originalX : float;
private var originalSet : boolean = false;
private var originalV : Vector3;

function OnEnable () {

	if(!originalSet && transform.localPosition != Vector3.zero) {
		originalV = transform.localPosition;
		originalSet = true;
	} else {
		transform.localPosition = originalV;
	}
	
	
}