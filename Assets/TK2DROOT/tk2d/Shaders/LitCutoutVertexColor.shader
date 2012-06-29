Shader "tk2d/LitCutoutVertexColor" 
{
	Properties 
	{
	    _MainTex ("Base (RGB)", 2D) = "white" {}
	}
	
	SubShader 
	{
		Tags {"IgnoreProjector"="True"}
	    Pass 
	    {
			Tags {"LightMode" = "Vertex" }
			LOD 100
	    
			AlphaTest Greater 0.5
			Blend Off		
			Cull Off

			ColorMaterial AmbientAndDiffuse
	        Lighting On
	        
	        SetTexture [_MainTex] 
	        {
	            Combine texture * primary double, texture * primary
	        }
	    }
	}

	Fallback "tk2d/BlendVertexColor", 1
}
