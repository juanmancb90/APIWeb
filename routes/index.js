var express = require('express');
var router = express.Router();
var userModels = require('../models/users');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Servicio rest con nodejs, express 4 y mysql' });
});

/* Creamos un nuevo usuario */
router.post("/user", function(req,res)
{
    //creamos un objeto con los datos a insertar del usuario
    var userData = {
        id : null,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        created_at : null
    };
    userModels.insertUser(userData,function(error, data)
    {
        //si el usuario se ha insertado correctamente mostramos su info
        if(data && data.insertId)
        {
            res.redirect("/user/" + data.insertId);
        }
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
});
 
/* Actualizamos un usuario existente */
router.put('/user/', function(req, res)
{
    //almacenamos los datos del formulario en un objeto
    var userData = {id:req.param('id'),username:req.param('username'),email:req.param('email')};
    userModels.updateUser(userData,function(error, data)
    {
        //si el usuario se ha actualizado correctamente mostramos un mensaje
        if(data && data.msg)
        {
            res.redirect("/user/" + req.param('id'));
        }
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
});
 
/* Obtenemos un usuario por su id y lo mostramos en un formulario para editar */
router.get('/user/:id', function(req, res)
{
    var id = req.params.id;
    //solo actualizamos si la id es un número
    if(!isNaN(id))
    {
        userModels.getUser(id,function(error, data)
        {
            //si existe el usuario mostramos el formulario
            if (typeof data !== 'undefined' && data.length > 0)
            {
                res.render("update",{
                    title : "Servicio rest con nodejs, express 4 y mysql",
                    info : data
                });
            }
            //en otro caso mostramos un error
            else
            {
                res.json(404,{"msg":"notExist"});
            }
        });
    }
    //si la id no es numerica mostramos un error de servidor
    else
    {
        res.json(500,{"msg":"The id must be numeric"});
    }
});
 
/* Obtenemos y mostramos todos los usuarios */
router.get('/users/', function(req, res)
{
    userModels.getUsers(function(error, data)
    {
        //si existe el usuario mostramos el formulario
        if (typeof data !== 'undefined')
        {
            res.render("show",{
                title : "Servicio rest con nodejs, express 4 y mysql",
                users : data
            });
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404,{"msg":"notExist"});
        }
    });
});
 
/* ELiminamos un usuario */
router.delete("/user/", function(req, res)
{
    //id del usuario a eliminar
    var id = req.param('id');
    userModels.deleteUser(id,function(error, data)
    {
        if(data && data.msg === "deleted" || data.msg === "notExist")
        {
            res.redirect("/users/");
        }
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
});

module.exports = router;
