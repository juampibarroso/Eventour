ALTER TABLE eventos
    ADD COLUMN link_entradas VARCHAR(500) NULL;

ALTER TABLE eventos
    MODIFY COLUMN descripcion TEXT NULL;
