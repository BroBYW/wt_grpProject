from flask import Flask, request, jsonify
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader
from flask_cors import CORS  # 导入 CORS

app = Flask(__name__)
CORS(app)
# 1. 加载数据
file_path = "DATA.txt"
loader = TextLoader(file_path, encoding="utf-8")
documents = loader.load()

# 2. 拆分文本
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(documents)

# 3. 嵌入模型
embedding_model = OllamaEmbeddings(model="nomic-embed-text")

# 4. 建立向量数据库
vector_db = FAISS.from_documents(chunks, embedding_model)

# 5. LLM 模型
model = OllamaLLM(model="llama3.2:3b")

# 6. 构建 RAG 检索链
retriever = vector_db.as_retriever()
qa_chain = RetrievalQA.from_chain_type(model, retriever=retriever)

@app.route("/rag", methods=["POST"])
def rag_endpoint():
    data = request.json
    question = data.get("question", "")
    print(f"\n📥 Received user input: {question}")
    if not question:
        return jsonify({"error": "Missing question"}), 400

    # 执行 RAG
    result = qa_chain.run(question)
    print(f"\n📥 Top relevant documents: {result}")
    return jsonify({
        "question": question,
        "context": result
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
