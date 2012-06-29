using UnityEditor;
using UnityEngine;
using System.Collections.Generic;

[CustomEditor(typeof(tk2dStaticSpriteBatcher))]
class tk2dStaticSpriteBatcherEditor : Editor
{
	tk2dStaticSpriteBatcher batcher { get { return (tk2dStaticSpriteBatcher)target; } }
	
	void DrawEditorGUI()
	{
		if (GUILayout.Button("Commit"))
		{
			List<tk2dSprite> sprites = new List<tk2dSprite>();
			tk2dSpriteCollectionData scd = null;
			
			for (int i = 0; i < batcher.transform.childCount; ++i)
			{
				Transform t = batcher.transform.GetChild(i);
				tk2dSprite s = t.GetComponent<tk2dSprite>();
				if (s)
				{
					if (scd == null) scd = s.collection;
					if (scd != s.collection)
					{
						EditorUtility.DisplayDialog("StaticSpriteBatcher", "Error: Multiple sprite collections found", "Ok");
						return;
					}
					
					sprites.Add(s);
				}
			}
			
			// sort sprites, smaller to larger z
			sprites.Sort( (a,b) => b.transform.localPosition.z.CompareTo(a.transform.localPosition.z) );
			
			// and within the z sort by material
			
			if (sprites.Count == 0)
			{
				EditorUtility.DisplayDialog("StaticSpriteBatcher", "Error: No child sprite objects found", "Ok");
				return;
			}
		
			batcher.spriteCollection = scd;
			batcher.batchedSprites = new tk2dBatchedSprite[sprites.Count];
			int currBatchedSprite = 0;
			foreach (var s in sprites)
			{
				tk2dBatchedSprite bs = new tk2dBatchedSprite();
				
				bs.name = s.gameObject.name;
				bs.color = s.color;
				bs.localScale = new Vector3(s.scale.x * s.transform.localScale.x, s.scale.y * s.transform.localScale.y, s.scale.z * s.transform.localScale.z);
				bs.position = s.transform.localPosition;
				bs.rotation = s.transform.localRotation;
				bs.spriteId = s.spriteId;
				bs.alwaysPixelPerfect = s.pixelPerfect;
				
				batcher.batchedSprites[currBatchedSprite++] = bs;
				
				GameObject.DestroyImmediate(s.gameObject);
			}
			
			batcher.scale = batcher.transform.localScale;
			batcher.transform.localScale = Vector3.one;
			batcher.Build();
			EditorUtility.SetDirty(target);
		}
	}
	
	void DrawInstanceGUI()
	{
		if (GUILayout.Button("Edit"))
	    {
			foreach (var v in batcher.batchedSprites)
			{
				GameObject go = new GameObject(v.name);
				go.transform.parent = batcher.transform;
				go.transform.localPosition = v.position;
				go.transform.localRotation = v.rotation;
					
				tk2dSprite s = go.AddComponent<tk2dSprite>();
				s.collection = batcher.spriteCollection;
				s.Build();

				s.spriteId = v.spriteId;
				s.EditMode__CreateCollider(); // needed to recreate the collider after setting spriteId

				s.scale = v.localScale;
				s.pixelPerfect = v.alwaysPixelPerfect;
				s.color = v.color;
			}
			
			batcher.transform.localScale = batcher.scale;
			
			batcher.batchedSprites = null;
			batcher.Build();
			EditorUtility.SetDirty(target);
		}

		batcher.scale = EditorGUILayout.Vector3Field("Scale", batcher.scale);		
	}
	
    public override void OnInspectorGUI()
    {
		if (batcher.batchedSprites == null || batcher.batchedSprites.Length == 0)
			DrawEditorGUI();
		else
			DrawInstanceGUI();
    }
	
    [MenuItem("GameObject/Create Other/tk2d/Static Sprite Batcher", false, 12907)]
    static void DoCreateSpriteObject()
    {
		GameObject go = tk2dEditorUtility.CreateGameObjectInScene("Static Sprite Batcher");
		tk2dStaticSpriteBatcher batcher = go.AddComponent<tk2dStaticSpriteBatcher>();
		batcher.version = tk2dStaticSpriteBatcher.CURRENT_VERSION;
    }
}

