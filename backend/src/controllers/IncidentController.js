const connection = require('../database/connection');

module.exports = {

  async index(req, res){
    const { page = 1 } = req.query;

    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
    .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
    .limit(5)
    .offset((page - 1) * 5)
    .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);

    if(incidents.length === 0){
      res.json({ message: 'Até o momento não existem casos cadastrados pelas ONGS.'});
    }
    
    res.header('X-Total_Count', count['count(*)'])
    return res.json(incidents);
  },

  async create(req, res){
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });

    return res.json({ id });
  },

  async delete(req, res){
    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incident = await connection('incidents').where('id', id).select('ong_id').first();

    if (incident.ong_id !== ong_id){
      return res.status(401).json({ error: 'O caso que vocẽ está tendando excluir não pertence à sua ONG'});
    };

    await connection('incidents').where('id', id).delete();

    return res.status(204).send();
  }
}