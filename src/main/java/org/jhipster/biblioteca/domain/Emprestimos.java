package org.jhipster.biblioteca.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.jhipster.biblioteca.domain.enumeration.Status;

/**
 * A Emprestimos.
 */
@Entity
@Table(name = "emprestimos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Emprestimos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "data_emprestimo", nullable = false)
    private Instant dataEmprestimo;

    @Column(name = "data_devolucao")
    private Instant dataDevolucao;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "genero", "emprestimos" }, allowSetters = true)
    private Livro livro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "emprestimos" }, allowSetters = true)
    private Cliente cliente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Emprestimos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDataEmprestimo() {
        return this.dataEmprestimo;
    }

    public Emprestimos dataEmprestimo(Instant dataEmprestimo) {
        this.setDataEmprestimo(dataEmprestimo);
        return this;
    }

    public void setDataEmprestimo(Instant dataEmprestimo) {
        this.dataEmprestimo = dataEmprestimo;
    }

    public Instant getDataDevolucao() {
        return this.dataDevolucao;
    }

    public Emprestimos dataDevolucao(Instant dataDevolucao) {
        this.setDataDevolucao(dataDevolucao);
        return this;
    }

    public void setDataDevolucao(Instant dataDevolucao) {
        this.dataDevolucao = dataDevolucao;
    }

    public Status getStatus() {
        return this.status;
    }

    public Emprestimos status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Livro getLivro() {
        return this.livro;
    }

    public void setLivro(Livro livro) {
        this.livro = livro;
    }

    public Emprestimos livro(Livro livro) {
        this.setLivro(livro);
        return this;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Emprestimos cliente(Cliente cliente) {
        this.setCliente(cliente);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Emprestimos)) {
            return false;
        }
        return getId() != null && getId().equals(((Emprestimos) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Emprestimos{" +
            "id=" + getId() +
            ", dataEmprestimo='" + getDataEmprestimo() + "'" +
            ", dataDevolucao='" + getDataDevolucao() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
