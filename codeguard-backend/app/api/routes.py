import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.report_model import Report
from app.schemas.request_response import CodeRequest, AnalyzeResponse, Issue
from app.utils.language_detector import detect_language
from app.analyzers.python_analyzer import PythonAnalyzer
from app.analyzers.js_analyzer import JSAnalyzer
from app.llm.llm_engine import LLMEngine
from app.services.scoring import calculate_score, calculate_severity_breakdown
from app.services.aggregator import aggregate_issues
from app.models.user_model import User
from app.schemas.request_response import UserCreate, UserResponse, Token
import bcrypt

router = APIRouter()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already taken")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # We omit actual JWT signing for brevity and just return a token that is stored in frontend matching current non-protected API.
    return {"token": f"jwt_token_for_{user.email}"}


@router.post("/analyze")
def analyze_code_endpoint(request: CodeRequest, db: Session = Depends(get_db)):
    try:
        print("Incoming code:", request.code)
        
        from app.analyzers.code_analyzer import analyze_code
        issues = analyze_code(request.code)
        
        print("Generated issues:", issues)
        
        # Save to database
        try:
            lang = detect_language(request.code)
            issues_dict = {
                "static_issues": issues,
                "ai_issues": [],
                "summary": "Static analysis complete",
                "llm_status": "success"
            }
            db_report = Report(
                language=lang,
                score=100.0,
                severity_breakdown=json.dumps({}),
                issues_json=json.dumps(issues_dict)
            )
            db.add(db_report)
            db.commit()
            db.refresh(db_report)
            print(f"Successfully saved Analysis Report (ID: {db_report.id}) to database.")
        except Exception as db_err:
            print("Database save error:", db_err)
            
        return issues
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Error during analysis:", e)
        return []

@router.get("/reports")
def get_reports(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.timestamp.desc()).offset(skip).limit(limit).all()
    
    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "language": r.language,
            "score": r.score,
            "timestamp": r.timestamp,
            "severity_breakdown": json.loads(r.severity_breakdown) if r.severity_breakdown else {}
        })
    return result

@router.get("/report/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    issues_data = json.loads(report.issues_json) if report.issues_json else {}
    
    return {
        "id": report.id,
        "language": report.language,
        "score": report.score,
        "timestamp": report.timestamp,
        "severity_breakdown": json.loads(report.severity_breakdown),
        "static_issues": issues_data.get("static_issues", []),
        "ai_issues": issues_data.get("ai_issues", []),
        "summary": issues_data.get("summary", ""),
        "llm_status": issues_data.get("llm_status", "unknown")
    }

@router.get("/results")
def get_results(db: Session = Depends(get_db)):
    latest_report = db.query(Report).order_by(Report.timestamp.desc()).first()
    if not latest_report:
        print("No reports found in DB")
        return {"issues": []}
    
    issues_data = json.loads(latest_report.issues_json) if latest_report.issues_json else {}
    static_issues = issues_data.get("static_issues", [])
    ai_issues = issues_data.get("ai_issues", [])
    
    combined_issues = []
    
    def transform_issue(issue, default_type):
        return {
            "type": issue.get("type", default_type),
            "severity": issue.get("severity", "Medium"),
            "description": issue.get("description", ""),
            "line_number": issue.get("line_number", 0)
        }
        
    print(f"Loading results: {len(static_issues)} static, {len(ai_issues)} AI")
        
    for issue in static_issues:
        combined_issues.append(transform_issue(issue, "Static Analysis"))
    for issue in ai_issues:
        combined_issues.append(transform_issue(issue, "AI Analysis"))
        
    return {"issues": combined_issues}
