/*Libraries*/
var util = require('util');
var jwt  = require('jsonwebtoken');
var randomstring = require('randomstring');
var bodyParser = require('body-parser');

/*config*/
var config = require('../config.js');

/*models*/
var Uzanto = require('../models/uzanto');
var UzantoAuxAsocio = require('../models/uzantoAuxAsocio');
var Grupo = require('../models/grupo');

/*modules*/
var query = require('../modules/query');
var hash = require('../modules/hash');
var mail = require('../modules/mail');
var file = require('../modules/file');

/*
  POST - /uzantoj/ensaluti
*/
var _ensaluti = function(req, res) {
  UzantoAuxAsocio.findUzantnomo(req.body.uzantnomo).then(
    function(sucess) {
      if (sucess.length == 0) {
        res.status(401).send({message: 'La uzantnomo ne ekzistas'});
      }

      if (!hash.valigiPasvorto(sucess[0].pasvortoSalt, req.body.pasvorto,
                                sucess[0].pasvortoHash)) {
        res.status(401).send({message: 'Malkorekta pasvorto'});
      }

      var uzanto = {
        id: sucess[0].id,
        uzantnomo: sucess[0].uzantnomo,
        permeso: 'uzanto'
      };

      // kaze uzanto estas trovita kaj pasvorto estas korekta
      // oni kreas iun token
      var token = jwt.sign(uzanto, config.sekretoJWT, {expiresIn: 18000});

      res.status(200).send({token: token});
    });
}

/*
  GET /uzantoj/:id
*/
var _getUzanto = function(req, res){
  Uzanto.find('id', req.params.id).then(function(sucess){
      var uzanto = sucess;
      res.status(200).send(uzanto);
  });
}

var _postUzanto = function(req, res){
   UzantoAuxAsocio.insert(req.body.uzantnomo, req.body.pasvorto, req.body.ueakodo).then(
    function (result){
      if (result) {
        Uzanto.insert(result.insertId, req.body.personanomo, req.body.familianomo, req.body.titolo,
                      req.body.bildo, req.body.adreso, req.body.posxtkodo, req.body.idLando,
                      req.body.naskigxtago, req.body.notoj, req.body.retposxto, req.body.telhejmo,
                      req.body.teloficejo, req.body.telportebla, req.body.tttpagxo).then(
              function(success) {
                var html = util.format(
                       'Estimata uzanto, <br><br>\
                        Via aliĝo por UEA estis registrita. En kelkaj tagoj, vi ricevos konfirmon\
                        de via pago kaj povos ekuzi viajn membrservojn<br>\
                        En kazo de duboj, kontaktu info@uea.org. \
                        <br><br>Kore,<br><br>\
                        La UEA-Teamo');
                var to = util.format('{"%s" : "UEA-membro"}', req.body.retposxto);
                var mailOptions = {
                    to: JSON.parse(to),
                    subject: 'Nova aliĝo',
                    html: html
                  };
                mail.sendiRetmesagxo(mailOptions);
                res.status(201).send({id: result.insertId});
              },
              function (fail) {
                res.status(500).send({message: 'Internal Error'});
              }
            );
      }
      else {
        Uzanto.find('retposxto', req.body.uzantnomo).then(function(result) {
          res.status(200).send({id: result[0].id});
        });
      }
    });
}

var _forgesisPasvorton = function(req, res) {
    Uzanto.findForgesis(req.body.retposxto, req.body.naskigxtago).then(
      function(sucess) {
        if (sucess.length > 0) {
          var novaPasvorto = randomstring.generate(10);
          var pasvortajDatumoj = hash.sha512(novaPasvorto, null);
          UzantoAuxAsocio.update(sucess[0].id, 'pasvortoSalt', pasvortajDatumoj.salt);
          UzantoAuxAsocio.update(sucess[0].id, 'pasvortoHash', pasvortajDatumoj.hash);
          UzantoAuxAsocio.find(sucess[0].id).then(
          function (sucess) {
            if(req.body.retposxto) {
                var html = util.format(
                       'Estimata uzanto, <br><br>\
                        La pasvorto por via membrspaco ĉe UEA estas nun: %s  <br> \
                        Ni rekomendas tuj ŝanĝi tiun pasvorton je ensaluto en la membra retejo. \
                        <br><br>Agrablan uzadon,<br><br>\
                        La UEA-Teamo', novaPasvorto);
                var to = util.format('{"%s" : "UEA-membro"}', req.body.retposxto);
                var mailOptions = {
                    to: JSON.parse(to),
                    subject: 'Restarigo de la forgesita pasvorto por UEA',
                    html: html
                  }
                mail.sendiRetmesagxo(mailOptions);
              }
            res.status(200).send({message: 'Nova pasvorto estis sendita al via retpoŝto'});
        });
      }
      else {
          res.status(400).send({message: "Ne ekzistas uzantoj kun la indikitaj datumoj je la sistemo"});
      }
  });
}

