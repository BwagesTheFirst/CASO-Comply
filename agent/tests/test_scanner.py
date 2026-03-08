# agent/tests/test_scanner.py
import pytest
from pathlib import Path
from agent.scanner import scan_folder, compute_file_hash

def test_scan_folder_finds_pdfs(tmp_path):
    (tmp_path / "doc1.pdf").write_bytes(b"%PDF-fake")
    (tmp_path / "doc2.pdf").write_bytes(b"%PDF-fake2")
    (tmp_path / "readme.txt").write_text("not a pdf")
    sub = tmp_path / "subdir"
    sub.mkdir()
    (sub / "nested.pdf").write_bytes(b"%PDF-nested")

    results = scan_folder(str(tmp_path))
    paths = [r["path"] for r in results]
    assert len(results) == 3
    assert str(tmp_path / "doc1.pdf") in paths
    assert str(sub / "nested.pdf") in paths

def test_scan_folder_includes_hash(tmp_path):
    (tmp_path / "test.pdf").write_bytes(b"%PDF-content")
    results = scan_folder(str(tmp_path))
    assert results[0]["sha256"]
    assert len(results[0]["sha256"]) == 64

def test_compute_file_hash_deterministic(tmp_path):
    f = tmp_path / "a.pdf"
    f.write_bytes(b"hello world")
    h1 = compute_file_hash(str(f))
    h2 = compute_file_hash(str(f))
    assert h1 == h2

def test_scan_empty_folder(tmp_path):
    results = scan_folder(str(tmp_path))
    assert results == []

def test_scan_nonexistent_folder():
    results = scan_folder("/nonexistent/path")
    assert results == []
