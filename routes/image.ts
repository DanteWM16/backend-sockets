import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const imageRoutes = Router();

imageRoutes.get('/:tipo/:img', (req: Request, res: Response) => {
    const tipo = req.params.tipo;
    const img = req.params.img;

    // res.status(200).json({
    //     tipo: tipo,
    //     img: img
    // });

    const pathImagen = path.resolve(__dirname, `../../dist/uploads/${ tipo }/${ img }`);

    if ( fs.existsSync(pathImagen) ) {
        res.sendFile(pathImagen)
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }
});

export default imageRoutes;