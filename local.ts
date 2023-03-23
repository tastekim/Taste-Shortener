import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { handler as shortener } from './handler';

const app = express();
import axios from 'axios';
import crypto from 'crypto';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.post('/', async (req: any, res: any) => {
    try {
        const full_url = req.body.full_url;
        const result = await axios.post(`${process.env.SHORTENER_URI}`, { full_url : full_url });
        res.status(200).json(result.data);
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).send({
                message : err.message,
            });
        }
    }
});

app.listen(process.env.SERVER_PORT, () => console.log('listening on port ' + process.env.SERVER_PORT));