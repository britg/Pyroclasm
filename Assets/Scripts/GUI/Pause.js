
var initiator : GUITexture;

private var paused : boolean = false;

function Update() {

	for (var touch : Touch in Input.touches) {
        if (touch.phase == TouchPhase.Began) {
        	if(initiator.HitTest(touch.position)) {
        		TogglePause();
        		return;
        	}
        }
    }
    
    if(Input.GetMouseButtonDown(0)) {
		if(initiator.HitTest(Input.mousePosition)) {
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