# Creating a new file 
- In the folder AgentDiscoveries-Backend/src/main/resources/db/migration create a new file
- Name the file with "V<next number>__" where next number is the number up from the highest migration file that already exists, followed by a useful name with underscores for spaces
- Use standard MySQL commands ending each line with a semi colon;
- Don't edit any files that exist already as these will not be run again


# Troubleshooting flyway error
- If you have run the file once and then changed it you may get a flyway error
- To solve this you can open the database, go to tables and find the flyway_schema_history
- Select the row containing the file you created and delete it from the table, you will also need to drop and columns or rows this migration may have created so check the tables you were affecting
- Once this is done you should be able to run everything again with no issues


# Merging into master
- Make sure you are using a unique number, and it is the next number after the highest existing migration for your migration file before you merge to master.
