import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "../styles/styles";
import ListItems from "./list-casos";

export default function LaudoLayout(props) {
  const [laudos, setLaudos] = useState([]);

  useEffect(() => {
    // const allLaudos = props.laudos;
    setLaudos(mockLaudos);
  });

  const mockLaudos = [
    [
      {
        _id: "683db4fb7542dd7fae3bcbbb",
        caso: {
          _id: "683db0107542dd7fae3bb5d3",
          titulo: "Lesão Corporal em Acidente de Trânsito",
        },
        evidencias: [
          {
            _id: "683db45c7542dd7fae3bcb70",
            titulo: "Boletim de Ocorrência Policial",
          },
        ],
        texto:
          "Referente ao Boletim de Ocorrência nº 2025.123456.04-14\nVítima: João Ferreira de Andrade\nData do Acidente: 14/04/2025\nLocal: Av. Domingos Ferreira, 4023 – Boa Viagem, Recife/PE\nPerito Responsável: Dr. Marcelo Antunes – CRO/PE 45210\nData do Laudo: 16/04/2025\n\n1. Objetivo da Perícia\nRealizar avaliação técnica e detalhada das lesões odontológicas sofridas pela vítima, decorrentes de acidente de trânsito ocorrido na data e local descritos, com base em exame clínico, documentação radiográfica e relato oficial (Boletim de Ocorrência Policial).\n\n2. Metodologia Utilizada\nAnálise do Boletim de Ocorrência nº 2025.123456.04-14.\nExame clínico intrabucal e extrabucal da vítima.\nAvaliação de fotografias faciais e intraorais.\nEstudo de radiografias periapicais e panorâmica.\nRevisão do prontuário de atendimento prévio do SAMU.\n\n3. Achados Clínicos\nForam observadas lesões compatíveis com trauma direto na região bucomaxilofacial. Os seguintes dentes apresentaram fraturas:\n\nArcada superior:\n\nDente 11 – Fratura coronária complicada com exposição pulpar.\nDente 12 – Fratura de esmalte e dentina, sem exposição pulpar.\nDente 13 – Fratura radicular vertical (confirmada por imagem).\nDente 21 – Fratura extensa com perda de estrutura vestibular.\nDente 22 – Fratura oblíqua vestibular.\nDente 23 – Luxação lateral com fratura do processo alveolar.\n\nArcada inferior:\nDente 31 – Fratura coronária transversal.\nDente 41 e 42 – Fraturas coronárias e discreta mobilidade dentária grau I.\n\nLesões complementares observadas:\nEquimose em lábio superior e mucosa jugal direita.\nLaceração do freio labial superior.\nRestrição de abertura bucal (trismo leve).\nRelato de dor intensa nas primeiras 48h pós-trauma.\n\n4. Discussão e Nexo Causal\nA documentação apresentada, especialmente o Boletim de Ocorrência Policial, confirma a ocorrência de colisão frontal em via urbana, com impacto suficiente para provocar deslocamento do condutor contra o painel do veículo. A ausência de cinto de segurança, conforme relatado, potencializou o trauma facial direto.\nA análise clínica e radiográfica comprova a ocorrência de múltiplas fraturas dentárias e lesões de tecidos moles compatíveis com o tipo e a dinâmica do acidente descrito.\nPortanto, há nexo causal direto entre o acidente de trânsito e as lesões observadas.\n\n5. Conclusão\nConclui-se que a vítima João Ferreira de Andrade sofreu lesões odontológicas de natureza grave, com envolvimento de 9 dentes permanentes, comprometendo a integridade estética, funcional e psicológica do indivíduo. Tais lesões demandam tratamento restaurador e, possivelmente, cirúrgico, com acompanhamento a longo prazo.\n\n6. Classificação da Lesão\nDe acordo com os parâmetros forenses e odontolegais:\nNatureza da lesão: Grave\nTempo estimado de recuperação: superior a 30 dias\nPossível dano estético: Moderado a elevado\nPrejuízo funcional temporário: Presente",
        autor: {
          _id: "68058cd32a508eed4770b98f",
          name: "Administrador Master",
          email: "admin@olin.com",
        },
        criadoEm: "2025-06-02T14:28:11.130Z",
        __v: 0,
      },
    ],
  ];
  return (
    <View style={styles.body}>
      <ListItems histCasos={laudos} />
    </View>
  );
}
