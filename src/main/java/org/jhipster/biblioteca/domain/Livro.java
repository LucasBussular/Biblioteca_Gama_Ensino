package org.jhipster.biblioteca.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Livro.
 */
@Entity
@Table(name = "livro")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Livro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "titulo", nullable = false)
    private String titulo;

    @NotNull
    @Column(name = "autor", nullable = false)
    private String autor;

    @NotNull
    @Column(name = "ano_publicacao", nullable = false)
    private Integer anoPublicacao;

    @NotNull
    @Column(name = "isbn", nullable = false, unique = true)
    private String isbn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "livros" }, allowSetters = true)
    private Genero genero;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "livro")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "livro", "cliente" }, allowSetters = true)
    private Set<Emprestimos> emprestimos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Livro id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Livro titulo(String titulo) {
        this.setTitulo(titulo);
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return this.autor;
    }

    public Livro autor(String autor) {
        this.setAutor(autor);
        return this;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Integer getAnoPublicacao() {
        return this.anoPublicacao;
    }

    public Livro anoPublicacao(Integer anoPublicacao) {
        this.setAnoPublicacao(anoPublicacao);
        return this;
    }

    public void setAnoPublicacao(Integer anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public Livro isbn(String isbn) {
        this.setIsbn(isbn);
        return this;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Genero getGenero() {
        return this.genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public Livro genero(Genero genero) {
        this.setGenero(genero);
        return this;
    }

    public Set<Emprestimos> getEmprestimos() {
        return this.emprestimos;
    }

    public void setEmprestimos(Set<Emprestimos> emprestimos) {
        if (this.emprestimos != null) {
            this.emprestimos.forEach(i -> i.setLivro(null));
        }
        if (emprestimos != null) {
            emprestimos.forEach(i -> i.setLivro(this));
        }
        this.emprestimos = emprestimos;
    }

    public Livro emprestimos(Set<Emprestimos> emprestimos) {
        this.setEmprestimos(emprestimos);
        return this;
    }

    public Livro addEmprestimos(Emprestimos emprestimos) {
        this.emprestimos.add(emprestimos);
        emprestimos.setLivro(this);
        return this;
    }

    public Livro removeEmprestimos(Emprestimos emprestimos) {
        this.emprestimos.remove(emprestimos);
        emprestimos.setLivro(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Livro)) {
            return false;
        }
        return getId() != null && getId().equals(((Livro) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Livro{" +
            "id=" + getId() +
            ", titulo='" + getTitulo() + "'" +
            ", autor='" + getAutor() + "'" +
            ", anoPublicacao=" + getAnoPublicacao() +
            ", isbn='" + getIsbn() + "'" +
            "}";
    }
}
