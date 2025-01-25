package org.jhipster.biblioteca.repository;

import org.jhipster.biblioteca.domain.Emprestimos;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Emprestimos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmprestimosRepository extends JpaRepository<Emprestimos, Long> {
    @Query("select e from Emprestimos e where e.cliente.email = ?#{autehntication.email}")
    List<Emprestimos> findByUserIsCurrentUser();
}
