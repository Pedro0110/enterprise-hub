# 📊 Arquitetura e Fluxo de Dados - Enterprise Hub

## 🏗️ Arquitetura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Browser)                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR FRONTEND (Porta 4200)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┬──────────────┬──────────────────────────────┐  │
│  │             │              │                              │  │
│  ↓             ↓              ↓                              ↓  │
│  ┌──────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Companies│ │ Suppliers  │ │ Postal Code │ │   Home     │ │
│  │Components│ │ Components │ │ Integration │ │ Component  │ │
│  └──────────┘ └────────────┘ └─────────────┘ └────────────┘ │
│       ▲             ▲              ▲              ▲            │
│       │             │              │              │            │
│       └─────────────┴──────────────┴──────────────┘            │
│                     │                                          │
│       ┌─────────────┴────────────────────────┐                │
│       │         Services (HttpClient)        │                │
│       ├────────────────────────────────────  │                │
│       │ • CompanyService                     │                │
│       │ • SupplierService                    │                │
│       │ • PostalCodeService                  │                │
│       └──────────────┬─────────────────────┘                 │
│                      │                                        │
│       ┌──────────────┴──────────────────┐                    │
│       │        Bootstrap Styling        │                    │
│       │  + Icons (Bootstrap Icons CDN)  │                    │
│       └──────────────────────────────────┘                   │
│                                                              │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTP REST Calls
                           │
                           ↓
┌──────────────────────────────────────────────────────────────┐
│         BACKEND SPRING BOOT (Porta 8080)                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              REST API Controllers                     │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • GET    /companies           → List all             │  │
│  │  • POST   /companies           → Create               │  │
│  │  • GET    /companies/{id}      → Get by ID            │  │
│  │  • PUT    /companies/{id}      → Update               │  │
│  │  • DELETE /companies/{id}      → Delete               │  │
│  │  • POST   /companies/{cId}/suppliers/{sId} → Associate│  │
│  │  • DELETE /companies/{cId}/suppliers/{sId} → Dissoc.  │  │
│  │  • GET    /suppliers           → List all             │  │
│  │  • POST   /suppliers           → Create               │  │
│  │  • GET    /suppliers/{id}      → Get by ID            │  │
│  │  • PUT    /suppliers/{id}      → Update               │  │
│  │  • DELETE /suppliers/{id}      → Delete               │  │
│  │  • GET    /cep/{zipcode}       → Postal Code lookup   │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Services / Business Logic                     │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • CompanyService                                     │  │
│  │  • SupplierService                                    │  │
│  │  • ViaCepService                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Data Access Layer (Repositories)             │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • CompanyRepository                                  │  │
│  │  • SupplierRepository                                 │  │
│  │  • Database (JPA/Hibernate)                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Database (MySQL/PostgreSQL)              │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • companies (id, documentNumber, tradeName, ...)     │  │
│  │  • suppliers (id, documentNumber, name, email, ...)   │  │
│  │  • company_supplier (association table)               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📈 Fluxo de Requisições

### 1️⃣ Listar Empresas

```
Usuário clica "Empresas"
    ↓
Router navega para /companies
    ↓
CompaniesListComponent.ngOnInit()
    ↓
CompanyService.listCompanies()
    ↓
HttpClient.get("http://localhost:8080/companies")
    ↓
Backend processa: GET /companies
    ↓
Retorna JSON com lista de empresas
    ↓
Componente atualiza view com tabela Bootstrap
    ↓
Usuário vê a listagem
```

### 2️⃣ Criar Empresa

```
Usuário clica "Nova Empresa"
    ↓
Router navega para /companies/new
    ↓
CompaniesFormComponent é instanciado (sem ID)
    ↓
Usuário preenche o formulário
    ↓
Usuário digita CEP e clica "Buscar"
    ↓
PostalCodeService.getPostalCodeData(cep)
    ↓
HttpClient.get("http://localhost:8080/cep/01001-000")
    ↓
Retorna dados do CEP (rua, bairro, cidade, estado)
    ↓
Campos de endereço são preenchidos automaticamente
    ↓
Usuário clica "Salvar"
    ↓
CompanyService.createCompany(empresa)
    ↓
HttpClient.post("http://localhost:8080/companies", empresa)
    ↓
Backend processa: POST /companies
    ↓
Empresa é criada no banco de dados
    ↓
Frontend redireciona para /companies
    ↓
Tabela é atualizada com novo registro
```

### 3️⃣ Editar/Atualizar Empresa

```
Usuário clica "Editar" em uma empresa
    ↓
Router navega para /companies/{id}/edit
    ↓
CompaniesFormComponent.ngOnInit()
    ↓
Detecta presença de ID na rota
    ↓
CompanyService.getCompanyById(id)
    ↓
HttpClient.get("http://localhost:8080/companies/{id}")
    ↓
Dados são carregados no formulário
    ↓
Usuário modifica valores
    ↓
Clica "Salvar"
    ↓
CompanyService.updateCompany(id, empresa)
    ↓
HttpClient.put("http://localhost:8080/companies/{id}", empresa)
    ↓
Backend processa: PUT /companies/{id}
    ↓
Registro é atualizado no banco de dados
    ↓
Frontend redireciona para /companies
    ↓
Tabela é atualizada
```

### 4️⃣ Deletar Empresa

```
Usuário clica "Deletar"
    ↓
Pergunta confirmação: "Tem certeza?"
    ↓
Usuário confirma
    ↓
CompanyService.deleteCompany(id)
    ↓
HttpClient.delete("http://localhost:8080/companies/{id}")
    ↓
Backend processa: DELETE /companies/{id}
    ↓
Registro é removido do banco de dados
    ↓
Success message é exibido
    ↓
Tabela é recarregada automaticamente
```

