package com.eventour.eventour.dto;

import java.util.Set;

public record UsuarioDTO(
        Long id,
        String username,
        String password,
        Set<String> roles
) {
}
