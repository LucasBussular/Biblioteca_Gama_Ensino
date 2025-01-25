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
 * A Genero.
 */
@Entity
@Table(name = "genero")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Genero implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "genero", nullable = false, unique = true)
    private String genero;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "genero")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "genero", "emprestimos" }, allowSetters = true)
    private Set<Livro> livros = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Genero id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGenero() {
        return this.genero;
    }

    public Genero genero(String genero) {
        this.setGenero(genero);
        return this;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Set<Livro> getLivros() {
        return this.livros;
    }

    public void setLivros(Set<Livro> livros) {
        if (this.livros != null) {
            this.livros.forEach(i -> i.setGenero(null));
        }
        if (livros != null) {
            livros.forEach(i -> i.setGenero(this));
        }
        this.livros = livros;
    }

    public Genero livros(Set<Livro> livros) {
        this.setLivros(livros);
        return this;
    }

    public Genero addLivro(Livro livro) {
        this.livros.add(livro);
        livro.setGenero(this);
        return this;
    }

    public Genero removeLivro(Livro livro) {
        this.livros.remove(livro);
        livro.setGenero(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Genero)) {
            return false;
        }
        return getId() != null && getId().equals(((Genero) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Genero{" +
            "id=" + getId() +
            ", genero='" + getGenero() + "'" +
            "}";
    }
}
