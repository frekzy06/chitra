from pydantic import BaseModel, Field
from typing import List, Optional

class SlideContent(BaseModel):
    slide_number: int
    title: str = Field(description="Max 40 characters concise slide title")
    layout_type: str = Field(default="Two_Column", description="Options: 'Title_Slide', 'Three_Card', 'Two_Column', 'Metric_Highlight'")
    header: Optional[str] = None
    bullet_points: List[str] = Field(description="2-4 short, high-impact statements")
    key_metric: Optional[str] = Field(default=None, description="e.g. '99.9%', 'CVE-2026-1120', 'CRITICAL'")
    metric_label: Optional[str] = Field(default=None, description="Short description of the key metric")

class PresentationDeckSchema(BaseModel):
    deck_title: str
    target_audience: str
    classification_tier: str
    summary_takeaway: Optional[str] = None
    slides: List[SlideContent]

class SecurityAdvisorySchema(BaseModel):
    advisory_id: str
    title: str
    severity: str  # Critical, High, Medium, Low
    classification_tier: str = "RESTRICTED"
    affected_systems: List[str]
    threat_overview: str
    indicators_of_compromise: List[str]
    mitigation_steps: List[str]
    published_date: Optional[str] = None

class SocialPostsSchema(BaseModel):
    instagram: str = Field(description="Engaging Instagram caption with emojis and hashtags")
    linkedin: str = Field(description="Professional LinkedIn briefing post with key takeaways")
    twitter: str = Field(description="Concise Twitter/X advisory thread or single post")

class TransformResponse(BaseModel):
    status: str
    title: str
    slide_count: int
    classification_tier: str
    pptx_download_url: Optional[str] = None
    pdf_download_url: Optional[str] = None
    deck_structure: Optional[PresentationDeckSchema] = None
    advisory_structure: Optional[SecurityAdvisorySchema] = None
    social_posts: Optional[SocialPostsSchema] = None
    processing_time_seconds: Optional[float] = None

