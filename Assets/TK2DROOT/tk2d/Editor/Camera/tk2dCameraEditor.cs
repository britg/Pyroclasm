using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor(typeof(tk2dCamera))]
public class tk2dCameraEditor : Editor 
{
	public override void OnInspectorGUI()
	{
		DrawDefaultInspector();

		tk2dCamera _target = (tk2dCamera)target;
		
		EditorGUILayout.LabelField("Camera resolution", EditorStyles.boldLabel);
		GUIContent toggleLabel = new GUIContent("Force Editor Resolution", 
			"When enabled, forces the resolution in the editor regardless of the size of the game window.");
		EditorGUI.indentLevel++;
		_target.forceResolutionInEditor = EditorGUILayout.Toggle(toggleLabel, _target.forceResolutionInEditor);
		if (_target.forceResolutionInEditor)
		{
			_target.forceResolution.x = EditorGUILayout.IntField("Width", (int)_target.forceResolution.x);
			_target.forceResolution.y = EditorGUILayout.IntField("Height", (int)_target.forceResolution.y);
		}
		else
		{
			EditorGUILayout.FloatField("Width", _target.resolution.x);
			EditorGUILayout.FloatField("Height", _target.resolution.y);
		}
		EditorGUI.indentLevel--;
		
		if (GUI.changed)
		{
			EditorUtility.SetDirty(target);
			tk2dCameraAnchor[] allAlignmentObjects = GameObject.FindObjectsOfType(typeof(tk2dCameraAnchor)) as tk2dCameraAnchor[];
			foreach (var v in allAlignmentObjects)
			{
				EditorUtility.SetDirty(v);
			}
		}
		
		GUILayout.Space(16.0f);
		
		EditorGUILayout.BeginHorizontal(GUILayout.ExpandWidth(true));
		if (GUILayout.Button("Create Anchor", EditorStyles.miniButton, GUILayout.ExpandWidth(false)))
		{
			tk2dCamera cam = (tk2dCamera)target;
			
			GameObject go = new GameObject("Anchor");
			go.transform.parent = cam.transform;
			tk2dCameraAnchor cameraAnchor = go.AddComponent<tk2dCameraAnchor>();
			cameraAnchor.tk2dCamera = cam;
			cameraAnchor.mainCamera = cam.mainCamera;
			
			EditorGUIUtility.PingObject(go);
		}
		
		EditorGUILayout.EndHorizontal();
	}
	
    [MenuItem("GameObject/Create Other/tk2d/Camera", false, 14905)]
    static void DoCreateCameraObject()
	{
		GameObject go = tk2dEditorUtility.CreateGameObjectInScene("tk2dCamera");
		go.transform.position = new Vector3(0, 0, -10.0f);
		Camera camera = go.AddComponent<Camera>();
		camera.orthographic = true;
		camera.orthographicSize = 480.0f; // arbitrary large number
		camera.farClipPlane = 1000.0f;
		go.AddComponent<tk2dCamera>();

		Selection.activeGameObject = go;
		Undo.RegisterCreatedObjectUndo(go, "Create tk2dCamera");
	}
}
