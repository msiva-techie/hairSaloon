var http = require('http');
var fs=require('fs');
const express =require('express');
const mysql=require('mysql');
const path=require('path');
const bodyparser=require('body-parser');
var flash=require('req-flash');

const app=express();
//app.use(flash());

app.use(bodyparser.json());
var urlencoded=app.use(bodyparser.urlencoded({
    extended:true
}));


const con=mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'1saltakhiH',
  database:'proj_DB'
});


//get
app.get('/signup.html',(req,res)=>{
    app.use('/signup.css',express.static(__dirname +'/signup.css'));
  return res.sendFile(__dirname+'/signup.html');
  
});
app.get('/login.html',(req,res)=>{
  app.use('/login.css',express.static(__dirname +'/login.css'));
return res.sendFile(__dirname+'/login.html');
});


//connect
con.connect((err)=>{
    if(err) 
    throw err;
    console.log('mySql connected');
  });


//post log in
app.post('/login',(req,res,)=>{

  var username=req.body.username;
  var password=req.body.password;

  con.query('SELECT count(*) AS cnt FROM signUp WHERE UserName = ? AND Password = ?', [username, password], function(error, fields) {
    if(error){throw error}
    else{
      if (fields[0].cnt<=0) {
        res.send('Incorrect Username and/or Password!');
        //response.redirect('/');
      } else {
        req.session.loggedin = true;
        res.send('login successfull');
        //req.session.UserName = username;
    }			
    res.end();
  }});
});



//post signup
app.post('/signup',(req,res,)=>{

  var name=req.body.Username;
  var email=req.body.email;
  var pwd1=req.body.password1;
  var pwd2=req.body.password2;
  con.query('SELECT count(*) AS cnt FROM signUp WHERE UserName =? and Email=?',[name,email],function(error,rows){
    if(error){throw error}
    else{
      if (rows[0].cnt<=0) {
         var sql="insert into signUp (UserName,Email,Password) values ('"+name+"','"+email+"','"+pwd1+"')";
         con.query(sql,(err,result)=>{
           if (!err)
              {
               console.log('Inserted');
               //res.redirect('/');
               res.end();}
           });
      }
      else{
        res.send('Username or email already exists');
        //res.redirect('/');
       
          }
        }
  });
});
  



app.listen(4242,()=>{
        console.log('Listening...');
    });

    //successful
    //redirect with message