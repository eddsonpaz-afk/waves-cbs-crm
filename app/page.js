function pageTitle(screen) {
  return ({
    dashboard:'Dashboard',
    'new-lead':'Novo lead',
    leads:'Leads',
    'lead-detail':'Detalhes do lead',
    agenda:'Agenda',
    profile:'Meu perfil',
    admin:'Dashboard administrativo'
  })[screen] || 'CRM Comercial';
}
