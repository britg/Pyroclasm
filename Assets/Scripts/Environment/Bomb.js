
var initiator : GUITexture;
var flashColor : Color;

private var paused : boolean = false;
private var numBombs : int;

private var flash : GUITexture;

function Start () {

    var tex : Texture2D = new Texture2D ( 1 , 1 );
    tex.SetPixel( 0 , 0 , Color.white );
    tex.Apply();

    var storageGB = new GameObject("Flash");
    storageGB.transform.localScale = new Vector3(1 , 1, -2);

    flash = storageGB.AddComponent(GUITexture);
    flash.pixelInset = new Rect(0 , 0 , Screen.width , Screen.height );
    flash.color = flashColor;
    flash.texture = tex;
    flash.enabled = false;
}

function Update() {

	for (var touch : Touch in Input.touches) {
        if (touch.phase == TouchPhase.Began) {
        	if(initiator.HitTest(touch.position)) {
        		AttemptBomb();
        		return;
        	}
        }
    }
    
    if(Input.GetMouseButtonDown(0)) {
		if(initiator.HitTest(Input.mousePosition)) {
    		AttemptBomb();
    	}
    }
	
}	

function AttemptBomb() {

	Flash(0.1);
	
	for(var bombable : GameObject in GameObject.FindGameObjectsWithTag("Bombable")) {
		Destroy(bombable);
	}
}

function UpdateBombLabel() {
	
}

function Flash (duration : float) {
     flash.enabled = true;
     Invoke("Cancel", duration);
}

function Cancel () {
    flash.enabled = false;
}