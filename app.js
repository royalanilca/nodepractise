var express = require("express");
var request = require("request");
var app = express();
var mongodb = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017"

var port = process.env.port || 8800;


var menu = [
    
    {link:'/',name:'Home'},
    {link:'/restaurants',name:'Restaurants'},
    {link:'/city',name:'City'},
    {link:'/about',name:'About Us'}
]


var LAT = 13.0827;
var LNG = 80.2707;



var apiUrl="https://api.opencagedata.com/geocode/v1/json?q="+LAT+"+"+LNG+"&key=f6235993f0fc4722b7efd96572122b1f";

//var apiUrl="https://api.opencagedata.com/geocode/v1/json?q=13.08+80.27&key=f6235993f0fc4722b7efd96572122b1f";

app.use(express.static(__dirname+'/public'));
app.set('views','./src/views');
app.set('view engine','ejs');







app.get('/', (req,res) => {

  
       request(apiUrl, (err,response) => {
        if(err) throw err;
       // res.send(response.body);

        var output = JSON.parse(response.body);
        var city=  output.results[0].components.city;

        console.log(city);

        mongodb.connect(url,function(err,dc){

            if(err)
            {
                console.log('Error in connceting to DB');
                res.status(501).send("Error in connceting to DB");
            }else{

                const dbo = dc.db('anil')
                dbo.collection('zomato').find({ "city": city}).toArray( (err,data) => {

                    if(err){
                        
                        res.status(402).send('Error while fetching from Database');
                        
                    }else{
                        console.log('The data found is '+data);
                        res.render('index',{title:`Restaurants in ${city}`, restaurants:data,menulist:menu})
                    }


                });



            }

      });

    

    });


      
    });





app.listen( port, (err) =>{

if(err) throw err;
console.log(`Server is running at port ${port}`)


});