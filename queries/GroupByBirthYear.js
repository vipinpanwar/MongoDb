
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            birthdate: { $convert: { input: "$dob.date", to: 'date' } },
            age: "$dob.age",
            location: {
                type: 'point',
                cordinates: [
                    { $convert: { input: '$location.coordinates.longitude', to: 'double', onError: 0.0, onNull: 0.0 } },
                    { $convert: { input: '$location.coordinates.longitude', to: 'double', onError: 0.0, onNull: 0.0 } }
                ]
            }
        }
    },
    {
        $project: {
            gender: 1,
            email: 1,
            birthdate: 1,
            age: 1,
            location: 1,
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
    },
    { $group: { _id: { birthYear: { $isoWeekYear: "$birthdate" } }, TotalPersons: { $sum: 1 } } },
    { $sort: { TotalPersons: -1 } }
]).pretty();

db.residents.aggregate([
    { $match: { $or: [{ Education: "Graduate" }, { Education: "PostGrad" }] } },
    {
        $group: { _id: "$Education", TotalCount: { $sum: 1 } }
    },
    { $sort: { _id: 1 } }
]).pretty();

db.residents.aggregate([
    {
        $project: {
            _id: 0,
            Education: 1,
            Citizen: 1,
            birthDate: {
                $dateFromString: {
                    dateString: "$DateOfBirth"
                }
            }
        }
    },
    {
        $match: { $and: [{ Citizen: "Y" }, { Education: "Undergrad" }, { $lt: [{ $year: "$birthDate" }, 1951] }] }
    }
]).pretty();


var idsList = db.residents.aggregate([
    {
        $project: {
            _id: 1,
            Education: 1,
            Citizen: 1,
            birthYear: {
                $year: {
                    $dateFromString: {
                        dateString: "$DateOfBirth"
                    }
                }

            }
        }
    },
    {
        $match: { $and: [{ Citizen: "Y" }, { Education: "Undergrad" }, { birthYear: { $lte: 1951 } }] }
    }
]).map(function (d) {
    return d._id;
});;

db.residents.aggregate([
    {
        $project: {
            _id: 1,
            Education: 1,
            Citizen: 1,
            birthYear: {
                $year: {
                    $dateFromString: {
                        dateString: "$DateOfBirth"
                    }
                }

            }
        }
    },
    {
        $match: { $and: [{ Citizen: "Y" }, { Education: "Undergrad" }, { birthYear: { $lte: 1951 } }] }
    }
]).forEach(function (doc) {
    db.getCollection("residents").remove({ "_id": doc._id });
});

db.getCollection("residents").remove({ _id: { $in: idsList } });

db.residents.deleteMany({
    $and: [
        { Citizen: "Y" },
        { Education: "Undergrad" },
    ]
})


db.invoice.aggregate(
    {
        $match: { $or: [{ "customer.customerName": "Aaron" }, { "customer.customerName": "Amy" }] }
    },
    { $group: { _id: "$customer.customerName", max_bill: { $max: '$billAmount' } } },
    { $sort: { max_bill: -1 } },
    { "$skip": 1 }
).pretty();