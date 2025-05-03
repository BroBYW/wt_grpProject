import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Make sure your token is available as an environment variable
const token = import.meta.env.VITE_GITHUB_TOKEN;

export async function askGithubModel(question) {
    const client = ModelClient(
        "https://models.inference.ai.azure.com",
        new AzureKeyCredential(token)
    );

    const response = await client.path("/chat/completions").post({
        body: {
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: question }
            ],
            model: "gpt-4o",
            temperature: 1,
            max_tokens: 4096,
            top_p: 1
        }
    });

    if (isUnexpected(response)) {
        throw response.body.error;
    }

    return response.body.choices[0].message.content;
}
