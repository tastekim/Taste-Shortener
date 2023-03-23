import { MongoClient, Db, Collection } from 'mongodb';
import { nanoid } from 'nanoid';
import {
    APIGatewayProxyEventV2,
    Context,
    APIGatewayProxyResult
} from 'aws-lambda';
import { connectToDatabase } from './mongo.config';

const collectionName = process.env.COLLECTION_NAME as string;

export const handler = async (
    event: APIGatewayProxyEventV2,
    context: Context
): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const db = await connectToDatabase();

        if (event.requestContext.http.method === 'POST') {
            const { full_url, id } = JSON.parse(event.body as string);

            await db.collection(collectionName).insertOne({
                full_url,
                shortId : id,
            });

            return {
                statusCode : 200,
                body : JSON.stringify({
                    id,
                    shortUrl : `https://li.urcurly.site/rd/${id}`
                }),
            };
        }

        if (event.requestContext.http.method === 'GET') {
            const shortId = event.pathParameters?.id || {} as string;
            const doc = await db.collection(collectionName).findOne({ shortId });

            if (!doc) {
                return {
                    statusCode : 404,
                    body : JSON.stringify({
                        message : 'Not found',
                        event : event
                    })
                };
            }

            return {
                statusCode : 302, // Or use 301 for a permanent redirect
                headers : {
                    Location : doc.full_url,
                },
                body : '', // Empty body for redirect
            };
        }

        return {
            statusCode : 400,
            body : JSON.stringify({
                message : 'Bad Request',
                event : event,
            }),
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode : 500,
            body : JSON.stringify({
                message : 'Internal server error',
                event : event
            })
        };
    }
};
