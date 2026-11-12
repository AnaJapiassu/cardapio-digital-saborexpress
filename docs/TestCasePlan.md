# Plano de Casos de Teste - SaborExpress

Este documento descreve os cenários de teste funcionais e de interface executados para validar os requisitos do sistema **Cardápio Digital Responsivo (SaborExpress)**.

## Matriz de Casos de Teste

| ID | Cenário de Teste | Pré-condição | Passos para Execução | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT01** | Filtragem por Categoria | Sistema carregado na tela inicial | 1. Clicar no botão de filtro "Bebidas". | Apenas os itens da categoria "Bebidas" devem ser exibidos na grade. | Passou |
| **CT02** | Busca por Nome de Produto | Sistema carregado na tela inicial | 1. Digitar "Burger" no campo de busca. | Apenas o "X-Burger Artesanal" deve permanecer visível. | Passou |
| **CT03** | Bloqueio de Item Esgotado | Existir um item com status `disponivel: false` | 1. Localizar o card "Batata Frita Crocante".<br>2. Tentar clicar no botão "Indisponível". | O botão deve estar desabilitado e o contador do carrinho não deve alterar. | Passou |
| **CT04** | Adição e Cálculo no Carrinho | Carrinho inicialmente vazio | 1. Clicar em "+ Adicionar" no X-Burger (R$ 24,90).<br>2. Abrir o carrinho e clicar no botão "+". | O contador deve exibir `2` e o valor total deve ser atualizado para `R$ 49,80`. | Passou |
| **CT05** | Validação de Checkout Vazio / Sem Dados | Carrinho vazio ou sem nome preenchido | 1. Abrir o carrinho sem preencher o nome.<br>2. Clicar em "Finalizar Pedido (WhatsApp)". | O sistema deve exibir alerta impedindo o envio sem os dados obrigatórios. | Passou |
| **CT06** | Gestão Administrativa (Pausar Item) | Acessar a tela "Painel Admin" | 1. Clicar em "Painel Admin".<br>2. Alterar status de um item para "Esgotado".<br>3. Voltar ao cardápio. | O item alterado deve aparecer imediatamente como "Indisponível" para o cliente. | Passou |
| **CT07** | Responsividade Mobile | Redimensionar tela para largura 375px (Smartphone) | 1. Abrir o DevTools do navegador em modo celular.<br>2. Navegar pelos filtros e abrir o carrinho. | Os cards devem alinhar-se em 1 coluna única sem quebra de layout ou rolagem horizontal. | Passou |
