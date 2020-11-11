exports.setApp = function (app, client)
{
    app.post('/api/register', async (req, res, next) => 
    {
        // incoming: firstName, lastName, username, password, email, address1, address2
        // outgoing: error, success

        const { login } = req.body;

        const db = client.db();
        const results = await db.collection('Users').find({ login:login }).toArray();
        
        if(results.length > 0)
        {
            var ret = { error:'Error: Login is already in use', success:false };
            res.status(400).json(ret);
        }
        else
        {
            var error = '';

            const { firstName, lastName, login, password, email, address1, address2 } = req.body;
            const newUser = { firstName:firstName, lastName:lastName, login:login, password:password, email:email, address1:address1, address2:address2, validated:false };
            
            try
            {
                const result = db.collection('Users').insertOne(newUser); 
                var ret = { error:'',success:true };
                
                res.status(200).json(ret);		
            }
            catch(e)
            {
                var error = e.toString();
                res.status(500).json({ success:false,error:error });  
            }
        }
    });

    app.post('/api/login', async (req, res, next) => 
    {
        // incoming: username, password
        // outgoing: userId, firstName, lastName, error

        var error = '';

        const { login, password } = req.body;

        const db = client.db();
        try
        {
            const results = await db.collection('Users').find({ login:login,password:password }).toArray();

            if(results.length > 0)
            {
                if(results[0].validated)
                {
                    var ret = {};
                    ret.userId = results[0]._id;
                    ret.firstName = results[0].firstName;
                    ret.lastName = results[0].lastName;
                    res.status(200).json(ret);
                }
                else
                {
                    var ret = { userId:'', firstName:'', lastName:'', error:'User not Validated' };
                    res.status(400).json(ret);                    
                }
            }
            else
            {
                var ret = { userId:'', firstName:'', lastName:'', error:'User not found' };
                res.status(400).json(ret);
            }
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/addGroup', async (req,res,next) =>
    {
        // incoming: userId, groupName
        // outgoing: error, success

        const { userId, groupName } = req.body;

        const db = client.db();

        const newGroup = { groupName:groupName, members:[userId], event:false, eventName:null, eventPriceMin:null, eventPriceMax:null, eventDate:null, secretShopper_buyers:[null], secretShopper_receivers:[null] };

        try
        {
            var uniqueGroupCode = false;
            var groupCode, code;
            while(!uniqueGroupCode)
            {
                groupCode = Math.random().toString(36).substring(2, 12).toUpperCase();

                code = await db.collection('Groups').find({ groupCode:groupCode }).toArray();
                uniqueGroupCode = (code.length == 0);
            }

            newGroup.groupCode = groupCode;
    
            const result = db.collection('Groups').insertOne(newGroup); 
            var ret = { error:'',success:true };
            
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/getGroups', async (req, res, next) =>
    {
        // incoming: userId
        // outgoing: groups[groupId, groupName, groupCode], error

        const { userId } = req.body;

        const db = client.db();
        try
        {
            const results = await db.collection('Groups').find({ members:userId }, { groupName: 1, groupCode: 1 }).toArray();

            var groups = [];

            for(i=0; i < results.length; i++ )
            {
                groups.push({ groupId:results[i]._id, groupName:results[i].groupName, groupCode:results[i].groupCode });
            }
            
            var ret = { groups:groups, error:'' };
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/getGroupInfo', async (req, res, next) =>
    {
        // incoming: groupId
        // outgoing: event, eventName, eventPriceMin, eventPriceMax, eventDate, secretShopper_buyers, secretShopper_receivers, members[firstName, lastName, userId]

        const { groupId } = req.body;
        var gid = require('mongodb').ObjectID(groupId);

        const db = client.db();
        try
        {
            const results = await db.collection('Groups').find({ _id:gid}).toArray();

            if (results.length > 0)
            {
                var ret = {};
                ret.event = results[0].event;
                ret.eventName = results[0].eventName;
                ret.eventPriceMin = results[0].eventPriceMin;
                ret.eventPriceMax = results[0].eventPriceMax;
                ret.eventDate = results[0].eventDate;
                ret.secretShopper_buyers = results[0].secretShopper_buyers;
                ret.secretShopper_receivers = results[0].secretShopper_receivers;
                ret.members = results[0].members;
                ret.error = '';

                res.status(200).json(ret);
            }   
            else
            {
                var ret = { event:false, eventName:null, eventPriceMin:null, eventPriceMax:null, evenDate:null, secretShopper_buyers:[null], secretShopper_receivers:[null], members:[null], error:'Group not found' };
                res.status(400).json(ret);           
            } 
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }        
    });

 /*   app.post('/api/addGroupMember', async (req, res, next) =>
    {
        // incoming: groupId, userId
        // outgoing: error, success

        const { groupId, userId} = req.body;
        var gid = require('mongodb').ObjectID(groupId);

        const db = client.db();
        const results = await db.collection('Groups').update({ _id:gid }, { $addToSet: { members:userId } });


    });
    */

    app.post('/api/userAddGroup', async (req, res, next) =>
    {
        // incoming: groupCode, userId
        // outgoing: error, success

        const { groupCode, userId } = req.body;
        
        const db = client.db();
        try
        {
            const check = await db.collection('Groups').find({ groupCode:groupCode, members:userId }).toArray();
            
            if(check.length > 0)
            {
                var ret = { error:'User is already a member of this group', success:false };
                res.status(400).json(ret);
            }
            else
            {
                const results = db.collection('Groups').update({ groupCode:groupCode }, { $addToSet: { members:userId } });
                var ret = { error:'',success:true };
                
                res.status(200).json(ret);
            }
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/deleteGroupMember', async (req, res, next) =>
    {
        // incoming: groupId, userId
        // outgoing: error, success

        const { groupId, userId } = req.body;
        var gid = require('mongodb').ObjectID(groupId);
        
        const db = client.db();

        try
        {
            const results = db.collection('Groups').update({ _id:gid }, { $pull: { members:userId } });
            var ret = { error:'',success:true };
            
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/updateGroupName', async (req, res, next) =>
    {
        // incoming: groupId, groupName
        // outgoing: error, success

        const { groupId, groupName } = req.body;
        var gid = require('mongodb').ObjectID(groupId);
        
        const db = client.db();

        try
        {
            const results = db.collection('Groups').update({ _id:gid }, { $set: { groupName:groupName } });
            var ret = { error:'',success:true };
            
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/deleteGroup', async (req, res, next) =>
    {
        // incoming: groupId
        // outgoing: error, success

        const { groupId } = req.body;
        var gid = require('mongodb').ObjectID(groupId);
        
        const db = client.db();

        try
        {
            const results = db.collection('Groups').deleteOne({ _id:gid });
            var ret = { error:'',success:true };
            
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/addEvent', async (req, res, next) =>
    {
        // incoming: groupId, eventName, eventPriceMin, eventPriceMax, eventDate
        // outgoing: error, success

        const { groupId, eventName, eventPriceMin, eventPriceMax, eventDate } = req.body;
        var gid = require('mongodb').ObjectID(groupId);
        
        const db = client.db();

        // create logic for secret shoppers

        try
        {
            const results = db.collection('Groups').update({ _id:gid }, { $set: { event:true, eventName:eventName, eventPriceMin:eventPriceMin, eventPriceMax:eventPriceMax, eventDate:eventDate } });
            var ret = { error:'',success:true };
            
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
       }
    });

    app.post('/api/getWishlist', async (req, res, next) =>
    {
        // incoming: userId
        // outgoing: gifts[giftId, giftName, giftPrice, giftGot]

        const { userId } = req.body;

        const db = client.db();
        try
        {
            const results = await db.collection('Gifts').find({ userId:userId }, { giftName: 1, giftPrice: 1, giftGot: 1 }).toArray();

            var gifts = [];

            for(i=0; i < results.length; i++ )
            {
                gifts.push({ giftId:results[i]._id, giftName:results[i].giftName, giftPrice:results[i].giftPrice, giftGot:results[i].giftGot });
            }
            
            var ret = { gifts:gifts, error:'' };
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/addGift', async (req, res, next) =>
    {
        // incoming: userId, giftName, giftPrice, giftLocation, giftComment
        // outgoing: error, success

        const { userId, giftName, giftPrice, giftLocation, giftComment } = req.body;
        
        const db = client.db();
        
        const newGift = { userId:userId, giftName:giftName, giftPrice:giftPrice, giftLocation:giftLocation, giftComment:giftComment, giftGot:false };
        
        try
        {
            const result = await db.collection('Gifts').insertOne(newGift);
            var ret = { error:'',success:true };
            
            res.status(200).json(ret);
       }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/getGift', async (req, res, next) =>
    {
        // incoming: giftId
        // outgoing: giftName, giftPrice, giftLocation, giftComment, giftGot

        const { giftId } = req.body;
        var gid = require('mongodb').ObjectID(giftId);

        const db = client.db();
        try
        {
            const results = await db.collection('Gifts').find({ _id:gid }).toArray();

            if (results.length > 0)
            {
                var ret = {};
                ret.giftName = results[0].giftName;
                ret.giftPrice = results[0].giftPrice;
                ret.giftLocation = results[0].giftLocation;
                ret.giftComment = results[0].giftComment;
                ret.giftGot = results[0].giftGot;
                ret.error = '';

                res.status(200).json(ret);
            }   
            else
            {
                var ret = { giftName:null, giftPrice:null, giftLocation:null, giftComment:null, giftGot:null, error:'No Gifts found' };
                res.status(400).json(ret);               
            }            
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/UpdateGift', async (req, res, next) =>
    {
        // incoming: giftId, giftName, giftPrice, giftLocation, giftComment
        // outgoing: error, success

        const { giftId, giftName, giftPrice, giftLocation, giftComment } = req.body;
        var gid = require('mongodb').ObjectID(giftId);

        const db = client.db();
        try
        {
            const results = await db.collection('Gifts').update({ _id:gid }, { $set: { giftName:giftName, giftPrice:giftPrice, giftLocation:giftLocation, giftComment:giftComment } });
            var ret = { error:'',success:true };
 
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/deleteGift', async (req, res, next) =>
    {
        // incoming: giftId
        // outgoing: error, success

        const { giftId } = req.body;
        var gid = require('mongodb').ObjectID(giftId);

        const db = client.db();
        try
        {
            const results = await db.collection('Gifts').deleteOne({ _id:gid });
            var ret = { error:'',success:true };
 
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

    app.post('/api/gotGift', async (req, res, next) =>
    {
        // incoming: giftId
        // outgoing: error, success

        const { giftId } = req.body;
        var gid = require('mongodb').ObjectID(giftId);

        const db = client.db();
        try
        {
            const results = await db.collection('Gifts').update({ _id:gid }, { $set: { giftGot: true }});
            var ret = { error:'',success:true };
 
            res.status(200).json(ret);
        }
        catch(e)
        {
            var error = e.toString();
            res.status(500).json({ success:false,error:error });  
        }
    });

}