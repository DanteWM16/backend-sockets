import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../clases/usuarios-lista';
import { Usuario } from '../clases/usuario';
import { IUsuario } from '../interfaces/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {
    console.log('Usuario ' + cliente.id + ' conectado');
    io.to(cliente.id).emit('logueate-usuario');
    // const usuario = new Usuario( cliente.id );
    // usuariosConectados.agregar( usuario );
}

// Desconectar usuario
export const desconectar = ( cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario( cliente.id );
        io.emit('usuarios-activos', usuariosConectados.getLista() );
        console.log('Usuario desconectado ', cliente.id);
    });
}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string} ) => {
        console.log('Mensaje recibido ', payload);

        io.emit('mensaje-nuevo', payload);
    });
}

// Configurar nombre de usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configurar-usuario', (payload: IUsuario, callback: Function ) => {

        let grupo: string;

        if ( payload.grupo ) {
            grupo = payload.grupo;
            cliente.join(grupo);

            console.log('Usuario conectado al grupo: ', grupo);
        }
        //usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
       usuariosConectados.agregar( payload, cliente.id );
       io.to(cliente.id).emit('usuario-logueado');
        io.emit('usuarios-activos', usuariosConectados.getLista() );

        callback({
            ok: true,
            mensaje: `Usuario ${ cliente.id }, configurado`
        });
    });
}

// Obtener usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('obtener-usuarios', () => {
        
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista() );

    });
}
