package com.jamesthoburn.fplsuite.repositories;

import com.jamesthoburn.fplsuite.entities.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {
}
