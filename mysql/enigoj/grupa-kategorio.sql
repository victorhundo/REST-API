/*ekzemple, membro, komisiono, ktp*/
INSERT INTO grupa_kategorio ()
  VALUES (
    1,  /*id laborgrupo*/
    "laboro" /*nomo varchar(255)*/
  );

INSERT INTO grupa_kategorio ()
  VALUES (
    2,  /*id laborgrupo*/
    "komitato" /*nomo varchar(255)*/
  );

INSERT INTO grupa_kategorio ()
  VALUES (
    3,  /*id laborgrupo*/
    "komisiono" /*nomo varchar(255)*/
  );

INSERT INTO grupa_kategorio ()
  VALUES (
    4,  /*id laborgrupo*/
    "membreco" /*nomo varchar(255)*/
  );

INSERT INTO grupa_kategorio ()
  VALUES (
      5,  /*id laborgrupo*/
      "aldona membreckategorio" /*nomo varchar(255)*/
  );

INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   9, /*idGrupo int(11) REFERENCES grupo(id)*/
   5 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
  );

INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   6, /*idGrupo int(11) REFERENCES grupo(id)*/
   4 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
  );

INSERT INTO ref_grupo_grupa_kategorio ()
VALUES (
   7, /*idGrupo int(11) REFERENCES grupo(id)*/
   4 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);

INSERT INTO ref_grupo_grupa_kategorio ()
VALUES (
   8, /*idGrupo int(11) REFERENCES grupo(id)*/
   4 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);

INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   1, /*idGrupo int(11) REFERENCES grupo(id)*/
   1 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);

INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   2, /*idGrupo int(11) REFERENCES grupo(id)*/
   1 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);


INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   2, /*idGrupo int(11) REFERENCES grupo(id)*/
   2 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);

INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   3, /*idGrupo int(11) REFERENCES grupo(id)*/
   1 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);


INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   3, /*idGrupo int(11) REFERENCES grupo(id)*/
   2 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);


INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   4, /*idGrupo int(11) REFERENCES grupo(id)*/
   1 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);


INSERT INTO ref_grupo_grupa_kategorio ()
  VALUES (
   4, /*idGrupo int(11) REFERENCES grupo(id)*/
   2 /*idGrupaKategorio int(11) REFERENCES grupa_kategorio(id),*/
);