'use client';

import { useMemo, useState } from 'react';
import {
  LayoutDashboard, Users, CalendarDays, UserRound, Plus, Search,
  ChevronLeft, LogOut, Phone, MessageCircle, Building2, MapPin,
  Mail, Target, TrendingUp, Handshake, CheckCircle2, Bell,
  ShieldCheck, BarChart3, LockKeyhole, Eye, EyeOff
} from 'lucide-react';

const DEMO_USER = { nome: 'Edson Paz', email: 'admin@wavesplus.com', telefone: '(85) 3031-8830', admin: true };
const DEMO_LEADS = [
  { id:'LD-001', nome:'Marcos Oliveira', empresa:'Marcos Construtora', telefone:'(85) 99999-1234', email:'marcos@construtora.com.br', cidade:'Fortaleza - CE', segmento:'Construção Civil', interesse:'Andaimes e escoras', potencial:'Alto', status:'Qualificado', observacoes:'Interesse em entrega rápida e condição para volume.' },
  { id:'LD-002', nome:'João da Silva', empresa:'Serralheria Silva', telefone:'(85) 98888-5678', email:'joao@serralheriasilva.com.br', cidade:'Caucaia - CE', segmento:'Serralheria', interesse:'Solda', potencial:'Médio', status:'Novo', observacoes:'Conheceu a Waves Plus na feira.' },
  { id:'LD-003', nome:'Ricardo Costa', empresa:'RC Estruturas Metálicas', telefone:'(85) 99666-7890', email:'contato@rcestruturas.com.br', cidade:'Maracanaú - CE', segmento:'Indústria', interesse:'Abrasivos', potencial:'Estratégico', status:'Proposta', observacoes:'Solicitou proposta completa.' },
  { id:'LD-004', nome:'Lucas Ferreira', empresa:'Obras e Reformas LF', telefone:'(85) 97444-2211', email:'lucas@obraslf.com.br', cidade:'Fortaleza - CE', segmento:'Construção Civil', interesse:'Parafusos e fixadores', potencial:'Alto', status:'Negociação', observacoes:'Follow-up agendado.' }
];
const STATUS = ['Todos','Novo','Qualificado','Proposta','Negociação','Convertido'];

function initials(name='') { return name.split(' ').filter(Boolean).slice(0,2).map(p=>p[0]).join('').toUpperCase() || 'WP'; }

async function api(action, data={}) {
  const response = await fetch('/api/crm', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action, ...data }) });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || 'Falha na operação.');
  return result;
}

