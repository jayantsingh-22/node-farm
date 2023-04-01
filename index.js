import fs from 'fs';
import http from 'http';
import url from 'url';
import slugify from 'slugify';
import replaceTemplate from './modules/replacetemplate.js';
import path from 'path';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
app.use(express());
//Synchronous, blocking code.

// const msg = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(msg);

// const addMsg = `This is what we know about the avocado : ${msg}.\n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", addMsg);
// console.log("File written!");

//Asynchronous, non-blocking code.

// fs.readFile('./txt/start.txt', 'utf-8', (err,data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8',(err,data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//                 console.log('Your file has been written');
//             });
//         });
//     });
// });
// console.log("Reading the file...");

//<------------- SERVER ------------->



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const template_files = app.use(express.static(path.join(__dirname, 'templates')));

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);


// const {query, pathname} = (url.parse(req.url, true));


  //Overview page
  app.get('/', (req, res) => {
    // res.writeHead(200,{'Content-type': 'text/html'});
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(' ');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.send(output);
  });

  app.get('/overview', (req, res) => {
    // res.writeHead(200,{'Content-type': 'text/html'});
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(' ');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.send(output);
  });


  //Product page
  app.get('/product', (req, res) => {
    // res.writeHead(200,{'Content-type': 'text/html'});
    const query = req.query;
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.send(output); 
  });

  //API
  app.get('/api', (req, res) => {
    res.status(200).json({
      message: dataObj
    });
  });

  //NOT FOUND
  app.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>'); 
  });

const port = 8000;

app.listen(port, () => {
  console.log(`Listening to the requests on port ${port}`);
});


// code snippet 1:
// for (let i = 0; i < 100; i++) {
//   console.log(i);
// }

// code snippet 2:
// var output = [];
// for (let i = 0; i < 100; i++) {
//   output.push(i);
// }
// console.log(output);