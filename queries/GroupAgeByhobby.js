/*
{
    "_id" : ObjectId("608c0363a271f24fcca02ff8"),
        "name" : "Max",
            "hobbies" : [
                "Sports",
                "Cooking"
            ],
                "age" : 29,
                    "examScores" : [
                        {
                            "difficulty": 4,
                            "score": 57.9
                        },
                        {
                            "difficulty": 6,
                            "score": 62.1
                        },
                        {
                            "difficulty": 3,
                            "score": 88.5
                        }
                    ]
}
*/
// Pushing the whole array
db.friends.aggregate([
    { $group: { _id: { age: "$age" }, Hobbies: { $push: "$hobbies" } } }
]).pretty();

//Pushing the value of the array.

db.friends.aggregate([
    { $unwind: "$hobbies" }
]).pretty();

// $unwind : It basically flatten the array for each array value there is one document.


db.friends.aggregate([
    { $unwind: "$hobbies" },
    { $group: { _id: { age: "$age" }, Hobbies: { $push: "$hobbies" } } }
]).pretty();

// Remove the duplicate value.
db.friends.aggregate([
    { $unwind: "$hobbies" },
    { $group: { _id: { age: "$age" }, Hobbies: { $addToSet: "$hobbies" } } }
]).pretty();

