export default function cases() {
    return ([
    {
        "_id": "683db0107542dd7fae3bb5d3",
        "titulo": "Lesão Corporal em Acidente de Trânsito",
        "tipo": "avaliação de lesões",
        "descricao": "O autor alega ter sofrido trauma facial em decorrência de colisão automobilística com veículo da empresa ré. Foi solicitada avaliação das lesões odontológicas.",
        "data": "2025-04-02T00:00:00.000Z",
        "status": "finalizado",
        "peritoResponsavel": {
            "_id": "68058cd32a508eed4770b98f",
            "name": "Administrador Master",
            "email": "admin@olin.com"
        },
        "localDoCaso": "Avenida Boa Viagem, 5212 – Boa Viagem, Recife – PE",
        "criadoPor": "68058cd32a508eed4770b98f",
        "ultimaAtualizacao": "2025-06-02T14:07:42.473Z",
        "createdAt": "2025-06-02T14:07:12.011Z",
        "updatedAt": "2025-06-02T14:32:42.771Z",
        "__v": 0,
        "localizacao": {
            "tipo": "Point",
            "coordenadas": [
                -34.8878328,
                -8.1071571
            ],
            "endereco": "Avenida Boa Viagem, 5212 – Boa Viagem, Recife – PE",
            "_id": "683db02e7542dd7fae3bb5e5"
        }
    },
    {
        "_id": "680fff4296fd6c1acb7db342",
        "titulo": "Afogamento",
        "tipo": "identificação de vítima",
        "descricao": "afogamento",
        "data": "2025-04-28T22:20:50.310Z",
        "status": "em andamento",
        "peritoResponsavel": {
            "_id": "68058cd32a508eed4770b98f",
            "name": "Administrador Master",
            "email": "admin@olin.com"
        },
        "localDoCaso": "Recife- PE",
        "criadoPor": "68058cd32a508eed4770b98f",
        "createdAt": "2025-04-28T22:20:50.314Z",
        "updatedAt": "2025-06-02T21:30:58.660Z",
        "__v": 0,
        "localizacao": {
            "tipo": "Point",
            "coordenadas": [
                -34.8995797,
                -8.1231876
            ],
            "endereco": "Avenida Engenheiro Domingos Ferreira, 509",
            "complemento": "próximo a praia",
            "referencia": "praia de Boa Viagem",
            "_id": "683e1812fc17f787a508dd5a"
        },
        "ultimaAtualizacao": "2025-06-02T21:30:58.661Z"
    },
    {
        "_id": "680e98a3202ee7ef7f1f7a4c",
        "titulo": "Fratura de Fêmur em Acidente",
        "tipo": "acidente",
        "descricao": "Paciente envolvido em colisão automobilística, com fratura exposta do fêmur direito.",
        "data": "2025-04-27T20:50:43.464Z",
        "status": "arquivado",
        "peritoResponsavel": {
            "_id": "680bd41f4cc77beeb79cde1d",
            "name": "Mario Andrade Alves",
            "email": "mario@olin.com"
        },
        "localDoCaso": "Recife - PE",
        "criadoPor": "680bd41f4cc77beeb79cde1d",
        "createdAt": "2025-04-27T20:50:43.473Z",
        "updatedAt": "2025-06-02T14:34:07.396Z",
        "__v": 0,
        "ultimaAtualizacao": "2025-06-02T14:34:07.396Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d67",
        "titulo": "Acidente de Trânsito na Avenida Boa Viagem",
        "tipo": "acidente",
        "descricao": "Colisão entre motocicleta e automóvel resultando em vítima fatal. Necessário análise pericial para determinação das causas do acidente e velocidade dos veículos no momento do impacto.",
        "data": "2024-03-15T16:20:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Avenida Boa Viagem, altura do número 3200, Boa Viagem, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9031,
                -8.1137
            ],
            "endereco": "Avenida Boa Viagem, 3200, Boa Viagem, Recife, PE",
            "complemento": "Em frente ao Shopping Recife",
            "referencia": "Próximo à praia de Boa Viagem",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff50"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.041Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d68",
        "titulo": "Identificação de Vítima - Corpo Encontrado no Rio Capibaribe",
        "tipo": "identificação de vítima",
        "descricao": "Corpo em estado de decomposição encontrado às margens do Rio Capibaribe. Necessária identificação através de métodos forenses incluindo análise odontológica e papiloscópica.",
        "data": "2024-02-28T07:30:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Margem do Rio Capibaribe, Bairro do Recife, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.8799,
                -8.0634
            ],
            "endereco": "Cais do Apolo, Bairro do Recife, Recife, PE",
            "complemento": "Próximo ao Marco Zero",
            "referencia": "Nas proximidades da Estação Central do Metrô",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff51"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.041Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d69",
        "titulo": "Exame Criminal - Homicídio em Casa Amarela",
        "tipo": "exame criminal",
        "descricao": "Homicídio por arma branca em residência. Análise da cena do crime, coleta de evidências e reconstituição dos fatos para elucidação do caso.",
        "data": "2024-03-18T21:15:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Rua dos Palmares, 567, Casa Amarela, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9108,
                -8.0285
            ],
            "endereco": "Rua dos Palmares, 567, Casa Amarela, Recife, PE",
            "complemento": "Conjunto habitacional Esperança",
            "referencia": "Próximo ao Hospital da Restauração",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff52"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.041Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d6a",
        "titulo": "Violência Doméstica - Agressão em Afogados",
        "tipo": "violência doméstica",
        "descricao": "Caso de violência doméstica com lesões corporais graves. Necessário exame de corpo de delito e análise das lesões para subsidiar processo judicial.",
        "data": "2024-03-10T14:45:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Rua da Harmonia, 123, Afogados, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9445,
                -8.0733
            ],
            "endereco": "Rua da Harmonia, 123, Afogados, Recife, PE",
            "complemento": "Residência unifamiliar",
            "referencia": "Próximo à UPA de Afogados",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff53"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.042Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d6b",
        "titulo": "Exumação - Cemitério de Santo Amaro",
        "tipo": "exumação",
        "descricao": "Exumação de corpo para nova perícia médico-legal devido a suspeitas de envenenamento. Necessária análise toxicológica dos restos mortais.",
        "data": "2024-02-15T09:00:00.000Z",
        "status": "finalizado",
        "peritoResponsavel": null,
        "localDoCaso": "Cemitério de Santo Amaro, Centro, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.8732,
                -8.0765
            ],
            "endereco": "Rua do Cemitério, s/n, Santo Amaro, Recife, PE",
            "complemento": "Cemitério público municipal",
            "referencia": "Próximo à Igreja de Santo Amaro",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff54"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.042Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d6c",
        "titulo": "Avaliação de Idade - Menor em Situação de Rua",
        "tipo": "avaliação de idade",
        "descricao": "Avaliação da idade cronológica de adolescente em situação de rua para fins de aplicação do ECA. Análise através de exames odontológicos e radiológicos.",
        "data": "2024-03-05T10:30:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Centro de Atendimento Socioeducativo, Cordeiro, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9221,
                -8.0398
            ],
            "endereco": "Avenida Caxangá, 1500, Cordeiro, Recife, PE",
            "complemento": "Centro de atendimento ao menor",
            "referencia": "Próximo ao Terminal Integrado de Passageiros",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff55"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.042Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d6d",
        "titulo": "Avaliação de Lesões - Agressão em Estabelecimento Comercial",
        "tipo": "avaliação de lesões",
        "descricao": "Avaliação de lesões corporais decorrentes de briga em bar. Necessária classificação da gravidade das lesões para enquadramento penal adequado.",
        "data": "2024-03-22T23:30:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Rua da Imperatriz, 45, Boa Vista, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.8891,
                -8.0518
            ],
            "endereco": "Rua da Imperatriz, 45, Boa Vista, Recife, PE",
            "complemento": "Bar e restaurante",
            "referencia": "Próximo ao Teatro Santa Isabel",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff56"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.042Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d6e",
        "titulo": "Acidente de Trabalho - Canteiro de Obras em Imbiribeira",
        "tipo": "acidente",
        "descricao": "Queda de trabalhador de andaime em canteiro de obras. Análise das condições de segurança e causas do acidente para fins trabalhistas e criminais.",
        "data": "2024-03-12T15:20:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Avenida Mascarenhas de Morais, 2100, Imbiribeira, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9167,
                -8.1175
            ],
            "endereco": "Avenida Mascarenhas de Morais, 2100, Imbiribeira, Recife, PE",
            "complemento": "Canteiro de obras - Edifício Residencial",
            "referencia": "Próximo ao Shopping RioMar",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff57"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.042Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d6f",
        "titulo": "Avaliação de Danos Corporais - Acidente de Moto em Várzea",
        "tipo": "avaliação de danos corporais",
        "descricao": "Avaliação de sequelas permanentes decorrentes de acidente motociclístico. Análise para fins de indenização por danos morais e materiais.",
        "data": "2024-01-25T11:00:00.000Z",
        "status": "finalizado",
        "peritoResponsavel": null,
        "localDoCaso": "Estrada do Encanamento, 1800, Várzea, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9514,
                -8.0426
            ],
            "endereco": "Estrada do Encanamento, 1800, Várzea, Recife, PE",
            "complemento": "Via pública com intenso tráfego",
            "referencia": "Próximo à UFPE - Campus Recife",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff58"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.043Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d70",
        "titulo": "Exame Criminal - Furto Qualificado em Espinheiro",
        "tipo": "exame criminal",
        "descricao": "Arrombamento de estabelecimento comercial com subtração de valores. Análise de vestígios, impressões digitais e modus operandi para identificação dos autores.",
        "data": "2024-03-08T03:45:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Rua Benfica, 890, Espinheiro, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9023,
                -8.0623
            ],
            "endereco": "Rua Benfica, 890, Espinheiro, Recife, PE",
            "complemento": "Loja de eletrônicos",
            "referência": "Próximo ao Colégio Marista São Luís",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff59"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.043Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d71",
        "titulo": "Identificação de Vítima - Ossada Encontrada em Água Fria",
        "tipo": "identificação de vítima",
        "descricao": "Ossada humana encontrada em terreno baldio. Necessária análise antropológica forense para determinação de sexo, idade, estatura e possível causa da morte.",
        "data": "2024-02-20T16:10:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Rua das Pitombas, s/n, Água Fria, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9234,
                -8.0145
            ],
            "endereco": "Rua das Pitombas, Água Fria, Recife, PE",
            "complemento": "Terreno baldio próximo a área residencial",
            "referencia": "Nas proximidades da Estação Água Fria do Metrô",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff5a"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.043Z"
    },
    {
        "_id": "683f59bce3230b8c86e86d72",
        "titulo": "Violência Doméstica - Agressão Sexual em Mustardinha",
        "tipo": "violência doméstica",
        "descricao": "Caso de violência sexual contra menor de idade no âmbito familiar. Exame de corpo de delito e coleta de material para análise de DNA.",
        "data": "2024-03-14T19:30:00.000Z",
        "status": "em andamento",
        "peritoResponsavel": null,
        "localDoCaso": "Rua Coronel Fabriciano, 234, Mustardinha, Recife/PE",
        "localizacaoGeo": {
            "coordenadas": [
                -34.9312,
                -8.0534
            ],
            "endereco": "Rua Coronel Fabriciano, 234, Mustardinha, Recife, PE",
            "complemento": "Residência familiar",
            "referencia": "Próximo ao Hospital Agamenon Magalhães",
            "tipo": "Point",
            "_id": "683f78ffec8b0ea3d491ff5b"
        },
        "ultimaAtualizacao": "2025-06-03T22:36:47.043Z"
    }
])
}