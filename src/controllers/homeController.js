const contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await contato.buscaPorContatos();
    res.render('index', { contatos }); 
}