### 5️⃣ Filtrar Fornecedores

```
Usuário digita "João" em busca por nome
    ↓
Digita "123.456.789-09" em busca por documento
    ↓
Clica "Filtrar"
    ↓
SuppliersListComponent.loadSuppliers()
    ↓
SupplierService.listSuppliers({
    nome: "João",
    documento: "123.456.789-09"
})
    ↓
HttpClient.get("http://localhost:8080/suppliers?nome=João&documento=123.456.789-09")
    ↓
Backend processa query parameters
    ↓
Retorna fornecedores filtrados
    ↓
Tabela é atualizada com resultado
    ↓
Usuário vê somente registros que correspondem
```

---

## 🔄 Ciclo de Vida dos Componentes

### CompaniesListComponent

```
1. Inicialização
   ├─ ngOnInit()
   ├─ loadCompanies()
   ├─ CompanyService.listCompanies()
   └─ Renderiza tabela

2. Interação com usuário
   ├─ Clique em "Nova Empresa" → navega para /companies/new
   ├─ Clique em "Ver" → navega para /companies/:id
   ├─ Clique em "Editar" → navega para /companies/:id/edit
   └─ Clique em "Deletar" → deleta e recarrega

3. Atualização
   ├─ Watch na rota ativa
   ├─ Detecta retorno da form
   └─ Recarrega dados automaticamente
```

### CompaniesFormComponent

```
1. Carregamento
   ├─ ngOnInit()
   ├─ Detecta se há ID na rota
   ├─ Se houver:
   │  ├─ CompanyService.getCompanyById()
   │  ├─ Preenche formulário
   │  └─ Modo "Editar"
   └─ Se não houver: Modo "Criar"

2. Ações do usuário
   ├─ Preenchimento de campos
   ├─ Clique em "Buscar CEP"
   │  ├─ PostalCodeService.getPostalCodeData()
   │  └─ Auto-preenchimento de endereço
   └─ Clique em "Salvar"
        ├─ Validação básica
        ├─ CompanyService.createCompany() ou .updateCompany()
        └─ Navegação para /companies

3. Finalização
   ├─ Sucesso → Mensagens de feedback
   ├─ Erro → Exibe mensagem de erro
   └─ Redirecionamento
```

---

## 🎯 Mapeamento de Rotas

| Rota | Componente | Ação |
|------|-----------|------|
| `/` | HomeComponent | Exibe dashboard inicial |
| `/companies` | CompaniesListComponent | Lista todas as empresas |
| `/companies/new` | CompaniesFormComponent | Formulário para criar empresa |
| `/companies/:id` | CompanyDetailComponent | Exibe détalhes da empresa |
| `/companies/:id/edit` | CompaniesFormComponent | Formulário para editar empresa |
| `/suppliers` | SuppliersListComponent | Lista todos fornecedores com filtros |
| `/suppliers/new` | SuppliersFormComponent | Formulário para criar fornecedor |
| `/suppliers/:id` | SupplierDetailComponent | Exibe detalhes do fornecedor |
| `/suppliers/:id/edit` | SuppliersFormComponent | Formulário para editar fornecedor |

---

## 🔐 Fluxo de Validação

```
┌─────────────────────────────────────┐
│     Validação no Frontend           │
├─────────────────────────────────────┤
│  ✓ Campo required verificado        │
│  ✓ Email format verificado          │
│  ✓ Comprimento máximo verificado    │
│  ✓ Confirmação em delete            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   Envio ao Backend (Validação 2ª)   │
├─────────────────────────────────────┤
│  ✓ Backend valida novamente         │
│  ✓ Regras de negócio verificadas    │
│  ✓ Constraints do banco de dados    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   Resposta ao Frontend              │
├─────────────────────────────────────┤
│  Sucesso (200/201) → Sucesso        │
│  Erro (400/500) → Mensagem de erro  │
└─────────────────────────────────────┘
```

---

## 📊 Estado da Aplicação

```typescript
// Estados possíveis em componentes
State {
  loading: boolean          // Indica carregamento
  error: string | null      // Mensagem de erro
  data: T[]                 // Dados carregados
  filterName: string        // Filtro por nome
  filterDocument: string    // Filtro por documento
  isEditMode: boolean       // Modo edição vs criação
}
```

---

## 🌐 URLs de Acesso

```
FRONTEND:        http://localhost:4200
                 │
                 ├─ http://localhost:4200/                (Home)
                 ├─ http://localhost:4200/companies       (List)
                 ├─ http://localhost:4200/companies/new   (Create)
                 ├─ http://localhost:4200/companies/1     (View)
                 ├─ http://localhost:4200/companies/1/edit (Edit)
                 ├─ http://localhost:4200/suppliers       (List)
                 ├─ http://localhost:4200/suppliers/new   (Create)
                 ├─ http://localhost:4200/suppliers/1     (View)
                 └─ http://localhost:4200/suppliers/1/edit (Edit)

BACKEND:         http://localhost:8080
                 │
                 ├─ GET    /api/companies
                 ├─ POST   /api/companies
                 ├─ GET    /api/companies/{id}
                 ├─ PUT    /api/companies/{id}
                 ├─ DELETE /api/companies/{id}
                 ├─ GET    /api/suppliers
                 ├─ POST   /api/suppliers
                 ├─ GET    /api/suppliers/{id}
                 ├─ PUT    /api/suppliers/{id}
                 ├─ DELETE /api/suppliers/{id}
                 └─ GET    /api/cep/{zipcode}
```

---


