package com.eventour.eventour.util;


import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class ApplicationContextProvider implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        synchronized (ApplicationContextProvider.class) {
            if (context == null) {
                context = applicationContext;
            }
        }
    }

    public static ApplicationContext getApplicationContext() {
        if (context == null) {
            throw new IllegalStateException("El ApplicationContext aún no se ha inicializado.");
        }
        return context;
    }
}
