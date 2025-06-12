export const colors = {
    // Azuis
    midnightNavy: '#071739',      // Azul-marinho escuro, quase preto
    steelBlue: '#4B6382',         // Azul aço suave
    lightSlateGray: '#A4B5C4',    // Cinza azulado claro
    gainsboro: '#CDD5DB',         // Cinza muito claro com toque azulado
    
    // Nova paleta - tons terrosos e neutros
    darkTeal: '#3D4D55',          // Azul petróleo escuro
    grayBlue: '#A79E9C',          // Cinza azulado
    lightGray: '#D3C3B9',         // Cinza claro
    warmBeige: '#B58863',         // Bege/caramelo
    
    // Terrosos originais
    desertSand: '#E3C39D',        // Areia do deserto, bege quente
    
    // Aliases para facilitar uso
    primary: '#3D4D55',           // darkTeal
    secondary: '#A79E9C',         // grayBlue
    accent: '#B58863',            // warmBeige
    background: '#F5F5F5',        // cinza claro neutro
    surface: '#FFFFFF',           // branco para cards/modais
    warm: '#E3C39D',              // desertSand
    
    // Estados e feedback
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Texto
    textPrimary: '#3D4D55',
    textSecondary: '#A79E9C',
    textDisabled: '#D3C3B9'
  };
  
  // Paletas pré-definidas para casos específicos
  export const statusColors = {
    'em andamento': colors.warmBeige,
    'finalizado': colors.darkTeal,
    'arquivado': colors.grayBlue,
    'pendente': colors.warning,
    'cancelado': colors.error
  };
  
  export default colors;