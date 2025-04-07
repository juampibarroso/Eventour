package com.eventour.eventour.config;

import com.eventour.eventour.model.NombreRol;
import com.eventour.eventour.model.Rol;
import com.eventour.eventour.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


//Cuando la aplicación se inicia, revisa si los roles ADMIN y USER existen en la base de datos.
//Si no existen, los crea automáticamente.
@Component
public class DataInitializer implements CommandLineRunner {
    private final RolRepository rolRepository;

    public DataInitializer(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public void run(String... args) {
        if (rolRepository.findByNombre(NombreRol.ADMIN).isEmpty()) {
            Rol rolAdmin = new Rol();
            rolAdmin.setNombre(NombreRol.ADMIN);
            rolRepository.save(rolAdmin);
        }

        if (rolRepository.findByNombre(NombreRol.USER).isEmpty()) {
            Rol rolUser = new Rol();
            rolUser.setNombre(NombreRol.USER);
            rolRepository.save(rolUser);
        }
    }
}