var _updateUzanto = function(req, res){
  if (req.body.kampo == 'id') {
    res.status(403).send({message: "vi ne povas ŝanĝi vian ID"});
    return;
  }

  if (req.body.kampo == 'pasvorto') {
    var novaPasvorto = req.body.valoro;
    var pasvortajDatumoj = hash.sha512(novaPasvorto, null);
    UzantoAuxAsocio.update(req.params.id, 'pasvortoSalt', pasvortajDatumoj.salt);
    UzantoAuxAsocio.update(req.params.id, 'pasvortoHash', pasvortajDatumoj.hash);
    res.status(200).send({message: "Ĝisdatigo sukcese farita"});
    return;
  }

  if((req.body.kampo == 'ueakodo') || (req.body.kampo == 'uzantnomo')) {
    UzantoAuxAsocio.update(req.params.id, req.body.kampo, req.body.valoro).then(
      function(sucess){
        if(sucess) {
          res.status(200).send({message: "Ĝisdatigo sukcese farita"});
        } else {
          res.status(500).send({message: "Eraro en la servilo"});
        }
      });
      return;
  }

  Uzanto.update(req.params.id, req.body.kampo, req.body.valoro).then(
    function(sucess) {
      if (sucess) {
        res.status(200).send({message: "Ĝisdatigo sukcese farita"});
      } else {
        res.status(500).send({message: "Eraro en la servilo"});
      }
  });
}

var _cxuMembro = function(req, res) {
  if(!req.params.retposxto) {
    res.status(200).send({membroID: false});
  }

  Uzanto.find('retposxto', req.params.retposxto).then(
    function(sucess){
      if(sucess && sucess.length >= 1) {
        var id = sucess[0].id;
        Grupo.findKategorio(config.idMembrecgrupo).then(function(sucess){
            var grupoj = sucess;
            var promises = [];
            for(var i = 0; i < grupoj.length; i++) {
              promises.push(Grupo.findAnoj(grupoj[i].id));
            }
            Promise.all(promises).then(function(values){
              for(var i = 0; i < values.length; i++) {
                 var ano = values[i].filter(query.search({idAno:id}));
                 if(ano.length >= 1) {
                   var result = {uzantoID: id,
                                 membro: true,
                                 idGrupo: ano[0].idGrupo,
                                 komencdato: ano[0].komencdato,
                                 dumviva: parseInt(ano[0].dumviva.toString('hex')),
                                 aprobita: parseInt(ano[0].aprobita.toString('hex')),
                                 findato: ano[0].findato};
                   result = result.filter(query.search(req.query));
                   res.status(200).send(result);
                   return;
                  }
              }
              res.status(200).send({uzantoID: id, membro: false});
            });
        });
      } else {
        res.status(200).send({uzantoID: -1, membro: false});
      }
    });
}

var _postBildo = function(req, res) {
  file.writeFile('/uzantbildoj', 'uzantbildo' + req.params.id, 'file', req, res);
}

var _getBildo = function(req, res) {
  file.readFile('/uzantbildoj/uzantbildo' + req.params.id, 'image/png', res);
}

var _getGrupoj = function(req,res) {
  Uzanto.findGrupoj(req.params.id).then(function(sucess){
    res.status(200).send(sucess);
  });
}

var _delete = function(req, res) {
  UzantoAuxAsocio.delete(req.params.id).then(function(sucess){
    UzantoAuxAsocio.find(req.params.id).then(function(sucess){
      if(sucess.length <= 0){
        Uzanto.delete(req.params.id).then(function(sucess){
          Uzanto.find('id', req.params.id).then(function(sucess){
            if(sucess.length <= 0)
              res.status(204).send({message: 'Ok'});
            else
              res.status(500).send({message: 'Internal Error'});
          });
        });
      } else {
        res.status(500).send({message: 'Internal Error'});
      }
    });
  });
}

module.exports = {
  forgesisPasvorton:_forgesisPasvorton,
  getGrupoj:_getGrupoj,
  postBildo: _postBildo,
  getBildo: _getBildo,
  getUzanto: _getUzanto,
  postUzanto: _postUzanto,
  updateUzanto: _updateUzanto,
  ensaluti: _ensaluti,
  cxuMembro: _cxuMembro,
  delete: _delete
}
