const { request ,response } = require('express');
const Evento = require('../models/Evento');

// {
//     ok: true,
//     msg: 'Obtener eventos'
// }


const getEventos = async(req = request, res = response) => {
    const eventos = await Evento.find().populate('user','name');

    return res.status(200).json({
        ok: true,
        eventos
    })
} 

const crearEvento = async(req = request, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;
        
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            eventoGuardado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

} 


const actualizarEvento = async(req = request, res = response) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById(eventoId);

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese id'
            })
        }

        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //el {new: true} regresa en la constante los datos actuzliados para imprimirlos
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        return res.status(200).json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

} 


const eliminarEvento = async(req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    
    try {
        
        const evento = await Evento.findById(eventoId);

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese id'
            })
        }

        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoId);

        return res.status(200).json({
            ok: true   
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
} 

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}


