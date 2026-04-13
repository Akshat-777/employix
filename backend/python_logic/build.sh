#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing dependencies ---"
pip install -r requirements.txt

echo "--- Downloading SpaCy model ---"
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl

echo "--- Build complete ---"
