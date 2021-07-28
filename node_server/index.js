var mysql = require('mysql');
const express = require('express')
var url = require('url');
var nodemailer = require('nodemailer');
const app = express()

const port = 8000

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rishtapp@gmail.com',
    pass: 'querywizards',
    insecureAuth : true
  }
});
var db_config = {
  host: "remotemysql.com",
  port: "3306",
  user: "0taR7i38cx",
  password: "39FchDTVVy",
  database: "0taR7i38cx",
  insecureAuth : true
};
/*var db_config = {
  host: "localhost",
  user: "root",
  password: "$Badcs340"
};*/

var con;

function handleDisconnect() {
  con = mysql.createConnection(db_config); 
  con.connect(function(err) {           
    if(err) {                                    
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }
    console.log("Connected to local database at localhost on port 3306!");                  
  });                                     
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

var generate_tables = [
`create table user (
id INT AUTO_INCREMENT,
first_name varchar(50) not null,
last_name varchar(50) not null,
email varchar(320) not null,
password varchar(100) not null,
gender varchar(50) not null,
primary key(id)
)`,
`create table attributes (
id INT not null,
age varchar(50) not null,
religion varchar(100) not null,
education varchar(500) not null,
location varchar(600) not null,
height varchar(200) not null,
profession varchar(500) not null,
marital varchar(50) not null,
primary key(id),
foreign key (id) references user(id) on delete cascade
)`,
`create table post(
id INT not null,
description varchar(5000) not null,
primary key(id),
foreign key (id) references user(id) on delete cascade
)`,
`create table inbox(
id INT not null,
messages varchar(10000) not null,
primary key(id),
foreign key (id) references user(id) on delete cascade
)`,
`create table reacts(
id INT not null,
love INT default 0,
thumbs INT default 0,
fire INT default 0,
primary key(id),
foreign key (id) references user(id) on delete cascade
)`,
`create table rating(
id INT not null,
num INT default 0,
value INT default 3,
foreign key (id) references post(id) on delete cascade
)`,
`create table privacy(
id INT not null,
flag INT default 0,
foreign key (id) references user(id) on delete cascade
)`,
`create table aunty(
id INT not null,
type1 INT default 0,
type2 INT default 0,
foreign key (id) references user(id) on delete cascade
)`
];

/*con.query("use user", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });*/

/*con.query(generate_tables[7], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });*/

//write your server code below

app.post('/register/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from user where email='${q.email}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into user (first_name,last_name,email,password,gender)
      values ('${q.first}','${q.last}','${q.email}','${q.password}','${q.gender}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
      });
      console.log('ID registered');
      res.send("Account created!");

    }
    else{
      res.send("Account could not be created. The email id allready exits!");
    }
  })
});


app.post('/publish_post/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from post where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into post (id,description)
      values ('${q.id}','${q.bio}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
      });
      console.log('POST CREATED => ',q);
      res.send("<strong>POST CREATED!</strong>");

    }
    else{
      res.send("<strong>You can only have one post at a time!</strong>");
    }
  })
});

app.get('/login/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from user where email='${q.email}' and password='${q.password}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result));
    }
    console.log('login => ',result[0]);
  });
});


app.get('/get_post/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from post where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
    console.log('post served => ',result[0]);
  });
});


