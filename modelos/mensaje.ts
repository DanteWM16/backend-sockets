import { Document, Schema, Model, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IMensaje } from '../interfaces/mensaje';

export interface IMensajeModel extends IMensaje, Document {}
export var mensajeSchema: Schema = new Schema({
    de: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    para: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    mensaje: { type: String, required: [true, 'El mensaje es necesario'] },
    f_envio: { type: String, required: true },
    f_recep: { type: String, required: false },
    status: { type: String, required: false }
}, { collection: 'mensajes' });

export const Mensaje: Model<IMensajeModel> = model<IMensajeModel>("Mensaje", mensajeSchema);