---
title: final-mbbs-clinical-simulator
type: project
classification: PORTFOLIO_PROJECT
last_commit: d0d3d9f297e252341f85a750bd7554abac24efee
---

# LK Final MBBS Clinical Case Simulator

## Executive Summary
The **LK Final MBBS Clinical Case Simulator** is an interactive, AI-powered medical examination training platform built for Sri Lankan medical students preparing for their Final MBBS Clinical Examinations (Long and Short Cases) VERIFIED (Source: `README.md`). The application provides a dual-phase simulation: first acting as a patient in a Sri Lankan teaching hospital ward who responds in the user's language (Sinhala, Singlish, or English), and second acting as an external examiner who evaluates the history taken by the student and conducts an interactive viva VERIFIED (Source: `README.md`, `app.py`).

---

## Technical Architecture & Implementation Details

### System Overview
The system is constructed as a single-page interactive application using **Streamlit** and the **Google GenAI SDK** using the `gemini-3.1-flash-lite` model VERIFIED (Source: `README.md`, `app.py`).

```
[Student Input (Text/Voice via Web Speech API)]
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│               Streamlit UI Engine               │
└───────────────────────┬─────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
   [Phase 1: PATIENT_SIM]   [Phase 2: EXAMINER_REVIEW]
            │                       │
            ▼                       ▼
  Google GenAI API         Google GenAI API
  (Patient Instruction)    (Examiner Critique & Viva)
            │                       │
            └───────────┬───────────┘
                        ▼
      [UI Response Render & Session State]
```

### Core Architecture Components

1. **State Management & Workflow Engine**
   - Streamlit session state (`st.session_state`) manages the execution stage (`PATIENT_SIM` vs. `EXAMINER_REVIEW`), selected case details, conversation log, and examiner review status VERIFIED (Source: `app.py`).
   - Typing **`done`** triggers the phase transition from patient history taking to examiner evaluation VERIFIED (Source: `README.md`, `app.py`).

2. **Multilingual Speech-to-Text Integration**
   - Implemented via a native JavaScript injection using Streamlit's `components.v1.html` VERIFIED (Source: `app.py`).
   - Uses the browser's native **Web Speech API** (`webkitSpeechRecognition`) set to locale `si-LK` to capture Sinhala, Singlish, or English speech VERIFIED (Source: `README.md`, `app.py`).
   - Automatically populates the chat input textarea, dispatches input events, and triggers an `Enter` keypress for hands-free auto-submission VERIFIED (Source: `README.md`, `app.py`).
   - Utilizes a persistent DOM check (`setInterval`) and cleans up redundant button instances across Streamlit re-renders VERIFIED (Source: `app.py`).

3. **Master Clinical Syllabus Engine**
   - Contains a clinical case database structured into 8 major categories spanning the undergraduate clinical syllabus VERIFIED (Source: `README.md`, `app.py`):
     - **Medicine Long Cases** (CVS, RS, GUT, GIT, Nervous & MS, Endocrine, Systemic, Haematological, Miscellaneous)
     - **Medicine Short Cases** (CVS, RS, GIT, Infections, Endocrine, Systemic, Nervous & MS, Miscellaneous)
     - **Surgery Long Cases** (Main, Head & Neck, Chest & Breast, Vascular, GIT, GUT)
     - **Surgery Short Cases** (Head & Neck, Paediatric Surgery, Malignancies, Orthopaedics, Chest & Breast, Vascular, Abdomen & Genitals, Limbs & Trunk, Miscellaneous)
     - **Paediatric Long Cases** (CVS, RS, Endocrine, Hematological, GIT, Systemic, GUT, Nervous & MS, Infectious, Miscellaneous)
     - **Paediatric Short Cases** (CVS, RS, GIT, CNS & MS, Skin, Haematological, Systemic, Neonatal EX)
     - **Gynecology Cases** (General)
     - **Obstetrics Cases** (General)
   - Diagnostic targets are randomly selected upon loading a new case, displaying only the Exam Category and System/Station to the student while keeping the actual diagnosis hidden VERIFIED (Source: `README.md`, `app.py`).

---

## Dual-Phase AI Simulation & Prompt Engineering

### Phase 1: Patient Simulation (`PATIENT_SIM`)
- **System Instruction Strategy:** The model is instructed to act as a patient in a Sri Lankan Teaching Hospital ward diagnosed with the hidden condition VERIFIED (Source: `app.py`).
- **Clinical Safeguards:** Strict prompt constraints forbid revealing clinical terms or exact diagnosis names VERIFIED (Source: `app.py`).
- **Language Mirroring Engine:**
  - **Sinhala Script:** Responds in colloquial Sinhala script using local ward phrasing (e.g., *"බඩ රිදෙනවා"*, *"කකුල් ඉදිමෙනවා"*, *"ක්ලිනික් කාඩ් එක"*) VERIFIED (Source: `app.py`).
  - **Singlish (Roman Script):** Responds in natural Singlish (e.g., *"bada ridenawa"*, *"hama duwiliyama hariyala nehe"*) VERIFIED (Source: `app.py`).
  - **English:** Responds in simple English with a realistic Sri Lankan persona VERIFIED (Source: `app.py`).
- **Conversational Realism:** Kept intentionally brief, disclosing deep history (medications, social, family) only upon explicit query VERIFIED (Source: `app.py`).

