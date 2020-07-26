/* ******* CONSTANTES PARA TRABAJAR CON JSON *********** */
const jsonModel = require('../models/jsonModel');
const planesModel = jsonModel('planesDataBase');
const instructivoModel = jsonModel('instructionsDataBase');
const recetasModel = jsonModel('recetasDataBase');
/* ******* CONSTANTES PARA TRABAJAR CON JSON *********** */

/* ******* CONSTANTES PARA TRABAJAR CON BASE DE DATOS *********** */
const db = require('../database/models');
/* ******* CONSTANTES PARA TRABAJAR CON BASE DE DATOS *********** */

// Creo el enumerado para no manejarme con datos fijos en el código
const planes = {
    PLAN_FAMILIAR: 1,
    PLAN_EQUILIBRADO: 2,
    PLAN_VEGETARIANO: 3,
    PLAN_PERSONALIZADO: 4
}

const controller ={
    root: (req, res) => {
       
       /* **** CODIGO PARA DB ***** */
       db.plans.findAll()
       .then((planes)  => {
            let instructive = instructivoModel.leerJson(); // Como no está el modelo del instructivo, lo leo del JSON
            return res.render('planes-list', {planes, instructive});
       })
       .catch(reason => { 
            console.log(reason);
       });
       /* **** CODIGO PARA DB ***** */
    },

    detail: (req, res)=>{
        let planBuscado = req.params.planid;
        // El plan 4 es el plan personalizado

        if (planBuscado != planes.PLAN_PERSONALIZADO){
            db.plans.findByPk(planBuscado, {
                include: [{association: 'receta'}]
            })
            .then((plan) => {
                //Calculo el precio total del plan consultando en la BD de recetas por el Plan elegido
                db.recipes.sum('precio', {
                    where: {
                        planId: planBuscado
                    }
                }).then((precioTotal)=>{
                    // console.log('El precio de devuelve la base es:'+ parseFloat(precioTotal));
                    return res.render('planes-detail', {plan, precioTotal });
                })                
                .catch(reason => { 
                    console.log(reason);
                })
            })
        }else{
            db.recipes.findAll()
            .then((recetas) => {
                return res.render('plan-personalizado', {recetas});
            })
            .catch((reason) => {
                console.log(reason);
            })
        }
    }
};

module.exports = controller;
