var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

const jwt = require('jsonwebtoken');

var db = mongojs('mongodb://userdb:userdb@ds163718.mlab.com:63718/cferrerdb', ['tasks']);
//mongodb://cferrer:cferrer123@ds163718.mlab.com:63718/cferrerdb

//jwt calls..

router.post('/login',function(req,res) {
    let user = req.body;
    jwt.sign({user},'dotenv',(err,token)=>{
        res.json({
            token,
            user
        })
    })
})
// Get All Tasks

router.get('/',function(req, res, next){
    db.tasks.find(function(err, tasks){
        if(err){
            res.send(err);
        }
        console.log(tasks);
        res.json(tasks);

    });
});

// Get Single Task
router.get('/:id', verifyToken, (req, res, next) => {
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

function verifyToken(req,res,next){
    const bearHeader = req.headers['authorization'];
    if(typeof bearHeader !=='undefined'){
        const bearer = bearHeader.split(' ');
        //get token
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        next();

    }else{
        res.sendStatus(403);
    }

}
//Save Task
router.post('/', verifyToken, function(req, res, next){
    var task = req.body;
    console.log('saving task ' + JSON.stringify(req.body));
    jwt.verify(req.token,process.env.JWT_SECRET,(err,authData) =>{
        if(err){
            res.sendStatus(403)
        }else{
            db.tasks.save(task, (err, task) =>{
                        if(err){
                            res.send(err);
                        }
                        res.json(task);
            });
        }
    })
       
    
});

// Delete Task
router.delete('/:id', function(req, res, next){
    console.log('deleting  ', req.params.id);
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
             console.log(err);
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/:id', function(req, res, next){
    var task = req.body;
    var updTask = {
        Title:task.Title,
        isdone:task.isdone
        
    };
    console.log('here put--> '+JSON.stringify(task));
    
    if(!task){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
      
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)},updTask, {}, function(err, task){
        if(err){
            console.log(err);
            res.send(err);

        }
        res.json(task);
    });
    }
});

module.exports = router;