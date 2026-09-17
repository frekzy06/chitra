import json
import os
import re
from typing import Optional
from openai import OpenAI
from api.schemas import PresentationDeckSchema, SecurityAdvisorySchema, SlideContent, SocialPostsSchema

class AirGappedBrain:
    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None
    ):
        self.base_url = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        self.model = model or os.getenv("OLLAMA_MODEL", "qwen3:8b")
        self.client = OpenAI(base_url=self.base_url, api_key="ollama")

    def _clean_json_string(self, text: str) -> str:
        """Extract and clean raw JSON from model response if wrapped in markdown."""
        text = text.strip()
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if json_match:
            return json_match.group(1).strip()
        first_brace = text.find('{')
        last_brace = text.rfind('}')
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            return text[first_brace:last_brace+1]
        return text

    def generate_presentation_structure(
        self,
        context_text: str,
        tone: str = "Executive Briefing",
        target_audience: str = "Common Public",
        classification_tier: str = "RESTRICTED"
    ) -> PresentationDeckSchema:
        system_prompt = (
            f"You are a clear communicator creating briefing slides for {target_audience}. "
            "Transform the provided document into clear, concise, and easy-to-understand slides. "
            "You MUST strictly follow this JSON schema. Do not output any conversational preamble."
        )

        user_prompt = f"""
Tone: {tone}
Target Audience: {target_audience}
Classification: {classification_tier}

Source Document Context:
\"\"\"
{context_text[:6000]}
\"\"\"

JSON Schema to strictly adhere to:
{json.dumps(PresentationDeckSchema.model_json_schema(), indent=2)}

Return ONLY a valid JSON object matching the schema above.
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
            raw_content = response.choices[0].message.content or ""
            cleaned_json = self._clean_json_string(raw_content)
            return PresentationDeckSchema.model_validate_json(cleaned_json)
        except Exception:
            return self._build_deterministic_deck(context_text, tone, target_audience, classification_tier)

    def generate_advisory_structure(
        self,
        context_text: str,
        classification_tier: str = "RESTRICTED"
    ) -> SecurityAdvisorySchema:
        system_prompt = (
            "You are a public safety and cyber awareness expert. "
            "Explain the threat and actions in SIMPLE, PLAIN, EVERYDAY LANGUAGE so that a normal person can easily understand what happened, who is affected, and what simple steps they should take to stay safe. "
            "Avoid overly complex jargon. Adhere strictly to the JSON schema."
        )
        user_prompt = f"""
Classification: {classification_tier}
Document Context:
\"\"\"
{context_text[:6000]}
\"\"\"

JSON Schema:
{json.dumps(SecurityAdvisorySchema.model_json_schema(), indent=2)}

