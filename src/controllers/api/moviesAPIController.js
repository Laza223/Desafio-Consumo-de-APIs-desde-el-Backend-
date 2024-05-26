const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const fetch = require('node-fetch');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesAPIController = {
    'list': (req, res) => {
        if(req.params.titulo){
            c985b3bf
            db.Movie.findAll()
            .then(movies => {
                let respuesta = {
                    meta: {
                        status : 200,
                        total: movies.length,
                        url: 'api/movies'
                    },
                    data: movies
                }
                res.json(respuesta);
            })
        }
        else{
            
            fetch(`http://www.omdbapi.com/?apikey=c985b3bf&t=${req.params.titulo}`)
            .then(response => response.json())
            .then(movie => {
                let respuesta = {
                    meta: {
                        status : 200,
                        total: movie.length,
                        url: 'api/movies'
                    },
                    data: movie
                }
                res.json(respuesta);
            })
        }
    },
    
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total: movie.length,
                        url: '/api/movie/:id'
                    },
                    data: movie
                }
                res.json(respuesta);
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : req.params.rating}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
        .then(movies => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: movies.length,
                    url: 'api/movies/recomended/:rating'
                },
                data: movies
            }
                res.json(respuesta);
        })
        .catch(error => console.log(error))
    },
    create: (req,res) => {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        .then(movies => {
            let respuesta;
            if(movies){
                respuesta ={
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: 'api/movies/create'
                    },
                    data:movies
                }
            }else{
                respuesta ={
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: 'api/movies/create'
                    },
                    data:movies
                }
            }
            res.json(respuesta);
        })    
        .catch(error => res.send(error))
    },
    update: (req,res) => {
        let movieId = req.params.id;
        Movies.update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
        })
        .then(movies => {
            let respuesta;
            if(movies){
                respuesta ={
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: 'api/movies/update/:id'
                    },
                    data:movies
                }
            }else{
                respuesta ={
                    meta: {
                        status: 204,
                        total: movies.length,
                        url: 'api/movies/update/:id'
                    },
                    data:movies
                }
            }
            res.json(respuesta);
        })    
        .catch(error => res.send(error))
    },
    destroy: (req,res) => {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}})
        .then(movies => {
            let respuesta;
            if(movies){
                respuesta ={
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: 'api/movies/delete/:id'
                    },
                    data:movies
                }
            }else{
                respuesta ={
                    meta: {
                        status: 204,
                        total: movies.length,
                        url: 'api/movies/delete/:id'
                    },
                    data:movies
                }
            }
            res.json(respuesta);
        })    
        .catch(error => res.send(error))
    }
    
}

module.exports = moviesAPIController;