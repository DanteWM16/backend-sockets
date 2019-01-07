import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Usuario } from '../modelos/usuario';
import jwd from 'jsonwebtoken';
import { SEED } from '../global/enviroment';

const loginRoutes = Router();


//================================================
// Login
//================================================
loginRoutes.post('/', (req: Request, res: Response ) => {
    const body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al tratar de ingresar',
                err: err
            });
        }

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                err: err
            });
        }

        if ( usuarioDB.status === 'INACTIVO' ) {
            return res.status(200).json({
                ok: false,
                mensaje: 'El usuario esta inactivo, contacte a un administrador'
            });
        }

        if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                err: err
            });
        }

        usuarioDB.lingreso = new Date().toLocaleString();

        usuarioDB.save((err, usuarioDBA) => {
            if ( err ) {
                console.log('error en la actualizacion de ultima conexion');
            }

            const token = jwd.sign({ usuario: usuarioDBA }, SEED, { expiresIn: 14400} );

            usuarioDBA.password = 'XD';

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id,
                menu: obtenerMenu(usuarioDB.role)
            });
        });

    });
});

function obtenerMenu(ROLE: any) {
    var menu = [{
        titulo: 'Principal',
        icono: 'zmdi zmdi-dns zmdi-hc-fw',
        submenu: [
            { titulo: 'Dashboard', url: '/dashboard' },
            // { titulo: 'Configuraciones', url: '/configuraciones' },
            { titulo: 'Seguimiento', url: '/seguimiento' },
            { titulo: 'Logistica', url: '/logistica' }
        ]
    },
    {
        titulo: 'Mantenimiento',
        icono: 'zmdi zmdi-wrench zmdi-hc-fw',
        submenu: [
            // { titulo: 'Usuarios', url: '/usuarios' },
            { titulo: 'Comandantes', url: '/comandantes' },
            { titulo: 'Bases de operaciones', url: '/bo' }
        ]
    }
];

if (ROLE === 'ADMIN_ROLE') {
    menu[1].submenu.push({ titulo: 'Usuarios', url: '/usuarios' });
}


return menu;
}

export default loginRoutes;