const express = require('express');
const path = require('path');
const moment = require('moment');
const IPFS = require('ipfs-core');

const app = express();

const initialiseIPFS = async () => {
    const ipfs = await IPFS.create();
}

initialiseIPFS();

app.use('/public', express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const ipfs = new ipfsClient({host: 'localhost', 'port': 5001, protocol: 'http'});

let counter = 0;
let data = {};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
    //res.send('welcome to the app');
});

app.post('/', async (req, res) => {
    //message.push(req.body.message)
    let currentDate = new Date();
    let details = [req.body.message, parseInt(req.body.time), moment().unix()]
    data[counter] = details;
    counter += 1;
    console.log(req.body);

    const { cid } = await ipfs.add(req.body.message);
    console.log(cid)

    res.send("Data was successfully logged at index  " + (counter-1));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'view.html'));
});

app.post('/view', (req, res) => {
    let index = req.body.index;
    let difference = moment().unix() - data[index][2];

    if (difference < (data[index][1] * 3600)) {
        res.send("cannot view the message yet");
    }
    else {
        res.send(data[index][0]);
    }
});


app.listen(3000);
console.log('Node server running on port 3000');