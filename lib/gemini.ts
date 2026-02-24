import { GoogleGenAI, Type } from "@google/genai";

export const payrollSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do funcionário" },
      nome: { type: Type.STRING, description: "Nome do funcionário" },
      salario: { type: Type.STRING, description: "Valor do Salário Base" },
      arredon: { type: Type.STRING, description: "Valor de Arredondamento" },
      he_70: { type: Type.STRING, description: "Horas Extras 70%" },
      refl_70: { type: Type.STRING, description: "Reflexo HE 70%" },
      he_100: { type: Type.STRING, description: "Horas Extras 100%" },
      refl_100: { type: Type.STRING, description: "Reflexo HE 100%" },
      ferias_prop: { type: Type.STRING, description: "Férias Proporcionais" },
      terco_ferias: { type: Type.STRING, description: "1/3 de Férias" },
      adicionais: { type: Type.STRING, description: "Adicionais (Insalubridade, Periculosidade, etc)" },
      outros_venc: { type: Type.STRING, description: "Outros Vencimentos" },
      inss_seg: { type: Type.STRING, description: "I.N.S.S. Segurado" },
      contrib_negoc: { type: Type.STRING, description: "Contribuição Negocial/Assistencial" },
      faltas_injust: { type: Type.STRING, description: "Faltas Injustificadas" },
      indeniz: { type: Type.STRING, description: "Indenizações (Aviso Prévio, etc)" },
      adiant: { type: Type.STRING, description: "Adiantamento Salarial" },
      vale_transp: { type: Type.STRING, description: "Vale Transporte (6%)" },
      irrf: { type: Type.STRING, description: "IRRF" },
      outros_desc: { type: Type.STRING, description: "Outros Descontos" },
      depos_fgts: { type: Type.STRING, description: "Depósito FGTS" },
      base_calc_inss: { type: Type.STRING, description: "Base de Cálculo I.N.S.S." },
      base_calc_fgts: { type: Type.STRING, description: "Base de Cálculo FGTS" },
      base_calc_irrf: { type: Type.STRING, description: "Base de Cálculo IRRF" },
      inss_patronal_20: { type: Type.STRING, description: "INSS Patronal (20% da Base INSS)" }
    },
    required: [
      "id", "nome", "salario", "arredon", "he_70", "refl_70", "he_100", "refl_100",
      "ferias_prop", "terco_ferias", "adicionais", "outros_venc", "inss_seg",
      "contrib_negoc", "faltas_injust", "indeniz", "adiant", "vale_transp", "irrf",
      "outros_desc", "depos_fgts", "base_calc_inss", "base_calc_fgts", "base_calc_irrf",
      "inss_patronal_20"
    ]
  }
};

export const systemInstruction = `Você é um extrator de dados contábeis especializado em folhas de pagamento. Sua tarefa é ler PDFs de holerites e extrair os valores para um formato JSON estruturado.

Regras de Extração:
1. Analise o documento ATÉ O ÚLTIMO FUNCIONÁRIO.
2. O fim da lista de funcionários é marcado pelo texto "R E S U M O - Categoria: 1 - Empregado". Extraia todos os funcionários que aparecem ANTES deste resumo.
3. Gere exatamente UMA LINHA para cada funcionário encontrado no documento.
4. Se um campo não existir para o funcionário, preencha com "-".
5. O campo 'ID' deve ser separado do 'Nome'. Geralmente o ID é o código numérico que precede o nome.
6. Calcule o 'inss_patronal_20' multiplicando a 'Base de Cálculo I.N.S.S.' por 0,20 para cada funcionário. Se a base for "-", o resultado é "-".
7. Identifique verbas rescisórias (Causa: Rescisão) e coloque indenizações nos campos específicos.
8. Mantenha sempre a ordem das 25 colunas definida no esquema JSON.
9. Certifique-se de extrair dados de TODOS os funcionários presentes do início ao fim do arquivo, parando apenas quando encontrar a seção de Resumo mencionada.
10. Formate os valores monetários conforme aparecem no documento (ex: 1.234,56).`;

export async function extractPayrollData(fileBase64: string, mimeType: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave de API do Gemini não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Extraia os dados deste holerite seguindo as instruções do sistema e o esquema JSON fornecido.",
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: payrollSchema,
    },
  });

  return JSON.parse(response.text || "[]");
}
