import { Request, Response, request } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(req: Request, res: Response) {
    try {
      const { city, uf, items } = req.query;

      const parsedItens = String(items)
        .split(',')
        .map((item) => Number(item.trim()));
  
      const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItens)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://192.168.15.11:3333/uploads/${point.image}`,
        }
      })
  
      return res.json(serializedPoints); 
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
  
  async store(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items,
      } = req.body;
  
      const trx = await knex.transaction();
  
      const point = {
        image: request.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };
  
      const insertedIds = await trx('points').insert(point);
  
      const point_id = insertedIds[0];
  
      const pointItens = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
        return {
          item_id,
          point_id,
        }
      });
  
      await trx('point_items').insert(pointItens);
  
      await trx.commit();
  
      return res.json({
        id: point_id,
        ...point,
      });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({ message: 'Point not found' });
    }

    const serializedPoints = {
      ...point,
      image_url: `http://192.168.15.11:3333/uploads/${point.image}`,
    };

    const items = await knex('items')
    .join('point_items', 'items.id', '=', 'point_items.item_id')
    .where('point_items.point_id', id)
    .select('items.title');


    return res.json({
      point: serializedPoints,
      items
    });
  }
}

export default new PointsController();
