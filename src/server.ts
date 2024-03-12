import express from 'express'
import * as bodyParser from 'body-parser';
import {CARDS_SERVICE, MEMORY_NODES_SERVICE, PRACTICE_ITEMS_SERVICE, USERS_SERVICE} from './services/contianer';
import cors from 'cors';
import {selectCards} from "./libs/memory-nodes.lib";

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

app.get('/cards', function (req: any , res: any) {
    const ids = JSON.parse(req.query.ids);
    // const cards = CARD;
    const cards = CARDS_SERVICE.getCardsByIDs(ids);
    res.send(cards);
});

app.post('/get-cards', function (req: { body: {ids: number[]} }, res: any) {
    const ids = req.body.ids;
    const cards = CARDS_SERVICE.getCardsByIDs(ids);
    res.send(cards);
});

app.post('/cards-by-query', function (req: { body: {id: number, query: string} }, res: any) {
    try{
        const id = req.body.id;
        const query = req.body.query;
        const cards = CARDS_SERVICE.getMemoryNodeCardsByMemoryNodeId(id);
        const selectedCards = selectCards(cards, query)
        res.send(selectedCards);
    } catch(e) {
        return [];
    }
});

app.put('/increase-card-count/:id', function (req: any, res: any) {
    const id = +req.params.id;
    const card = CARDS_SERVICE.getCardById(id);
    if (card === null) {
        res.send({});
        return;
    }
    card.count += 1;
    CARDS_SERVICE.updateCard(card);
    res.send(card);
});

app.put('/decrease-card-count/:id', function (req: any, res: any) {
    const id = +req.params.id;
    const card = CARDS_SERVICE.getCardById(id);
    if (card === null) {
        res.send({});
        return;
    }
    if (card.count > 0) {
        card.count -= 1;
    }
    CARDS_SERVICE.updateCard(card);
    res.send(card);
});

app.put('/increase-card-practice-count/:id', function (req: any, res: any) {
    const id = +req.params.id;
    const card = CARDS_SERVICE.getCardById(id);
    if (card === null) {
        res.send({});
        return;
    }
    card.practiceCount += 1;
    CARDS_SERVICE.updateCard(card);1
    res.send(card);
});

app.put('/decrease-card-practice-count/:id', function (req: any, res: any) {
    const id = +req.params.id;
    const card = CARDS_SERVICE.getCardById(id);
    if (card === null) {
        res.send({});
        return;
    }
    if (card.practiceCount > 0) {
        card.practiceCount -= 1;
    }
    CARDS_SERVICE.updateCard(card);1
    res.send(card);
});



//---------cards------------------1
//---------practice-items------------------
app.get('/practice-item-by-card/:id', function (req: any, res: any) {
    const practiceItem = PRACTICE_ITEMS_SERVICE.getPracticeItemByCardId(+req.params.id);
    res.send(practiceItem);
});

//---------practice-items------------------

//---------nodes-----------------
app.get('/stats-by-node/:id', function (req: any, res: any) {
    const id = +req.params.id;
    const node = MEMORY_NODES_SERVICE.getMemoryNodeById(id);
    if (!node) {
        res.send({});
    }
});

app.get('/node-by-alias/:alias', function (req: any, res: any) {
    const alias = req.params.alias;
    const node = MEMORY_NODES_SERVICE.getMemoryNodeByAlias(alias);
    console.log('/node-by-alias/:alias', alias, node);
    res.send(node);
});

app.get('/memory-node-by-alias/:alias', function (req: any, res: any) {
    const node = MEMORY_NODES_SERVICE.getMemoryNodeByAlias(req.params.alias);
    res.send(node);
});

app.get('/memory-nodes', function (req: any , res: any) {
    const ids = req.query.ids;
    const nodes = MEMORY_NODES_SERVICE.getMemoryNodesByIDs(ids);
    res.send(nodes);
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
// ---------- users ----------------
app.post('/auth-user', async function (req: { body: {username: string, password: string} }, res: any) {
    const username = req.body.username;
    const password = req.body.password;
    const user = await USERS_SERVICE.getUserByCredentials(username, password);
    res.send(user ?? null);
});

// ---------- users ----------------



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
