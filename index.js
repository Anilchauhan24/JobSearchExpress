const express = require("express");
const mongo = require("mongodb");
var cors = require('cors')
const bodyParser = require('body-parser');
const MongoClient = mongo.MongoClient;
const Mongo_Url = "mongodb://127.0.0.1:27017";
const multer = require('multer');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors())
const port = 5000;
let db;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('resume'), (req, res) => {

    const fileBuffer = req.file.buffer;

    const filePath = 'path/to/save/file.pdf';

    fs.writeFile(filePath, fileBuffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ error: 'Error saving file' });
        }
        res.json({ message: 'File uploaded and saved successfully' });
    });
});




//getting data through api




app.get("/bestJob", function (req, res) {
    db.collection("listingOne").find()
        .toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        })
})


app.get("/job/:jobid", function (req, res) {

    let jobid = Number(req.params.jobid);

    db.collection("listingOne").find({ id_name: jobid })
        .toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        })
})
//http://localhost:5000/bestJob/${_id}

app.get("/job/", function (req, res) {
    let query = {};
    let jobId = Number(req.query.id_name);
    if (jobId) {
        query = { id_name: jobId }
    }
    db.collection("listingOne").find(query)
        .toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
})




app.get("/best", (req, res) => {
    db.collection("ImageJob").find()
        .toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
})


app.post('/api/post-data', (req, res) => {
    const postData = req.body;
    console.log('Received data:', postData);
    const userPostsCollection = db.collection("userPosts");
    userPostsCollection.insertOne(postData, (err, result) => {
        if (err) {
            console.error('Error saving data to MongoDB:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Data saved to MongoDB:', result.ops[0]);
        res.json({ message: 'Data received and saved successfully' });
    });
});


MongoClient.connect(Mongo_Url, (err, client) => {
    console.log("Mongodb connected");
    if (err) {
        console.log(err, "while connecting")
        return;
    }

    db = client.db("Joblist");

    // Moving the route vale inside the callback
    app.post('/api/submit-form', async (req, res) => {
        try {
            const { name, email } = req.body;

            const collection = db.collection('formData');
            await collection.insertOne({
                name,
                email,
            });

            res.status(200).json({ message: 'Form data submitted successfully' });
        } catch (error) {
            console.error('Error submitting form data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.listen(port, () => console.log("Server is connected on the port", port));
});