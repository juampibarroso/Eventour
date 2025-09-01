package com.eventour.eventour.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class WhoAmIController {

    @GetMapping("/whoami")
    public ResponseEntity<?> whoami(Authentication auth) {
        if (auth == null) return ResponseEntity.ok("anonymous");
        var roles = auth.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toList());
        return ResponseEntity.ok(new Who(auth.getName(), roles));
    }

    record Who(String username, java.util.List<String> roles) {}
}
