package org.jhipster.biblioteca.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.biblioteca.domain.ClienteTestSamples.*;
import static org.jhipster.biblioteca.domain.EmprestimosTestSamples.*;
import static org.jhipster.biblioteca.domain.LivroTestSamples.*;

import org.jhipster.biblioteca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmprestimosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Emprestimos.class);
        Emprestimos emprestimos1 = getEmprestimosSample1();
        Emprestimos emprestimos2 = new Emprestimos();
        assertThat(emprestimos1).isNotEqualTo(emprestimos2);

        emprestimos2.setId(emprestimos1.getId());
        assertThat(emprestimos1).isEqualTo(emprestimos2);

        emprestimos2 = getEmprestimosSample2();
        assertThat(emprestimos1).isNotEqualTo(emprestimos2);
    }

    @Test
    void livroTest() {
        Emprestimos emprestimos = getEmprestimosRandomSampleGenerator();
        Livro livroBack = getLivroRandomSampleGenerator();

        emprestimos.setLivro(livroBack);
        assertThat(emprestimos.getLivro()).isEqualTo(livroBack);

        emprestimos.livro(null);
        assertThat(emprestimos.getLivro()).isNull();
    }

    @Test
    void clienteTest() {
        Emprestimos emprestimos = getEmprestimosRandomSampleGenerator();
        Cliente clienteBack = getClienteRandomSampleGenerator();

        emprestimos.setCliente(clienteBack);
        assertThat(emprestimos.getCliente()).isEqualTo(clienteBack);

        emprestimos.cliente(null);
        assertThat(emprestimos.getCliente()).isNull();
    }
}
