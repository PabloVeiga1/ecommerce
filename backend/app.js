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

app.get("/",(req,res)=>{
    res.send("API do Ecommerce funcionando!")
})

app.get("/produtos",(req,res)=>{
    res.json(produtos)
})

app.get("/produts/:id",(req,res)=>{
    const id = Number(req.params.id)

    const produto = produtos.find(produto => produtos.id === id)

    if(!produto){
        return res.status(404).json({
            mensagem: "Produto nao encontrado."
        })
    }

    res.json(produto)
})

app.post("/carrinho", (req, res) => {
    const { produtoId, quantidade } = req.body

    if (!produtoId || !quantidade || quantidade <= 0) {
        return res.status(400).json({
            mensagem: "Informe produtoId e quantidade (maior que zero)."
        })
    }

    const produto = produtos.find(produto => produto.id === produtoId)

    if (!produto) {
        return res.status(404).json({
            mensagem: "Produto nao encontrado."
        })
    }

    if (produto.estoque < quantidade) {
        return res.status(400).json({
            mensagem: "Estoque insuficiente para essa quantidade."
        })
    }

    const itemExistente = carrinho.find(item => item.produtoId === produtoId)

    if (itemExistente) {
        itemExistente.quantidade += quantidade
    } else {
        carrinho.push({ produtoId, quantidade })
    }

    produto.estoque -= quantidade

    res.status(201).json({
        mensagem: "Produto adicionado ao carrinho.",
        carrinho
    })
})

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000")
})
