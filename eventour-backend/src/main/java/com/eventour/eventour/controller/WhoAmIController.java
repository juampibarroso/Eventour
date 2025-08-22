package com.eventour.eventour.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WhoAmIController {

    @GetMapping("/__whoami")
    public Map<String, Object> who() {
        return Map.of(
                "ok", true,
                "ts", System.currentTimeMillis()
        );
    }
}
