# TEE : ETL package documentation

# How to use

Docker has been setup to easily use the package.
It's been integrated with NX to have a very simple experience.

From the root project directory or the etl directory, you can 
`npm run etl:build`
`npm run update:database`

You can check the full list of commands from the libs/etl/project.json file

# How to contribute

The docker setup is usable in a development settings. 
After running `npm run etl:build`, you can simply modify the python file and execute them inside the docker environement using `npm run update:database`

If you are proposing an unrequested contribution, please start by opening an issue in the following [github repository](https://github.com/betagouv/mission-transition-ecologique).
If your contribution is answering an issue of the repository, feel free to directly open a pull request which will be reviewed by a member of the project.


### To test locally or to work on the scripts

- in the .env file, set the variable `TEST=True`

## Notes

In postgreSQL, when UserA creates a schema, only UserA and Superusers have access to the schema. If we recreate the production database from scratch, don't forget to grant the correct rights to every user that needs it (or better, define a 'production' role and attribute the role to the corresponding users)