export default function Home() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const notify = (message) => { setToast(message); setTimeout(()=>setToast(''), 2400); };

  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const senha = String(form.get('senha') || '').trim();
    if (!email || !senha) return notify('Preencha e-mail e senha.');
    setLoading(true);
    try {
      const result = await api('login', { email, senha });
      setUser(result.user); setScreen('dashboard');
    } catch {
      setUser(DEMO_USER); setScreen('dashboard'); notify('Modo demonstração ativo. Conecte a API para dados reais.');
    } finally { setLoading(false); }
  }

  const filteredLeads = useMemo(() => leads.filter(lead => {
    const statusOk = statusFilter === 'Todos' || lead.status === statusFilter;
    const text = `${lead.nome} ${lead.empresa} ${lead.cidade} ${lead.telefone}`.toLowerCase();
    return statusOk && text.includes(search.toLowerCase());
  }), [leads, statusFilter, search]);

  const stats = useMemo(() => ({
    total: leads.length,
    oportunidades: leads.filter(l=>['Qualificado','Proposta'].includes(l.status)).length,
    negociacoes: leads.filter(l=>l.status==='Negociação').length,
    convertidos: leads.filter(l=>l.status==='Convertido').length
  }), [leads]);

  async function saveLead(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (!data.nome || !data.telefone || !data.cidade) return notify('Preencha nome, telefone e cidade.');
    const newLead = { id:`LD-${Date.now()}`, ...data, status:'Novo' };
    setLoading(true);
    try { await api('createLead', { lead:data, vendedor:user?.email }); notify('Lead salvo com sucesso.'); }
    catch { notify('Lead salvo no modo demonstração.'); }
    setLeads(current=>[newLead,...current]); event.currentTarget.reset(); setLoading(false); setScreen('leads');
  }

  if (screen === 'login') {
    return <main className="login-shell">
      <section className="brand-presentation">
        <div className="brand-lockup"><img src="/logos/waves-plus-oficial.png" alt="Waves Plus"/><div/><img src="/logos/cbs-oficial.png" alt="CBS Importadora"/></div>
        <span className="eyebrow">PLATAFORMA COMERCIAL INTEGRADA</span>
        <h1>CRM <strong>COMERCIAL</strong></h1>
        <p>Mais organização, mais produtividade, mais resultados.</p>
        <div className="benefits"><div><Users/>Gerencie seus leads</div><div><Target/>Acompanhe oportunidades</div><div><TrendingUp/>Aumente suas vendas</div><div><ShieldCheck/>Tudo em um só lugar</div></div>
      </section>
      <section className="login-card">
        <div className="mobile-brand"><img src="/logos/waves-plus-oficial.png"/><img src="/logos/cbs-oficial.png"/></div>
        <span className="eyebrow">BEM-VINDO AO</span><h2>CRM Comercial</h2><p>Entre com seus dados para acessar o painel.</p>
        <form onSubmit={handleLogin}>
          <label>E-mail<div className="field"><Mail/><input name="email" type="email" placeholder="seu@email.com"/></div></label>
          <label>Senha<div className="field"><LockKeyhole/><input name="senha" type={showPassword?'text':'password'} placeholder="Sua senha"/><button type="button" className="icon-button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff/>:<Eye/>}</button></div></label>
          <button className="primary-button" disabled={loading}>{loading?'ENTRANDO...':'ENTRAR'}</button>
        </form>
        <button className="text-button">Cadastrar vendedor</button><small>WAVES PLUS + CBS · JUNTOS CONSTRUÍMOS O FUTURO</small>
      </section>
      {toast && <div className="toast">{toast}</div>}
    </main>;
  }

  const openLead = (lead) => { setSelectedLead(lead); setScreen('lead-detail'); };
  const updateStatus = (status) => { const updated={...selectedLead,status}; setSelectedLead(updated); setLeads(ls=>ls.map(l=>l.id===updated.id?updated:l)); notify('Status atualizado.'); };

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="sidebar-brand"><img src="/logos/waves-plus-oficial.png"/><img src="/logos/cbs-oficial.png"/></div>
      <nav>
        <Nav icon={LayoutDashboard} label="Início" active={screen==='dashboard'} onClick={()=>setScreen('dashboard')}/>
        <Nav icon={Users} label="Leads" active={['leads','lead-detail'].includes(screen)} onClick={()=>setScreen('leads')}/>
        <Nav icon={CalendarDays} label="Agenda" active={screen==='agenda'} onClick={()=>setScreen('agenda')}/>
        <Nav icon={UserRound} label="Perfil" active={screen==='profile'} onClick={()=>setScreen('profile')}/>
        {user?.admin && <Nav icon={BarChart3} label="Admin" active={screen==='admin'} onClick={()=>setScreen('admin')}/>} 
      </nav>
      <button className="logout-button" onClick={()=>{setUser(null);setScreen('login')}}><LogOut/>Sair</button>
    </aside>

    <section className="app-content">
      <header className="topbar"><div><span className="eyebrow">CRM COMERCIAL</span><h2>{pageTitle(screen)}</h2></div><div className="top-actions"><button className="icon-button"><Bell/></button><div className="avatar">{initials(user?.nome)}</div></div></header>

      {screen==='dashboard' && <>
        <section className="welcome-card"><div><span className="eyebrow">BOM DIA</span><h3>Olá, {user?.nome?.split(' ')[0]}! 👋</h3><p>Aqui está o resumo do seu desempenho comercial.</p></div><button className="primary-button compact" onClick={()=>setScreen('new-lead')}><Plus/>Novo lead</button></section>
        <section className="stats-grid"><Stat title="Leads" value={stats.total} icon={Users} tone="blue"/><Stat title="Oportunidades" value={stats.oportunidades} icon={Handshake} tone="green"/><Stat title="Negociações" value={stats.negociacoes} icon={TrendingUp} tone="orange"/><Stat title="Convertidos" value={stats.convertidos} icon={CheckCircle2} tone="purple"/></section>
        <section className="dashboard-grid"><article className="panel"><span className="eyebrow">PIPELINE</span><h3>Funil de vendas</h3><div className="funnel"><div className="blue">Novos</div><div className="cyan">Qualificados</div><div className="yellow">Proposta</div><div className="orange">Negociação</div><div className="green">Convertidos</div></div></article><article className="panel"><span className="eyebrow">ATIVIDADE</span><h3>Leads recentes</h3><div className="compact-leads">{leads.slice(0,4).map(l=><button key={l.id} onClick={()=>openLead(l)}><div className="lead-avatar">{initials(l.nome)}</div><div><strong>{l.empresa}</strong><small>{l.nome} · {l.cidade}</small></div><Status status={l.status}/></button>)}</div></article></section>
      </>}

      {screen==='new-lead' && <section className="panel form-panel"><button className="back-button" onClick={()=>setScreen('dashboard')}><ChevronLeft/>Voltar</button><span className="eyebrow">CADASTRO COMERCIAL</span><h3>Novo lead</h3><p>Preencha os dados essenciais para registrar uma nova oportunidade.</p><form className="lead-form" onSubmit={saveLead}><Input name="nome" label="Nome completo" icon={UserRound}/><Input name="empresa" label="Empresa" icon={Building2}/><Input name="telefone" label="Telefone / WhatsApp" icon={Phone}/><Input name="email" label="E-mail" icon={Mail}/><Input name="cidade" label="Cidade" icon={MapPin}/><Select name="segmento" label="Segmento"><option value="">Selecione</option><option>Serralheria</option><option>Construção Civil</option><option>Loja de Ferragens</option><option>Distribuidor</option><option>Indústria</option></Select><Select name="interesse" label="Interesse principal"><option value="">Selecione</option><option>Solda</option><option>Parafusos e fixadores</option><option>Abrasivos</option><option>Andaimes e escoras</option></Select><Select name="potencial" label="Potencial de compra"><option value="">Selecione</option><option>Baixo</option><option>Médio</option><option>Alto</option><option>Estratégico</option></Select><label className="form-field full"><span>Observações</span><textarea name="observacoes"/></label><button className="primary-button full" disabled={loading}>{loading?'SALVANDO...':'SALVAR LEAD'}</button></form></section>}

      {screen==='leads' && <section className="panel"><div className="panel-heading"><div><span className="eyebrow">GESTÃO COMERCIAL</span><h3>Lista de leads</h3></div><button className="primary-button compact" onClick={()=>setScreen('new-lead')}><Plus/>Novo lead</button></div><div className="search-box"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome, empresa ou cidade"/></div><div className="chips">{STATUS.map(s=><button key={s} className={statusFilter===s?'active':''} onClick={()=>setStatusFilter(s)}>{s}</button>)}</div><div className="lead-table">{filteredLeads.map(l=><button key={l.id} className="lead-row" onClick={()=>openLead(l)}><div className="lead-avatar">{initials(l.nome)}</div><div><strong>{l.empresa}</strong><small>{l.nome}</small></div><div><span>{l.cidade}</span><small>{l.telefone}</small></div><Status status={l.status}/></button>)}</div></section>}

      {screen==='lead-detail' && selectedLead && <><button className="back-button" onClick={()=>setScreen('leads')}><ChevronLeft/>Voltar</button><section className="detail-hero"><div className="lead-avatar large">{initials(selectedLead.nome)}</div><div><span className="eyebrow">DETALHES DO LEAD</span><h3>{selectedLead.empresa}</h3><p>{selectedLead.nome} · {selectedLead.cidade}</p></div><Status status={selectedLead.status}/></section><section className="detail-grid"><article className="panel"><Info icon={Phone} label="Telefone" value={selectedLead.telefone}/><Info icon={Mail} label="E-mail" value={selectedLead.email}/><Info icon={MapPin} label="Cidade" value={selectedLead.cidade}/><Info icon={Building2} label="Segmento" value={selectedLead.segmento}/><Info icon={Target} label="Interesse" value={selectedLead.interesse}/></article><article className="panel"><h3>Atividades e próximos passos</h3><div className="timeline"><div><MessageCircle/><span><strong>Contato via WhatsApp</strong><small>Conversamos sobre produtos e prazo.</small></span></div><div><Phone/><span><strong>Ligação realizada</strong><small>Apresentação da linha comercial.</small></span></div><div><CalendarDays/><span><strong>Reunião agendada</strong><small>Visita técnica ao cliente.</small></span></div></div><div className="detail-actions"><a className="whatsapp-button" href={`https://wa.me/55${selectedLead.telefone.replace(/\D/g,'')}`} target="_blank"><MessageCircle/>WhatsApp</a><a className="call-button" href={`tel:${selectedLead.telefone}`}><Phone/>Ligar</a></div><Select value={selectedLead.status} onChange={e=>updateStatus(e.target.value)} label="Atualizar status">{STATUS.filter(s=>s!=='Todos').map(s=><option key={s}>{s}</option>)}</Select></article></section></>}

      {screen==='agenda' && <section className="agenda-layout"><article className="panel"><span className="eyebrow">MAIO 2026</span><h3>Agenda comercial</h3><div className="calendar-grid">{['D','S','T','Q','Q','S','S'].map((d,i)=><strong key={i}>{d}</strong>)}{Array.from({length:35}).map((_,i)=><span key={i} className={i===19?'selected':''}>{i+1}</span>)}</div></article><article className="panel"><span className="eyebrow">PRÓXIMOS CONTATOS</span><h3>Compromissos</h3><div className="agenda-list"><div><strong>09:00</strong><span><b>Reunião com Marcos Construtora</b><small>Visita técnica na obra</small></span></div><div><strong>14:00</strong><span><b>Ligação — Serralheria Silva</b><small>Acompanhar proposta enviada</small></span></div><div><strong>16:30</strong><span><b>Follow-up — RC Estruturas</b><small>Negociação de valores</small></span></div></div></article></section>}

      {screen==='profile' && <section className="profile-card panel"><div className="profile-avatar">{initials(user?.nome)}</div><span className="eyebrow">MEU PERFIL</span><h3>{user?.nome}</h3><p>{user?.email}</p><p>{user?.telefone}</p><button className="danger-button" onClick={()=>{setUser(null);setScreen('login')}}><LogOut/>Sair da conta</button></section>}

      {screen==='admin' && <><section className="stats-grid"><Stat title="Total de leads" value={128} icon={Users} tone="blue"/><Stat title="Oportunidades" value={48} icon={Handshake} tone="green"/><Stat title="Negociações" value={18} icon={TrendingUp} tone="orange"/><Stat title="Convertidos" value={9} icon={CheckCircle2} tone="purple"/></section><section className="admin-grid"><article className="panel"><span className="eyebrow">EQUIPE</span><h3>Desempenho comercial</h3><div className="ranking-table"><div><b>Vendedor</b><b>Leads</b><b>Oport.</b><b>Conv.</b></div><div><strong>Edson Paz</strong><span>32</span><span>15</span><span>4</span></div><div><strong>João Victor</strong><span>28</span><span>10</span><span>2</span></div><div><strong>Maria Clara</strong><span>24</span><span>9</span><span>2</span></div></div></article><article className="panel conversion-panel"><div><span className="eyebrow">TAXA DE CONVERSÃO</span><strong>18%</strong><small>Conversão geral</small></div><div className="donut"/></article></section></>}
    </section>

    <nav className="mobile-nav"><button onClick={()=>setScreen('dashboard')}><LayoutDashboard/></button><button onClick={()=>setScreen('leads')}><Users/></button><button className="mobile-fab" onClick={()=>setScreen('new-lead')}><Plus/></button><button onClick={()=>setScreen('agenda')}><CalendarDays/></button><button onClick={()=>setScreen('profile')}><UserRound/></button></nav>
    {toast && <div className="toast">{toast}</div>}
  </main>;
}

function Nav({icon:Icon,label,active,onClick}) { return <button className={active?'active':''} onClick={onClick}><Icon/><span>{label}</span></button>; }
function Stat({title,value,icon:Icon,tone}) { return <article className={`stat-card ${tone}`}><div><span>{title}</span><strong>{value}</strong></div><Icon/></article>; }
function Status({status}) { return <span className={`status status-${status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}`}>{status}</span>; }
function Input({icon:Icon,label,...props}) { return <label className="form-field"><span>{label}</span><div><Icon/><input {...props} placeholder={label}/></div></label>; }
function Select({label,children,...props}) { return <label className="form-field"><span>{label}</span><select {...props}>{children}</select></label>; }
function Info({icon:Icon,label,value}) { return <div className="info-row"><Icon/><span><small>{label}</small><strong>{value || 'Não informado'}</strong></span></div>; }
function pageTitle(screen) { return ({dashboard:'Dashboard','new-lead':'Novo lead',leads:'Leads','lead-detail':'Detalhes do lead',agenda:'Agenda',profile:'Meu perfil',admin:'Dashboard administrativo'})[screen] || 'CRM Comercial'; }
