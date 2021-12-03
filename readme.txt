************MongoDb***************************
In mongoDB server we can have multiple database.
1.) we have database of shop(similar to schema) and it carries 
    a.) Collection (similar to tables) so for example shop database contains two collections
        "users" and "orders"
    b.) Then user will contians data of user which is "Documents". Document is JSON objects.
**********when to use************
1.) Depends on APP (specially if we don't know the structure of the database then mongodb is best)

BSON ---> It is a binary version of JSON which mongodb converts to save in the memory.


**MongoDb is a schemaless database, we donot have any restriction but good to follow schema.

DataTypes 
1.) String or Text
2.) Boolean
3.) Number 
    a.) Integer(32 bit)
    b.) NumberLong(64 bit)
    c.) NumberDecimal ( for high precision)
4.) ObjectId("kdsj") -> It gives unique id and also maintain order using timestamp so which is used in sorting.
5.) ISODate - ISODATE("2018-09-09")
6.) Timestamp- Timestamp(11421532) // it is mostly internally used.
7.) Embeded documents
8.) Array - it can be array of list also.

Shell
>> It is based on a JS.
>> If you just use a number (e.g. insertOne({a: 1}), this will get added as a normal double into the database.
   The reason for this is that the shell is based on JS which only knows float/ double values and doesn't differ between
   integers and floats.

*******************OneToOne Relations********************
1.) we store the id of the document to which we refer
    ex : db.card.insertOne({ name : "BMW" , price : 40000 , owner : ObjectId(198327918273129378)})
        here ObjectId refer to the owner , mostly we use Embeded document in case of one to one relations , 
        but in case owner  is itself carry large details and mostly we want cars data not owner details then the 
        reference to other table is good option because we save the traffic in the internet.


***************************OnetoMany**************************************
1.)Example . city registery which store the data of all the citizens.

 Here one city can have millions of citizens, 
 so one way is 

    db.cities.insertOne({ name : "New york" , cordinate : { lang : 938 , lati : 990} , citizens :[id1 , id2 , id3.....]})
        In the above exaple cities collentions document can cross the 16mb size limit so we will not use above approach.

    second approach
        db.cities.insertOne( { _id : "New_York" name : "New york" , cordinate : { lang : 938 , lati : 990});

        db.citizens.insertMany({ name : "vipin Panwar" , city_Id : "New_York"} , { name : "bhola" , city_id : "Ney_York"})

>>>

******************************Many to many******************************************
1.) Customer <-----> product
    db.products.insertOne({title: "A Book", price: 12.99});
    db.customers.insertOne({name: "Max", age: 29 , orders  : { title: "A Book", price: 12.99 }});

    here we apply enbeded approach the reason is if in future product price get change or name changes, we want to show user
    the details of product which he ordered , so if we use reference approach then if product price change then users' already
    ordered product price will also get changed.

2.) db.books.insertOne({name: "My Favourite Book", authors: [{name: "Maxwell", age: 29}, {name: "Spartan", age: 45}]})
    db.books.findOne()
 
    db.authors.insertMany([{name: "Maxwell", age: 29, address: {street: "Main"}}, {name: "Spartan", age: 45, address: {street: "Airport St."}}])
    db.authors.find().pretty()
 
    db.books.updateOne({}, {$set: {authors: [ObjectId("5dd24e46a981e9e8dcdef29c"), ObjectId("5dd24e46a981e9e8dcdef29d")]}}) 

    ** here we use reference because may be author get married and its last name get change and ofcource age is something which 
        is every year upated, so we do not have to do many write operations, 

    *** Its depends on the requiement that which approach we need to use.

    **************************************Validation of schema**********************
    1.) We can create the validation of the schema 
    example : 
    db.createCollection('posts', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator', 'comments'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                }
            }
        }
    }

    >> We can also choode the validation level and action based on the application requiement.
    example : 
    db.runCommand({
  collMod: 'posts',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'text', 'creator', 'comments'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  } , 
   validationAction: 'warn/error'
});

************ Setting up db location and logs location***************

 >>>mongod --dbpath "C:\Program Files\MongoDB\Server\4.4\data\db" --logpath  "C:\Program Files\MongoDB\Server\4.4\log\log.log"
 >> We can setup the confg file also, so that no need to write again same flags
   cmd : mongod -f <"config-location">
