package org.jhipster.biblioteca.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class GeneroTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Genero getGeneroSample1() {
        return new Genero().id(1L).genero("genero1");
    }

    public static Genero getGeneroSample2() {
        return new Genero().id(2L).genero("genero2");
    }

    public static Genero getGeneroRandomSampleGenerator() {
        return new Genero().id(longCount.incrementAndGet()).genero(UUID.randomUUID().toString());
    }
}
