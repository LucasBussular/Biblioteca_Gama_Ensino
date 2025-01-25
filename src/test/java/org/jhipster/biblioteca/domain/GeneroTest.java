package org.jhipster.biblioteca.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.biblioteca.domain.GeneroTestSamples.*;
import static org.jhipster.biblioteca.domain.LivroTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.jhipster.biblioteca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GeneroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Genero.class);
        Genero genero1 = getGeneroSample1();
        Genero genero2 = new Genero();
        assertThat(genero1).isNotEqualTo(genero2);

        genero2.setId(genero1.getId());
        assertThat(genero1).isEqualTo(genero2);

        genero2 = getGeneroSample2();
        assertThat(genero1).isNotEqualTo(genero2);
    }

    @Test
    void livroTest() {
        Genero genero = getGeneroRandomSampleGenerator();
        Livro livroBack = getLivroRandomSampleGenerator();

        genero.addLivro(livroBack);
        assertThat(genero.getLivros()).containsOnly(livroBack);
        assertThat(livroBack.getGenero()).isEqualTo(genero);

        genero.removeLivro(livroBack);
        assertThat(genero.getLivros()).doesNotContain(livroBack);
        assertThat(livroBack.getGenero()).isNull();

        genero.livros(new HashSet<>(Set.of(livroBack)));
        assertThat(genero.getLivros()).containsOnly(livroBack);
        assertThat(livroBack.getGenero()).isEqualTo(genero);

        genero.setLivros(new HashSet<>());
        assertThat(genero.getLivros()).doesNotContain(livroBack);
        assertThat(livroBack.getGenero()).isNull();
    }
}
