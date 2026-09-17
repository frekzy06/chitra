import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from api.schemas import SecurityAdvisorySchema

class PDFPrintingPress:
    def __init__(self):
        pass

    def create_advisory_pdf(self, data: SecurityAdvisorySchema, output_path: str) -> str:
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        
        # Custom Paragraph Styles
        header_style = ParagraphStyle(
            'GovHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0F172A"),
            alignment=TA_LEFT
        )
        
        sub_header_style = ParagraphStyle(
            'GovSubHeader',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#64748B"),
            alignment=TA_LEFT
        )

        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#1E293B"),
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'BodyDark',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155")
        )

        bullet_style = ParagraphStyle(
            'BulletDark',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#334155"),
            leftIndent=15
        )

        story = []

        # 1. Header Banner Box
        banner_color = colors.HexColor("#DC2626") if data.severity.lower() == "critical" else colors.HexColor("#D97706")
        header_data = [
            [
                Paragraph(f"<b>NATIONAL CYBERSECURITY ADVISORY</b><br/><font size='9' color='#64748B'>GOVERNMENT OF INDIA // AIR-GAPPED INTELLIGENCE RELEASE</font>", header_style),
                Paragraph(f"<font color='{banner_color.hexval()}'><b>SEVERITY: {data.severity.upper()}</b></font><br/><font size='8.5' color='#64748B'>ID: {data.advisory_id}</font>", ParagraphStyle('RAlign', parent=sub_header_style, alignment=TA_RIGHT))
            ]
        ]
        t_header = Table(header_data, colWidths=[340, 190])
        t_header.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t_header)
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#CBD5E1"), spaceAfter=14))

        # Title
        story.append(Paragraph(f"<b>{data.title}</b>", header_style))
        story.append(Spacer(1, 10))

        # Metadata Table
        meta_data = [
            [
                Paragraph("<b>Classification:</b>", body_style), Paragraph(data.classification_tier, body_style),
                Paragraph("<b>Date Published:</b>", body_style), Paragraph(data.published_date or "2026-09-17", body_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[90, 160, 90, 190])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 14))

        # Threat Overview
        story.append(Paragraph("1. Threat & Vulnerability Overview", section_heading))
        story.append(Paragraph(data.threat_overview, body_style))
        story.append(Spacer(1, 12))

        # Affected Systems
        story.append(Paragraph("2. Target & Affected Systems", section_heading))
        for item in data.affected_systems:
            story.append(Paragraph(f"• &nbsp; {item}", bullet_style))
        story.append(Spacer(1, 12))

        # Indicators of Compromise (IOC)
        story.append(Paragraph("3. Verified Indicators of Compromise (IoC)", section_heading))
        for item in data.indicators_of_compromise:
            story.append(Paragraph(f"• &nbsp; <font name='Courier'>{item}</font>", bullet_style))
        story.append(Spacer(1, 12))

        # Mitigation & Remediation
        story.append(Paragraph("4. Statutory Remediation & Immediate Action Checklist", section_heading))
        for idx, item in enumerate(data.mitigation_steps, start=1):
            story.append(Paragraph(f"<b>[{idx}]</b> &nbsp; {item}", bullet_style))
        story.append(Spacer(1, 18))

        # Footer Notice
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
        footer_text = Paragraph(
            f"<font size='8' color='#94A3B8'>NITROUS ENGINE AIR-GAPPED GENERATION // SOVEREIGN SECURITY DIRECTIVE // STRICT CLASSIFICATION: {data.classification_tier.upper()}</font>",
            ParagraphStyle('Footer', parent=styles['Normal'], alignment=TA_CENTER)
        )
        story.append(footer_text)

        doc.build(story)
        return output_path