app.get('/random_posts/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * 
                  from (((user natural join post) natural join attributes) natural left join rating) natural left join privacy
                  order by rand() limit 10`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result));
    }
    console.log('10 posts served => ',result[0]);
  });
});

app.get('/get_aboutinfo/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from attributes where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
    console.log('aboutinfo served => ',result);
  });
});

app.get('/change_profile/',(req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var update_st = `update user 
                   set first_name='${q.first}',last_name='${q.last}'
                   where id ='${q.id}'`

  con.query(update_st, function (err, result, fields) {
    if (err) throw err;
    res.send("Account updated!");
  });
  console.log("account updated =>", q)
});

app.get('/change_password/',(req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var update_st = `update user 
                   set password='${q.password}'
                   where id ='${q.id}'`

  con.query(update_st, function (err, result, fields) {
    if (err) throw err;
    res.send("Password updated!");
  });
  console.log("password changed =>", q);
});



app.get('/delete_user/',(req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var del_st = `delete from user where id ='${q.id}'`

  con.query(del_st, function (err, result, fields) {
    if (err) throw err;
    res.send("account deleted!");
  });
  console.log("account deleted =>",q);
});

app.get('/delete_inbox/',(req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var del_st = `delete from inbox where id ='${q.id}'`

  con.query(del_st, function (err, result, fields) {
    if (err) throw err;
    res.send("inbox deleted!");
  });
  console.log("inbox deleted =>",q);
});

app.post('/update_aboutinfo/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from attributes where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into attributes(id,age,religion,education,marital,profession,height,location)
      values ('${q.id}','${q.age}','${q.rel}','${q.edu}','${q.status}','${q.prof}','${q.hei}','${q.loc}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        console.log('About info updated!');
        res.send("About info updated!");
      });

    }
    else{

      var insert_st = `update attributes
      set age='${q.age}',religion='${q.rel}',education='${q.edu}',marital='${q.status}',profession='${q.prof}',height='${q.hei}',location='${q.loc}'
      where id='${q.id}'`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        console.log('About info updated!');
        res.send("About info updated!");
      });

    }
  });

});


app.get('/get_inbox/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from inbox where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NO MESSAGES!");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
    console.log('Inbox served => ',result);
  });
});


app.get('/name/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select first_name,last_name from user where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NO USER!");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
    console.log('Name served => ',result);
  });
});


app.get('/search/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var sql = `select * from ((user natural left join attributes) natural left join rating) natural left join privacy where`
  for (const [key, value] of Object.entries(q)) {
       sql = sql + ` lower(${key}) like '%${value}%' and `;
  }
  sql = sql.slice(0,-4);
  sql = sql + " "+ "limit 30";

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result));
    }
    console.log('search query => ',result);
  });

});


app.post('/update_inbox/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from inbox where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into inbox(id,messages)
      values ('${q.id}','${q.msg}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        console.log('Inbox updated! =>',q);
        res.send("MSG SENT!");
      });

    }
    else{

      var insert_st = `update inbox
      set messages='${q.msg}'
      where id='${q.id}'`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        console.log('Inbox updated! =>',q);
        res.send("MSG SENT!");
      });

    }
  });

});


app.post('/update_react/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from reacts where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into reacts(id)
      values ('${q.id}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        var insert_st = `update reacts
        set ${q.type}=${q.type}+1
        where id='${q.id}'`;
  
        con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        console.log('react updated! =>',q);
        res.send("Done!");
      });
        console.log('reacts updated! =>',q);
      });

    }
    else{

      var insert_st = `update reacts
      set ${q.type}=${q.type}+1
      where id='${q.id}'`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        console.log('react updated! =>',q);
        res.send("Done!");
      });

    }
  });

});


app.get('/get_react/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from reacts where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
    console.log('reacts served => ',result);
  });
});

app.get('/delete_post/',(req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var del_st = `delete from post where id ='${q.id}'`
  var del_st2 = `delete from reacts where id ='${q.id}'`

  con.query(del_st, function (err, result, fields) {
    if (err) throw err;
  });

  con.query(del_st2, function (err, result, fields) {
    if (err) throw err;
  });
  
  var insert_st = `update attributes
  set marital='married'
  where id='${q.id}'`;
  
  con.query(insert_st, function (err, result, fields) {
    if (err) throw err;
    res.send("Post deleted!");
  });
});


app.post('/submit_rating/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from rating where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into rating(id,num,value)
      values ('${q.id}','1','${q.val}')`;
  
      con.query(insert_st, function (err, result, fields) {
        console.log("rating updated=>",q);
        res.end();
        if (err) throw err;
      });
    }
    else{
      var insert_st = `update rating
      set value= (value+'${parseInt(q.val)}')/2 , num = num+1
      where id='${q.id}'`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        res.end();
        console.log("rating updated=>",q);
      });

    }
  });
});

app.get('/get_rating/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from rating where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
  });
});

app.get('/privacy/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `select * from privacy where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0){
      res.send("NULL");
    }
    else{
      res.send(JSON.stringify(result[0]));
    }
  });
});


app.post('/update_privacy/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from privacy where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into privacy(id,flag)
      values ('${q.id}','${q.flag}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        res.send("Done!");
      });

    }
    else{

      var insert_st = `update privacy
      set flag=${q.flag}
      where id='${q.id}'`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        res.send("Done!");
      });

    }
  });

});


app.get('/send_email/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;

  
  var select_st = `select * 
                  from (user natural left join attributes)
                  where id = '${q.id}'`

  con.query(select_st, function (err, result, fields) {
    if (err) throw err;

    var data = result[0];
    var msg = `Your friend ${q.name} recommended the following profile to you:\n\n`
    msg = msg + "Name: " +data.first_name +" "+ data.last_name+"\n";
    msg = msg + "Email: " + data.email + "\n";
    msg = msg + "Gender: " + data.gender + "\n";
    msg = msg + "Age: " + data.age + "\n";
    msg = msg + "Religion: " + data.religion + "\n";
    msg = msg + "Location: " + data.location + "\n";
    msg = msg + "Marital Status: " + data.marital + "\n";
    msg = msg + "Profession: " + data.profession + "\n";
    msg = msg + "Education: " + data.education + "\n";
    msg = msg + "Height: " + data.height + "\n\n";
    msg = msg + "Join Rishta app today and find a perfect match for yourself at the following link\n";
    msg = msg + "https://mati607.github.io/website/rishta_app/login.html\n";

    var mailOptions = {
      from: 'honeykhalid62@gmail.com',
      to: `${q.mail}`,
      subject: 'Profile recomendation',
      text: `${msg}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.end();

  });
});


app.post('/register_aunty/', (req, res) => {
  var q = url.parse(req.url, true);
  q = q.query;
  res.setHeader("Access-Control-Allow-Origin", "*");

  var select_st = `select * from aunty where id='${q.id}'`;
  con.query(select_st, function (err, result1, fields1) {
    if (err) throw err;
    
    if(result1.length == 0){
      
      var insert_st = `insert into aunty(id,type1,type2)
      values ('${q.id}','${q.type1}','${q.type2}')`;
  
      con.query(insert_st, function (err, result, fields) {
        if (err) throw err;
        res.send("Done");
      });

    }
    else{

     res.send(JSON.stringify(result1[0]));

    }
  });

});


app.get('/delete_aunty/', (req, res) => {
  var q = url.parse(req.url, true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  q = q.query;
  var select_st = `delete from aunty where id='${q.id}'`
  con.query(select_st, function (err, result, fields) {
    if (err) throw err;
    res.send("deleted");
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
