using UnityEngine;
using System.Collections;

[AddComponentMenu("2D Toolkit/Sprite/tk2dAnimatedSprite")]
/// <summary>
/// Sprite implementation which plays and maintains animations
/// </summary>
public class tk2dAnimatedSprite : tk2dSprite
{
	/// <summary>
	/// <see cref="tk2dSpriteAnimation"/>
	/// </summary>
	public tk2dSpriteAnimation anim;
	/// <summary>
	/// Currently playing/active clip
	/// </summary>
	public int clipId = 0;
	/// <summary>
	/// Interface option to play the animation automatically when instantiated / game is started. Useful for background looping animations.
	/// </summary>
	public bool playAutomatically = false;
	
	/// <summary>
	/// Globally pause all animated sprites
	/// </summary>
	public static bool g_paused = false;
	
	/// <summary>
	/// Pause this animated sprite
	/// </summary>
	public bool paused = false;
	
	/// <summary>
	/// Interface option to create an animated box collider for this animated sprite
	/// </summary>
	public bool createCollider = false;
	
	/// <summary>
	/// Currently active clip
	/// </summary>
	tk2dSpriteAnimationClip currentClip = null;
	
	/// <summary>
	/// Time into the current clip. This is in clip local time (i.e. (int)clipTime = currentFrame)
	/// </summary>
    float clipTime = 0.0f;
	
	/// <summary>
	/// Previous frame identifier
	/// </summary>
	int previousFrame = -1;
	
	/// <summary>
	/// Animation complete delegate 
	/// </summary>
	public delegate void AnimationCompleteDelegate(tk2dAnimatedSprite sprite, int clipId);
	/// <summary>
	/// Animation complete event. This is called when the animation has completed playing. Will not trigger on looped animations
	/// </summary>
	public AnimationCompleteDelegate animationCompleteDelegate;
	
	/// <summary>
	/// Animation event delegate.
	/// </summary>
	public delegate void AnimationEventDelegate(tk2dAnimatedSprite sprite, tk2dSpriteAnimationClip clip, tk2dSpriteAnimationFrame frame, int frameNum);
	/// <summary>
	/// Animation event. This is called when the frame displayed has <see cref="tk2dSpriteAnimationFrame.triggerEvent"/> set.
	/// The triggering frame is passed to the delegate, and the eventInfo / Int / Float can be extracted from there.
	/// </summary>
	public AnimationEventDelegate animationEventDelegate;
	
	new void Start()
	{
		base.Start();
		
		if (playAutomatically)
			Play(clipId);
	}
	
	/// <summary>
	/// Adds a tk2dAnimatedSprite as a component to the gameObject passed in, setting up necessary parameters and building geometry.
	/// </summary>
	public static tk2dAnimatedSprite AddComponent(GameObject go, tk2dSpriteAnimation anim, int clipId)
	{
		var clip = anim.clips[clipId];
		tk2dAnimatedSprite animSprite = go.AddComponent<tk2dAnimatedSprite>();
		animSprite.collection = clip.frames[0].spriteCollection;
		animSprite.spriteId = clip.frames[0].spriteId;
		animSprite.anim = anim;
		return animSprite;
	}
	
	/// <summary>
	/// Play the active clip. Will restart the clip if called again.
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	public void Play()
	{
		Play(clipId);
	}
	
	/// <summary>
	/// Play the active clip, starting "clipStartTime" seconds into the clip. 
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	public void Play(float clipStartTime)
	{
		Play(clipId, clipStartTime);
	}
	
	/// <summary>
	/// Play the active clip, starting at the frame specified.
	/// Will restart the clip at frame if called while the clip is playing.
	/// </summary>
	public void PlayFromFrame(int frame)
	{
		PlayFromFrame(clipId, frame);
	}
	
	/// <summary>
	/// Play the specified clip.
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	/// <param name='name'>
	/// Name of clip. Try to cache the animation clip Id and use that instead for performance.
	/// </param>
	public void Play(string name)
	{
		int id = anim?anim.GetClipIdByName(name):-1;
		Play(id);
	}
	
	/// <summary>
	/// Play the specified clip, starting at the frame specified.
	/// Will restart the clip at frame if called while the clip is playing.
	/// </summary>
	/// <param name='name'> Name of clip. Try to cache the animation clip Id and use that instead for performance. </param>
	/// <param name='frame'> Frame to start playing from. </param>
	public void PlayFromFrame(string name, int frame)
	{
		int id = anim?anim.GetClipIdByName(name):-1;
		PlayFromFrame(id, frame);
	}
	
	/// <summary>
	/// Play the specified clip, starting "clipStartTime" seconds into the clip.
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	/// <param name='name'> Name of clip. Try to cache the animation clip Id and use that instead for performance. </param>
	/// <param name='clipStartTime'> Clip start time in seconds. </param>
	public void Play(string name, float clipStartTime)
	{
		int id = anim?anim.GetClipIdByName(name):-1;
		Play(id, clipStartTime);
	}
	
