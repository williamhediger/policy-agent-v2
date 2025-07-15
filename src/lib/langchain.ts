import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import fs from "fs/promises";
import path from "path";

const indexPath = path.resolve("public/policy_docs/index.json");
const docsPath = path.resolve("public/policy_docs");

export async function loadAndQuery(query: string): Promise<string> {
  const rawIndex = await fs.readFile(indexPath, "utf8");
  const { documents } = JSON.parse(rawIndex);

  const docs: Document[] = [];

  for (const docMeta of documents) {
    const filePath = path.join(docsPath, docMeta.filename);
    const content = await fs.readFile(filePath, "utf8");
    docs.push(new Document({ pageContent: content, metadata: { source: docMeta.filename } }));
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings()
  );

  const chain = RetrievalQAChain.fromLLM(
    new ChatOpenAI({ temperature: 0 }),
    vectorStore.asRetriever()
  );

  const response = await chain.call({ query });
  return response.text;
}
