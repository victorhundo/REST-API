//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var db = require('../modules/db');
var util = require('util');
var should = chai.should();
var expect = chai.expect;
var Lando = require('../models/dissendo');
var Retlisto = require('../models/retlisto');
var jwt  = require('jsonwebtoken');
var config = require('../config');

chai.use(chaiHttp);
describe('Dissendoj', function() {
    var token = '';
    beforeEach( function(done) { //Before each test we empty the database
      var query = util.format('DELETE FROM `dissendo`');
      db.mysqlExec(query).then(function(result){});
      var query = util.format('DELETE FROM `retlisto`');
      db.mysqlExec(query).then(function(result){});
      var administranto = {
        id: 1,
        uzantnomo: 'nomo',
        permesoj: [3]
      };
      token = jwt.sign(administranto, config.sekretoJWT, {expiresIn: 18000});
      done();
    });

    var retlisto = { nomo: 'nomo', priskribo: 'priskribo'};
    var dissendo = { dissendanto: 1, dato: '1996-05-05', temo:'temo', teksto:'teksto', idRetlisto: 1};
    var abonanto = { ekde: '1996-05-05', formato_html:true, kodigxo_utf8:true, retadreso:'email@email.com'};


    describe('GET /dissendoj', function(){
     it('it should GET empty dissendoj', function(done){
       chai.request(server)
           .get('/dissendoj')
           .set('x-access-token', token)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.length.should.equals(0);
               done();
           });
     });


     describe('POST /dissendoj', function(){
         it('it should POST a dissendo - with token', function (done) {
             chai.request(server)
                 .post('/dissendoj')
                 .set('x-access-token', token)
                 .send(dissendo)
                 .end(function (err, res) {
                     res.should.have.status(201)
                     done();
                 });
            });
      });

      describe('GET /dissendoj/:id', function(){
          it('it should GET a retlisto - with token', function (done) {
                  var query = util.format('INSERT INTO dissendo VALUES (1, 1, "1996-05-05", "temo", "teksto", 1);');
                  db.mysqlExec(query).then(function(result){
                     chai.request(server)
                     .get('/dissendoj/1')
                     .set('x-access-token', token)
                     .end((err, res) => {
                       res.should.have.status(200);
                       done();
                     });
               });
         });
      });

      describe('GET /dissendoj/retlistoj', function(){
       it('it should GET empty retlistoj', function(done){
         chai.request(server)
             .get('/dissendoj/retlistoj')
             .end((err, res) => {
                 res.should.have.status(200);
                 res.body.length.should.equals(0);
                 done();
             });
           });
        });

        describe('POST /dissendoj/retlistoj', function(){
            it('it should POST a dissendo - with token', function (done) {
                chai.request(server)
                    .post('/dissendoj/retlistoj')
                    .set('x-access-token', token)
                    .send(retlisto)
                    .end(function (err, res) {
                        res.should.have.status(201)
                        done();
                    });
               });
         });

         describe('DELETE /dissendoj/retlistoj', function(){
             it('it should DELETE a retlisto - with token', function (done) {
                     Retlisto.insert(retlisto.nomo, retlisto.priskribo).then(function (success) {
                         chai.request(server)
                             .delete('/dissendoj/retlistoj/' + success.insertId)
                             .set('x-access-token', token)
                             .end(function (err, res) {
                                 res.should.have.status(200);
                                 res.body.message.should.equal("Ok");
                                 done();
                             });
                        });
                  });
            });

            describe('POST /dissendoj/retlistoj/:id/abonantoj', function(){
                it('it should POST a dissendo - with token', function (done) {
                   Retlisto.insert(retlisto.nomo, retlisto.priskribo).then(function (success) {
                     chai.request(server)
                       .post('/dissendoj/retlistoj/' + success.insertId + '/abonantoj')
                       .set('x-access-token', token)
                       .send(abonanto)
                       .end(function (err, res) {
                           res.should.have.status(201);
                           done();
                         });
                    });
                });
            });

   });
});
