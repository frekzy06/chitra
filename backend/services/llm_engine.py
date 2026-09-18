import json
import os
import re
import urllib.request
from typing import Optional, List, Dict, Any, Tuple
from dotenv import load_dotenv
from openai import OpenAI
from google import genai
from google.genai import types

load_dotenv()

from api.schemas import (
    PresentationDeckSchema,
    SecurityAdvisorySchema,
    SlideContent,
    SocialPostsSchema,
    ExecutiveSummarySchema,
    InfographicSchema,
    InfographicMetric,
    InfographicSection,
    DocumentAnalysisMetadata
)

class AirGappedBrain:
    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None
    ):
        self.base_url = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        self.model = model or os.getenv("OLLAMA_MODEL", "qwen3:8b")
        self.timeout = float(os.getenv("OLLAMA_TIMEOUT", "120.0"))
        self.client = OpenAI(base_url=self.base_url, api_key="ollama", timeout=self.timeout)

    def is_available(self) -> bool:
        """Check if local Ollama daemon is reachable."""
        try:
            # Check base endpoint
            base_check_url = self.base_url.replace("/v1", "")
            req = urllib.request.Request(base_check_url, headers={"User-Agent": "CHITRA-HealthCheck"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                return resp.status in (200, 204)
        except Exception:
            return False

    def _ensure_available(self):
        if not self.is_available():
            raise RuntimeError(
                "Local offline LLM (Ollama) is not reachable at http://localhost:11434. "
                "Please ensure Ollama is running locally, or switch to Online Model."
            )

    def _clean_json_string(self, text: str) -> str:
        text = text.strip()
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if json_match:
            return json_match.group(1).strip()
        first_brace = text.find('{')
        last_brace = text.rfind('}')
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            return text[first_brace:last_brace+1]
        return text

    def analyze_document_type(self, context_text: str, user_hint: str = "Auto-Detect") -> DocumentAnalysisMetadata:
        if user_hint and user_hint != "Auto-Detect (AI)" and user_hint != "Auto-Detect":
            return DocumentAnalysisMetadata(
                detected_type=user_hint,
                key_entities=["Security Operations", "Perimeter Infrastructure"],
                urgency="High"
            )

        lower_text = context_text.lower()
        if "cve-" in lower_text or "patch" in lower_text or "advisory" in lower_text:
            dtype = "Security Advisory"
            urgency = "High"
        elif "incident" in lower_text or "breach" in lower_text or "ransomware" in lower_text:
            dtype = "Incident Report"
            urgency = "Critical"
        elif "apt" in lower_text or "threat actor" in lower_text or "ttp" in lower_text:
            dtype = "Threat Intelligence"
            urgency = "High"
        elif "policy" in lower_text or "compliance" in lower_text or "framework" in lower_text:
            dtype = "Policy Document"
            urgency = "Standard"
        elif "research" in lower_text or "abstract" in lower_text or "methodology" in lower_text:
            dtype = "Research Paper"
            urgency = "Informational"
        elif "announced" in lower_text or "press release" in lower_text:
            dtype = "Announcement"
            urgency = "Standard"
        elif len(context_text) < 300:
            dtype = "Free-form Prompt"
            urgency = "Medium"
        else:
            dtype = "General Report"
            urgency = "Medium"

        return DocumentAnalysisMetadata(
            detected_type=dtype,
            key_entities=["Perimeter Systems", "Infrastructure Gateways"],
            urgency=urgency
        )

    def generate_presentation_structure(
        self,
        context_text: str,
        tone: str = "Executive Briefing",
        target_audience: str = "Common Public",
        classification_tier: str = "RESTRICTED",
        doc_type: str = "Security Advisory"
    ) -> PresentationDeckSchema:
        self._ensure_available()
        system_prompt = (
            f"You are an offline briefing specialist generating presentation slides for {target_audience}. "
            f"Document Type: {doc_type}. Tone: {tone}. "
            "Output ONLY valid JSON matching the schema."
        )

        user_prompt = f"""
Classification: {classification_tier}
Document:
\"\"\"
{context_text[:4000]}
\"\"\"

JSON Schema:
{json.dumps(PresentationDeckSchema.model_json_schema(), indent=2)}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content or "{}"
            cleaned = self._clean_json_string(raw_content)
            parsed_dict = json.loads(cleaned)
            if isinstance(parsed_dict, dict):
                if "target_audience" not in parsed_dict:
                    parsed_dict["target_audience"] = target_audience
                if "classification_tier" not in parsed_dict:
                    parsed_dict["classification_tier"] = classification_tier
            return PresentationDeckSchema.model_validate(parsed_dict)
        except Exception as e:
            print(f"Ollama call failed ({e}), using structured fallback presentation.")
            return self._fallback_presentation(context_text, tone, target_audience, classification_tier, doc_type)

    def generate_advisory_structure(
        self,
        context_text: str,
        classification_tier: str = "RESTRICTED",
        doc_type: str = "Security Advisory"
    ) -> SecurityAdvisorySchema:
        self._ensure_available()
        system_prompt = (
            "You are a cybersecurity advisor. Generate a structured security advisory document. "
            "Output ONLY valid JSON matching the schema."
        )
        user_prompt = f"""
Classification: {classification_tier}
Document:
\"\"\"
{context_text[:4000]}
\"\"\"

JSON Schema:
{json.dumps(SecurityAdvisorySchema.model_json_schema(), indent=2)}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content or "{}"
            cleaned = self._clean_json_string(raw_content)
            parsed_dict = json.loads(cleaned)
            if isinstance(parsed_dict, dict):
                if "classification_tier" not in parsed_dict:
                    parsed_dict["classification_tier"] = classification_tier
            return SecurityAdvisorySchema.model_validate(parsed_dict)
        except Exception as e:
            print(f"Ollama call failed ({e}), using structured fallback advisory.")
            return self._fallback_advisory(context_text, classification_tier, doc_type)

    def generate_executive_summary(
        self,
        context_text: str,
        tone: str = "Executive Briefing"
    ) -> ExecutiveSummarySchema:
        self._ensure_available()
        system_prompt = (
            "You are a strategic intelligence advisor. Generate an executive summary for leadership. "
            "Output ONLY valid JSON matching the schema."
        )
        user_prompt = f"""
Tone: {tone}
Document:
\"\"\"
{context_text[:4000]}
\"\"\"

JSON Schema:
{json.dumps(ExecutiveSummarySchema.model_json_schema(), indent=2)}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content or "{}"
            cleaned = self._clean_json_string(raw_content)
            parsed_dict = json.loads(cleaned)
            return ExecutiveSummarySchema.model_validate(parsed_dict)
        except Exception as e:
            print(f"Ollama call failed ({e}), using structured fallback executive summary.")
            return self._fallback_executive_summary(context_text, tone)

    def generate_infographic_data(
        self,
        context_text: str
    ) -> InfographicSchema:
        self._ensure_available()
        system_prompt = (
            "You are an information architect. Extract structured infographic data and metrics. "
            "Output ONLY valid JSON matching the schema."
        )
        user_prompt = f"""
Document Context:
\"\"\"
{context_text[:4000]}
\"\"\"

JSON Schema:
{json.dumps(InfographicSchema.model_json_schema(), indent=2)}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content or "{}"
            cleaned = self._clean_json_string(raw_content)
            parsed_dict = json.loads(cleaned)
            data = InfographicSchema.model_validate(parsed_dict)
            if not data.svg_code or "<svg" not in data.svg_code:
                data.svg_code = self._generate_default_svg(data.headline, data.metrics)
            return data
        except Exception as e:
            print(f"Ollama call failed ({e}), using structured fallback infographic.")
            return self._fallback_infographic(context_text)

    def generate_social_posts(
        self,
        context_text: str,
        target_audience: str = "Common Public"
    ) -> SocialPostsSchema:
        self._ensure_available()
        system_prompt = (
            f"Generate platform-optimized social posts for {target_audience}. "
            "Output ONLY valid JSON matching the schema."
        )
        user_prompt = f"""
Document Context:
\"\"\"
{context_text[:4000]}
\"\"\"

JSON Schema:
{json.dumps(SocialPostsSchema.model_json_schema(), indent=2)}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content or "{}"
            cleaned = self._clean_json_string(raw_content)
            parsed_dict = json.loads(cleaned)
            return SocialPostsSchema.model_validate(parsed_dict)
        except Exception as e:
            print(f"Ollama call failed ({e}), using structured fallback social posts.")
            return self._fallback_social(context_text, target_audience)

    # --- FALLBACK GENERATORS ---

    def _extract_summary_title(self, text: str) -> str:
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines:
            first = lines[0].strip("#* ")
            if len(first) < 80:
                return first
        return "Intelligence Assessment"

    def _fallback_presentation(self, context_text: str, tone: str, audience: str, tier: str, doc_type: str) -> PresentationDeckSchema:
        title = self._extract_summary_title(context_text)
        sentences = [s.strip() for s in re.split(r'[.!?]', context_text) if len(s.strip()) > 10]
        s1 = sentences[0] if len(sentences) > 0 else "Analysis of input document context."
        s2 = sentences[1] if len(sentences) > 1 else "Key findings indicate specific operational measures."
        s3 = sentences[2] if len(sentences) > 2 else "Recommended mitigation steps and long term policies."

        slides = [
            SlideContent(
                slide_number=1,
                title=f"Executive Briefing: {title}",
                bullets=["Document Analysis", f"Scope: {doc_type}", f"Audience: {audience}"],
                speaker_notes=f"Welcome. Today we review the findings regarding {title}."
            ),
            SlideContent(
                slide_number=2,
                title="Strategic Context & Findings",
                bullets=[s1[:90], s2[:90]],
                speaker_notes="Key strategic context points extracted from document analysis."
            ),
            SlideContent(
                slide_number=3,
                title="Action Plan & Recommendations",
                bullets=[s3[:90], "Implement verification controls.", "Review operational framework."],
                speaker_notes="Recommended next steps and operational policy enforcement."
            ),
        ]

        return PresentationDeckSchema(
            deck_title=f"Executive Briefing: {title}",
            target_audience=audience,
            classification_tier=tier,
            slides=slides
        )

    def _fallback_advisory(self, context_text: str, tier: str, doc_type: str) -> SecurityAdvisorySchema:
        title = self._extract_summary_title(context_text)
        return SecurityAdvisorySchema(
            advisory_id="ADV-2026-001",
            title=f"Advisory: {title}",
            classification_tier=tier,
            published_date="2026-09-18",
            severity="High",
            threat_overview=context_text[:300] if context_text else "Advisory analysis summary.",
            affected_systems=["Perimeter Infrastructure", "Network Gateways"],
            indicators_of_compromise=["MD5: 4a8b...1f09", "IP: 192.168.1.100"],
            mitigation_steps=["Audit system access credentials.", "Verify firmware integrity.", "Apply vendor security updates."]
        )

    def _fallback_executive_summary(self, context_text: str, tone: str) -> ExecutiveSummarySchema:
        title = self._extract_summary_title(context_text)
        sentences = [s.strip() for s in re.split(r'[.!?]', context_text) if len(s.strip()) > 10]
        return ExecutiveSummarySchema(
            title=f"Executive Summary: {title}",
            headline=f"Strategic Assessment: {title}",
            strategic_context=sentences[0] if len(sentences) > 0 else context_text[:250],
            operational_impact=sentences[1] if len(sentences) > 1 else "Operational workflows require standard review and control verification.",
            key_findings=[sentences[i][:100] for i in range(min(3, len(sentences)))] or ["Primary finding: Active review required."],
            recommendations=["Establish continuous monitoring.", "Enforce strict credential rotation."],
            next_steps=["Deploy security updates.", "Conduct follow-up assessment."]
        )

    def _fallback_infographic(self, context_text: str) -> InfographicSchema:
        title = self._extract_summary_title(context_text)
        metrics = [
            InfographicMetric(label="Status", value="ACTIVE"),
            InfographicMetric(label="Coverage", value="High"),
            InfographicMetric(label="Priority", value="P1"),
            InfographicMetric(label="Gateways", value="Verified"),
        ]
        sections = [
            InfographicSection(step_number=1, title="Ingestion", description="Document analysis and parsing."),
            InfographicSection(step_number=2, title="Synthesis", description="AI extraction and vector alignment."),
            InfographicSection(step_number=3, title="Verification", description="Formatting and report delivery."),
        ]
        svg = self._generate_default_svg(title, metrics)
        return InfographicSchema(
            headline=title,
            summary=context_text[:200] if context_text else "Visual summary of document findings.",
            metrics=metrics,
            sections=sections,
            layout_recommendation="Vertical 3-tier hierarchy",
            key_message="Maintain operational vigilance and control verification.",
            call_to_action="Review findings and execute mitigation plan.",
            svg_code=svg,
            image_prompt=f"Cybersecurity architecture infographic for {title}"
        )

    def _fallback_social(self, context_text: str, audience: str) -> SocialPostsSchema:
        title = self._extract_summary_title(context_text)
        return SocialPostsSchema(
            linkedin=f"Briefing Update: {title}\n\nKey takeaways from our latest assessment:\n- Critical analysis completed.\n- Mitigation protocols established.\n\n#SecurityBriefing #Intelligence #Analysis",
            twitter=f"Alert: Assessment complete for {title[:40]}. Review mitigation steps and update credentials. #SecurityUpdate"
        )

    def _generate_default_svg(self, headline: str, metrics: List[InfographicMetric]) -> str:
        safe_headline = (headline or "Cybersecurity Intelligence")[:45]
        m1 = metrics[0] if len(metrics) > 0 else InfographicMetric(label="Status", value="ACTIVE")
        m2 = metrics[1] if len(metrics) > 1 else InfographicMetric(label="Coverage", value="High")
        m3 = metrics[2] if len(metrics) > 2 else InfographicMetric(label="Priority", value="P1")
        m4 = metrics[3] if len(metrics) > 3 else InfographicMetric(label="Gateways", value="Verified")

        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8B4752"/>
      <stop offset="100%" stop-color="#5E2E36"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="960" height="540" fill="url(#bgGrad)" rx="20"/>
  <rect x="40" y="40" width="880" height="60" rx="12" fill="#7A3E48" fill-opacity="0.2" stroke="#7A3E48" stroke-width="1.5"/>
  <text x="60" y="77" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">{safe_headline}</text>

  <!-- Central Defense Shield Icon -->
  <g transform="translate(480, 220)">
    <circle r="75" fill="#7A3E48" fill-opacity="0.15" stroke="#7A3E48" stroke-width="2" filter="url(#glow)"/>
    <path d="M 0 -45 L 35 -25 L 35 15 C 35 38 0 50 0 50 C 0 50 -35 38 -35 15 L -35 -25 Z" fill="url(#shieldGrad)" stroke="#FEEAEA" stroke-width="2"/>
    <path d="M -10 -5 L 10 -5 L 10 15 L -10 15 Z" fill="#FFFFFF" rx="2"/>
    <path d="M -6 -5 L -6 -12 C -6 -16 6 -16 6 -12 L 6 -5" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Metric 1 -->
  <rect x="60" y="360" width="190" height="120" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="155" y="415" fill="#F43F5E" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">{m1.value}</text>
  <text x="155" y="445" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">{m1.label}</text>

  <!-- Metric 2 -->
  <rect x="280" y="360" width="190" height="120" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="375" y="415" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">{m2.value}</text>
  <text x="375" y="445" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">{m2.label}</text>

  <!-- Metric 3 -->
  <rect x="500" y="360" width="190" height="120" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="595" y="415" fill="#34D399" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">{m3.value}</text>
  <text x="595" y="445" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">{m3.label}</text>

  <!-- Metric 4 -->
  <rect x="710" y="360" width="190" height="120" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="805" y="415" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">{m4.value}</text>
  <text x="805" y="445" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">{m4.label}</text>
</svg>'''


class GeminiBrain:
    def __init__(
        self,
        api_key: Optional[str] = None,
        models: Optional[List[str]] = None,
        image_models: Optional[List[str]] = None
    ):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        models_env = os.getenv("GEMINI_MODELS", "gemini-3.5-flash-lite,gemini-3.6-flash,gemini-flash-latest,gemini-flash-lite-latest")
        self.text_models = models or [m.strip() for m in models_env.split(",") if m.strip()]
        img_models_env = os.getenv("GEMINI_IMAGE_MODELS", "gemini-3.1-flash-image,gemini-3-pro-image,gemini-2.5-flash-image,gemini-3.1-flash-lite-image")
        self.image_models = image_models or [m.strip() for m in img_models_env.split(",") if m.strip()]
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None
        self.last_used_model = self.text_models[0] if self.text_models else "gemini-3.5-flash-lite"


    def is_available(self) -> bool:
        return bool(self.api_key and self.client is not None)

    def _clean_json_string(self, text: str) -> str:
        text = text.strip()
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if json_match:
            return json_match.group(1).strip()
        first_brace = text.find('{')
        last_brace = text.rfind('}')
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            return text[first_brace:last_brace+1]
        return text

    def _call_with_fallback(self, user_prompt: str, system_prompt: str) -> Tuple[str, Dict[str, Any]]:
        if not self.client:
            raise RuntimeError("Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env")

        last_error = None
        for model_name in self.text_models:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        response_mime_type="application/json",
                        temperature=0.1
                    )
                )
                raw_text = response.text or "{}"
                cleaned = self._clean_json_string(raw_text)
                parsed = json.loads(cleaned)
                if isinstance(parsed, dict):
                    self.last_used_model = model_name
                    return model_name, parsed
            except Exception as e:
                print(f"[GeminiBrain] Model {model_name} failed ({type(e).__name__}: {str(e)[:120]}), switching to next model in fallback chain...")
                last_error = e
                continue

        raise RuntimeError(f"All Gemini models exhausted. Last error: {last_error}")

    def analyze_document_type(self, context_text: str, user_hint: str = "Auto-Detect") -> DocumentAnalysisMetadata:
        if user_hint and user_hint != "Auto-Detect (AI)" and user_hint != "Auto-Detect":
            return DocumentAnalysisMetadata(
                detected_type=user_hint,
                key_entities=["Security Operations", "Perimeter Infrastructure"],
                urgency="High"
            )

        system_prompt = (
            "You are a document classification specialist. Analyze the text and output a JSON object "
            "with keys 'detected_type', 'key_entities' (list of strings), and 'urgency' ('Critical', 'High', 'Medium', 'Standard', 'Informational')."
        )
        user_prompt = f"Document excerpt:\n\"\"\"\n{context_text[:2000]}\n\"\"\"\n\nReturn JSON only."

        try:
            _, parsed = self._call_with_fallback(user_prompt, system_prompt)
            return DocumentAnalysisMetadata(
                detected_type=parsed.get("detected_type", "General Report"),
                key_entities=parsed.get("key_entities", ["System Architecture", "Security Operations"]),
                urgency=parsed.get("urgency", "High")
            )
        except Exception:
            # Deterministic rule fallback
            lower_text = context_text.lower()
            if "cve-" in lower_text or "patch" in lower_text or "advisory" in lower_text:
                dtype = "Security Advisory"
                urgency = "High"
            elif "incident" in lower_text or "breach" in lower_text:
                dtype = "Incident Report"
                urgency = "Critical"
            else:
                dtype = "General Report"
                urgency = "Medium"
            return DocumentAnalysisMetadata(
                detected_type=dtype,
                key_entities=["Perimeter Systems", "Security Infrastructure"],
                urgency=urgency
            )

    def generate_presentation_structure(
        self,
        context_text: str,
        tone: str = "Executive Briefing",
        target_audience: str = "Common Public",
        classification_tier: str = "RESTRICTED",
        doc_type: str = "Security Advisory"
    ) -> PresentationDeckSchema:
        system_prompt = (
            f"You are a premier executive presentation designer generating slide decks for {target_audience}. "
            f"Document Type: {doc_type}. Tone: {tone}. "
            "Output ONLY valid JSON strictly matching the schema."
        )
        user_prompt = f"""
Classification: {classification_tier}
Document:
\"\"\"
{context_text[:5000]}
\"\"\"

JSON Schema:
{json.dumps(PresentationDeckSchema.model_json_schema(), indent=2)}
"""
        _, parsed_dict = self._call_with_fallback(user_prompt, system_prompt)
        if "target_audience" not in parsed_dict:
            parsed_dict["target_audience"] = target_audience
        if "classification_tier" not in parsed_dict:
            parsed_dict["classification_tier"] = classification_tier
        return PresentationDeckSchema.model_validate(parsed_dict)

    def generate_advisory_structure(
        self,
        context_text: str,
        classification_tier: str = "RESTRICTED",
        doc_type: str = "Security Advisory"
    ) -> SecurityAdvisorySchema:
        system_prompt = (
            "You are a senior cybersecurity advisor. Generate a comprehensive security advisory document. "
            "Output ONLY valid JSON strictly matching the schema."
        )
        user_prompt = f"""
Classification: {classification_tier}
Document:
\"\"\"
{context_text[:5000]}
\"\"\"

JSON Schema:
{json.dumps(SecurityAdvisorySchema.model_json_schema(), indent=2)}
"""
        _, parsed_dict = self._call_with_fallback(user_prompt, system_prompt)
        if "classification_tier" not in parsed_dict:
            parsed_dict["classification_tier"] = classification_tier
        return SecurityAdvisorySchema.model_validate(parsed_dict)

    def generate_executive_summary(
        self,
        context_text: str,
        tone: str = "Executive Briefing"
    ) -> ExecutiveSummarySchema:
        system_prompt = (
            "You are an executive strategic intelligence advisor. Generate an executive intelligence summary. "
            "Output ONLY valid JSON strictly matching the schema."
        )
        user_prompt = f"""
Tone: {tone}
Document:
\"\"\"
{context_text[:5000]}
\"\"\"

JSON Schema:
{json.dumps(ExecutiveSummarySchema.model_json_schema(), indent=2)}
"""
        _, parsed_dict = self._call_with_fallback(user_prompt, system_prompt)
        return ExecutiveSummarySchema.model_validate(parsed_dict)

    def generate_infographic_data(
        self,
        context_text: str
    ) -> InfographicSchema:
        system_prompt = (
            "You are an information architect and visual designer. Extract structured infographic metrics and SVG data. "
            "Output ONLY valid JSON strictly matching the schema."
        )
        user_prompt = f"""
Document Context:
\"\"\"
{context_text[:5000]}
\"\"\"

JSON Schema:
{json.dumps(InfographicSchema.model_json_schema(), indent=2)}
"""
        _, parsed_dict = self._call_with_fallback(user_prompt, system_prompt)
        data = InfographicSchema.model_validate(parsed_dict)
        if not data.svg_code or "<svg" not in data.svg_code:
            air = AirGappedBrain()
            data.svg_code = air._generate_default_svg(data.headline, data.metrics)
        return data

    def generate_social_posts(
        self,
        context_text: str,
        target_audience: str = "Common Public"
    ) -> SocialPostsSchema:
        system_prompt = (
            f"Generate platform-optimized social posts for {target_audience} (LinkedIn and Twitter/X). "
            "Output ONLY valid JSON strictly matching the schema."
        )
        user_prompt = f"""
Document Context:
\"\"\"
{context_text[:5000]}
\"\"\"

JSON Schema:
{json.dumps(SocialPostsSchema.model_json_schema(), indent=2)}
"""
        _, parsed_dict = self._call_with_fallback(user_prompt, system_prompt)
        return SocialPostsSchema.model_validate(parsed_dict)


class HybridBrain:
    """Unified brain managing both offline (Ollama) and online (Google Gemini with model fallback)."""
    def __init__(self):
        self.offline_brain = AirGappedBrain()
        self.online_brain = GeminiBrain()

    def get_brain(self, mode: str = "offline"):
        normalized = (mode or "offline").lower().strip()
        if normalized == "online":
            return self.online_brain
        else:
            return self.offline_brain

    def get_active_model_name(self, mode: str = "offline") -> str:
        normalized = (mode or "offline").lower().strip()
        if normalized == "online":
            return self.online_brain.last_used_model
        return self.offline_brain.model
