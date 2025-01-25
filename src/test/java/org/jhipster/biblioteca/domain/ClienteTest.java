package org.jhipster.biblioteca.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.biblioteca.domain.ClienteTestSamples.*;
import static org.jhipster.biblioteca.domain.EmprestimosTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.jhipster.biblioteca.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClienteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cliente.class);
        Cliente cliente1 = getClienteSample1();
        Cliente cliente2 = new Cliente();
        assertThat(cliente1).isNotEqualTo(cliente2);

        cliente2.setId(cliente1.getId());
        assertThat(cliente1).isEqualTo(cliente2);

        cliente2 = getClienteSample2();
        assertThat(cliente1).isNotEqualTo(cliente2);
    }

    @Test
    void emprestimosTest() {
        Cliente cliente = getClienteRandomSampleGenerator();
        Emprestimos emprestimosBack = getEmprestimosRandomSampleGenerator();

        cliente.addEmprestimos(emprestimosBack);
        assertThat(cliente.getEmprestimos()).containsOnly(emprestimosBack);
        assertThat(emprestimosBack.getCliente()).isEqualTo(cliente);

        cliente.removeEmprestimos(emprestimosBack);
        assertThat(cliente.getEmprestimos()).doesNotContain(emprestimosBack);
        assertThat(emprestimosBack.getCliente()).isNull();

        cliente.emprestimos(new HashSet<>(Set.of(emprestimosBack)));
        assertThat(cliente.getEmprestimos()).containsOnly(emprestimosBack);
        assertThat(emprestimosBack.getCliente()).isEqualTo(cliente);

        cliente.setEmprestimos(new HashSet<>());
        assertThat(cliente.getEmprestimos()).doesNotContain(emprestimosBack);
        assertThat(emprestimosBack.getCliente()).isNull();
    }
}
