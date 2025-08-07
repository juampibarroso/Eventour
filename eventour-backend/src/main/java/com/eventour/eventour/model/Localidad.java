package com.eventour.eventour.model;

public enum Localidad {
    SAN_RAFAEL(Oasis.ZONA_SUR),
    GENERAL_ALVEAR(Oasis.ZONA_SUR),
    MALARGÜE(Oasis.ZONA_SUR),

    CAPITAL(Oasis.GRAN_MENDOZA),
    GODOY_CRUZ(Oasis.GRAN_MENDOZA),
    GUAYMALLÉN(Oasis.GRAN_MENDOZA),
    LAS_HERAS(Oasis.GRAN_MENDOZA),
    LAVALLE(Oasis.GRAN_MENDOZA),
    MAIPÚ(Oasis.GRAN_MENDOZA),

    SAN_MARTÍN(Oasis.ZONA_ESTE),
    JUNÍN(Oasis.ZONA_ESTE),
    RIVADAVIA(Oasis.ZONA_ESTE),
    LA_PAULA(Oasis.ZONA_ESTE),
    SANTA_ROSA(Oasis.ZONA_ESTE),

    TUNUYÁN(Oasis.VALLE_DE_UCO),
    TUPUNGATO(Oasis.VALLE_DE_UCO),
    SAN_CARLOS(Oasis.VALLE_DE_UCO);

    private final Oasis oasis;

    Localidad(Oasis oasis) {
        this.oasis = oasis;
    }

    public Oasis getOasis() {
        return oasis;
    }
}
