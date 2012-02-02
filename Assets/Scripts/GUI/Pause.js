
var initiator : GUITexture;

private var paused : boolean = false;

function Update() {

	var touchCount : int = Input.touchCount;
	
	for (var touch : Touch in Input.touches) {
        if (touch.phase == TouchPhase.Began) {
        	if(initiator.HitTest(touch.position, Camera.main)) {
        		TogglePause();
        	}
        }
    }
    
    if(Input.GetMouseButtonDown(0)) {
		if(initiator.HitTest(Input.mousePosition, Camera.main)) {
    		TogglePause();
    	}	
    }
	
}	

function TogglePause() {

	if(paused) {
		Time.timeScale = 1;
	} else {
		Time.timeScale = 0;
	}
	
	paused = !paused;
	
}