import express from 'express'
import * as bodyParser from 'body-parser';
import {
  CARDS_API_SERVICE,
  CARDS_SERVICE, db,
  MEMORY_NODES_API_SERVICE,
  MEMORY_NODES_SERVICE,
  META_SERVICE,
  PRACTICE_ITEMS_API_SERVICE, USERS_API_SERVICE,
  USERS_SERVICE
} from './services/contianer';
import cors from 'cors';
import {selectCards} from "./libs/memory-nodes.lib";
import basicAuth from 'express-basic-auth';
import { Card, MemoryNode } from "./classes";
import { CardItem, createCardItemFromObj } from "./classes/card-items/card-item";

async function server() {
        const jsonParser = bodyParser.json()
        const app = express();
        app.use(cors());

        const users = await USERS_API_SERVICE.getAllItems();
        const basicAuthObj: any = {};
        users.forEach(u => {
            basicAuthObj[u.username] = u.password;
        })
        app.use(basicAuth({
            users: basicAuthObj
        }))
          

        app.use((req: any, res: any, next: any) => {
            console.log('\t',req.url);
            next();
        })
        const port = process.env.PORT || 3033;

        app.use(jsonParser);
        app.get('/', (req: any, res: any) => {
            res.send({ text: 'Hello World!' });
        });

        app.get('/hello', (req: any, res: any) => {
            res.send({ text: 'Hello World!' });
        });

        app.get('/hello2', (req: any, res: any) => {
            res.send({ text: 'Hello World!' });
        });
//---------cards------------------

        app.get('/card/:id', async function (req: any, res: any) {
            const card = await CARDS_API_SERVICE.getItem(+req.params.id);
            res.send(card);
        });

        app.get('/cards', async (req: any , res: any) => {
            const ids = JSON.parse(req.query.ids);
            // const cards = CARD;
            const cards = await CARDS_API_SERVICE.getItems(ids);
            res.send(cards);
        });

        app.post('/update-cards-field', async (req: { body: { cards: Card[], field: 'count' | 'practiceCount' } }, res: any) => {
          const {cards, field} = req.body;
          console.log('HERE update-cards-field', cards, field );
          const updates: any[] = [];
          cards.forEach(card => {
            updates.push(
              { updateOne: {
                  "filter": { "_id": card._id },
                  "update": { $set: { [field]: card[field] } }
                }
              }
              // {_id: card._id, [field]: card[field]}
            )
          });
          const cardsCollection = db.collection<Card>('cards');
          await cardsCollection.bulkWrite(updates);
          console.log('AFTER BULK WRITE');
          res.send({answer: 'goodd'});
        });

        app.post('/get-cards', async function (req: { body: {ids: number[]} }, res: any) {
            const ids = req.body.ids;
            const cards = await CARDS_API_SERVICE.getItems(ids);
            res.send(cards);
        });

        app.post('/cards-by-query', async function (req: { body: {id: number, query: string} }, res: any) {
            try{
                const id = req.body.id;
                const query = req.body.query;
                const cards = await CARDS_SERVICE.getMemoryNodeCardsByMemoryNodeId(id);
                const selectedCards = selectCards(cards, query)
                res.send(selectedCards);
            } catch(e) {
                return [];
            }
        });

        app.put('/increase-card-count/:id', async (req: any, res: any)=> {
            const id = +req.params.id;
            const card = await CARDS_API_SERVICE.getItem(id);
            if (card === null) {
                res.send({});
                return;
            }
            card.count += 1;
            await CARDS_API_SERVICE.updateItem(card);
            res.send(card);
        });

        app.put('/decrease-card-count/:id', async (req: any, res: any) => {
            const id = +req.params.id;
            const card = await CARDS_API_SERVICE.getItem(id);
            if (card === null) {
                res.send({});
                return;
            }
            if (card.count > 0) {
                card.count -= 1;
            }
            CARDS_API_SERVICE.updateItem(card);
            res.send(card);
        });

        app.put('/increase-card-practice-count/:id', async (req: any, res: any) => {
            const id = +req.params.id;
            const card = await CARDS_API_SERVICE.getItem(id);
            if (card === null) {
                res.send({});
                return;
            }
            card.practiceCount += 1;
            await CARDS_API_SERVICE.updateItem(card);1
            res.send(card);
        });

        app.put('/decrease-card-practice-count/:id', async (req: any, res: any) => {
            const id = +req.params.id;
            const card = await CARDS_API_SERVICE.getItem(id);
            if (card === null) {
                res.send({});
                return;
            }
            if (card.practiceCount > 0) {
                card.practiceCount -= 1;
            }
            await CARDS_API_SERVICE.updateItem(card);
            res.send(card);
        });

        app.post('/new-card', async (req: { body: { _id: number, question: any[], answer: any[] } }, res: any) => {
            try {
                const { _id, question, answer } = req.body;
                const node = await MEMORY_NODES_API_SERVICE.getItem(+_id);
                if (!node) {
                    res.status(404).send({ error: 'Memory node was not found' });
                    return;
                }
                const toItems = (arr: any[] = []) => arr
                    .map(item => createCardItemFromObj(item))
                    .filter(item => item !== null) as CardItem[];
                const card = await CARDS_SERVICE.createCardByQuestionAndAnswer(
                    node, toItems(question), toItems(answer), {});
                await CARDS_API_SERVICE.addItem(card);
                node.cards.push(card._id);
                await node.save();
                res.send(card);
            } catch (e) {
                console.error('new-card failed', e);
                res.status(500).send({ error: 'Failed to create the card' });
            }
        });

        app.put('/update-card', async (req: { body: any }, res: any) => {
            try {
                const card = Card.createFromObj(req.body);
                await CARDS_API_SERVICE.updateItem(card);
                res.send(card);
            } catch (e) {
                console.error('update-card failed', e);
                res.status(500).send({ error: 'Failed to update the card' });
            }
        });

        app.post('/delete-cards', async (req: { body: { ids: number[] } }, res: any) => {
            try {
                const ids = req.body.ids ?? [];
                const cards = await CARDS_API_SERVICE.getItems(ids);
                for (const card of cards) {
                    await CARDS_API_SERVICE.deleteItem(card);
                    const parents = await MEMORY_NODES_API_SERVICE.getItems(card.parentNodes);
                    for (const parent of parents) {
                        parent.cards = parent.cards.filter((id: number) => id !== card._id);
                        parent.groups.forEach(g => g.cards = g.cards.filter((id: number) => id !== card._id));
                        parent.priorities.forEach(p => p.cards = p.cards.filter((id: number) => id !== card._id));
                        await parent.save();
                    }
                }
                res.send({ deleted: cards.length });
            } catch (e) {
                console.error('delete-cards failed', e);
                res.status(500).send({ error: 'Failed to delete cards' });
            }
        });

//---------cards------------------
//---------practice-items------------------
        app.get('/practice-item-by-card/:id', function (req: any, res: any) {
            const practiceItem = PRACTICE_ITEMS_API_SERVICE.getItem(req.params.id);
            res.send(practiceItem);
        });

//----------------practice-items---------

//-----------------nodes-----------------
        app.get('/stats-by-node/:id', async function (req: any, res: any) {
            const id = +req.params.id;
            const node = await MEMORY_NODES_API_SERVICE.getItem(id);
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

        app.get('/memory-nodes', async (req: any , res: any) => {
            const ids = req.query.ids;
            const nodes = await MEMORY_NODES_API_SERVICE.getItems(ids);
            res.send(nodes);
        });

        app.post('/get-memory-nodes', async (req: { body: {ids: number[]} }, res: any) => {
            const ids = req.body.ids;
            const nodes = await MEMORY_NODES_API_SERVICE.getItems(ids);
            res.send(nodes);
        });

        app.get('/memory-node/:id', async (req: any, res: any) => {
            const node = await MEMORY_NODES_API_SERVICE.getItem(+req.params.id);
            res.send(node);
        });

        app.post('/memory-node/:id/children', async (req: any, res: any) => {
            const parentId = +req.params.id;
            const name = String(req.body?.name ?? '').trim();
            const aliases = Array.isArray(req.body?.aliases)
                ? req.body.aliases.map((alias: unknown) => String(alias).trim()).filter((alias: string) => alias.length > 0)
                : [];
            if (!name) {
                res.status(400).send({ error: 'Description is required' });
                return;
            }
            const parent = await MEMORY_NODES_API_SERVICE.getItem(parentId);
            if (!parent) {
                res.status(404).send({ error: 'Parent node was not found' });
                return;
            }
            for (const alias of aliases) {
                if (await MEMORY_NODES_SERVICE.isAliasUsed(alias)) {
                    res.status(409).send({ error: `Alias is already used: ${alias}` });
                    return;
                }
            }
            const newNodeId = await META_SERVICE.getNextMemoryNodeId();
            const newNode = new MemoryNode(newNodeId, name, [], [parentId], [], aliases, [], []);
            await MEMORY_NODES_API_SERVICE.addItem(newNode);
            parent.children = parent.children ?? [];
            parent.children.push(newNodeId);
            await parent.save();
            res.send(newNode);
        });
//------------nodes-----------------
// ---------- users ----------------
        app.post('/auth-user', async function (req: { body: {username: string, password: string} }, res: any) {
            const username = req.body.username;
            const password = req.body.password;
            const user = await USERS_SERVICE.getUserByCredentials(username, password);
            res.send(user ?? {user: 'notfound'});
        });
// ---------- users ----------------

        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
}

console.log('HERE');
server().then(r => r);
console.log('after');
