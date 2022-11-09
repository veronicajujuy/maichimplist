const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing")

const PORT = process.env.PORT || 3000
const listID = 'b5eed1464b'

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    
    console.log(req.body)
    let fname = req.body.firstname
    let lname = req.body.lastname
    let email = req.body.email
    
    // res.send("Gracias por suscribirse")
    
    var data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                  FNAME: fname,
                  LNAME: lname
                }
            }
        ]
    }
    // var jsonData = JSON.stringify(data)

    const subscribingUser = {
        firstName: fname,
        lastName: lname,
        email: email
       };


// la apikey de mailchimp fueron agregadas a las variables de entorno en heroku a traves del comando:
// heroku config:set MAIL_KEY="aca va la clave"
// mas info sobre variables de entorno: https://devcenter.heroku.com/articles/config-vars

    mailchimp.setConfig({
        apiKey: process.env.MAIL_KEY,
        server: "us21",
      });

      async function run() {
        const response = await mailchimp.lists.addListMember(listID, {
         email_address: subscribingUser.email,
         status: "subscribed",
         merge_fields: {
         FNAME: subscribingUser.firstName,
         LNAME: subscribingUser.lastName
        }
        });
        //If all goes well logging the contact's id
         res.sendFile(__dirname + "/success.html")
         console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
        }
        // if any error:

         run().catch(e => res.sendFile(__dirname + "/failure.html"));
 
})

app.post("/comeback", (req, res) => {
    res.redirect('/')  
})


app.listen(PORT, () => console.log(`Escuchando en puerto ${PORT}`) )