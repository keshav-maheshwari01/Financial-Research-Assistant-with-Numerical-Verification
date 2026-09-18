from fin_rag_assistant.retrieval.retriever import retrieve_chunks


def test_relevant_chunk_is_retrieved():
    results = retrieve_chunks("Why did gross margin fall in 2024?", company="Acme Retail Inc.", year=2024, top_k=3)
    assert len(results) >= 1
    assert any("gross margin".lower() in chunk["text"].lower() for chunk in results)


def test_year_filtering_works():
    results = retrieve_chunks("What happened in 2024?", company="Acme Retail Inc.", year=2024, top_k=5)
    assert all(chunk["year"] == 2024 for chunk in results)


def test_company_filtering_works():
    results = retrieve_chunks("Tell me about Acme Retail Inc.", company="Acme Retail Inc.", top_k=5)
    assert all(chunk["company"] == "Acme Retail Inc." for chunk in results)
