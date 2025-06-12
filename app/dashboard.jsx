import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView,
  Alert,
  Dimensions
} from "react-native";
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { useAuth } from "../components/auth/auth-context";
import { colors } from "../constants/colors";
import RecentCases from "../components/cases/recent-cases";
import NewCaseModal from "../components/forms/new-case-modal";

const screenWidth = Dimensions.get("window").width;

// Componente de gráfico SVG customizado
const SVGPieChart = ({ stats, size = 180 }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;
  const innerRadius = radius * 0.5;
  
  const total = stats.emAndamento + stats.finalizados + stats.arquivados;
  
  // Função para criar path do arco
  const createArcPath = (startAngle, endAngle, outerRadius, innerRadius) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);
    
    return [
      "M", x1, y1, 
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
      "L", x3, y3,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
      "Z"
    ].join(" ");
  };
  
  // Calcular ângulos para cada seção
  let currentAngle = -90; // Começar no topo
  const sections = [
    { value: stats.emAndamento, color: '#e74c3c', name: 'Em Andamento' },
    { value: stats.finalizados, color: '#27ae60', name: 'Finalizados' },
    { value: stats.arquivados, color: '#f4d03f', name: 'Arquivados' }
  ];
  
  const paths = sections.map((section) => {
    const angle = (section.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const path = createArcPath(startAngle, endAngle, radius, innerRadius);
    currentAngle = endAngle;
    
    return {
      path,
      color: section.color
    };
  });
  
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {paths.map((item, index) => (
          <Path
            key={index}
            d={item.path}
            fill={item.color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
        {/* Texto central */}
        <SvgText
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#333"
        >
          {stats.totalCasos}
        </SvgText>
      </Svg>
    </View>
  );
};

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    totalCasos: 15,
    emAndamento: 11,
    finalizados: 3,
    arquivados: 1
  });
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  const { auth, setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Deseja realmente sair do aplicativo?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setAuth({});
              router.replace('/login');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          }
        }
      ]
    );
  };

  // Função chamada quando um novo caso é criado com sucesso
  const handleNewCaseSuccess = (novoCaso) => {
    console.log('Novo caso criado:', novoCaso);
    // Aqui você pode atualizar as estatísticas ou recarregar os dados
    // Por exemplo, incrementar o total de casos
    setStats(prevStats => ({
      ...prevStats,
      totalCasos: prevStats.totalCasos + 1,
      emAndamento: prevStats.emAndamento + 1
    }));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#f5f5f5'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AntDesign name="user" size={20} color={colors.steelBlue} />
          <Text style={{
            fontSize: 16,
            color: colors.steelBlue,
            marginLeft: 8
          }}>
            {user.name || 'Administrador'}
          </Text>
        </View>
        <Pressable onPress={handleLogout}>
          <AntDesign name="logout" size={20} color={colors.steelBlue} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* Botão Novo Caso */}
        <Pressable 
          style={{
            backgroundColor: colors.midnightNavy,
            borderRadius: 12,
            padding: 18,
            alignItems: 'center',
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center'
          }}
          onPress={() => setShowNewCaseModal(true)}
        >
          <AntDesign name="plus" size={20} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            marginLeft: 8
          }}>
            Novo Caso
          </Text>
        </Pressable>

        {/* Card Distribuição de Casos */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 20
          }}>
            Distribuição de Todos os Casos
          </Text>

          {/* Total de Casos */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#333'
            }}>
              {stats.totalCasos}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#999'
            }}>
              Casos Totais
            </Text>
          </View>

          {/* Gráfico SVG */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <SVGPieChart stats={stats} />

            {/* Legendas */}
            <View style={{ flex: 1, marginLeft: 20 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#e74c3c',
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 14, color: '#333' }}>
                  73% Em Andamento: {stats.emAndamento}
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#27ae60',
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 14, color: '#333' }}>
                  20% Finalizados: {stats.finalizados}
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#f4d03f',
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 14, color: '#333' }}>
                  7% Arquivados: {stats.arquivados}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Componente de Casos Recentes */}
        <RecentCases />
      </View>

      {/* Modal de Novo Caso */}
      <NewCaseModal
        visible={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onSuccess={handleNewCaseSuccess}
      />
    </ScrollView>
  );
}