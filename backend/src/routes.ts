import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi  } from 'celebrate';

import PointsController from './controllers/PointsController';
import ItensController from './controllers/ItensController';

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/itens', ItensController.index);

routes.post('/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false,
  }),
  PointsController.store
);
routes.get('/points', PointsController.index);
routes.get('/points/:id', PointsController.show);

export default routes;