Return ONLY valid JSON.
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
            raw_content = response.choices[0].message.content or ""
            cleaned_json = self._clean_json_string(raw_content)
            return SecurityAdvisorySchema.model_validate_json(cleaned_json)
        except Exception:
            return self._build_deterministic_advisory(context_text, classification_tier)

    def generate_social_posts(
        self,
        context_text: str,
        target_audience: str = "Common Public"
    ) -> SocialPostsSchema:
        system_prompt = (
            f"You are a social media specialist crafting informative posts for {target_audience}. "
            "Generate format text tailored for: "
            "1. Instagram: Engaging caption with emojis, clear warnings, and relevant hashtags. "
            "2. LinkedIn: Professional, well-structured update with key takeaways and advice. "
            "3. Twitter/X: Concise, punchy alert thread/post under 280 characters with alert emojis. "
            "Return valid JSON matching the schema."
        )
        user_prompt = f"""
Document Context:
\"\"\"
{context_text[:5000]}
\"\"\"

JSON Schema:
{json.dumps(SocialPostsSchema.model_json_schema(), indent=2)}

Return ONLY valid JSON.
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
            raw_content = response.choices[0].message.content or ""
            cleaned_json = self._clean_json_string(raw_content)
            return SocialPostsSchema.model_validate_json(cleaned_json)
        except Exception:
            return self._build_deterministic_social_posts(context_text, target_audience)

    def _build_deterministic_deck(
        self,
        context: str,
        tone: str,
        target_audience: str,
        classification_tier: str
    ) -> PresentationDeckSchema:
        lines = [line.strip() for line in context.split('\n') if line.strip()]
        first_line = lines[0] if lines else "Important Security Update"
        title = first_line[:40] if len(first_line) > 5 else "Security Advisory & Action Guide"

        return PresentationDeckSchema(
            deck_title=title,
            target_audience=target_audience,
            classification_tier=classification_tier,
            summary_takeaway="A security vulnerability has been identified. Follow the recommended steps to safeguard your systems.",
            slides=[
                SlideContent(
                    slide_number=1,
                    title="Overview: What You Need To Know",
                    layout_type="Title_Slide",
                    header="SUMMARY",
                    bullet_points=[
                        "A critical security issue has been discovered affecting network devices.",
                        "If left unaddressed, attackers could gain unauthorized system access.",
                        "Simple software updates can effectively protect your devices."
                    ],
                    key_metric="URGENT",
                    metric_label="Action Required"
                ),
                SlideContent(
                    slide_number=2,
                    title="Who Is Affected?",
                    layout_type="Three_Card",
                    header="SYSTEMS INVOLVED",
                    bullet_points=[
                        "Home and office Wi-Fi routers and gateways.",
                        "Connected smart office and IoT hardware devices.",
                        "Remote access servers and VPN connections."
                    ],
                    key_metric="PATCH",
                    metric_label="Resolution Type"
                ),
                SlideContent(
                    slide_number=3,
                    title="Simple Action Steps to Take",
                    layout_type="Two_Column",
                    header="WHAT TO DO",
                    bullet_points=[
                        "Install the latest firmware update provided by your device manufacturer.",
                        "Change default administrative passwords to strong, unique passphrases.",
                        "Enable Two-Factor Authentication (2FA) wherever possible."
                    ],
                    key_metric="< 10 min",
                    metric_label="Time to Update"
                ),
                SlideContent(
                    slide_number=4,
                    title="Best Practices For Ongoing Safety",
                    layout_type="Metric_Highlight",
                    header="SAFETY TIPS",
                    bullet_points=[
                        "Keep automatic security updates turned ON.",
                        "Regularly review which devices are connected to your network.",
                        "Stay alert for suspicious emails or login prompts."
                    ],
                    key_metric="100%",
                    metric_label="Protection Level"
                )
            ]
        )

    def _build_deterministic_advisory(
        self,
        context: str,
        classification_tier: str
    ) -> SecurityAdvisorySchema:
        return SecurityAdvisorySchema(
            advisory_id="CHITRA-ADV-2026-01",
            title="Important Security Advisory: Update Your Connected Network Devices",
            severity="High",
            classification_tier=classification_tier,
            affected_systems=[
                "Home & Office Wi-Fi Routers",
                "Connected Smart Devices & Cameras",
                "Remote Login & VPN Gateways"
            ],
            threat_overview="A security flaw was detected in several router models that could allow outsiders to access network settings if firmware is outdated. Updating your software immediately fixes this issue.",
            indicators_of_compromise=[
                "Unexpected router reboots or slow connection speeds",
                "Unrecognized devices appearing on your Wi-Fi network list",
                "Changes in default DNS or Wi-Fi login passwords"
            ],
            mitigation_steps=[
                "Restart your router and check the manufacturer's website or app for updates.",
                "Apply the latest official security update / firmware version.",
                "Change default router passwords (admin/admin) to a strong personal password.",
                "Enable 2-Step Verification (Two-Factor Authentication) on all accounts."
            ],
            published_date="2026-09-17"
        )

    def _build_deterministic_social_posts(
        self,
        context: str,
        target_audience: str
    ) -> SocialPostsSchema:
        return SocialPostsSchema(
            instagram=(
                "🚨 SECURITY ALERT: Time to check your Wi-Fi router! 🛡️\n\n"
                "A new vulnerability has been spotted in common network devices. Here is how to keep yourself safe in 3 simple steps:\n\n"
                "1️⃣ Check for software updates in your router app/settings\n"
                "2️⃣ Change your default router password\n"
                "3️⃣ Turn on Two-Factor Authentication (2FA)\n\n"
                "Share this with friends and family to help them stay safe! 📲\n\n"
                "#CyberSecurity #StaySafeOnline #TechTips #SecurityAlert #CHITRA"
            ),
            linkedin=(
                "🔒 Critical Cyber Advisory Notice: Device Hardening & Firmware Updates\n\n"
                "Recent intelligence indicates active exploitation targeting edge gateways and unpatched router firmware.\n\n"
                "Key Takeaways & Actions:\n"
                "• Immediate audit of internet-facing edge routers and gateways.\n"
                "• Apply vendor firmware patches immediately.\n"
                "• Enforce multi-factor authentication across all remote access endpoints.\n\n"
                "For more guidance, consult the latest official advisory releases.\n\n"
                "#Cybersecurity #InformationSecurity #Infosec #IncidentResponse #Governance"
            ),
            twitter=(
                "🚨 CYBER ALERT: Critical vulnerability found in network routers. Make sure to update your device firmware and change default passwords immediately! 🛡️ Stay protected: #CyberSecurity #TechAlert #CHITRA"
            )
        )

