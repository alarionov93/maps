default:
	python3 run.py

test:
	python3 -m pytest -v ./app/**/test*.py
