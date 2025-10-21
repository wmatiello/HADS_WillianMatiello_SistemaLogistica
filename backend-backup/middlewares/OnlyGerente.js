function onlyGerente(req, res, next) {
    if (req.profile?.perfil === "gerente") return next();
    return res.status(403).json({ error: "Acesso negado. Requer perfil gerente." });
  }
  
  module.exports = onlyGerente;
  