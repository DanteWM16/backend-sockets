import { Router, Request, Response } from 'express';
import { Mensaje } from '../modelos/mensaje';
import { Usuario } from '../modelos/usuario';
import * as socket from '../sockets/sockets';
import { UsuariosLista } from '../clases/usuarios-lista';
import { IUsuario } from '../interfaces/usuario';

const chatRoutes = Router();
var lista: IUsuario[] = [];

//================================================
// Obtener todos los usuarios activos
//================================================

// chatRoutes.post('/nMensaje', (req: Request, res: Response) => {
//     const body = req.body;

//     Promise.all([verificaEmisor(body.de), verificaReceptor(body.para), idsDiferentes(body.de, body.para), verficarOnline()])
//             .then( ( respuestas: any ) => {
//                 const mensaje = new Mensaje({
//                     de: body.de,
//                     para: body.para,
//                     mensaje: body.mensaje,
//                     f_envio: new Date().toLocaleString(),
//                     status: 'SERVIDOR'
//                 });

//                 mensaje.save((err: any, mensajeG: any ) => {
//                     if ( err ) {
//                         return res.status(500).json({
//                             ok: false,
//                             mensaje: 'Error al enviar mensaje'
//                         });
//                     }

//                     res.status(200).json({
//                         ok: true,
//                         mensaje: 'Mensaje enviado',
//                         mensajeDB: mensajeG,
//                         usuariosOnline: respuestas[3]
//                     });
//                 })
//             })
//             .catch( (err: any) => {
//                 return res.status(400).json({
//                     ok: false,
//                     respuestas: err
//                 });
//             });
// });

function verificaEmisor( id: string ) {
    var emisor = new Promise((resolve, reject) => {
        Usuario.findById(id, '_id nombre apellidoP apellidoM email img')
        .exec( (err: any, emisor: any) => {
            if ( err ) {
                reject('El id del emisor no existe');
            }
            resolve( emisor );
        });
    });

    return emisor;
}

function verificaReceptor( id: string ) {
    var receptor = new Promise( (resolve, reject) => {
        Usuario.findById(id, '_id nombre apellidoP apellidoM email img')
        .exec( (err: any, receptor: any) => {
            if ( err ) {
                reject('El id del receptor no existe');
            }
            resolve( receptor );
        });
    });

    return receptor;
}

function idsDiferentes ( emisor: string, receptor: string ) {
    var sonDiferentes = new Promise( ( resolve, reject ) => {
        if ( emisor === receptor ) {
            reject ('Los ids deben ser diferentes');
        } else {
            resolve();
        }
    });

    return sonDiferentes;
}

function verficarOnline( id: string ) {
    var usuarioOnline = new Promise((resolve, reject) => {
        resolve(socket.usuariosConectados);
    });

    return usuarioOnline;
}



export default chatRoutes;