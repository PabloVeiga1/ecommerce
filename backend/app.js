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

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000")
})