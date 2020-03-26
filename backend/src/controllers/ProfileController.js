const connection = require('../database/connection');

module.exports = {

  async index(req, res){

    const ong_id = req.headers.authorization;

    const incidents = await connection('incidents').where('ong_id', ong_id).select('*');

    if(incidents.length === 0){
      return res.json({ message: 'Não existem casos cadastrados por sua ONG.'})
    }

    return res.json(incidents);
  }
}