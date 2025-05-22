package com.eventour.eventour.model;

public enum Localidad {
    SAN_RAFAEL(Oasis.OASIS_SUR),
    GENERAL_ALVEAR(Oasis.OASIS_SUR),
    MALARGÜE(Oasis.OASIS_SUR),

    CAPITAL(Oasis.OASIS_NORTE),
    GODOY_CRUZ(Oasis.OASIS_NORTE),
    GUAYMALLÉN(Oasis.OASIS_NORTE),
    LAS_HERAS(Oasis.OASIS_NORTE),
    LAVALLE(Oasis.OASIS_NORTE),
    MAIPÚ(Oasis.OASIS_NORTE),

    SAN_MARTÍN(Oasis.OASIS_ESTE),
    JUNÍN(Oasis.OASIS_ESTE),
    RIVADAVIA(Oasis.OASIS_ESTE),
    LA_PAULA(Oasis.OASIS_ESTE),
    SANTA_ROSA(Oasis.OASIS_ESTE),

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