### Phase 2: Examiner Evaluation & Interactive Viva (`EXAMINER_REVIEW`)
- **Isolation of Assessment:** The evaluation prompt strips away patient responses and feeds **only the user's questions** into the prompt, forcing the AI examiner to rate the student purely on clinical history-taking strategy VERIFIED (Source: `README.md`, `app.py`).
- **Structured Feedback Output:**
  1. Conversational introduction directly addressing the student as "you" VERIFIED (Source: `app.py`).
  2. Positive reinforcement (*"WHAT YOU DID BRILLIANTLY"*) VERIFIED (Source: `app.py`).
  3. Gap analysis and clinical guidance (*"AREAS TO REFINE & HOW TO FIX THEM"*) targeting missed questions specific to the hidden diagnosis VERIFIED (Source: `app.py`).
  4. History-taking score percentage VERIFIED (Source: `app.py`).
  5. Interactive viva questions (differential diagnoses, bedside/lab tests, physical signs) to transition into discussion VERIFIED (Source: `app.py`).
- **Interactive Viva:** After the initial critique, subsequent user inputs are handled in an ongoing dialogue where the examiner probes clinical reasoning, management plans, and differentials VERIFIED (Source: `README.md`, `app.py`).

---

## UI/UX Design & Styling

- **Theme & Aesthetics:** Glassmorphic dark layout styled with custom CSS (`Plus Jakarta Sans` font, subtle gradient accents matching Sri Lankan colors `#FF9933` and `#138808`) VERIFIED (Source: `README.md`, `app.py`).
- **Visual Feedback:**
  - Pulsing CSS keyframe animation around a stethoscope icon in the sidebar VERIFIED (Source: `README.md`, `app.py`).
  - History Metrics card with dynamic color shifts (orange to green) tracking questions asked against a baseline threshold of 5 questions VERIFIED (Source: `README.md`, `app.py`).
  - Dynamic status badges showing active state (`PATIENT INTERVIEW ACTIVE` vs. `EXAMINER REVIEW ACTIVE`) VERIFIED (Source: `app.py`).
  - Microphone button pulses red when active recording is detected VERIFIED (Source: `app.py`).

---

## Tech Stack & Dependencies

| Category | Technology | Usage / Purpose |
|---|---|---|
| Language | Python 3.11 | Core runtime environment VERIFIED (Source: `.devcontainer/devcontainer.json`, `app.py`) |
| Web Framework | Streamlit (>= 1.31) | UI application rendering and session handling VERIFIED (Source: `requirements.txt`, `app.py`) |
| LLM API | `google-genai` SDK | Accessing `gemini-3.1-flash-lite` model VERIFIED (Source: `requirements.txt`, `app.py`) |
| Speech Recognition | Web Speech API (`webkitSpeechRecognition`) | Embedded browser speech-to-text in JS VERIFIED (Source: `README.md`, `app.py`) |
| Styling | Vanilla CSS / HTML Injection | Custom glassmorphism, animations, layout overrides VERIFIED (Source: `README.md`, `app.py`) |
| Dev Environment | Devcontainers / VS Code Codespaces | Pre-configured Python 3.11 Bookworm container VERIFIED (Source: `.devcontainer/devcontainer.json`) |

---

## Key Challenges & Mitigations

1. **Streamlit Component DOM Destruction on Rerun**
   - *Problem:* Streamlit re-renders destroy iframe contexts, which previously caused custom microphone DOM buttons to lose click handlers or duplicate on screen VERIFIED (Source: `app.py`).
   - *Solution:* Implemented explicit removal of existing button instances (`oldBtn.remove()`) and re-binding click listeners to a newly created button element inside a persistent interval loop (`setInterval`) VERIFIED (Source: `app.py`).

2. **Audio Generation Latency Overhead**
   - *Problem:* Generating AI voice audio (e.g., via Text-to-Speech engines) introduced significant response latency and instability VERIFIED (Source: `README.md`).
   - *Solution:* Removed text-to-speech dependencies (e.g., `gTTS`), using hands-free voice input combined with instant text responses VERIFIED (Source: `README.md`).

3. **Language Consistency Control**
   - *Problem:* General LLMs often output formal or book-language Sinhala, which does not reflect hospital ward interactions VERIFIED (Source: `app.py`).
   - *Solution:* Engineered explicit system prompts detailing ward-specific colloquial Sinhala phrases (e.g., *"බඩ රිදෙනවා"*, *"කකුල් ඉදිමෙනවා"*) and exact script-matching rules VERIFIED (Source: `app.py`).

---

## Author's Role & Contribution

INFERRED: The repository represents an individually developed, specialized end-to-end medical simulator targeting Sri Lankan medical curricula. Key architectural contributions include:
- System prompt design enforcing medical knowledge isolation and language mirroring.
- Curation and structuring of the Sri Lankan Final MBBS clinical syllabus across 8 exam categories.
- JavaScript bridge integrating browser-native speech recognition directly into Streamlit's chat interface.
- Phase-transition architecture enabling seamless handover between patient roleplay and examiner evaluation.

---

## Environment Setup & Run Instructions

### 1. Installation
```bash
git clone <repository-url>
cd final-mbbs-clinical-simulator
pip install -r requirements.txt
```
VERIFIED (Source: `README.md`)

### 2. Secrets Configuration
Create `.streamlit/secrets.toml`:
```toml
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
```
VERIFIED (Source: `README.md`, `app.py`)

### 3. Running Application
```bash
streamlit run app.py
```
Application serves by default at `http://localhost:8501` VERIFIED (Source: `.devcontainer/devcontainer.json`, `README.md`).
