# TEE : ETL package documentation

# How to use

Docker has been setup to easily use the package.
It's been integrated with NX to have a very simple experience.

From the root project directory or the etl directory, you can 
`npm run build:etl`
`npm run database:update`

You can check the full list of commands from the libs/etl/project.json file

# How to contribute

The docker container must be used while developing too. 

While working on the package, in the .env file, set the variable `TEST=True`

To create the docker container : 
`npm run build:etl`

To then execute a file with your latest modifications taken into acount : 
`npm run docker-python -- mydir.myfile` (module )
for exemple : `npm run docker-python -- db.init_db`

You can also execute the database update: 
`npm run database:update`

If you are proposing an unrequested contribution, please start by opening an issue in the following [github repository](https://github.com/betagouv/mission-transition-ecologique).
If your contribution is answering an issue of the repository, feel free to directly open a pull request which will be reviewed by a member of the project.


## Notes

- In postgreSQL, when UserA creates a schema, only UserA and Superusers have access to the schema. If we recreate the production database from scratch, don't forget to grant the correct rights to every user that needs it (or better, define a 'production' role and attribute the role to the corresponding users).
- In postgreSQL, only the user that has created a schema and superusers can delete a schema. Feel free to rename the test schema if you want to create a new schema but please clean it on the database afterwards.  
