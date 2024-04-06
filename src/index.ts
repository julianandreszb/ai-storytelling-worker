/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Ai } from '@cloudflare/ai';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;

	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: any;
}

export default {
	async fetch(request: Request, env: Env) {
		const ai = new Ai(env.AI);

		const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
				prompt: "What is the origin of the phrase Hello, World"
			}
		);

		const jsonResponse =  new Response(JSON.stringify(response));
		jsonResponse.headers.set('Content-Type', 'application/json');
		jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
		return jsonResponse;
	},
};