	/// <summary>
	/// The currently active or playing <see cref="tk2dSpriteAnimationClip"/>
	/// </summary>
	public tk2dSpriteAnimationClip CurrentClip
	{
		get { return currentClip; }
	}
	
	/// <summary>
	/// The current clip time in seconds
	/// </summary>
	public float ClipTimeSeconds
	{
		get { return clipTime / currentClip.fps; }	
	}
	
	/// <summary>
	/// Stop the currently playing clip.
	/// </summary>
	public void Stop()
	{
		currentClip = null;
	}
	
	/// <summary>
	/// Stops the currently playing animation and reset to the first frame in the animation
	/// </summary>
	public void StopAndResetFrame()
	{
		if (currentClip != null)
		{
			SwitchCollectionAndSprite(currentClip.frames[0].spriteCollection, currentClip.frames[0].spriteId);
		}
		Stop();
	}
	
	/// <summary>
	/// Is a clip currently playing?
	/// </summary>
	public bool isPlaying()
	{
		return currentClip != null;
	}
	
	protected override bool NeedBoxCollider()
	{
		return createCollider;
	}
	
	/// <summary>
	/// Resolves an animation clip by name and returns a unique id.
	/// This is a convenient alias to <see cref="tk2dSpriteAnimation.GetClipIdByName"/>
	/// </summary>
	/// <returns>
	/// Unique Animation Clip Id.
	/// </returns>
	/// <param name='name'>Case sensitive clip name, as defined in <see cref="tk2dSpriteAnimationClip"/>. </param>
	public int GetClipIdByName(string name)
	{
		return anim?anim.GetClipIdByName(name):-1;
	}
	
	/// <summary>
	/// Play the clip specified by identifier.
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	/// <param name='id'>
	/// Use <see cref="GetClipIdByName"/> to resolve a named clip id
	/// </param>
	public void Play(int id)
	{
		Play(id, 0.0f);
	}
	
	/// <summary>
	/// Play the clip specified by identifier, starting at the specified frame.
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	/// <param name='id'>Use <see cref="GetClipIdByName"/> to resolve a named clip id</param>	
	/// <param name='frame'> Frame to start from. </param>
	public void PlayFromFrame(int id, int frame)
	{
		var clip = anim.clips[id];
		Play(id, frame / clip.fps);
	}
	
	/// <summary>
	/// Play the clip specified by identifier.
	/// Will restart the clip at clipStartTime if called while the clip is playing.
	/// </summary>
	/// <param name='id'>Use <see cref="GetClipIdByName"/> to resolve a named clip id</param>	
	/// <param name='clipStartTime'> Clip start time in seconds. </param>
	public void Play(int id, float clipStartTime)
	{
		clipId = id;
		if (id >= 0 && anim && id < anim.clips.Length)
		{
			currentClip = anim.clips[id];

			// Simply swap, no animation is played
			if (currentClip.wrapMode == tk2dSpriteAnimationClip.WrapMode.Single || currentClip.frames == null)
			{
				SwitchCollectionAndSprite(currentClip.frames[0].spriteCollection, currentClip.frames[0].spriteId);
				
				if (currentClip.frames[0].triggerEvent)
				{
					if (animationEventDelegate != null)
						animationEventDelegate( this, currentClip, currentClip.frames[0], 0 );
				}
				currentClip = null;
			}
			else if (currentClip.wrapMode == tk2dSpriteAnimationClip.WrapMode.RandomFrame || currentClip.wrapMode == tk2dSpriteAnimationClip.WrapMode.RandomLoop)
			{
				int rnd = Random.Range(0, currentClip.frames.Length - 1);
				var currentFrame = currentClip.frames[rnd];
				clipTime = rnd * currentClip.fps;
				
				SwitchCollectionAndSprite(currentFrame.spriteCollection, currentFrame.spriteId);
				if (currentFrame.triggerEvent)
				{
					if (animationEventDelegate != null)
						animationEventDelegate( this, currentClip, currentFrame, rnd );
				}
				if (currentClip.wrapMode == tk2dSpriteAnimationClip.WrapMode.RandomFrame)
				{
					currentClip = null;
					previousFrame = -1;
				}
			}
			else
			{
				SwitchCollectionAndSprite(currentClip.frames[0].spriteCollection, currentClip.frames[0].spriteId);
				
				// clipStartTime is in seconds
				// clipTime is in clip local time (ignoring fps)
				clipTime = clipStartTime * currentClip.fps;
				previousFrame = -1;
				
				if (currentClip.wrapMode == tk2dSpriteAnimationClip.WrapMode.Once && clipTime >= currentClip.fps * currentClip.frames.Length)
				{
					// force to the last frame
					clipTime = currentClip.fps * (currentClip.frames.Length - 0.1f);
				}
			}
		}
		else
		{
			OnCompleteAnimation();
			currentClip = null;
		}
	}
	
	/// <summary>
	/// Pause the currently playing clip. Will do nothing if the clip is currently paused.
	/// </summary>
	public void Pause()
	{
		paused = true;
	}
	
