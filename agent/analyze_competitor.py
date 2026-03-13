"""
Competitor analysis script: Analyze a YouTube video using Gemini API.
"""
import os
from google import genai
from google.genai.types import Part

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

video_url = "https://youtu.be/pVHfQcvk_6k"

prompt = """Please analyze this YouTube video thoroughly and provide ALL of the following:

1. **FULL TRANSCRIPTION**: Provide a complete, word-for-word transcription of everything said in the video. Do not skip or summarize any parts — include every word spoken.

2. **COMPANY/PRODUCT IDENTIFICATION**: What company and product is this video about? Include any branding, URLs, or contact info mentioned.

3. **KEY FEATURES**: List every feature, capability, and functionality mentioned or demonstrated in the video.

4. **PRICING**: Note any pricing, plans, tiers, or cost information mentioned.

5. **VALUE PROPOSITIONS**: What are the main selling points and benefits they emphasize?

6. **TARGET MARKET**: Who is this product aimed at? What industries, use cases, or customer segments are mentioned?

7. **COMPETITIVE INSIGHTS**: What do they do well? What claims do they make about their technology or approach? How do they differentiate themselves?

8. **WEAKNESSES & GAPS**: Based on what's shown and said, what are potential weaknesses, limitations, or gaps in their offering?

Be extremely thorough. This is for competitive intelligence purposes. Do not truncate or summarize the transcription — provide it in full."""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        Part.from_uri(
            file_uri=video_url,
            mime_type="video/*",
        ),
        prompt,
    ],
)

print(response.text)
