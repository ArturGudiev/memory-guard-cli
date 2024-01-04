import express from 'express'
import * as bodyParser from 'body-parser';
import { CARDS_SERVICE, MEMORY_NODES_SERVICE } from './services/contianer';
import cors from 'cors';

const jsonParser = bodyParser.json()

const app = express();
app.use(cors());
app.use((req: any, res: any, next: any) => {
    console.log('\t',req.url);
    next();
})
const port = 3033;


app.use(jsonParser);

app.get('/', (req: any, res: any) => {
    res.send({ text: 'Hello World!' });
});



//---------cards------------------

app.get('/card/:id', function (req: any, res: any) {
    const card = CARDS_SERVICE.getCardById(+req.params.id);
    res.send(card);
});

app.post('/get-cards', function (req: { body: {ids: number[]} }, res: any) {
    const ids = req.body.ids;
    const cards = CARDS_SERVICE.getCardsByIDs(ids);
    res.send(cards);
});
//---------cards------------------

//---------nodes-----------------
app.get('/memory-node-by-alias/:alias', function (req: any, res: any) {
    const node = MEMORY_NODES_SERVICE.getMemoryNodeByAlias(req.params.alias);
    res.send(node);
});

app.post('/get-memory-nodes', function (req: { body: {ids: number[]} }, res: any) {
    const ids = req.body.ids;
    const nodes = MEMORY_NODES_SERVICE.getMemoryNodesByIDs(ids);
    res.send(nodes);
});

app.get('/memory-node/:id', function (req: any, res: any) {
    const node = MEMORY_NODES_SERVICE.getMemoryNodeById(+req.params.id);
    res.send(node);
});
//---------nodes-----------------


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});