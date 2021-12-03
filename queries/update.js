/* sampple data
[
  {
    "name": "Max",
    "hobbies": [
      {
        "title": "Sports",
        "frequency": 3
      },
      {
        "title": "Cooking",
        "frequency": 6
      }
    ],
    "phone": 131782734
  },
  {
    "name": "Manuel",
    "hobbies": [
      {
        "title": "Cooking",
        "frequency": 5
      },
      {
        "title": "Cars",
        "frequency": 2
      }
    ],
    "phone": "012177972",
    "age": 30
  },
  {
    "name": "Anna",
    "hobbies": [
      {
        "title": "Sports",
        "frequency": 2
      },
      {
        "title": "Yoga",
        "frequency": 3
      }
    ],
    "phone": "80811987291",
    "age": null
  },
  {
    "name": "Chris",
    "hobbies": ["Sports", "Cooking", "Hiking"]
  }
]


*/
//Upadte the hobbies for user name chris.
db.users.updateOne({ name: "Chris" },
    {
        $set: {
            hobbies: [{ title: "Sports", frequency: 5 },
            { title: "cooking", frequency: 3 },
            { title: "Hiking", "frequency": 1 }]
        }
    });

// add isSporty Field to all those documents which has title="sports" in hobiies array.
db.users.updateMany({ "hobbies.title": "Sports" },
    {
        $set: { isSporty: true }
    }
);

// Updating multiple fields during using $set
db.users.updateOne({ _id: ObjectId("608fce7ba271f24fcca03025") },
    { $set: { age: 40, phone: 83883838 } }
);

// increment
db.users.updateOne({ name: "Manuel" },
    { $inc: { age: 2 } }
);

//we can decrement also using the same operator.
db.users.updateOne({ name: "Manuel" },
    { $inc: { age: -2 } }// decrement
);

// we can increment and set at the same time.
db.users.updateOne({ name: "Manuel" },
    { $inc: { age: 2 }, $set: { isSporty: false } }
);
// working on the same field is not possible , results in error.
db.users.updateOne({ name: "Manuel" },
    { $inc: { age: 2 }, $set: { age: 31 } }
);// result in error.

// 
db.users.updateOne(
    { name: "Chris" },
    { $min: { age: 35 } }
)
// $min will update value only if old value is higher then its(presnet) value.
// $max will update value only if old value is lower then its(present) value.
db.users.updateOne(
    { name: "Chris" },
    { $mul: { age: 1.1 } }// multiply current age with 1.1 .
)

// drop the field.
db.users.updateMany({ isSporty: true },
    { $unset: { phone: "" } }
);

// renaming the fields.
db.users.updateMany({}, { $rename: { age: "totalAge" } })

// In case we do not find any document and we want to insert the new document.
db.users.updateMany(
    { name: "Maria" },
    { $set: { age: 29, hobbies: [{ title: "Good Food", frequency: 3 }], isSporty: true } },
    { upsert: true }
)

/* users who should have title : Sports and Frequency >= 3
 the below query does not work correctly because for example we have below documents
{
    "_id" : ObjectId("608fce7ba271f24fcca03024"),
    "name" : "Anna",
    "hobbies" : [
            {
                    "title" : "Sports",
                    "frequency" : 2
            },
            {
                    "title" : "Yoga",
                    "frequency" : 3
            }
    ],
    "isSporty" : true,
    "totalAge" : null
}
{
    "_id" : ObjectId("608fce7ba271f24fcca03025"),
    "name" : "Chris",
    "hobbies" : [
            {
                    "title" : "Sports",
                    "frequency" : 5
            },
            {
                    "title" : "cooking",
                    "frequency" : 3
            },
            {
                    "title" : "Hiking",
                    "frequency" : 1
            }
    ],
    "isSporty" : true,
    "totalAge" : 60.50000000000001

    output will be both the above documents, beacuse for the first one there is title sports exist and freuency >= 3 for yoga 
    so the below query take the both condition independently.
}*/
db.users.find({
    $and: [{ "hobbies.title": "Sports" }, { "hobbies.frequency": { $gte: 3 } }]
}).pretty();
//Correcy Query

db.users.find({
    hobbies: { $elemMatch: { title: "Sports", frequency: { $gte: 3 } } }
})

// to increase the frequency of the particular document of the array.
db.users.updateMany({
    hobbies: { $elemMatch: { title: "Sports", frequency: { $gte: 3 } } }
}, {
    $inc: { "hobbies.$.frequency": 1 }
});
// to add the new field in the document of the array.
db.users.updateMany({
    hobbies: { $elemMatch: { title: "Sports", frequency: { $gte: 3 } } }
}, {
    $set: { "hobbies.$.highFrequency": true }
});

// In update $ sign match for the first document in the array , If in the array there is two matching document then update
// will only valid for the first matching documents.

// Now to update all the matchig documents we have another syntax that is : "$[]"

db.users.updateMany(
    { totalAge: { $gt: 30 } },
    { $inc: { "hobbies.$[].frequency": 1 } }
);
db.users.updateMany(
    { totalAge: { $gt: 30 } },
    { $inc: { "hobbies.$.frequency": -1 } }// it will not work , $ sign work only in elemMatch
);
// to updae many documents of an array.
db.users.updateMany(
    { "hobbies.frequency": { $gt: 2 } },// from this we filter the documents.
    { $set: { "hobbies.$[el].Testing": true } },// here "el" is an variable it can be anything.
    { arrayFilters: [{ "el.frequency": { $gt: 2 } }] } // This condition to filter the array documents.
);
// Adding elements/documents into the array.
db.users.updateOne({ name: "Maria" },
    { $push: { hobbies: { title: "sports", frequency: 2 } } }
)
// To add the multiple documennts.
db.users.updateOne({ name: "Anna" },
    { $push: { hobbies: { $each: [{ title: "Good Wine", frequency: 1 }, { title: "Hiking", frequency: 2 }], $sort: { frquency: 1 } } } }
)
// Removing the documents from the arary.
db.users.updateOne(
    { name: "Anna" }, { $pull: { hobbies: { title: "Hiking" } } }// remove all the documents in the array which has title "Hiking".
)
// removing the last or first elements.
db.users.updateOne(
    { name: "Anna" }, { $pop: { hobbies: 1 } }// -1 will remove the first element.
)
// If we want to avoid the duplicate elements.
db.users.updateOne(
    { name: "Anna" }, { $addToSet: { hobbies: { title: "Singing", frequency: 2 } } }
)