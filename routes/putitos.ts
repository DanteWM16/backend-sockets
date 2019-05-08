import {Request, Response, Router} from 'express';
import { Usuario } from '../modelos/usuario';
import { IUsuario } from '../interfaces/usuario';

const putinRoutes = Router();

//===================================================
// Crear putin
//===================================================
putinRoutes.post('/', (req: Request, res: Response) => {
    const body: IUsuario = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
    });

    usuario.save((err: any, usuarioGuardado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                err: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario guardado',
            usuario: usuarioGuardado
        });
    });

});


//===================================================
// Ver putin
//===================================================
putinRoutes.get('/', (req: Request, res: Response) => {
    
    Usuario.find((err, usuariosDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                err: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuariosDB
        });
    });

});

//===================================================
// Actualizar putin
//===================================================
putinRoutes.put('/', (req: Request, res: Response) => {

});

//===================================================
// Borrar putin
//===================================================
putinRoutes.delete('/', (req: Request, res: Response) => {

});