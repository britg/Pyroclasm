#pragma strict

private var fireball : GameObject;
private var shouldAnimate : boolean = false;
var animationTime : float = 0.1;

private var posVelocity : Vector3;
private var widthVelocity : float;
private var heightVelocity : float;

private var originalPos : Vector3;
private var originalWidth : float;
private var originalHeight : float;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.SCROLL_AWARD_ANIMATION_START);
	fireball = GameObject.Find("Fireball");
	originalPos = transform.position;
	originalWidth = guiTexture.pixelInset.width;
	originalHeight = guiTexture.pixelInset.height;
}

function Update () {

	if(shouldAnimate) {
		DoAwardAnimation();
	}

}

function OnScrollAwardAnimationStart() {
	StartAwardAnimation();
	yield WaitForSeconds(animationTime);
	EndAwardAnimation();
}

function StartAwardAnimation() {
	guiTexture.transform.position = Camera.mainCamera.WorldToViewportPoint(fireball.transform.position);
	guiTexture.pixelInset.width = 0;
	guiTexture.pixelInset.height = 0;
	
	shouldAnimate = true;
}

function DoAwardAnimation() {
	guiTexture.transform.position = Vector3.SmoothDamp(guiTexture.transform.position, originalPos, posVelocity, animationTime);
	guiTexture.pixelInset.width = Mathf.SmoothDamp(guiTexture.pixelInset.width, originalWidth, widthVelocity, animationTime);
	guiTexture.pixelInset.height = Mathf.SmoothDamp(guiTexture.pixelInset.height, originalHeight, heightVelocity, animationTime);
	
	if(guiTexture.transform.position == originalPos) {
		//EndAwardAnimation();
		shouldAnimate = false;
	}
}

function EndAwardAnimation() {
	NotificationCenter.DefaultCenter().PostNotification(this, Notifications.SCROLL_AWARD_ANIMATION_ENDED);
}