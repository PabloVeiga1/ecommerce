const express = require("express");
const app = express();
const prisma = require('./prisma');

app.use(express.json());

const carrinho = [];

app.get("/", (req, res) => {
    res.send("API do Ecommerce funcionando!");
});

app.get('/produtos', async (req, res) => {
    try {
        const todosProdutos = await prisma.produto.findMany();
        res.json(todosProdutos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos no banco de dados.' });
    }
});

app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await prisma.produto.findUnique({
            where: { id: parseInt(id) },
        });

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.json(produto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o produto.' });
    }
});


app.post("/produtos/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const produto = await prisma.produto.findUnique({ where: { id } });

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        if (produto.estoque === 0) {
            return res.status(400).json({ mensagem: "O produto encontra-se com o estoque esgotado." });
        }

        await prisma.produto.update({
            where: { id },
            data: { estoque: produto.estoque - 1 }
        });

        const itemCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco
        };

        carrinho.push(itemCarrinho);

        res.json({ 
            mensagem: "Um item foi adicionado ao carrinho."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar item ao carrinho." });
    }
});

// 4. Remover produto do carrinho e devolver 1 para o estoque no banco
app.delete("/carrinho/:id", async (req, res) => {
    const id = Number(req.params.id);
    const indice = carrinho.findIndex(item => item.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensagem: "O produto indicado nao foi adicionado no carrinho." });
    }

    carrinho.splice(indice, 1);

    try {
        const produtoOriginal = await prisma.produto.findUnique({ where: { id } });
        if (produtoOriginal) {
            // Devolve 1 ao estoque no banco de dados
            await prisma.produto.update({
                where: { id },
                data: { estoque: produtoOriginal.estoque + 1 }
            });
        }
        res.json({ mensagem: "Um item foi removido do carrinho." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar estoque após remoção." });
    }
});

app.put("/produtos/:id", async (req, res) => {
    const idParam = Number(req.params.id);
    const dadosAtualizados = req.body;

    try {
        const produtoAtualizado = await prisma.produto.update({
            where: { id: idParam },
            data: {
                nome: dadosAtualizados.nome,
                descricao: dadosAtualizados.descricao,
                preco: dadosAtualizados.preco ? parseFloat(dadosAtualizados.preco) : undefined,
                estoque: dadosAtualizados.estoque ? parseInt(dadosAtualizados.estoque) : undefined,
                imagem: dadosAtualizados.imagem
            }
        });

        return res.status(200).json(produtoAtualizado);
    } catch (error) {
        console.error(error);
        return res.status(404).json({ erro: "Produto não encontrado ou erro na atualização" });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
