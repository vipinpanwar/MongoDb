// $bucket is used in the statistics, when we want to show some statistics.
//Categorizes incoming documents into groups, called buckets, \
//based on a specified expression and bucket boundaries and outputs a document per each bucket
/*
{
    "_id" : ObjectId("608a4ce4a3a128e35a0dc082"),
    "gender" : "male",
    "name" : {
            "title" : "mr",
            "first" : "victor",
            "last" : "pedersen"
    },
    "location" : {
            "street" : "2156 stenbjergvej",
            "city" : "billum",
            "state" : "nordjylland",
            "postcode" : 56649,
            "coordinates" : {
                    "latitude" : "-29.8113",
                    "longitude" : "-31.0208"
            },
            "timezone" : {
                    "offset" : "+5:30",
                    "description" : "Bombay, Calcutta, Madras, New Delhi"
            }
    },
    "email" : "victor.pedersen@example.com",
    "login" : {
            "uuid" : "fbb3c298-2cea-4415-84d1-74233525c325",
            "username" : "smallbutterfly536",
            "password" : "down",
            "salt" : "iW5QrgwW",
            "md5" : "3cc8b8a4d69321a408cd46174e163594",
            "sha1" : "681c0353b34fae08422686eea190e1c09472fc1f",
            "sha256" : "eb5251e929c56dfd19fc597123ed6ec2d0130a2c3c1bf8fc9c2ff8f29830a3b7"
    },
    "dob" : {
            "date" : "1959-02-19T23:56:23Z",
            "age" : 59
    },
    "registered" : {
            "date" : "2004-07-07T22:37:39Z",
            "age" : 14
    },
    "phone" : "23138213",
    "cell" : "30393606",
    "id" : {
            "name" : "CPR",
            "value" : "506102-2208"
    },
    "picture" : {
            "large" : "https://randomuser.me/api/portraits/men/23.jpg",
            "medium" : "https://randomuser.me/api/portraits/med/men/23.jpg",
            "thumbnail" : "https://randomuser.me/api/portraits/thumb/men/23.jpg"
    },
    "nat" : "DK"
}*/

db.persons.aggregate([
    {
        $bucket: {
            groupBy: "$dob.age",
            boundaries: [18, 30, 31, 50, 51, 80, 81, 120],
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: "$dob.age" }
            }
        }
    }
]).pretty();

/*
    If boundary is : [18 , 30 ,31 , 50]
    it will calculate for :
    18 :   18>=values<30
    30 :   30>=values<31
    31 :   31>=values<50

*/

db.persons.find({
    $and: [{
        "dob.age": { $gte: 18 }
    },
    { "dob.age": { $lt: 30 } }
    ]
}).count();