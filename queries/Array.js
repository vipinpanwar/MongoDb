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
// Slice the array.
// first element
db.friends.aggregate([
    { $project: { _id: 0, examScore: { $slice: ["$examScores", 1] } } }
]);

// first element from the last
db.friends.aggregate([
    { $project: { _id: 0, examScore: { $slice: ["$examScores", -1] } } }
]);

// only second element
db.friends.aggregate([
    { $project: { _id: 0, examScore: { $slice: ["$examScores", 1, 1] } } }
]);
//***********length of the array ************ */
// Total number of exams.
db.friends.aggregate([
    { $project: { _id: 0, TotalNumberOfExams: { $size: "$examScores" } } }
]);

//*******$Filter Array****************/

db.friends.aggregate([
    {
        $project: {
            _id: 0,
            scores: { $filter: { input: "$examScores", as: "sc", cond: { $gt: ["$$sc.score", 60] } } }
        }
    }
]).pretty();
/* $filter: { input: "$examScores", as: "sc", cond: { $gt: ["$$sc.score", 60] } }
input : it will take the input array field
as : It takes a variable name which is temp variable, this variable stores the value of the array one by one
cond : condition which we need to apply to array element.
*/
