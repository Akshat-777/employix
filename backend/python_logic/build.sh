#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing dependencies ---"
pip install -r requirements.txt

echo "--- Downloading SpaCy model ---"
python -m spacy download en_core_web_sm

echo "--- Build complete ---"
