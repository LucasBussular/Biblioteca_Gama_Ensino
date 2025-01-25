package org.jhipster.biblioteca.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.biblioteca.domain.EmprestimosTestSamples.*;
import static org.jhipster.biblioteca.domain.GeneroTestSamples.*;
import static org.jhipster.biblioteca.domain.LivroTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.jhipster.biblioteca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LivroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Livro.class);
        Livro livro1 = getLivroSample1();
        Livro livro2 = new Livro();
        assertThat(livro1).isNotEqualTo(livro2);

        livro2.setId(livro1.getId());
        assertThat(livro1).isEqualTo(livro2);

        livro2 = getLivroSample2();
        assertThat(livro1).isNotEqualTo(livro2);
    }

    @Test
    void generoTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Genero generoBack = getGeneroRandomSampleGenerator();

        livro.setGenero(generoBack);
        assertThat(livro.getGenero()).isEqualTo(generoBack);

        livro.genero(null);
        assertThat(livro.getGenero()).isNull();
    }

    @Test
    void emprestimosTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Emprestimos emprestimosBack = getEmprestimosRandomSampleGenerator();

        livro.addEmprestimos(emprestimosBack);
        assertThat(livro.getEmprestimos()).containsOnly(emprestimosBack);
        assertThat(emprestimosBack.getLivro()).isEqualTo(livro);

        livro.removeEmprestimos(emprestimosBack);
        assertThat(livro.getEmprestimos()).doesNotContain(emprestimosBack);
        assertThat(emprestimosBack.getLivro()).isNull();

        livro.emprestimos(new HashSet<>(Set.of(emprestimosBack)));
        assertThat(livro.getEmprestimos()).containsOnly(emprestimosBack);
        assertThat(emprestimosBack.getLivro()).isEqualTo(livro);

        livro.setEmprestimos(new HashSet<>());
        assertThat(livro.getEmprestimos()).doesNotContain(emprestimosBack);
        assertThat(emprestimosBack.getLivro()).isNull();
    }
}
