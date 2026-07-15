const PLANILHA_ID = '1A9A5BAK-A8lGVTKU1PmIQ6stXrbSKsa65bxhrMQvIes';

function doGet() {
  return jsonResponse({ success: true, message: 'API CRM Waves Plus + CBS funcionando.' });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const action = String(payload.action || '');
    if (action === 'login') return jsonResponse(login(payload.email, payload.senha));
    if (action === 'createLead') return jsonResponse(createLead(payload.lead || {}, payload.vendedor || ''));
    if (action === 'listLeads') return jsonResponse(listLeads(payload.vendedor || ''));
    if (action === 'updateLead') return jsonResponse(updateLead(payload.id, payload.status, payload.observacoes));
    if (action === 'stats') return jsonResponse(getStats(payload.vendedor || ''));
    return jsonResponse({ success: false, message: 'Ação não reconhecida: ' + action });
  } catch (error) {
    return jsonResponse({ success: false, message: error.toString() });
  }
}

function getSheet(name) {
  const spreadsheet = SpreadsheetApp.openById(PLANILHA_ID);
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    if (name === 'Vendedores') {
      sheet.appendRow(['Nome', 'Email', 'Telefone', 'Senha', 'DataCadastro']);
      sheet.appendRow(['Administrador', 'admin@wavesplus.com', '(85) 3031-8830', 'admin123', new Date()]);
    }
    if (name === 'Leads') {
      sheet.appendRow(['ID','Nome','Empresa','Email','Telefone','Cidade','Segmento','Interesse','Potencial','Observacoes','Origem','Data','Status','Vendedor','ProximoContato','UltimaAtualizacao']);
    }
  }
  return sheet;
}

function login(email, senha) {
  email = String(email || '').trim().toLowerCase();
  senha = String(senha || '').trim();
  const rows = getSheet('Vendedores').getDataRange().getValues();
  for (let index = 1; index < rows.length; index++) {
    const rowEmail = String(rows[index][1] || '').trim().toLowerCase();
    const rowSenha = String(rows[index][3] || '').trim();
    if (rowEmail === email && rowSenha === senha) {
      return { success: true, user: { nome:String(rows[index][0]||''), email:rowEmail, telefone:String(rows[index][2]||''), admin:rowEmail==='admin@wavesplus.com' } };
    }
  }
  return { success: false, message: 'E-mail ou senha incorretos.' };
}

function createLead(lead, vendedor) {
  const now = new Date();
  const id = 'LD-' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random()*900+100);
  getSheet('Leads').appendRow([id,lead.nome||'',lead.empresa||'',lead.email||'',lead.telefone||'',lead.cidade||'',lead.segmento||'',lead.interesse||'',lead.potencial||'',lead.observacoes||'',lead.origem||'CRM Comercial',now,'Novo',vendedor||'',lead.proximoContato||'',now]);
  return { success:true, message:'Lead salvo com sucesso.', id:id };
}

function listLeads(vendedor) {
  vendedor = String(vendedor || '').trim().toLowerCase();
  const rows = getSheet('Leads').getDataRange().getValues();
  const leads = [];
  for (let index=1; index<rows.length; index++) {
    const emailVendedor = String(rows[index][13]||'').trim().toLowerCase();
    if (vendedor !== 'admin@wavesplus.com' && emailVendedor !== vendedor) continue;
    leads.push({ id:String(rows[index][0]||''), nome:String(rows[index][1]||''), empresa:String(rows[index][2]||''), email:String(rows[index][3]||''), telefone:String(rows[index][4]||''), cidade:String(rows[index][5]||''), segmento:String(rows[index][6]||''), interesse:String(rows[index][7]||''), potencial:String(rows[index][8]||''), observacoes:String(rows[index][9]||''), origem:String(rows[index][10]||''), data:rows[index][11], status:String(rows[index][12]||'Novo'), vendedor:String(rows[index][13]||'') });
  }
  return { success:true, leads:leads.reverse() };
}

function updateLead(id,status,observacoes) {
  const sheet=getSheet('Leads'); const rows=sheet.getDataRange().getValues();
  for(let index=1;index<rows.length;index++){
    if(String(rows[index][0]||'')===String(id||'')){
      sheet.getRange(index+1,13).setValue(status||'Novo');
      if(observacoes){const current=String(rows[index][9]||'');sheet.getRange(index+1,10).setValue(current?current+'\n'+observacoes:observacoes)}
      sheet.getRange(index+1,16).setValue(new Date());
      return {success:true,message:'Lead atualizado com sucesso.'};
    }
  }
  return {success:false,message:'Lead não encontrado.'};
}

function getStats(vendedor) {
  const result=listLeads(vendedor); if(!result.success)return result; const leads=result.leads;
  return {success:true,stats:{total:leads.length,oportunidades:leads.filter(l=>['Qualificado','Proposta'].indexOf(l.status)!==-1).length,negociacoes:leads.filter(l=>l.status==='Negociação').length,convertidos:leads.filter(l=>l.status==='Convertido').length}};
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
