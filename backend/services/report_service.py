import os
import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

is_serverless = os.getenv("VERCEL") == "1" or os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None
if is_serverless:
    REPORTS_DIR = os.path.join("/tmp", "reports")
else:
    REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "reports")

try:
    os.makedirs(REPORTS_DIR, exist_ok=True)
except OSError:
    REPORTS_DIR = os.path.join("/tmp", "reports")
    os.makedirs(REPORTS_DIR, exist_ok=True)


class ReportService:
    @staticmethod
    def generate_pdf(report_data: Dict[str, Any]) -> str:
        timestamp_slug = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"ClimateCascade_Stress_Report_{timestamp_slug}.pdf"
        filepath = os.path.join(REPORTS_DIR, filename)

        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Primary enterprise colors matching ClimateCascade
        PRIMARY_GREEN = colors.HexColor("#167A5B")
        DARK_GREEN = colors.HexColor("#0D4A36")
        LIGHT_BG = colors.HexColor("#F4F7F5")
        TEXT_DARK = colors.HexColor("#1A202C")
        MUTED_TEXT = colors.HexColor("#4A5568")
        BORDER_COLOR = colors.HexColor("#DCE5E0")
        ALERT_AMBER = colors.HexColor("#D97706")

        # Custom Paragraph Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=DARK_GREEN
        )
        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=MUTED_TEXT
        )
        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=PRIMARY_GREEN,
            spaceBefore=10,
            spaceAfter=4
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=TEXT_DARK
        )
        body_bold = ParagraphStyle(
            "BodyBold",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=13.5,
            textColor=TEXT_DARK
        )
        callout_style = ParagraphStyle(
            "Callout",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=DARK_GREEN
        )

        elements = []

        # Header Banner
        header_table = Table([
            [
                Paragraph("<b>CLIMATECASCADE</b><br/><font size=8 color='#4A5568'>Operational Climate Intelligence Command Center</font>", body_style),
                Paragraph(f"<b>CONFIDENTIAL OPERATIONAL AUDIT</b><br/><font size=8 color='#4A5568'>Generated: {datetime.datetime.utcnow().strftime('%d %b %Y, %H:%M UTC')}</font>", ParagraphStyle("RightH", parent=body_style, alignment=2))
            ]
        ], colWidths=[3.8 * inch, 3.8 * inch])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6)
        ]))
        elements.append(header_table)
        elements.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_GREEN, spaceAfter=14))

        # Title
        elements.append(Paragraph("Operational Climate Stress & Intervention Analysis", title_style))
        elements.append(Paragraph("Enterprise Stress Simulation Report • Bharat Manufacturing Industries (Sanand & Chakan Clusters)", subtitle_style))
        elements.append(Spacer(1, 12))

        # Executive Summary Box
        summary_text = (
            "<b>EXECUTIVE SUMMARY:</b> Under a projected +4.0°C Extreme Heatwave scenario across Gujarat Industrial corridors, "
            "ClimateCascade models identify an operational cascading failure sequence initiated at the <b>Plant 1 Chilled Water Cooling System</b>. "
            "Without proactive intervention, the cooling shortfall induces a 45% production throttling on <b>Line 2</b>, depleting finished goods inventory of <b>SKU-17</b> "
            "and placing <b>37 confirmed OEM customer consignments at direct SLA risk</b>. "
            "Total unmitigated financial exposure is estimated at <b>₹18,60,000 (₹18.6L)</b>. "
            "Deploying the recommended intervention—<b>shifting 18% production to Plant 2 (Chakan) and pre-stocking Raw Material X by 2 days</b>—"
            "successfully curtails exposure to <b>₹7,40,000</b>, delivering an avoided loss of <b>₹11,20,000 (₹11.2L)</b> at a net intervention cost of ₹1,80,000."
        )
        callout_data = [[Paragraph(summary_text, callout_style)]]
        callout_table = Table(callout_data, colWidths=[7.4 * inch])
        callout_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
            ('BOX', (0, 0), (-1, -1), 1, PRIMARY_GREEN),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(callout_table)
        elements.append(Spacer(1, 14))

        # Key Metrics Table
        elements.append(Paragraph("Key Simulation Metrics (Before vs. After Intervention)", h2_style))
        metrics_data = [
            ["Metric Parameter", "Without Intervention", "With Recommended Action", "Net Operational Variance"],
            ["First Operational Failure", "Cooling Capacity (450kW Chiller)", "Cooling Load Derated & Stabilized", "Thermal Trip Averted"],
            ["Critical Network Nodes", "4 Nodes at Breach Risk", "1 Node (Marginal Warning)", "-3 Critical Nodes (-75%)"],
            ["Customer Orders at SLA Risk", "37 Consignments (Tier-1 OEMs)", "11 Consignments (Rescheduled)", "26 Consignments Protected"],
            ["Operational & Delay Loss", "₹13,40,000", "₹5,20,000", "-₹8,20,000"],
            ["Contractual SLA Penalty Exposure", "₹5,20,000", "₹2,20,000", "-₹3,00,000"],
            ["Estimated Total Exposure", "₹18,60,000 (₹18.6L)", "₹7,40,000 (₹7.4L)", "₹11,20,000 Avoided (-60.2%)"],
            ["Intervention Implementation Cost", "₹0", "₹1,80,000", "Net ROI: 6.2x Net Benefit"]
        ]
        metrics_table = Table(metrics_data, colWidths=[2.2 * inch, 1.8 * inch, 1.8 * inch, 1.6 * inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_GREEN),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8.5),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('TOPPADDING', (0, 1), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
        ]))
        elements.append(metrics_table)
        elements.append(Spacer(1, 14))

        # First Failure & Cascade Propagation Chain
        elements.append(Paragraph("Discovered Operational Cascade Sequence", h2_style))
        cascade_data = [
            ["Stage", "Operational Node", "Disruption Mechanism", "Calculated Local Impact"],
            ["1. Climate Stress", "Extreme Heat (+4°C Anomaly)", "Ambient wet/dry bulb reaches 44.8°C for 72h", "Heat load exceeds site threshold by 2.8°C"],
            ["2. First Failure", "Cooling Capacity (450kW Chiller)", "Condensing limit exceeded; derate triggers", "Chiller capacity drops 38% (to 279kW)"],
            ["3. Line Throttle", "Production Line 2 (Sanand)", "Spindle thermal limits trip line safeguard", "Production throughput throttled by 45%"],
            ["4. SKU Deficit", "SKU-17 (Gen-4 Actuator)", "Assembly output drops from 95 to 52 units/day", "378-unit cumulative assembly shortfall"],
            ["5. Delivery SLA", "37 Tier-1 Customer Orders", "Dispatches breach contractual shipment windows", "SLA delay clauses trigger across 37 orders"],
            ["6. Financial Hit", "Revenue & P&L Exposure", "Compound delay penalties and idle overheads", "₹18,60,000 gross financial exposure"]
        ]
        cascade_table = Table(cascade_data, colWidths=[1.1 * inch, 1.9 * inch, 2.5 * inch, 1.9 * inch])
        cascade_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), DARK_GREEN),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('TOPPADDING', (0, 1), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
        ]))
        elements.append(cascade_table)
        elements.append(Spacer(1, 14))

        # Model Assumptions & Regulatory Notice
        elements.append(Paragraph("Deterministic Calculation Basis & Assumptions", h2_style))
        assumptions_text = (
            "<b>Calculation Framework:</b> Risk = Exposure × Vulnerability × Dependency. Cascade impact propagates along directed dependency edges: "
            "CascadeImpact_j += Risk_i × DependencyWeight_ij.<br/>"
            "<b>Assumptions:</b><br/>"
            "• Operational Loss is calculated from unfulfilled assembly quantities multiplied by unit gross contribution margin.<br/>"
            "• SLA penalty rates conform to standard Tier-1 Automotive supply agreements (clause 14.2) averaging ₹28,500/order/day.<br/>"
            "• Plant 2 (Chakan) has 24% uncommitted line headroom with verified tooling interchangeability within 24-hour setup.<br/>"
            "• <i>Data Disclaimer: All stress scenario figures are calibrated synthetic simulations for enterprise operational resilience planning.</i>"
        )
        elements.append(Paragraph(assumptions_text, body_style))

        # Build document
        doc.build(elements)
        return filename
