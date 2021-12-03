/*
Collection : invoice .
sample data

{
    invoiceNum : 100001,
    purchaseDate : "2010-09-09",
    customer : {
        customerId : 1678,
        customerName : "Antony"
    } ,
    items :[
        {
            itemCode : 1289,
            quantity : 5,
            unitPrice  : 10
        }
    ] ,
    billAmount : 50
}



Question 1 : As an offer, one additional piece of the item was provided
for all the customers who have purchased item with itemCode=3813.
Write a command to update the documents with the above criteria.

Example :
before update :
{
    invoiceNum : 100001,
    purchaseDate : "2010-09-09",
    customer : {
        customerId : 1678,
        customerName : "Antony"
    } ,
    items :[
        {
            itemCode : 3813,
            quantity : 5,
            unitPrice  : 10
        }
    ] ,
    billAmount : 50
}

After Update
{
    invoiceNum : 100001,
    purchaseDate : "2010-09-09",
    customer : {
        customerId : 1678,
        customerName : "Antony"
    } ,
    items :[
        {
            itemCode : 3813,
            quantity : 6,// update the quantity
            unitPrice  : 10
        }
    ] ,
    billAmount : 50
}
ans : db.invoice.updateMany({
    items : { $elemMatch : { itemCode : 3813 }} ,
    },
    { $inc : {"items.$.quantity" : 1} }
    ) ;

    if array contains multiple document with itemCode : 3813
    db.invoice.updateMany({
    items : { $elemMatch : { itemCode : 3813 }} ,
    },
    { $inc : {"items.$[el].quantity" : 1} },
    { arrayFilters: [{ "el.itemCode": 3813 }] }
    ) ;

Ques2 : Find the total number of item quantity(use TotalItemQty as alias) for cutomers
        having customName as "Aaron" and "Amy". Sort the result in descending order
        of "TotalItemQty".
output format :
{"_id" : "Aaron", "TotalItemQty" : 99}
{"_id" : "Amy", "TotalItemQty" : 99}

ans :
db.invoice.find({ "customer.customerName" : "Aaron" }).pretty();
db.invoice.find( { $or : [{"customer.customerName" : "Aaron"}, {"customer.customerName" : "Amy"}] }).count();


db.invoice.aggregate(
{
        $match: { $or : [{"customer.customerName" : "Aaron"}, {"customer.customerName" : "Amy"}] }
    },
     { $unwind: "$items" },
     {
        $group: { _id: "$customer.customerName" , "TotalItemQty" : { $sum : "$items.quantity" } }
    },
    { $sort : { TotalItemQty : -1}}
)

Question 3 : Retrieve the average billAmount(use AverageBill as alias) for customers
            having customerName as "Aaron" and "Amy". Sort the result in ascending order for
            "AverageBill"

output format :
{"_id" : "Aaron", "AverageBill" : 99}
{"_id" : "Amy" : "AverageBill" : 99}


db.invoice.aggregate(
{
        $match: { $or : [{"customer.customerName" : "Aaron"}, {"customer.customerName" : "Amy"}] }
    },
     {
        $group: { _id: "$customer.customerName" , "AverageBill" : { $avg : "$billAmount"} }
    },
    { $sort : { TotalItemQty : -1}}
)

Question 4 :   output each document element of items array having itecode=1017 into a new collection named "items".

db.invoice.aggregate(
{
    $project : { _id : 0 , items : 1}
},
{$unwind : "$items"},
  { $match : {"items.itemCode" : 3813}
},
{ $out : "items"}
)

Question 5 :
    Retrieve the second highest total billAmount(use TotalBill as alias) amongst customers having customerName as "Lia"
    and "Aaron".
    output format :
    {"_id" : "Aaron" , "TotalBill" : 99}

ans :   db.invoice.aggregate(
    {
        $match: { $or: [{ "customer.customerName": "Aaron" }, { "customer.customerName": "Amy" }] }
    },
    { $group: { _id: "$customer.customerName", max_bill: { $max: '$billAmount' } } },
    { $sort: { max_bill: -1 } },
    { "$skip": 1 }
).pretty();



Question 6 : Retrieve the total count (use TotalCount as alias) of customers who have purchased items
             billAmount greater than 1400.
             output format :
             each document of the above query should look like the sample gien below.
             {"_id" : null , "TotalCount" : 99}

        ans :  db.invoice.find({ billAmount : { $gt : 1400} }).pretty();

        db.invoice.aggregate(
            {
            $match : {billAmount : { $gt : 1400} }
        },
        {
            $group : { _id : null  , TotalCount : { $sum : 1}}
        }
        );
*/