>> db.shutdownServer() - to shutdown background mongod service.
>> db.dropDatabase() - to drop the databases.

In windows we cann write  : "net start mongoDB" to start the service.


Questions : 
    1.) what if we wants only few fields and those fields are required and those are the only fields should be 
        in the db no other fields allowed? just like sql, can this be done?
    2.) In sql we have "like" query operator , is there is something similar in mongodb?


********************Atomicity***************************
>> Atomicity means if anything went wrong then either data will save to memory or rollback.
    In general mongodb support atomicity on document level example : ordered insert or unordered insert.

************Indexes***********************
>> Indexes - we use indexes in mongodb to fast the retrevial/find query.
  Why Indexes???????
  >> If we do not have the indexes then mongoDb do the collection Scan. 
  ex : db.products.find({seller : 'max'});
  If our collection contains 1 million rows then mongoDb will scan all the documents in the collection.
  
  For this we can create the Index table which contains the "seller" key in a sorted way.
  So seller Index table will contains the seller data and address which is pointing to the whole document in the collection.
  slide : indexes1.png. 

>> Don't use too many indexes, The cost of index is with every insert or update that index table get update.
>> Index table is a ordered list so with every insert and update it can take time.

** The idea of indexes is to get the narrow subset of the collections.

Ques : restrictions of indexes?
ans : If we get majority of data in most of the queries then indexing is not a good choice becuase first mongoDb will retreive all the 
       address of the dcoument from the index table then will go to the collection and retreive documents. it will take almost double time
       then if index table does not exist.
    
    >> So we should use indexing only when fraction of data we retreive in our 90% or more queries.

    Two types of indexes :
    1.) single field index
    2.) Compund index - ex : db.contacts.createIndex({ "dob.age":1 , gender : 1}); 
      here compound index can be use for two types 
      1.) for compound search where we use both age and gender
      2.) we can use indexing for left to right. for example here we can use indexing for age alone, but not for gender alone.

    
    >> when we sort documents in the mongoDb, mongoDb fetch all data into memory and then sort the data.
      here the imp point is , mongoDb has only 32 Mb memory reserve for this, so if we have millions of documents
      then we might get time out, so in such case we need to use indexing, index table already sorted so 
      mongoDb does not sort inmemory it just fetch the data and show it.


      >> Default indexes : 
       db.collection.getIndexes();
       mongoDb maintain the default index using the _id object, so we can sort for _id without using memory.

       *********Unique*************
       >> By default _id is a unique property , we can not add same _d value for two different documents.
       >> We can also create our own unique index.

    
    >> Query diagnosis - QueryDiagnosis.png

  ******************Aggregation Framework*******************************************

  1.) AggregationFramework.png

  ***************************$match filter*****************************************
  >>  db.persons.aggregate( { $match : {gender : "female"} } ).pretty();

*************************$group****************************
>> db.persons.aggregate( [{ $match : {gender : "female"} },
{ $group : { _id : {state : "$location.state"}, totalPersons : {$sum : 1}}},
{ $sort: { totalPersons: -1 } }
] ).pretty();

question : Find persons older than 50, group them by gender how many persons per gender and avg age per gender
           and output it total number per gender?
Ans : db.persons.aggregate( [{ $match : {$gt : {"$dob.age" : 50 } } },
        { $group : { _id : {gender : "$gender"},
                     totalPersons : {$sum :1 } ,
                     avgAge : {$avg : "$dob.age"}
                    }},
        { $sort : {totalPersons : -1} }
]);

*****************$Project*********************************
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [{ $toUpper: "$name.first" },
                    " ",
                { $toUpper: "$name.first" }]
            }
        }
    }
]).pretty();


// First Letter of the name should be capital.  
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [{ $toUpper: { "$substrCP": ["$name.first", 0, 1] } },
                {
                    "$substrCP": [
                        "$name.first",
                        1,
                        { $subtract: [{ $strLenCP: '$name.first' }, 1] }
                    ]

                },
                    " ",
                { $toUpper: { "$substrCP": ["$name.last", 0, 1] } },
                {
                    "$substrCP": [
                        "$name.first",
                        1,
                        { $subtract: [{ $strLenCP: '$name.last' }, 1] }
                    ]

                }

                ]
            }
        }
    }
]).pretty();

