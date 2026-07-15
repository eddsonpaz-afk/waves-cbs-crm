async function saveLead(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.nome || !data.telefone || !data.cidade) {
    notify("Preencha nome, telefone e cidade.");
    return;
  }

  setLoading(true);

  try {
    const result = await api("createLead", {
      lead: data,
      vendedor: user?.email || ""
    });

    const newLead = {
      id: result.id || `LD-${Date.now()}`,
      ...data,
      status: "Novo"
    };

    setLeads((current) => [newLead, ...current]);

    // Limpa todos os campos somente depois de salvar de verdade
    form.reset();

    notify("Lead salvo com sucesso!");

    setScreen("leads");
  } catch (error) {
    console.error("Erro ao salvar lead:", error);

    notify(
      error instanceof Error
        ? error.message
        : "Não foi possível salvar o lead."
    );
  } finally {
    setLoading(false);
  }
}
