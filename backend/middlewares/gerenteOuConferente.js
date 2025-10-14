function gerenteOuConferente(req, res, next) {
    if (["gerente", "conferente"].includes(req.profile?.perfil)) return next();
    return res.status(403).json({ error: "Acesso negado. Requer gerente ou conferente." });
  }
  
  module.exports = gerenteOuConferente;
  