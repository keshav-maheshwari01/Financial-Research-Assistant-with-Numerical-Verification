from types import SimpleNamespace

from fin_rag_assistant.qa import synthesizer


class FakeCompletions:
    def create(self, **kwargs):
        assert kwargs["model"] == "test-model"
        assert kwargs["temperature"] == 0
        return SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content="Groq verified answer."))]
        )


class FakeGroq:
    def __init__(self, api_key, timeout, max_retries):
        assert api_key == "test-key"
        assert timeout == 20.0
        assert max_retries == 1
        self.chat = SimpleNamespace(completions=FakeCompletions())


def test_synthesizer_uses_groq_when_configured(monkeypatch):
    monkeypatch.setattr(synthesizer, "GROQ_API_KEY", "test-key")
    monkeypatch.setattr(synthesizer, "GROQ_MODEL", "test-model")
    monkeypatch.setitem(__import__("sys").modules, "groq", SimpleNamespace(Groq=FakeGroq))

    result = synthesizer.synthesize_answer(
        "What was revenue growth?",
        [{"metric": "revenue_growth", "value": 10.46, "unit": "%"}],
        [],
    )

    assert result == "Groq verified answer."


def test_synthesizer_falls_back_without_key(monkeypatch):
    monkeypatch.setattr(synthesizer, "GROQ_API_KEY", "")

    result = synthesizer.synthesize_answer(
        "What was revenue growth?",
        [{"metric": "revenue_growth", "value": 10.46, "unit": "%", "formula": "growth"}],
        [],
    )

    assert result.startswith("Revenue Growth: 10.46%")
