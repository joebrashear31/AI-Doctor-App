from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class SymptomInput(BaseModel):
    age: int
    sex: Optional[str] = None
    symptoms: str
    duration: Optional[str] = None
    meds: List[str] = []
    conditions: List[str] = []

class TriageOut(BaseModel):
    risk: Literal["emergency", "urgent", "routine"]
    next_step: Literal["call_emergency", "urgent_care_24h", "self_care"]
    red_flags: List[str] = []
    disclaimer: str

class AdviceStep(BaseModel):
    step: str
    details: str

class AdviceOut(BaseModel):
    advice: List[AdviceStep]
    when_to_seek_care: List[str]
    disclaimer: str

class ReferralSpecialty(BaseModel):
    name: str
    reason: str

class ReferralOut(BaseModel):
    suggested_specialties: List[ReferralSpecialty]
    pre_referral_workup: List[str]
    priority: Literal["routine", "expedited"]

class RxCandidate(BaseModel):
    drug_class: str
    example: str
    use_case: str
    contraindications: List[str]
    monitoring: List[str]

class RxDraftOut(BaseModel):
    candidates: List[RxCandidate]
    notes: str
