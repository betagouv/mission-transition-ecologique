# TEE : ETL package documentation

# How to use

Docker has been setup to easily use the package.
It's been integrated with NX to have a very simple experience.

From the root project directory or the etl directory, you can
nx run update:database

You can check the full list of commands from the libs/etl/project.json file

# How to contribute

Docker has been setup only to ensure a controlled deployment.
Right now, you must rebuild the docker image each time your code change to test it.

Instead, we recommend, setting up a local python virtual environment :

All the commands below should be executed in libs/etl

To create your virtual environment :
python -m venv .venv

To use it :
. ./.venv/bin/activate

To install the packages :
pip install -r requirements.txt

After a package update, and after a verification that it does not break anything, to ensure that everyone is using the same packages :
pip freeze > requirements.txt

## To test locally or to work on the scripts

- in your environnement, variable set TEST=true

Possible improvements :

- setup a fixed python version for all devs
- use a docker test database instead of a test schema in the production database.
