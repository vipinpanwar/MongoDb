/* sample Collection : resident  , Database : Populatoin
[
    {
    residentId : 123456,
    Name : "Alen",
    DateOfBirth : "1990-01-19",
    Education : "Graduate",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Vipin",
    DateOfBirth : "1997-01-19",
    Education : "Graduate",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Niin",
    DateOfBirth : "1994-01-19",
    Education : "PostGrad",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Manu",
    DateOfBirth : "1944-01-19",
    Education : "Undergrad",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Golu",
    DateOfBirth : "1951-01-19",
    Education : "Undergrad",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Alen",
    DateOfBirth : "1949-01-19",
    Education : "PostGrad",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Alen",
    DateOfBirth : "1965-01-19",
    Education : "Graduate",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Alen",
    DateOfBirth : "2000-01-19",
    Education : "PostGrad",
    Citizen : "Y",
    Phone : "123-546-890"
},
{
    residentId : 123456,
    Name : "Alen",
    DateOfBirth : "1944-01-19",
    Education : "PostGrad",
    Citizen : "Y",
    Phone : "123-546-890"
}
]

{
    residentId : 123456,
    Name : "Alen",
    DateOfBirth : "1990-01-19",
    Education : "Graduate", PostGrad , Undergrad
    Citizen : "Y",
    Phone : "123-546-890"
}*/

/*
ques1 : Add the field "income" for resident having education ="Postgrad"
        and update it with value 10000?
ans:  db.residents.updateMany({ "Education" = "PostGrad"},{$set : {income : 10000}});
ques2  : Find the total number (use TotalCount as alias) of residents having Education = Graduate and Education = PostGrad ?
output format :
    {"_id" : "Graduate" , "TotalCount" : 10}
    {"_id" : "Postgrad" , "TotalCount" : 10}
ans  :
 db.residents.aggregate([
    { $match: { $or: [{ Education: "Graduate" }, { Education: "PostGrad" }] } },
    {
        $group: { _id: "$Education", TotalCount: { $sum: 1 } }
    },
    { $sort: { _id: 1 } }
]).pretty();

ques3 : Retrieve the fields  Name , Education , and EducationName from all the documentes in the collection.
EducationName is a new field obtained by concatenating the fields d: Education and Name with
hyphen(-) as the delimiter between the fields.

Sample Document :
Name : Aaron
Education : Undergrad
After concatenating.
EducationName : "Undergrad-Aaron"
ans :

db.residents.aggregate([
    {
        $project: { Name : 1, _id : 0, Education : 1 , EducationName : { $concat : ["$Name", "-" ,"$Education"]}}
    }

]).pretty();


Question 4 : Note : Perform the below delete operation at the end, after the above 3 queries are completed.
    Delete all the residents who are citizens, having DateOfBirth <= 1951 and Education = Undergrad.
    Hint : use Citizen= N for residents who are not Citizens.

ans :
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
]).forEach(function(doc) {
    db.getCollection("residents").remove({ "_id": doc._id });
  });

db.getCollection("residents").remove({ _id: { $in: idsList } });
*/
