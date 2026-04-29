# 🛍️ API Produto — CRUD de Produtos

Projeto Spring Boot com CRUD completo de produtos conectado ao MySQL, com interface visual no navegador.

---

## 📋 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/produtos` | Lista todos os produtos |
| `GET` | `/produtos/{id}` | Busca produto por ID |
| `POST` | `/produtos` | Cria novo produto |
| `PUT` | `/produtos/{id}` | Atualiza dados de um produto |
| `DELETE` | `/produtos/{id}` | Remove um produto |

---

## 🖥️ Frontend

| Rota | Descrição |
|------|-----------|
| `GET /` | Interface visual para cadastrar, editar, listar e excluir produtos |

A interface inclui formulário com os campos **Nome**, **Descrição**, **Preço** e **Quantidade**, tabela com filtro e modal de edição.

---

## 🗄️ Configuração do Banco de Dados

As configurações de conexão com o MySQL estão em:

```
src/main/resources/application.properties
```

A tabela utilizada é `produtos`.

---

## 🚀 Build e Execução

### Com Docker (recomendado)

1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados.
2. Na raiz do projeto, execute:

```bash
docker compose up --build
```

> O build Maven roda automaticamente dentro do Dockerfile.

3. Acesse a interface em: **`http://20.151.221.155:8080`**
4. A API estará disponível em: **`http://20.151.221.155:8080/produtos`**

---

## 🛠️ Tecnologias

- Java 21
- Spring Boot
- Spring Data JPA
- Validation (Bean Validation)
- MySQL
- Docker / Docker Compose
