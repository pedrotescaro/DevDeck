# Política de Segurança

Esta política descreve como relatar vulnerabilidades de segurança e como gerenciamos riscos de segurança no DevDeck.

## Relatando uma Vulnerabilidade

Se você descobrir uma vulnerabilidade de segurança no DevDeck, por favor **não abra uma issue pública**. Em vez disso, envie um e-mail detalhado para:
👉 **pedro@devdeck.dev**

Por favor, inclua no e-mail:

- Uma descrição detalhada do problema.
- Passos para reproduzir ou prova de conceito (PoC).
- O impacto potencial da vulnerabilidade.

## Escopo

Apenas vulnerabilidades no código deste repositório ou integridade da nossa infraestrutura padrão estão no escopo. Problemas em dependências de terceiros devem ser reportados diretamente aos respectivos projetos.

## Credenciais Expostas

> [!CAUTION]
> Caso você identifique credenciais expostas no histórico ou em qualquer arquivo do projeto, por favor avise imediatamente.
> Lembramos que, caso chaves de produção (como senhas do Supabase ou chaves da OpenAI) sejam expostas, o procedimento padrão consiste em **rotacionar as credenciais imediatamente no painel administrativo do respectivo serviço**. Não realizamos reescritas do histórico do Git retroativamente caso o histórico já tenha sido amplamente clonado.

## SLA de Resposta e Correção

Nos comprometemos com os seguintes prazos:

1. **Confirmação de Recebimento (Acknowledgement):** Até 72 horas úteis após o envio do e-mail.
2. **Correção (Fix):** Até 30 dias corridos para vulnerabilidades de alto impacto, com a publicação de uma nova versão ou patch de segurança.
