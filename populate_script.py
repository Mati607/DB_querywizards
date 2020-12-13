import mysql.connector
import random

'''mydb = mysql.connector.connect(
  host = "localhost",
  user = "root",
  password = "$Badcs340",
  database = "user"
)'''

mydb = mysql.connector.connect(
  host= "remotemysql.com",
  port= "3306",
  user= "0taR7i38cx",
  password= "39FchDTVVy",
  database= "0taR7i38cx",
)

generate = [
'''create table user (
id INT AUTO_INCREMENT,
first_name varchar(50) not null,
last_name varchar(50) not null,
email varchar(320) not null,
password varchar(100) not null,
gender varchar(50) not null,
primary key(id)
)''',
'''create table attributes (
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
)''',
'''create table post(
id INT not null,
description varchar(5000) not null,
primary key(id),
foreign key (id) references user(id) on delete cascade
)''',
'''create table inbox(
id INT not null,
messages varchar(10000) not null,
primary key(id),
foreign key (id) references user(id) on delete cascade
)''',
'''create table reacts(
id INT not null,
love INT default 0,
thumbs INT default 0,
fire INT default 0,
primary key(id),
foreign key (id) references user(id) on delete cascade
)''',
'''create table rating(
id INT not null,
num INT default 0,
value INT default 3,
foreign key (id) references post(id) on delete cascade
)''',
'''create table privacy(
id INT not null,
flag INT default 0,
foreign key (id) references user(id) on delete cascade
)''',
'''create table aunty(
id INT not null,
type1 INT default 0,
type2 INT default 0,
foreign key (id) references user(id) on delete cascade
)'''
];

file = open("names.txt", "r")
names = file.read()

names = names.split()
gender = ['male','female']
religion = ["islam","christanity","Hinduism"]
education = ["Biological and Biomedical Sciences",
"Business",
"Communications and Journalism",
"Computer Sciences",
"Education",
"Engineering",
"Legal",
"Liberal Arts and Humanities",
"Medical and Health Professions",
"Physical Sciences",
"Psychology",
"Visual and Performing Arts"]
location = ["Lahore","Islamabad","Peshawar","sydney","australia","newyork","dubai","canada","karachi","gilgit","chitral","washington"]
height = ["5.3","5.5","5.7","6","5.9","5.8","5.65","5.77","5.85"]
prof = ["doctor","engineer","scientist","professor","software engineer","banker","buisness man","teacher","politician"]
age = [str(i) for i in range(20,45)]

mycursor = mydb.cursor()

'''tables = ["aunty","privacy","rating","reacts","inbox","post","attributes","user"]
for x in tables:
  sql = "drop table "+x
  mycursor.execute(sql)

for x in generate:
   mycursor.execute(x)
'''
for i in range(2000):
  print(i)
  sql = "INSERT INTO user (first_name,last_name,email,password,gender) VALUES (%s, %s,%s, %s,%s)"
  first = random.choice(names)
  mail = first+str(i)+"@yahoo.com"
  val = (first,random.choice(names),mail,"123456",random.choice(gender))
  mycursor.execute(sql, val)
  mydb.commit()


for i in range(1501,3001):
  print(i-1500)
  sql = "INSERT INTO attributes (id, age,religion,education,location,height,profession,marital) VALUES (%s, %s,%s, %s,%s,%s,%s,%s)"
  val = (i,random.choice(age),random.choice(religion),random.choice(education),random.choice(location),random.choice(height),random.choice(prof),random.choice(gender))
  mycursor.execute(sql, val)
  mydb.commit()


for i in range(1501,3001):
  print(i-1500)
  sql = "INSERT INTO post (id, description) VALUES (%s, %s)"
  val = (i,"lorem opsum....")
  mycursor.execute(sql, val)
  mydb.commit()
  

