# Agent discoveries Application on GitPod

## GitPod setup instructions
- Use `mysql` in the terminal to open a mysql shell inside the docker container
- Create a new datase in the terminal called `agentdiscoveries`
- Change the password for your sql instance with `ALTER USER 'username'@'localhost' IDENTIFIED BY 'new-password-here'`
- Change the connection credentials in the `config.properties` file (you will need to change the `database.username` and `database.password`)
- In order to query the database manually in the terminal, you will need to connect with `mysql --host=localhost --user=<username> --password=<password> agentdiscoveries`. This will open a new shell inside your database
- Finally, run `mvn clean package` followed by `java -jar AgentDiscoveries-Backend/target/agentdiscoveries-backend-1.0-SNAPSHOT.jar` to launch the application.