import { Ai } from '@cloudflare/ai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Env {
	AI: any;
}

const app = new Hono<Env>({ AI: 'AI' });
app.use(
	'/*',
	cors({
		origin: ['http://localhost:5173', 'https://ai-storytelling.pages.dev'],
	}),
);

app.post('/entry', async (c) => {
	const messages = await c.req.json();
	const ai = new Ai(c.env.AI);
	// const res = await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', { // ERROR 500
	const res = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
		// OK
		// const res = await ai.run('@cf/meta/llama-2-7b-chat-fp16', { // OK
		// OK
		messages,
	});

	return c.json(res);
});

app.get('/image', async (c) => {
	const ai = new Ai(c.env.AI);

	const fallbackPrompt = 'tale kids';
	const prompt = c.req.query('query') || fallbackPrompt;

	const summaryResult = await ai.run('@cf/facebook/bart-large-cnn', {
		input_text: prompt,
	});

	const imageResponse = await ai.run('@cf/bytedance/stable-diffusion-xl-lightning', {
		// const imageResponse = await ai.run('@cf/lykon/dreamshaper-8-lcm', {
		prompt: summaryResult.summary,
		// prompt,
	});

	c.header('Content-Type', 'image/png');

	return c.body(imageResponse);
});

app.get('/translate', async (c) => {
	const ai = new Ai(c.env.AI);

	const text = c.req.query('text') || 'hello';
	const source_lang = c.req.query('source_lang') || 'english';
	const target_lang = c.req.query('target_lang') || 'spanish';

	const translationOutput = await ai.run('@cf/meta/m2m100-1.2b', {
		text,
		source_lang,
		target_lang,
	});

	c.header('Content-Type', 'image/png');

	return c.json(translationOutput);
});

export default app;