	/// <summary>
	/// Resume the currently paused clip. Will do nothing if the clip hasn't been paused.
	/// </summary>
	public void Resume()
	{
		paused = false;
	}
	
	void OnCompleteAnimation()
	{
		previousFrame = -1;
		if (animationCompleteDelegate != null)
			animationCompleteDelegate(this, clipId);
	}
	
	/// <summary>
	/// Sets the current frame. The animation will wrap if the selected frame exceeds the 
	/// number of frames in the clip.
	/// </summary>
	public void SetFrame(int currFrame)
	{
		if (currentClip != null && currentClip.frames.Length > 0 && currFrame >= 0)
		{
			int frame = currFrame % currentClip.frames.Length;
			SetFrameInternal(frame);
			ProcessEvents(frame - 1, frame, 1);
		}
	}
	
	void SetFrameInternal(int currFrame)
	{
		if (previousFrame != currFrame)
		{
			SwitchCollectionAndSprite( currentClip.frames[currFrame].spriteCollection, currentClip.frames[currFrame].spriteId );
			previousFrame = currFrame;
		}
	}
	
	void ProcessEvents(int start, int last, int direction)
	{
		if (animationEventDelegate == null || start == last) 
			return;
		int end = last + direction;
		var frames = currentClip.frames;
		for (int frame = start + direction; frame != end; frame += direction)
		{
			if (frames[frame].triggerEvent)
				animationEventDelegate(this, currentClip, frames[frame], frame);
		}
	}
	
	void Update () 
	{
#if UNITY_EDITOR
		// Don't play animations when not in play mode
		if (!Application.isPlaying)
			return;
#endif
		
		if (g_paused || paused)
			return;
		
		if (currentClip != null && currentClip.frames != null)
		{
			clipTime += Time.deltaTime * currentClip.fps;
			int _previousFrame = previousFrame;
			
			switch (currentClip.wrapMode)
			{
			case tk2dSpriteAnimationClip.WrapMode.Loop: case tk2dSpriteAnimationClip.WrapMode.RandomLoop:
			{
				int currFrame = (int)clipTime % currentClip.frames.Length;
				SetFrameInternal(currFrame);
				if (currFrame < _previousFrame) // wrap around
				{
					ProcessEvents(_previousFrame, currentClip.frames.Length - 1, 1); // up to end of clip
					ProcessEvents(-1, currFrame, 1); // process up to current frame
				}
				else
				{
					ProcessEvents(_previousFrame, currFrame, 1);
				}
				break;
			}
			case tk2dSpriteAnimationClip.WrapMode.LoopSection:
			{
				int currFrame = (int)clipTime;
				int currFrameLooped = currentClip.loopStart + ((currFrame - currentClip.loopStart) % (currentClip.frames.Length - currentClip.loopStart));
				SetFrameInternal(currFrame);
				if (currFrame >= currentClip.loopStart)
				{
					currFrame = currFrameLooped;
					if (_previousFrame < currentClip.loopStart)
					{
						ProcessEvents(_previousFrame, currentClip.loopStart - 1, 1); // processed up to loop-start
						ProcessEvents(currentClip.loopStart - 1, currFrame, 1); // to current frame, doesn't cope if already looped once
					}
					else 
					{
						if (currFrame < _previousFrame)
						{
							ProcessEvents(_previousFrame, currentClip.frames.Length - 1, 1); // up to end of clip
							ProcessEvents(currentClip.loopStart - 1, currFrame, 1); // up to current frame
						}
						else
						{
							ProcessEvents(_previousFrame, currFrame, 1); // this doesn't cope with multi loops within one frame
						}
					}
				}
				else
				{
					ProcessEvents(_previousFrame, currFrame, 1);
				}
				break;
			}
			case tk2dSpriteAnimationClip.WrapMode.PingPong:
			{
				int currFrame = (int)clipTime % (currentClip.frames.Length + currentClip.frames.Length - 2);
				int dir = 1;
				if (currFrame >= currentClip.frames.Length)
				{
					currFrame = 2 * currentClip.frames.Length - 2 - currFrame;
					dir = -1;
				}
				// This is likely to be buggy - this needs to be rewritten storing prevClipTime and comparing that rather than previousFrame
				// as its impossible to detect direction with this, when running at frame speeds where a transition occurs within a frame
				if (currFrame < _previousFrame) dir = -1;
				SetFrameInternal(currFrame);
				ProcessEvents(_previousFrame, currFrame, dir);
				break;
			}				
			case tk2dSpriteAnimationClip.WrapMode.Once:
			{
				int currFrame = (int)clipTime;
				if (currFrame >= currentClip.frames.Length)
				{
					SetFrameInternal(currentClip.frames.Length - 1); // set to last frame
					ProcessEvents(_previousFrame, currentClip.frames.Length - 1, 1);
					currentClip = null;
					OnCompleteAnimation();
				}
				else
				{
					SetFrameInternal(currFrame);
					ProcessEvents(_previousFrame, currFrame, 1);
				}
				break;
			}
			}
		}
	}
}
