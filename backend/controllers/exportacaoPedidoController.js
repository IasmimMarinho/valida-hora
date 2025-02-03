const ExportacaoService = require('../services/exportacaoPedidoService');
const Exportacao = require('../models/ExportacaoPedido');
require('dotenv').config();

class ExportacaoController {

    async exportarPedidos(req, res) {
        try {
            const { id_usuario } = req.params;
            const caminhoArquivo = await ExportacaoService.gerarArquivoTxt(id_usuario);
            res.download(caminhoArquivo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async baixarArquivo(req, res) {
        try {
            const { id_usuario } = req.params;

            const result = await Exportacao.buscarArquivoPorUsuario(id_usuario);

            if (result.length === 0) {
                return res.status(404).json({ message: 'Nenhum arquivo encontrado para esse usuário.' });
            }

            const { nome_arquivo, conteudo } = result[0];

            res.setHeader('Content-Disposition', `attachment; filename=${nome_arquivo}`);
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.send(conteudo);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao baixar o arquivo.', error: error.message });
        }
    }
}

module.exports = new ExportacaoController();
