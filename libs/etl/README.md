# TEE : ETL package documentation

All the commands below should be executed in libs/etl

To create your virtual environment : 
python -m venv .venv

To use it : 
. ./.venv/bin/activate

To install the packages : 
pip install -r requirements.txt


After a package update, and after a verification that it does not break anything, to ensure that everyone is using the same packages : 
pip freeze > requirements.txt
