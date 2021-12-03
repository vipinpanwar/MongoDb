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

// Max score
db.friends.aggregate([
    { $unwind: "$examScores" },
    { $project: { _id: 1, name: 1, score: "$examScores.score" } },
    { $sort: { score: -1 } },
    { $group: { _id: "$_id", name: { $first: "$name" }, maxScore: { $max: "$score" } } },
    { $sort: { maxScore: -1 } }
]).pretty();


db.friends.aggregate([
    { $unwind: "$examScores" },
    { $project: { _id: 1, name: 1, age: 1, examScores: "$examScores.score" } }
]).pretty();