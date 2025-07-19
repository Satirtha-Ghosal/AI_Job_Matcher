from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import faiss
import numpy as np
import pandas as pd
from utils import model, normalize_skills_fast, clean_skill
from sentence_transformers import util
from huggingface_hub import hf_hub_download
import os

# Ensure HF cache uses writeable directory
os.environ["HF_HOME"] = "/data/.cache/huggingface"
os.environ["TRANSFORMERS_CACHE"] = "/data/.cache/huggingface/transformers"
os.environ["HF_HUB_CACHE"] = "/data/.cache/huggingface/hub"


# Download and load utility files from Hugging Face Hub
csv_path = hf_hub_download(repo_id="Satirtha-Ghosal/JobMatcher", filename="final_jobs.csv", repo_type="model")
index_path = hf_hub_download(repo_id="Satirtha-Ghosal/JobMatcher", filename="faiss_jobs_cleaned.index", repo_type="model")
title_index_path = hf_hub_download(repo_id="Satirtha-Ghosal/JobMatcher", filename="faiss_titles.index", repo_type="model")

df = pd.read_csv(csv_path)
df["normalized_skills"] = df["normalized_skills"].apply(lambda x: eval(x))
index = faiss.read_index(index_path)
title_index = faiss.read_index(title_index_path)

app = FastAPI()


class SkillRequest(BaseModel):
    skills: List[str]

@app.post("/match_jobs")
def match_jobs(req: SkillRequest):
    user_skills = req.skills
    norm_skills = normalize_skills_fast(user_skills)
    user_embedding = model.encode([" ".join(norm_skills)])

    distances, indices = index.search(user_embedding, 10)
    candidate_jobs = df.iloc[indices[0]].copy()

    def find_missing_skills(job_skills, user_skills, threshold=0.5):
        user_embeddings = model.encode(user_skills, convert_to_tensor=True)
        missing = []
        for skill in job_skills:
            skill_emb = model.encode(skill, convert_to_tensor=True)
            sim = util.cos_sim(skill_emb, user_embeddings)
            if sim.max().item() < threshold:
                missing.append(skill.title())
        return missing

    def find_matched_skills(job_skills, user_skills, threshold=0.5):
        user_embeddings = model.encode(user_skills, convert_to_tensor=True)
        matched = []
        for job_skill in job_skills:
            job_skill_clean = clean_skill(job_skill)
            if not job_skill_clean:
                continue
            job_emb = model.encode(job_skill_clean, convert_to_tensor=True)
            sim_scores = util.cos_sim(job_emb, user_embeddings)
            if sim_scores.max().item() >= threshold:
                matched.append(job_skill_clean.title())
        return matched
    
    def compute_custom_score(job_skills, user_skills, missing_skills):
        total = len(job_skills)
        matched = total - len(missing_skills)
        score = matched / total if total else 0
        if len(user_skills) > total:
            score += 0.05 * (len(user_skills) - total)
        score -= 0.1 * len(missing_skills)
        return score

    scored = []
    for _, row in candidate_jobs.iterrows():
        job_skills = row["normalized_skills"]
        missing = find_missing_skills(job_skills, norm_skills)
        matched = find_matched_skills(job_skills, norm_skills)
        score = compute_custom_score(job_skills, norm_skills, missing)
        scored.append({
            "job_title": row["job_title"],
            "matched_skills": matched,
            "missing_skills": missing,
            "score": round(score, 2),
            "id": row["id"]
        })

    sorted_jobs = sorted(scored, key=lambda x: x["score"], reverse=True)
    return sorted_jobs[:10]

class TitleSkillRequest(BaseModel):
    job_title: str
    skills: List[str]

@app.post("/match_jobs_by_title")
def match_jobs_by_title(req: TitleSkillRequest):
    job_title = req.job_title
    user_skills = req.skills

    norm_skills = normalize_skills_fast(user_skills)

    title_embedding = model.encode([job_title])

    # Search title index
    distances, indices = title_index.search(title_embedding, 10)
    candidate_jobs = df.iloc[indices[0]].copy()

    def find_missing_skills(job_skills, user_skills, threshold=0.5):
        user_embeddings = model.encode(user_skills, convert_to_tensor=True)
        missing = []
        for skill in job_skills:
            skill_emb = model.encode(skill, convert_to_tensor=True)
            sim = util.cos_sim(skill_emb, user_embeddings)
            if sim.max().item() < threshold:
                missing.append(skill.title())
        return missing
    
    def find_matched_skills(job_skills, user_skills, threshold=0.5):
        user_embeddings = model.encode(user_skills, convert_to_tensor=True)
        matched = []
        for job_skill in job_skills:
            job_skill_clean = clean_skill(job_skill)
            if not job_skill_clean:
                continue
            job_emb = model.encode(job_skill_clean, convert_to_tensor=True)
            sim_scores = util.cos_sim(job_emb, user_embeddings)
            if sim_scores.max().item() >= threshold:
                matched.append(job_skill_clean.title())
        return matched

    def compute_custom_score(job_skills, user_skills, missing_skills):
        total = len(job_skills)
        matched = total - len(missing_skills)
        score = matched / total if total else 0
        if len(user_skills) > total:
            score += 0.05 * (len(user_skills) - total)
        score -= 0.1 * len(missing_skills)
        return score


    scored = []
    for _, row in candidate_jobs.iterrows():
        job_skills = row["normalized_skills"]
        missing = find_missing_skills(job_skills, norm_skills)
        matched = find_matched_skills(job_skills, norm_skills)
        score = compute_custom_score(job_skills, norm_skills, missing)
        scored.append({
            "job_title": row["job_title"],
            "matched_skills": matched,
            "missing_skills": missing,
            "score": round(score, 2),
            "id": row["id"]
        })

    sorted_jobs = sorted(scored, key=lambda x: x["score"], reverse=True)
    return sorted_jobs[:10]


class JobEvaluationRequest(BaseModel):
    skills: List[str]
    job_ids: List[str]

@app.post("/evaluate_selected_jobs")
def evaluate_selected_jobs(req: JobEvaluationRequest):
    user_skills = req.skills
    job_ids = req.job_ids

    # Normalize user skills
    norm_skills = normalize_skills_fast(user_skills)

    def find_missing_skills(job_skills, user_skills, threshold=0.5):
        user_embeddings = model.encode(user_skills, convert_to_tensor=True)
        missing = []
        for skill in job_skills:
            skill_emb = model.encode(skill, convert_to_tensor=True)
            sim = util.cos_sim(skill_emb, user_embeddings)
            if sim.max().item() < threshold:
                missing.append(skill.title())
        return missing

    def find_matched_skills(job_skills, user_skills, threshold=0.5):
        user_embeddings = model.encode(user_skills, convert_to_tensor=True)
        matched = []
        for job_skill in job_skills:
            job_skill_clean = clean_skill(job_skill)
            if not job_skill_clean:
                continue
            job_emb = model.encode(job_skill_clean, convert_to_tensor=True)
            sim_scores = util.cos_sim(job_emb, user_embeddings)
            if sim_scores.max().item() >= threshold:
                matched.append(job_skill_clean.title())
        return matched

    results = []
    for job_id in job_ids:
        job_id = int(job_id)
        row = df[df["id"] == job_id]
        if row.empty:
            continue  # skip if ID not found

        row = row.iloc[0]
        job_skills = row["normalized_skills"]
        matched = find_matched_skills(job_skills, norm_skills)
        missing = find_missing_skills(job_skills, norm_skills)

        results.append({
            "id": job_id,
            "job_title": row["job_title"],
            "matched_skills": matched,
            "missing_skills": missing
        })

    return results

