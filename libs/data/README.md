# Data

This library was generated with [Nx](https://nx.dev).
It mainly contain 3 things : 
- all the typescript types related to the data used in the project
- the data itself
- scripts that can be executed to update the data

## Focus on the scripts
The scripts are written in typescript are can be found at the root of the `src` directory. 

They have multiple usage : 
- decouple the editable data from our online no-code database platform, Baserow, and the data in production stored in this package
- infer typescript types from our data
- create specific runtime formats of our data when needed

The best way to get an up-to-date list of those script is to read the project.json file. 
Most of those scripts can be executed from root using npm run commands (see the root package.json)

## Running unit tests

Run `nx run @tee/data:test` to execute the unit tests via [vitest](https://vitest.dev/).

### Test data

When generating a new test dataset. Please be careful to modify the end of validates dates. Not doing so may lead to unwanted results variations. 
The easiest way to do so is to replace all occurence of 2024, 2025 and 2026 by 2040.  


## External tools 
In the directory `tools`, we have some scripts that are independant from the rest of the project. 
Each of the script has its own readme.

Right now, we only have one script available, and for private use only. 
It is a custom export of our cloud based CRM, Brevo.
