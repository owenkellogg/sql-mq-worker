## SQL Message Queue Worker

Treat your SQL table as a message queue that
can be worked on by worker processes. This software
was inspired by Resque for Redis, but I wanted
to have a similar lightweight system for use with
small, simple SQL-based node.js applications.

Make sure to use SQL transactions when working
jobs and updating the state of of the database
record object.


## Dependencies

    Node.js
    Sequelize - SQL Object-Relational Mapper for node.js
    Postgres, Mysql, or SQLite database

## Installation

    npm install sql-mq-worker

## USAGE

Every SQL-MQ Worker object performs a job or function,
ultimately calling a callback function and proceeding
with polling to get the next database record.


    function job(dbRecordInstance, callback){
      // POST to a service endpoint, for example.

      request.post(SERVICE_URL, dbRecordInstance).complete(callback);
    }



A SQL-MQ worker must also be provided with a Sequelize Class
object, which is queried using the `predicate` option:

    worker = new SqlMqWorker({
      Class: Payment, 
      predicate: { where: { state: "toSend" }},
      job: sendPaymentToServceJob
    })

    worker.start();

