const express = require("express")
const app = express()

app.use(express.json())

const produtos = [
    {
        id: 1,
        nome: "Notebook",
        preco: 4500,
        estoque: 8
    },
    {
        id: 2,
        nome: "Mouse",
        preco: 120,
        estoque: 20
    },
    {
        id: 3,
        nome: "Teclado",
        preco: 250,
        estoque: 10
    }
];

const carrinho = [];

app.get("/", (req, res) => {
    res.send("API do Ecommerce funcionando!")
})

app.get("/produtos", (req, res) => {
    res.json(produtos)
})

// Corrigido: era "/produts/:id" e dentro do find estava "produtos.id"
app.get("/produtos/:id", (req, res) => {
    const id = Number(req.params.id)

    const produto = produtos.find(produto => produto.id === id)

    if (!produto) {
        return res.status(404).json({
            mensagem: "Produto nao encontrado."
        })
    }

    res.json(produto)
})

app.post("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
    const produto = produtos.find(produto => produto.id === id)

    if (!produto) {
        return res.status(404).json({ mensagem: "Produto não encontrado." })
    }

    if (produto.estoque === 0) {
        return res.status(404).json({ mensagem: "O produto encontra-se com o estoque esgotado." })
    }

    produto.estoque = produto.estoque - 1

    const itemCarrinho = {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco
    };

    carrinho.push(itemCarrinho)

    res.json({ 
        mensagem: "Um item foi adicionado ao carrinho."
    })
})

app.delete("/carrinho/:id", (req, res) => {
    const id = Number(req.params.id);
    const indice = carrinho.findIndex(item => item.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensagem: "O produto indicado nao foi adicionado no carrinho." })
    }

    carrinho.splice(indice, 1)

    const produtoOriginal = produtos.find(produto => produto.id === id)
    if (produtoOriginal) {
        produtoOriginal.estoque += 1 
    }

    res.json({ mensagem: "Um item foi removido do carrinho." })
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})
