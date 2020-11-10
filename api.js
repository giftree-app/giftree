exports.setApp = function (app, client)
{
    app.post('/api/register', async (req, res, next) => 
    {
        // incoming: firstName, lastName, username, password, email, address1, address2
        // outgoing: error, success

        const { login } = req.body;

        const db = client.db();
        const results = await db.collection('Users').find({login:login}).toArray();
        
        if(results.length > 0)
        {
            var ret = { error:'Error: Login is already in use', success:false };
            res.status(400).json(ret);
        }
        else
        {
            var error = '';

            const { firstName, lastName, login, password, email, address1, address2 } = req.body;
            const newUser = { firstName:firstName, lastName:lastName, login:login, password:password, email:email, address1:address1, address2:address2 };
            
            try
            {
                const result = db.collection('Users').insertOne(newUser); 
                var ret = { error:'',success:true };
                
                res.status(200).json(ret);		
            }
            catch(e)
            {
                res.status(500).json({success:false,error:e});  
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
        const results = await db.collection('Users').find({login:login,password:password}).toArray();

        var id = -1;
        var fn = '';
        var ln = '';

        if(results.length > 0)
        {
            id = results[0]._id;
            fn = results[0].firstName;
            ln = results[0].lastName;

            var ret = { userId:id, firstName:fn, lastName:ln, error:'' };
            res.status(200).json(ret);
        }
        else
        {
            var ret = { userId:'', firstName:'', lastName:'', error:'Error: User not found' };
            res.status(400).json(ret);
        }
    });


}