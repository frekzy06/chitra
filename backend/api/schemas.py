from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Any, Dict, Union

class SlideContent(BaseModel):
    slide_number: int = 1
    title: str = Field(default="Overview", description="Concise slide title")
    layout_type: str = Field(default="Two_Column", description="Options: 'Title_Slide', 'Three_Card', 'Two_Column', 'Metric_Highlight'")
    header: Optional[str] = None
    bullet_points: List[str] = Field(default_factory=list, description="High-impact bullet points")
    key_metric: Optional[str] = None
    metric_label: Optional[str] = None
    speaker_notes: Optional[str] = Field(default=None, description="Clear speaker notes for this slide")

    @model_validator(mode='before')
    @classmethod
    def normalize_slide(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        if 'title' not in data or not data['title']:
            data['title'] = data.get('slide_title') or data.get('heading') or data.get('name') or "Overview"

        bullets = data.get('bullet_points') or data.get('bullets') or data.get('points') or data.get('key_points') or data.get('content')
        if isinstance(bullets, str):
            data['bullet_points'] = [p.strip() for p in bullets.split('\n') if p.strip()]
        elif isinstance(bullets, list):
            data['bullet_points'] = [str(p) for p in bullets]
        elif not data.get('bullet_points'):
            data['bullet_points'] = ["Key operational insight outlined above."]

        if 'speaker_notes' not in data or not data['speaker_notes']:
            data['speaker_notes'] = data.get('notes') or data.get('narration') or data.get('speaker_note')

        return data

class PresentationDeckSchema(BaseModel):
    deck_title: str = "Intelligence Briefing Deck"
    target_audience: str = "Common Public"
    classification_tier: str = "PUBLIC"
    summary_takeaway: Optional[str] = None
    slides: List[SlideContent] = Field(default_factory=list)

    @model_validator(mode='before')
    @classmethod
    def unwrap_deck(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        for wrapper in ['deck', 'presentation', 'presentation_deck', 'data', 'response', 'result']:
            if wrapper in data and isinstance(data[wrapper], dict):
                data = data[wrapper]
                break

        if 'deck_title' not in data or not data['deck_title']:
            data['deck_title'] = data.get('title') or data.get('deck_name') or data.get('name') or "Intelligence Briefing Deck"

        if 'target_audience' not in data or not data['target_audience']:
            data['target_audience'] = data.get('audience') or "Common Public"

        if 'classification_tier' not in data or not data['classification_tier']:
            data['classification_tier'] = data.get('classification') or data.get('tier') or "PUBLIC"

        slides = data.get('slides') or data.get('deck_slides') or data.get('slide_list') or data.get('cards') or []
        if isinstance(slides, list):
            for idx, s in enumerate(slides):
                if isinstance(s, dict) and 'slide_number' not in s:
                    s['slide_number'] = idx + 1
            data['slides'] = slides

        return data

class SecurityAdvisorySchema(BaseModel):
    advisory_id: str = "CHITRA-ADV-2026-01"
    title: str = "Security Advisory"
    severity: str = "High"
    classification_tier: str = "PUBLIC"
    affected_systems: List[str] = Field(default_factory=list)
    threat_overview: str = "Security assessment identified perimeter device vulnerabilities."
    indicators_of_compromise: List[str] = Field(default_factory=list)
    mitigation_steps: List[str] = Field(default_factory=list)
    published_date: Optional[str] = "2026-09-17"

    @model_validator(mode='before')
    @classmethod
    def unwrap_advisory(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        for wrapper in ['advisory', 'security_advisory', 'report', 'data', 'response', 'result']:
            if wrapper in data and isinstance(data[wrapper], dict):
                data = data[wrapper]
                break

        if 'title' not in data or not data['title']:
            data['title'] = data.get('advisory_title') or data.get('headline') or "Security Advisory"

        if 'advisory_id' not in data or not data['advisory_id']:
            data['advisory_id'] = data.get('id') or "CHITRA-ADV-2026-01"

        if 'severity' not in data or not data['severity']:
            data['severity'] = data.get('urgency') or "High"

        systems = data.get('affected_systems') or data.get('systems') or data.get('scope')
        if isinstance(systems, str):
            data['affected_systems'] = [s.strip() for s in systems.split('\n') if s.strip()]
        elif isinstance(systems, list):
            data['affected_systems'] = [str(s) for s in systems]
        elif not data.get('affected_systems'):
            data['affected_systems'] = ["Perimeter network devices"]

        iocs = data.get('indicators_of_compromise') or data.get('iocs') or data.get('indicators')
        if isinstance(iocs, str):
            data['indicators_of_compromise'] = [i.strip() for i in iocs.split('\n') if i.strip()]
        elif isinstance(iocs, list):
            data['indicators_of_compromise'] = [str(i) for i in iocs]
        elif not data.get('indicators_of_compromise'):
            data['indicators_of_compromise'] = ["Anomalous outbound telemetry"]

        steps = data.get('mitigation_steps') or data.get('mitigations') or data.get('steps') or data.get('recommendations')
        if isinstance(steps, str):
            data['mitigation_steps'] = [s.strip() for s in steps.split('\n') if s.strip()]
        elif isinstance(steps, list):
            data['mitigation_steps'] = [str(s) for s in steps]
        elif not data.get('mitigation_steps'):
            data['mitigation_steps'] = ["Apply vendor security update immediately."]

        return data

class ExecutiveSummarySchema(BaseModel):
    title: str = "Executive Intelligence Briefing"
    headline: str = "Security Posture & Action Assessment"
    strategic_context: str = "Analysis of identified operational findings and mitigation vectors."
    operational_impact: str = "No confirmed exfiltration; perimeter device updates recommended."
    key_findings: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)

    @model_validator(mode='before')
    @classmethod
    def unwrap_executive(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        for wrapper in ['executive_summary', 'summary', 'briefing', 'data', 'response', 'result']:
            if wrapper in data and isinstance(data[wrapper], dict):
                data = data[wrapper]
                break

        if 'title' not in data or not data['title']:
            data['title'] = data.get('executive_title') or "Executive Intelligence Briefing"

        if 'headline' not in data or not data['headline']:
            data['headline'] = data.get('title') or "Security Posture & Action Assessment"

        if 'strategic_context' not in data or not data['strategic_context']:
            data['strategic_context'] = data.get('context') or data.get('overview') or "Analysis of findings."

        if 'operational_impact' not in data or not data['operational_impact']:
            data['operational_impact'] = data.get('impact') or "Operational status normal."

        findings = data.get('key_findings') or data.get('findings') or data.get('points')
        if isinstance(findings, str):
            data['key_findings'] = [f.strip() for f in findings.split('\n') if f.strip()]
        elif isinstance(findings, list):
            data['key_findings'] = [str(f) for f in findings]
        elif not data.get('key_findings'):
            data['key_findings'] = ["Key operational findings analyzed."]

        recs = data.get('recommendations') or data.get('strategic_recommendations') or data.get('actions')
        if isinstance(recs, str):
            data['recommendations'] = [r.strip() for r in recs.split('\n') if r.strip()]
        elif isinstance(recs, list):
            data['recommendations'] = [str(r) for r in recs]
        elif not data.get('recommendations'):
            data['recommendations'] = ["Deploy security firmware update across all gateways."]

        return data

class InfographicMetric(BaseModel):
    label: str = "Indicator"
    value: str = "Active"
    context: Optional[str] = None

class InfographicSection(BaseModel):
    step_number: int = 1
    title: str = "Step"
    description: str = "Action description"

class InfographicSchema(BaseModel):
    headline: str = "Cyber Defense & Intelligence Dashboard"
    summary: str = "Key telemetry and remediation metrics."
    metrics: List[InfographicMetric] = Field(default_factory=list)
    sections: List[InfographicSection] = Field(default_factory=list)
    layout_recommendation: str = "Three-tier card structure."
    key_message: str = "Proactive perimeter hardening prevents unauthorized access."
    call_to_action: str = "Audit connected devices and apply updates."
    svg_code: Optional[str] = Field(default=None, description="Dynamic SVG vector graphic generated offline by LLM")
    image_prompt: Optional[str] = Field(default=None, description="Detailed local diffusion image prompt generated offline by LLM")

    @model_validator(mode='before')
    @classmethod
    def unwrap_infographic(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        for wrapper in ['infographic', 'infographics', 'data', 'response', 'result']:
            if wrapper in data and isinstance(data[wrapper], dict):
                data = data[wrapper]
                break

        if 'headline' not in data or not data['headline']:
            data['headline'] = data.get('title') or "Cyber Defense & Intelligence Dashboard"

        if 'summary' not in data or not data['summary']:
            data['summary'] = data.get('overview') or "Key telemetry metrics."

        return data

class SocialPostsSchema(BaseModel):
    linkedin: Optional[str] = Field(default=None, description="Professional LinkedIn post with key takeaways")
    twitter: Optional[str] = Field(default=None, description="Platform-optimized tweet or tweet thread with hashtags")

    @model_validator(mode='before')
    @classmethod
    def unwrap_social(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        for wrapper in ['social_posts', 'social', 'posts', 'data', 'response', 'result']:
            if wrapper in data and isinstance(data[wrapper], dict):
                data = data[wrapper]
                break

        return data

class DocumentAnalysisMetadata(BaseModel):
    detected_type: str
    key_entities: List[str]
    urgency: str

class TransformResponse(BaseModel):
    status: str
    title: str
    slide_count: int
    classification_tier: str
    pptx_download_url: Optional[str] = None
    pdf_download_url: Optional[str] = None
    deck_structure: Optional[PresentationDeckSchema] = None
    advisory_structure: Optional[SecurityAdvisorySchema] = None
    executive_summary: Optional[ExecutiveSummarySchema] = None
    infographic: Optional[InfographicSchema] = None
    social_posts: Optional[SocialPostsSchema] = None
    analysis_metadata: Optional[DocumentAnalysisMetadata] = None
    processing_time_seconds: Optional[float] = None
    model_used: Optional[str] = None
    model_mode: Optional[str] = None

