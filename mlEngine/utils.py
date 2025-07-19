import re
import numpy as np
from sentence_transformers import SentenceTransformer, util
import pickle
from huggingface_hub import hf_hub_download
import os

# Ensure HF cache uses writeable directory
os.environ["HF_HOME"] = "/tmp/huggingface"


model = SentenceTransformer('all-MiniLM-L6-v2')

# Download skill_to_embedding.pkl from HF hub
pkl_path = hf_hub_download(
    repo_id="Satirtha-Ghosal/JobMatcher",
    filename="skill_to_embedding.pkl",
    repo_type="model"
)

with open(pkl_path, "rb") as f:
    skill_to_embedding = pickle.load(f)



def clean_skill(skill):
    skill = skill.lower().strip()
    skill = re.sub(r"[^a-z0-9+.#\- ]", "", skill)
    skill = re.sub(r"\s+", " ", skill)
    return skill

def normalize_skills_fast(skill_list_raw, threshold=0.8):
    skill_list = list(set([clean_skill(s) for s in skill_list_raw if s.strip()]))
    if not skill_list:
        return []

    clustered = []
    used = set()
    for i, skill_i in enumerate(skill_list):
        if i in used or skill_i not in skill_to_embedding:
            continue
        group = [skill_i]
        used.add(i)
        for j in range(i + 1, len(skill_list)):
            if j in used:
                continue
            skill_j = skill_list[j]
            if skill_j not in skill_to_embedding:
                continue
            sim = util.cos_sim(skill_to_embedding[skill_i], skill_to_embedding[skill_j])
            if sim.item() >= threshold:
                group.append(skill_j)
                used.add(j)
        clustered.append(min(group, key=len))
    return list(set(clustered))
