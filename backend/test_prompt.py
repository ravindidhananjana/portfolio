from app.agent.prompts import build_agent_prompt


def test_prompt_guides_elara_to_answer_like_a_chatbot_not_raw_chunks():
    prompt = build_agent_prompt(
        "Tell me about Ravindi's work",
        [{
            "source": "profile.md",
            "score": 0.92,
            "text": "Ravindi is a machine learning engineer and researcher.",
        }],
    )

    assert "You are Elara" in prompt
    assert "Never dump the retrieved chunks" in prompt
    assert "Write a natural, conversational answer" in prompt
    assert "Elara's Response:" in prompt
