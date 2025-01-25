package org.jhipster.biblioteca.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class EmprestimosTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Emprestimos getEmprestimosSample1() {
        return new Emprestimos().id(1L);
    }

    public static Emprestimos getEmprestimosSample2() {
        return new Emprestimos().id(2L);
    }

    public static Emprestimos getEmprestimosRandomSampleGenerator() {
        return new Emprestimos().id(longCount.incrementAndGet());
    }
}
